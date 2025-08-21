"use client"

import { useState, useEffect } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { celoAlfajores } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Create config only in browser environment
const config = isBrowser ? createConfig({
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
    setMounted(true)
  }, [])

  // Don't render anything until mounted (client-side only)
  if (!mounted || !isBrowser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SapaSafe...</p>
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