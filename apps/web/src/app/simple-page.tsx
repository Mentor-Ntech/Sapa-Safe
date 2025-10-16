export default function SimplePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">SapaSafe</h1>
                <p className="text-xs text-muted-foreground">Secure African Savings</p>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4 bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="container mx-auto max-w-6xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-yellow-100 text-yellow-800 rounded-full">
            <span className="text-sm">✨</span>
            <span className="font-semibold text-sm">Built on Celo Blockchain</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            Beat <span className="text-primary">Sapa</span> with{" "}
            <span className="text-accent">Smart Savings</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of African youth building wealth through disciplined savings. 
            Lock your funds in time-bound vaults and earn rewards for staying committed.
          </p>

          {/* CTA Button */}
          <button className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 text-lg font-semibold">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose SapaSafe?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Savings</h3>
              <p className="text-muted-foreground">Your funds are locked in smart contracts on the blockchain</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Wealth</h3>
              <p className="text-muted-foreground">Disciplined monthly savings help you achieve your goals</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">African Focused</h3>
              <p className="text-muted-foreground">Built for African currencies and financial needs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
