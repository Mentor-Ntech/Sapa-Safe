import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

// Ensure environment variables are loaded
require('dotenv').config();

async function main() {
  console.log("Deploying SapaSafe contracts ");

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

  try {
    // 1. Deploy TokenRegistry (with owner parameter)
    console.log("\n=== Deploying TokenRegistry ===");
    const TokenRegistry = await ethers.getContractFactory("TokenRegistry");
    const tokenRegistry = await TokenRegistry.deploy(deployer.address);
    await tokenRegistry.waitForDeployment();
    const tokenRegistryAddress = await tokenRegistry.getAddress();
    console.log("✅ TokenRegistry deployed to:", tokenRegistryAddress);

    // 2. Deploy PenaltyManager (with owner parameter)
    console.log("\n=== Deploying PenaltyManager ===");
    const PenaltyManager = await ethers.getContractFactory("PenaltyManager");
    const penaltyManager = await PenaltyManager.deploy(deployer.address);
    await penaltyManager.waitForDeployment();
    const penaltyManagerAddress = await penaltyManager.getAddress();
    console.log("✅ PenaltyManager deployed to:", penaltyManagerAddress);

    // 3. Deploy VaultFactory (with TokenRegistry and PenaltyManager addresses)
    console.log("\n=== Deploying VaultFactory ===");
    const VaultFactory = await ethers.getContractFactory("VaultFactory");
    const vaultFactory = await VaultFactory.deploy(
      tokenRegistryAddress,
      penaltyManagerAddress
    );
    await vaultFactory.waitForDeployment();
    const vaultFactoryAddress = await vaultFactory.getAddress();
    console.log("✅ VaultFactory deployed to:", vaultFactoryAddress);

    // Verify deployments
    console.log("\n=== Verifying Deployments ===");
    
    // Check TokenRegistry
    const registryOwner = await tokenRegistry.owner();
    const supportedTokens = await tokenRegistry.getSupportedTokens();
    console.log("TokenRegistry Owner:", registryOwner);
    console.log("TokenRegistry Supported Tokens Count:", supportedTokens.length);
    console.log("TokenRegistry Owner correct:", registryOwner === deployer.address ? "✅ Yes" : "❌ No");

    // Check PenaltyManager
    const penaltyOwner = await penaltyManager.owner();
    const treasuryAddress = await penaltyManager.getTreasuryAddress();
    console.log("PenaltyManager Owner:", penaltyOwner);
    console.log("PenaltyManager Treasury:", treasuryAddress);
    console.log("PenaltyManager Owner correct:", penaltyOwner === deployer.address ? "✅ Yes" : "❌ No");

    // Check VaultFactory
    const factoryOwner = await vaultFactory.owner();
    const factoryTokenRegistry = await vaultFactory.tokenRegistry();
    const factoryPenaltyManager = await vaultFactory.penaltyManager();
    console.log("VaultFactory Owner:", factoryOwner);
    console.log("VaultFactory TokenRegistry:", factoryTokenRegistry);
    console.log("VaultFactory PenaltyManager:", factoryPenaltyManager);
    console.log("VaultFactory Owner correct:", factoryOwner === deployer.address ? "✅ Yes" : "❌ No");
    console.log("VaultFactory TokenRegistry correct:", factoryTokenRegistry === tokenRegistryAddress ? "✅ Yes" : "❌ No");
    console.log("VaultFactory PenaltyManager correct:", factoryPenaltyManager === penaltyManagerAddress ? "✅ Yes" : "❌ No");

    // Test vault creation
    console.log("\n=== Testing Vault Creation ===");
    const testToken = "0x4a5b03B8b16122D330306c65e4CA4BC5Dd6511d0"; // cNGN
    const testAmount = ethers.parseEther("600"); // 600 tokens
    const testDuration = 30 * 24 * 60 * 60; // 30 days
    const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 minutes from now
    
    console.log("Testing vault creation...");
    console.log("Test Token:", testToken);
    console.log("Test Amount:", testAmount.toString());
    console.log("Test Duration:", testDuration);
    console.log("Deadline:", deadline);
    
    const tx = await vaultFactory.createVault(
      testToken,
      testAmount,
      testDuration,
      deadline
    );
    
    console.log("✅ Vault creation transaction sent:", tx.hash);
    await tx.wait();
    console.log("✅ Vault creation successful!");

    // Get the created vault
    const userVaults = await vaultFactory.getUserVaults(deployer.address);
    console.log("User vaults count:", userVaults.length);
    if (userVaults.length > 0) {
      console.log("Created vault address:", userVaults[0]);
    }

    console.log("\n=== Deployment Complete ===");
    console.log("✅ TokenRegistry:", tokenRegistryAddress);
    console.log("✅ PenaltyManager:", penaltyManagerAddress);
    console.log("✅ VaultFactory:", vaultFactoryAddress);

    // Save deployment addresses to file
    const deploymentInfo = {
      network: "alfajores",
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        tokenRegistry: {
          address: tokenRegistryAddress,
          owner: registryOwner
        },
        penaltyManager: {
          address: penaltyManagerAddress,
          owner: penaltyOwner,
          treasury: treasuryAddress
        },
        vaultFactory: {
          address: vaultFactoryAddress,
          owner: factoryOwner,
          tokenRegistry: factoryTokenRegistry,
          penaltyManager: factoryPenaltyManager
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
    
    // Frontend configuration
    console.log("\n=== Frontend Configuration ===");
    console.log("Update your frontend config with these addresses:");
    console.log(`export const CONTRACTS = {
  alfajores: {
    tokenRegistry: {
      address: "${tokenRegistryAddress}"
    },
    penaltyManager: {
      address: "${penaltyManagerAddress}"
    },
    vaultFactory: {
      address: "${vaultFactoryAddress}"
    }
  }
} as const`);

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
