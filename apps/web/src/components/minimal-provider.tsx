"use client"

import { useState, useEffect } from 'react'

export function MinimalProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    console.log('MinimalProvider: Starting initialization...')
    
    const timer = setTimeout(() => {
      console.log('MinimalProvider: Setting ready to true')
      setIsReady(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SapaSafe...</p>
          <p className="text-xs text-muted-foreground mt-2">Minimal provider test...</p>
        </div>
      </div>
    )
  }

  console.log('MinimalProvider: Rendering children')
  
  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">SapaSafe - Test Mode</h1>
        <p className="text-muted-foreground mb-4">App is loading successfully!</p>
        <p className="text-sm text-muted-foreground">Wallet functionality is disabled for testing.</p>
      </div>
      {children}
    </div>
  )
}
