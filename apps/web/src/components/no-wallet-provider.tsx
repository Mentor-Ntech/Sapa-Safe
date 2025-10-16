"use client"

export function NoWalletProvider({ children }: { children: React.ReactNode }) {
  console.log('NoWalletProvider: Rendering immediately')
  
  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">SapaSafe - No Wallet Mode</h1>
        <p className="text-muted-foreground mb-4">App loaded successfully without wallet providers!</p>
        <p className="text-sm text-muted-foreground">This confirms the app can render without wallet dependencies.</p>
      </div>
      {children}
    </div>
  )
}
