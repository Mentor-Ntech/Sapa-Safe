"use client"

import { useState, useEffect } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { celoAlfajores } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets'
import '@rainbow-me/rainbowkit/styles.css'

export function ClientWalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [config, setConfig] = useState<any>(null)
  const [queryClient, setQueryClient] = useState<any>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      try {
        console.log('Initializing wallet providers...')
        
        // Create connectors
        const connectors = connectorsForWallets(
          [
            {
              groupName: 'Recommended for Celo',
              wallets: [
                walletConnectWallet, // Valora works through this
                metaMaskWallet,
              ],
            },
            {
              groupName: 'Popular Wallets',
              wallets: [
                coinbaseWallet,
                trustWallet,
                injectedWallet,
              ],
            },
          ],
          {
            appName: 'SapaSafe - Secure Savings Vault',
            projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? '636fbbf256896d1aec459c53de2530f1',
          }
        )

        // Create config
        const wagmiConfig = createConfig({
          connectors,
          chains: [celoAlfajores],
          transports: {
            [celoAlfajores.id]: http(),
          },
        })

        // Create query client
        const client = new QueryClient()

        setConfig(wagmiConfig)
        setQueryClient(client)
        setMounted(true)
        
        console.log('Wallet providers initialized successfully')
      } catch (error) {
        console.error('Failed to initialize wallet providers:', error)
        // Still set mounted to true to show error state
        setMounted(true)
      }
    }
  }, [])

  // Show loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SapaSafe...</p>
          <p className="text-xs text-muted-foreground mt-2">Initializing blockchain connection...</p>
        </div>
      </div>
    )
  }

  // Show error state if providers failed to initialize
  if (!config || !queryClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-500">Failed to initialize blockchain connection</p>
          <p className="text-xs text-muted-foreground mt-2">Please refresh the page</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // Render providers
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
