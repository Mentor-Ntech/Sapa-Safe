"use client"

export function StaticProvider({ children }: { children: React.ReactNode }) {
  console.log('StaticProvider: Rendering immediately')
  
  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">SapaSafe - Static Mode</h1>
        <p className="text-muted-foreground mb-4">App loaded successfully!</p>
        <p className="text-sm text-muted-foreground">No state management - direct render.</p>
      </div>
      {children}
    </div>
  )
}
