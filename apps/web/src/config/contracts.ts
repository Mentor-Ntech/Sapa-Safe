// Contract addresses from deployed contracts on Celo Alfajores
export const CONTRACTS = {
  // Alfajores Testnet
  alfajores: {
    tokenRegistry: {
      implementation: "0x489A6563295E96aD48647D5B4e555D879C433b59",
      proxy: "0x8c3907ffc68f305A60d241a88D5b2d3C665eAcdF"
    },
    penaltyManager: {
      implementation: "0xA3A5d917B952E73B61a92Aa311Dc70844e3d77cd",
      proxy: "0x7777e46157369afEfE40bc697Dc70c225667882f"
    },
    vaultFactory: {
      implementation: "0x5fcC7d6A99Ca919463E3b895d93aAfBe2B126095",
      proxy: "0xb6BEE6fF5747865Bb2b6069B11e22ba169cF7A12"
    }
  }
  // Celo Mainnet - commented out until contracts are deployed
  // celo: {
  //   tokenRegistry: {
  //     implementation: "",
  //     proxy: ""
  //   },
  //   penaltyManager: {
  //     implementation: "",
  //     proxy: ""
  //   },
  //   vaultFactory: {
  //     implementation: "",
  //     proxy: ""
  //   }
  // }
} as const

// Get contract addresses for current network
export const getContractAddresses = (network: 'alfajores' = 'alfajores') => {
  return CONTRACTS[network]
}

// Contract address getters
export const getVaultFactoryAddress = (network: 'alfajores' = 'alfajores') => {
  return CONTRACTS[network].vaultFactory.proxy
}

export const getTokenRegistryAddress = (network: 'alfajores' = 'alfajores') => {
  return CONTRACTS[network].tokenRegistry.proxy
}

export const getPenaltyManagerAddress = (network: 'alfajores' = 'alfajores') => {
  return CONTRACTS[network].penaltyManager.proxy
}
