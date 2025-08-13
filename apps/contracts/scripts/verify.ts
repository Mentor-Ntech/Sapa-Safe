import { ethers, run } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

async function main() {
  console.log("Verifying SapaSafe contracts on Celo Alfajores...");

  // Read deployment addresses from file
  const deploymentPath = path.join(__dirname, "..", "deployments", "alfajores.json");
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("Deployment file not found. Please deploy contracts first.");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const { contracts } = deploymentInfo;

  console.log("Using deployment addresses from:", deploymentPath);

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  
  // Encode initialization data
  const tokenRegistryInterface = new ethers.Interface([
    "function initialize(address owner)"
  ]);
  const tokenRegistryData = tokenRegistryInterface.encodeFunctionData("initialize", [deployer.address]);

  const penaltyManagerInterface = new ethers.Interface([
    "function initialize(address owner)"
  ]);
  const penaltyManagerData = penaltyManagerInterface.encodeFunctionData("initialize", [deployer.address]);

  const vaultFactoryInterface = new ethers.Interface([
    "function initialize(address tokenRegistry, address penaltyManager, address owner)"
  ]);
  const vaultFactoryData = vaultFactoryInterface.encodeFunctionData("initialize", [
    contracts.tokenRegistry.proxy,
    contracts.penaltyManager.proxy,
    deployer.address
  ]);

  try {
    console.log("Verifying implementation contracts...");
    
    // Verify implementation contracts
    await run("verify:verify", {
      address: contracts.tokenRegistry.implementation,
      constructorArguments: [],
    });
    console.log("✅ TokenRegistry implementation verified");

    await run("verify:verify", {
      address: contracts.penaltyManager.implementation,
      constructorArguments: [],
    });
    console.log("✅ PenaltyManager implementation verified");

    await run("verify:verify", {
      address: contracts.vaultFactory.implementation,
      constructorArguments: [],
    });
    console.log("✅ VaultFactory implementation verified");

    console.log("Verifying proxy contracts...");
    
    // Verify proxy contracts
    await run("verify:verify", {
      address: contracts.tokenRegistry.proxy,
      contract: "contracts/SapaSafeProxy.sol:SapaSafeProxy",
      constructorArguments: [contracts.tokenRegistry.implementation, tokenRegistryData],
    });
    console.log("✅ TokenRegistry proxy verified");

    await run("verify:verify", {
      address: contracts.penaltyManager.proxy,
      contract: "contracts/SapaSafeProxy.sol:SapaSafeProxy",
      constructorArguments: [contracts.penaltyManager.implementation, penaltyManagerData],
    });
    console.log("✅ PenaltyManager proxy verified");

    await run("verify:verify", {
      address: contracts.vaultFactory.proxy,
      contract: "contracts/SapaSafeProxy.sol:SapaSafeProxy",
      constructorArguments: [contracts.vaultFactory.implementation, vaultFactoryData],
    });
    console.log("✅ VaultFactory proxy verified");

    console.log("\n🎉 All contracts verified successfully!");
    console.log("\nVerified contracts on Alfajores:");
    console.log("TokenRegistry Proxy:", contracts.tokenRegistry.proxy);
    console.log("PenaltyManager Proxy:", contracts.penaltyManager.proxy);
    console.log("VaultFactory Proxy:", contracts.vaultFactory.proxy);
    
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
