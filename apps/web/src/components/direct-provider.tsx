"use client"

import { WagmiProvider, createConfig, http } from 'wagmi'
import { celoAlfajores } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

export function DirectProvider({ children }: { children: React.ReactNode }) {
  console.log('DirectProvider: Rendering immediately')
  
  // Create config and client directly
  const config = createConfig({
    chains: [celoAlfajores],
    transports: {
      [celoAlfajores.id]: http(),
    },
  })

  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
