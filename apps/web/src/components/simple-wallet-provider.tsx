"use client"

import { useState, useEffect } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { celoAlfajores } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

export function SimpleWalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [timeoutReached, setTimeoutReached] = useState(false)

  useEffect(() => {
    console.log('SimpleWalletProvider: Starting initialization')
    
    const timer = window.setTimeout(() => {
      console.log('SimpleWalletProvider: Setting mounted to true')
      setMounted(true)
    }, 100) // Small delay to ensure browser is ready

    const timeoutTimer = window.setTimeout(() => {
      console.log('SimpleWalletProvider: Timeout reached, forcing mounted')
      setTimeoutReached(true)
      setMounted(true)
    }, 5000) // 5 second timeout

    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(timeoutTimer)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SapaSafe...</p>
          {timeoutReached && (
            <div className="mt-4">
              <p className="text-sm text-yellow-600">Taking longer than expected...</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Simple config without complex connectors
  const config = createConfig({
    chains: [celoAlfajores],
    transports: {
      [celoAlfajores.id]: http(),
    },
  })

  const queryClient = new QueryClient()

  console.log('SimpleWalletProvider: Rendering providers')

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
