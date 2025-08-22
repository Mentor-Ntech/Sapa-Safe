"use client"

import { useState, useEffect } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { celoAlfajores } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

export function RobustWalletProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing RobustWalletProvider...')
        
        // Force a small delay to ensure browser APIs are ready
        await new Promise(resolve => setTimeout(resolve, 100))
        
        console.log('Setting isReady to true')
        setIsReady(true)
      } catch (err) {
        console.error('Failed to initialize wallet provider:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    initializeApp()
  }, [])

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-500">Failed to initialize app</p>
          <p className="text-xs text-muted-foreground mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Show loading state
  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SapaSafe...</p>
          <p className="text-xs text-muted-foreground mt-2">Setting up blockchain connection...</p>
        </div>
      </div>
    )
  }

  // App is ready, render the providers
  try {
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
  } catch (err) {
    console.error('Failed to create providers:', err)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-500">Failed to create blockchain providers</p>
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
}
