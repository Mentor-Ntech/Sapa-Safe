import { celo, celoAlfajores } from 'wagmi/chains'

export const NETWORKS = {
  alfajores: celoAlfajores,
  celo: celo,
} as const

export const SUPPORTED_NETWORKS = [celoAlfajores, celo]

// Network configuration for Wagmi
export const NETWORK_CONFIG = {
  [celoAlfajores.id]: {
    name: 'Celo Alfajores',
    chainId: celoAlfajores.id,
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    blockExplorer: 'https://alfajores.celoscan.io',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
  },
  [celo.id]: {
    name: 'Celo',
    chainId: celo.id,
    rpcUrl: 'https://forno.celo.org',
    blockExplorer: 'https://celoscan.io',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
  },
} as const

// Get network config by chain ID
export const getNetworkConfig = (chainId: number) => {
  return NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG]
}

// Check if network is supported
export const isSupportedNetwork = (chainId: number) => {
  return SUPPORTED_NETWORKS.some(network => network.id === chainId)
}
