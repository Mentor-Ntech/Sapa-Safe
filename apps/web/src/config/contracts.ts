// Contract addresses from deployed contracts on Celo Alfajores
export const CONTRACTS = {
  // Alfajores Testnet
  alfajores: {
    tokenRegistry: {
      address: "0xdff3C5d1Ae46A795fE4B891c01bB43B69055bFf7"
    },
    penaltyManager: {
      address: "0x5c43dAEeB39D66F5546beE7FA06a073E3b803591"
    },
    vaultFactory: {
      address: "0x3888aC9D1004B26c1D8D9b4623F4c6B0B3469205"
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
