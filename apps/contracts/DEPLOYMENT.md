# SapaSafe Deployment Guide

## Quick Deploy

### Local Development
```bash
npx hardhat run scripts/deploy.ts
```

### Testnet (Alfajores)
```bash
npx hardhat run scripts/deploy.ts --network alfajores
```

### Mainnet (Celo)
```bash
npx hardhat run scripts/deploy.ts --network celo
```

## Contract Verification

### Verify on Alfajores
```bash
npx hardhat run scripts/verify.ts --network alfajores
```

**Prerequisites:**
- Set `CELOSCAN_API_KEY` environment variable
- Deploy contracts first (deployment addresses are saved automatically)

## What Gets Deployed

The deployment script deploys the following contracts:

### Implementation Contracts
- **TokenRegistry** - Manages supported tokens and their metadata
- **PenaltyManager** - Handles penalty calculations for early withdrawals
- **VaultFactory** - Creates and manages savings vaults

### Proxy Contracts
- **TokenRegistry Proxy** - Upgradeable proxy for TokenRegistry
- **PenaltyManager Proxy** - Upgradeable proxy for PenaltyManager  
- **VaultFactory Proxy** - Upgradeable proxy for VaultFactory

## Deployment Output

The script will output:
- All contract addresses (implementation and proxy)
- Initial configuration verification
- Deployment status

## Configuration

### Initial Setup
- **Owner**: Set to the deployer address
- **Supported Tokens**: 5 African tokens pre-loaded
- **Penalty Percentage**: 10% (1000 basis points)
- **Lock Durations**: 7 available periods (7, 14, 30, 60, 90, 180, 365 days)

### Post-Deployment
After deployment, you can:
- Add new tokens via TokenRegistry
- Update penalty percentages via PenaltyManager
- Create vaults via VaultFactory

## Environment Variables

Create a `.env` file in the contracts directory:

```bash
# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Celoscan API key for contract verification
CELOSCAN_API_KEY=your_celoscan_api_key_here
```

## Network Configuration

Make sure your `hardhat.config.ts` has the correct network configurations for your target networks.
