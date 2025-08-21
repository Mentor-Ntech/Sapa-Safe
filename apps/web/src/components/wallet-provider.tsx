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

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Create connectors only in browser environment
const connectors = isBrowser ? connectorsForWallets(
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
) : []

// Create config only in browser environment
const config = isBrowser ? createConfig({
  connectors,
  chains: [celoAlfajores],
  transports: {
    [celoAlfajores.id]: http(),
  },
}) : null

// Create query client only in browser environment
const queryClient = isBrowser ? new QueryClient() : null

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('AppProvider: Setting mounted to true')
    setMounted(true)
  }, [])

  console.log('AppProvider: mounted =', mounted, 'isBrowser =', isBrowser)

  // Don't render anything until mounted (client-side only)
  if (!mounted || !isBrowser) {
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

  // Fallback if config is not available
  if (!config || !queryClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-500">Failed to initialize blockchain connection</p>
          <p className="text-xs text-muted-foreground mt-2">Please refresh the page</p>
        </div>
      </div>
    )
  }

  return (
    <WagmiProvider config={config!}>
      <QueryClientProvider client={queryClient!}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}