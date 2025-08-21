// Contract addresses from deployed contracts on Celo Alfajores
export const CONTRACTS = {
  // Alfajores Testnet - Monthly Savings System
  alfajores: {
    tokenRegistry: {
      address: "0xa54286F049A9d8A8867707E3b2E958AD49Bdd30B"
    },
    penaltyManager: {
      address: "0x92B16Fd77CDE4e27DEff8F9b2975a6a57C0b789b"
    },
    vaultFactory: {
      address: "0x7b6daCea811fd2704911E05c794CE08bF24430f4"
    }
  }
  // Celo Mainnet - commented out until contracts are deployed
  // celo: {
  //   tokenRegistry: {
  //     address: ""
  //   },
  //   penaltyManager: {
  //     address: ""
  //   },
  //   vaultFactory: {
  //     address: ""
  //   }
  // }
} as const

// Get contract addresses for current network
export const getContractAddresses = (network: 'alfajores' = 'alfajores') => {
  return CONTRACTS[network]
}

// Contract address getters
export const getVaultFactoryAddress = (network: 'alfajores' = 'alfajores') => {
  return CONTRACTS[network].vaultFactory.address
}

export const getTokenRegistryAddress = (network: 'alfajores' = 'alfajores') => {
  return CONTRACTS[network].tokenRegistry.address
}

export const getPenaltyManagerAddress = (network: 'alfajores' = 'alfajores') => {
  return CONTRACTS[network].penaltyManager.address
}
