import { expect } from "chai";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { parseEther, encodeFunctionData } from "viem";

describe("SapaSafe Final Tests", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await viem.getWalletClients();

    // Deploy implementation contracts
    const MockToken = await viem.deployContract("MockERC20", ["Test Token", "TEST"]);
    const TokenRegistryImpl = await viem.deployContract("TokenRegistry");
    const PenaltyManagerImpl = await viem.deployContract("PenaltyManager");
    const VaultFactoryImpl = await viem.deployContract("VaultFactory");

    // Encode initialization data
    const tokenRegistryData = encodeFunctionData({
      abi: TokenRegistryImpl.abi,
      functionName: 'initialize',
      args: [owner.account.address]
    });

    const penaltyManagerData = encodeFunctionData({
      abi: PenaltyManagerImpl.abi,
      functionName: 'initialize',
      args: [owner.account.address]
    });

    // Deploy proxy contracts first
    const tokenRegistryProxy = await viem.deployContract("SapaSafeProxy", [
      TokenRegistryImpl.address,
      tokenRegistryData
    ]);

    const penaltyManagerProxy = await viem.deployContract("SapaSafeProxy", [
      PenaltyManagerImpl.address,
      penaltyManagerData
    ]);

    const vaultFactoryData = encodeFunctionData({
      abi: VaultFactoryImpl.abi,
      functionName: 'initialize',
      args: [
        tokenRegistryProxy.address,
        penaltyManagerProxy.address,
        owner.account.address
      ]
    });

    const vaultFactoryProxy = await viem.deployContract("SapaSafeProxy", [
      VaultFactoryImpl.address,
      vaultFactoryData
    ]);

    // Get proxy contracts
    const tokenRegistry = await viem.getContractAt("TokenRegistry", tokenRegistryProxy.address);
    const penaltyManager = await viem.getContractAt("PenaltyManager", penaltyManagerProxy.address);
    const vaultFactory = await viem.getContractAt("VaultFactory", vaultFactoryProxy.address);

    // Mint tokens to users
    await MockToken.write.mint([user1.account.address, parseEther("1000")]);
    await MockToken.write.mint([user2.account.address, parseEther("1000")]);

    return { 
      tokenRegistry, 
      penaltyManager, 
      vaultFactory, 
      mockToken: MockToken, 
      owner, 
      user1, 
      user2 
    };
  }

  describe("TokenRegistry", function () {
    it("Should initialize with African tokens", async function () {
      const { tokenRegistry } = await loadFixture(deployFixture);
      const count = await tokenRegistry.read.getSupportedTokenCount();
      expect(count).to.equal(5n);
    });

    it("Should add new token", async function () {
      const { tokenRegistry, mockToken, owner } = await loadFixture(deployFixture);
      const tokenAddress = mockToken.address;
      
      await tokenRegistry.write.addToken([
        tokenAddress,
        "MOCK",
        "Test Token",
        "Test Country",
        parseEther("10")
      ], { account: owner.account.address });
      
      const isSupported = await tokenRegistry.read.isTokenSupported([tokenAddress]);
      expect(isSupported).to.be.true;
    });

    it("Should validate amount correctly", async function () {
      const { tokenRegistry, mockToken, owner } = await loadFixture(deployFixture);
      const tokenAddress = mockToken.address;
      const minAmount = parseEther("10");
      
      await tokenRegistry.write.addToken([
        tokenAddress,
        "MOCK",
        "Test Token",
        "Test Country",
        minAmount
      ], { account: owner.account.address });
      
      const isValid = await tokenRegistry.read.validateAmount([tokenAddress, minAmount]);
      expect(isValid).to.be.true;
      
      const isInvalid = await tokenRegistry.read.validateAmount([tokenAddress, minAmount - 1n]);
      expect(isInvalid).to.be.false;
    });
  });

  describe("PenaltyManager", function () {
    it("Should handle zero amount", async function () {
      const { penaltyManager } = await loadFixture(deployFixture);
      
      await expect(
        penaltyManager.read.calculatePenalty([0n])
      ).to.be.rejectedWith("Amount must be greater than 0");
    });

    it("Should update penalty percentage", async function () {
      const { penaltyManager, owner } = await loadFixture(deployFixture);
      const newPercentage = 1500n; // 15%
      
      await penaltyManager.write.updatePenaltyPercentage([newPercentage], {
        account: owner.account.address
      });
      
      const currentPercentage = await penaltyManager.read.penaltyPercentage();
      expect(currentPercentage).to.equal(newPercentage);
    });
  });

  describe("VaultFactory Basic", function () {
    it("Should get available lock durations", async function () {
      const { vaultFactory } = await loadFixture(deployFixture);
      const durations = await vaultFactory.read.getAvailableLockDurations();
      expect(durations.length).to.equal(7);
    });

    it("Should validate lock durations", async function () {
      const { vaultFactory } = await loadFixture(deployFixture);
      const validDuration = 30n * 24n * 60n * 60n; // 30 days
      const isValid = await vaultFactory.read.isValidLockDuration([validDuration]);
      expect(isValid).to.be.true;
    });
  });

  describe("Integration Basic", function () {
    it("Should handle token registry operations", async function () {
      const { tokenRegistry, mockToken, owner } = await loadFixture(deployFixture);
      const tokenAddress = mockToken.address;
      
      // Add token
      await tokenRegistry.write.addToken([
        tokenAddress,
        "MOCK",
        "Test Token",
        "Test Country",
        parseEther("10")
      ], { account: owner.account.address });
      
      // Verify token is supported
      const isSupported = await tokenRegistry.read.isTokenSupported([tokenAddress]);
      expect(isSupported).to.be.true;
      
      // Get token info
      const tokenInfo = await tokenRegistry.read.getTokenInfo([tokenAddress]);
      expect(tokenInfo.symbol).to.equal("MOCK");
      expect(tokenInfo.name).to.equal("Test Token");
      expect(tokenInfo.country).to.equal("Test Country");
    });

    it("Should handle penalty manager operations", async function () {
      const { penaltyManager, owner } = await loadFixture(deployFixture);
      
      // Update penalty percentage
      const newPercentage = 1500n; // 15%
      await penaltyManager.write.updatePenaltyPercentage([newPercentage], {
        account: owner.account.address
      });
      
      // Verify update
      const currentPercentage = await penaltyManager.read.penaltyPercentage();
      expect(currentPercentage).to.equal(newPercentage);
    });
  });
});
