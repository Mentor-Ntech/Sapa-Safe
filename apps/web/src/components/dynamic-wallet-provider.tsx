"use client"

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Dynamic import to prevent SSR issues
const WalletProvider = dynamic(
  () => import('./wallet-provider').then(mod => ({ default: mod.AppProvider })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SapaSafe...</p>
        </div>
      </div>
    ),
  }
)

export function DynamicWalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SapaSafe...</p>
        </div>
      </div>
    )
  }

  return <WalletProvider>{children}</WalletProvider>
}
