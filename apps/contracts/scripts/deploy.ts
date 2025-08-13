import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

// Ensure environment variables are loaded
require('dotenv').config();

async function main() {
  console.log("Deploying SapaSafe contracts...");

  // Check if private key is set
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY environment variable not set!");
    console.log("Please create a .env file with your private key:");
    console.log("PRIVATE_KEY=your_private_key_here");
    process.exit(1);
  }

  // Get deployer account
  const signers = await ethers.getSigners();
  console.log("Available signers:", signers.length);
  
  if (signers.length === 0) {
    console.error("❌ No signers found!");
    console.log("Make sure your PRIVATE_KEY is correct and has funds for deployment.");
    console.log("PRIVATE_KEY exists:", !!process.env.PRIVATE_KEY);
    process.exit(1);
  }
  
  const deployer = signers[0];
  console.log("Deploying from:", deployer.address);

  // Deploy implementation contracts
  console.log("Deploying implementation contracts...");
  
  const TokenRegistryImpl = await ethers.deployContract("TokenRegistry");
  await TokenRegistryImpl.waitForDeployment();
  console.log("TokenRegistry implementation deployed to:", await TokenRegistryImpl.getAddress());

  const PenaltyManagerImpl = await ethers.deployContract("PenaltyManager");
  await PenaltyManagerImpl.waitForDeployment();
  console.log("PenaltyManager implementation deployed to:", await PenaltyManagerImpl.getAddress());

  const VaultFactoryImpl = await ethers.deployContract("VaultFactory");
  await VaultFactoryImpl.waitForDeployment();
  console.log("VaultFactory implementation deployed to:", await VaultFactoryImpl.getAddress());

  // Encode initialization data
  console.log("Encoding initialization data...");
  
  const tokenRegistryData = TokenRegistryImpl.interface.encodeFunctionData('initialize', [deployer.address]);

  const penaltyManagerData = PenaltyManagerImpl.interface.encodeFunctionData('initialize', [deployer.address]);

  // Deploy proxy contracts
  console.log("Deploying proxy contracts...");
  
  const tokenRegistryProxy = await ethers.deployContract("SapaSafeProxy", [
    await TokenRegistryImpl.getAddress(),
    tokenRegistryData
  ]);
  await tokenRegistryProxy.waitForDeployment();
  console.log("TokenRegistry proxy deployed to:", await tokenRegistryProxy.getAddress());

  const penaltyManagerProxy = await ethers.deployContract("SapaSafeProxy", [
    await PenaltyManagerImpl.getAddress(),
    penaltyManagerData
  ]);
  await penaltyManagerProxy.waitForDeployment();
  console.log("PenaltyManager proxy deployed to:", await penaltyManagerProxy.getAddress());

  const vaultFactoryData = VaultFactoryImpl.interface.encodeFunctionData('initialize', [
    await tokenRegistryProxy.getAddress(),
    await penaltyManagerProxy.getAddress(),
    deployer.address
  ]);

  const vaultFactoryProxy = await ethers.deployContract("SapaSafeProxy", [
    await VaultFactoryImpl.getAddress(),
    vaultFactoryData
  ]);
  await vaultFactoryProxy.waitForDeployment();
  console.log("VaultFactory proxy deployed to:", await vaultFactoryProxy.getAddress());

  // Get proxy contract instances
  const tokenRegistry = TokenRegistryImpl.attach(await tokenRegistryProxy.getAddress());
  const penaltyManager = PenaltyManagerImpl.attach(await penaltyManagerProxy.getAddress());
  const vaultFactory = VaultFactoryImpl.attach(await vaultFactoryProxy.getAddress());

  // Verify deployments
  console.log("Verifying deployments...");
  
  const tokenCount = await tokenRegistry.getSupportedTokenCount();
  console.log("Initial supported tokens:", tokenCount.toString());

  const penaltyPercentage = await penaltyManager.penaltyPercentage();
  console.log("Initial penalty percentage:", penaltyPercentage.toString());

  const lockDurations = await vaultFactory.getAvailableLockDurations();
  console.log("Available lock durations:", lockDurations.length);

  console.log("Deployment completed successfully!");
  console.log("\nDeployed addresses:");
  console.log("TokenRegistry Proxy:", await tokenRegistryProxy.getAddress());
  console.log("PenaltyManager Proxy:", await penaltyManagerProxy.getAddress());
  console.log("VaultFactory Proxy:", await vaultFactoryProxy.getAddress());
  console.log("\nImplementation addresses:");
  console.log("TokenRegistry Implementation:", await TokenRegistryImpl.getAddress());
  console.log("PenaltyManager Implementation:", await PenaltyManagerImpl.getAddress());
  console.log("VaultFactory Implementation:", await VaultFactoryImpl.getAddress());

  // Save deployment addresses to file
  const deploymentInfo = {
    network: "alfajores",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      tokenRegistry: {
        implementation: await TokenRegistryImpl.getAddress(),
        proxy: await tokenRegistryProxy.getAddress()
      },
      penaltyManager: {
        implementation: await PenaltyManagerImpl.getAddress(),
        proxy: await penaltyManagerProxy.getAddress()
      },
      vaultFactory: {
        implementation: await VaultFactoryImpl.getAddress(),
        proxy: await vaultFactoryProxy.getAddress()
      }
    }
  };

  const deploymentPath = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentPath, "alfajores.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment info saved to deployments/alfajores.json");
  console.log("Use this file for contract verification");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
