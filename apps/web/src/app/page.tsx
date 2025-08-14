"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Clock, TrendingUp, CheckCircle, Sparkles, Trophy, Users, Zap, ArrowRight, Star, Award, Target, BarChart3, Lock, Globe, Smartphone, CreditCard } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { PageTransition } from "@/components/page-transition"
import { useNav } from "@/components/nav-context"

export default function Home() {
  const router = useRouter()
  const { setShowMobileNav } = useNav()

  useEffect(() => {
    // Hide mobile navigation on landing page
    setShowMobileNav(false)
    
    // Cleanup: show mobile navigation when leaving this page
    return () => {
      setShowMobileNav(true)
    }
  }, [setShowMobileNav])

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-primary">SapaSafe</h1>
                  <p className="text-xs text-muted-foreground">Secure African Savings</p>
                </div>
              </div>
              
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading'
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated')

                  return (
                    <Button
                      className={connected ? "sapasafe-btn-accent" : "sapasafe-btn-primary"}
                      onClick={connected ? () => router.push("/register") : openConnectModal}
                      disabled={!ready}
                    >
                      {!ready ? 'Loading...' : connected ? 'Launch App' : 'Connect Wallet'}
                    </Button>
                  )
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4 bg-gradient-to-br from-background via-primary/5 to-accent/5">
          <div className="container mx-auto max-w-6xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 sapasafe-badge sapasafe-badge-gold sapasafe-bounce-in">
              <Sparkles className="h-4 w-4" />
              <span className="font-semibold">Built on Celo Blockchain</span>
            </div>

            {/* Main Heading */}
            <h1 className="sapasafe-heading-1 mb-8 sapasafe-fade-in">
              Beat <span className="text-primary">Sapa</span> with{" "}
              <span className="text-accent">Smart Savings</span>
            </h1>

            {/* Subtitle */}
            <p className="sapasafe-text-large text-muted-foreground mb-12 max-w-3xl mx-auto sapasafe-slide-up leading-relaxed">
              Join thousands of African youth building wealth through disciplined savings. 
              Lock your funds in time-bound vaults and earn rewards for staying committed.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              <div className="text-center">
                <div className="sapasafe-text-large font-bold text-primary mb-2">10K+</div>
                <p className="sapasafe-text-small">Active Savers</p>
              </div>
              <div className="text-center">
                <div className="sapasafe-text-large font-bold text-accent mb-2">₦2M+</div>
                <p className="sapasafe-text-small">Total Saved</p>
              </div>
              <div className="text-center">
                <div className="sapasafe-text-large font-bold text-info mb-2">5</div>
                <p className="sapasafe-text-small">African Currencies</p>
              </div>
              <div className="text-center">
                <div className="sapasafe-text-large font-bold text-success mb-2">99.9%</div>
                <p className="sapasafe-text-small">Success Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="sapasafe-heading-2 mb-6">Why Choose SapaSafe?</h2>
              <p className="sapasafe-text-large text-muted-foreground max-w-2xl mx-auto">
                The most trusted platform for African youth to build wealth through disciplined savings
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="sapasafe-card sapasafe-card-interactive p-8 text-center sapasafe-fade-in">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="sapasafe-heading-3 mb-4">Secure Smart Contracts</h3>
                <p className="sapasafe-text-small text-muted-foreground">
                  Time-locked smart contracts ensure your savings stay safe and committed. 
                  No early withdrawals without penalties.
                </p>
              </div>
              
              <div className="sapasafe-card sapasafe-card-interactive p-8 text-center sapasafe-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <h3 className="sapasafe-heading-3 mb-4">Flexible Goals</h3>
                <p className="sapasafe-text-small text-muted-foreground">
                  Choose from 1 week to 1 year lock periods with customizable amounts. 
                  Set multiple savings goals simultaneously.
                </p>
              </div>
              
              <div className="sapasafe-card sapasafe-card-interactive p-8 text-center sapasafe-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-info/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-info" />
                </div>
                <h3 className="sapasafe-heading-3 mb-4">Earn Rewards</h3>
                <p className="sapasafe-text-small text-muted-foreground">
                  Build streaks, unlock achievements, and earn bonus rewards for discipline. 
                  Gamified savings experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="sapasafe-heading-2 mb-6">How SapaSafe Works</h2>
              <p className="sapasafe-text-large text-muted-foreground max-w-2xl mx-auto">
                Simple steps to start your wealth-building journey
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center sapasafe-fade-in">
                <div className="w-16 h-16 bg-primary text-white rounded-xl flex items-center justify-center mx-auto mb-6 font-bold text-xl">
                  1
                </div>
                <h3 className="sapasafe-heading-3 mb-4">Connect Wallet</h3>
                <p className="sapasafe-text-small text-muted-foreground">
                  Link your wallet and choose your preferred African currency. 
                  Support for multiple wallets and networks.
                </p>
              </div>
              
              <div className="text-center sapasafe-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-accent text-white rounded-xl flex items-center justify-center mx-auto mb-6 font-bold text-xl">
                  2
                </div>
                <h3 className="sapasafe-heading-3 mb-4">Set Your Goal</h3>
                <p className="sapasafe-text-small text-muted-foreground">
                  Choose amount, duration, and create your savings vault. 
                  Set realistic goals that match your financial capacity.
                </p>
              </div>
              
              <div className="text-center sapasafe-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-info text-white rounded-xl flex items-center justify-center mx-auto mb-6 font-bold text-xl">
                  3
                </div>
                <h3 className="sapasafe-heading-3 mb-4">Earn Rewards</h3>
                <p className="sapasafe-text-small text-muted-foreground">
                  Stay disciplined, build streaks, and unlock achievements. 
                  Watch your wealth grow with compound benefits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Currency Support Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="sapasafe-heading-2 mb-6">Supported Currencies</h2>
              <p className="sapasafe-text-large text-muted-foreground max-w-2xl mx-auto">
                Save in your local currency with stablecoin backing for maximum security
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="sapasafe-card p-6 text-center currency-ngn rounded-xl">
                <div className="text-3xl mb-3">₦</div>
                <p className="sapasafe-text-body font-medium">Nigerian Naira</p>
                <p className="sapasafe-text-small text-muted-foreground mt-1">cNGN</p>
              </div>
              <div className="sapasafe-card p-6 text-center currency-ghs rounded-xl">
                <div className="text-3xl mb-3">₵</div>
                <p className="sapasafe-text-body font-medium">Ghanaian Cedi</p>
                <p className="sapasafe-text-small text-muted-foreground mt-1">cGHS</p>
              </div>
              <div className="sapasafe-card p-6 text-center currency-kes rounded-xl">
                <div className="text-3xl mb-3">KSh</div>
                <p className="sapasafe-text-body font-medium">Kenyan Shilling</p>
                <p className="sapasafe-text-small text-muted-foreground mt-1">cKES</p>
              </div>
              <div className="sapasafe-card p-6 text-center currency-zar rounded-xl">
                <div className="text-3xl mb-3">R</div>
                <p className="sapasafe-text-body font-medium">South African Rand</p>
                <p className="sapasafe-text-small text-muted-foreground mt-1">cZAR</p>
              </div>
              <div className="sapasafe-card p-6 text-center currency-xof rounded-xl">
                <div className="text-3xl mb-3">CFA</div>
                <p className="sapasafe-text-body font-medium">West African CFA</p>
                <p className="sapasafe-text-small text-muted-foreground mt-1">cXOF</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="sapasafe-heading-2 mb-6">Built on Modern Technology</h2>
              <p className="sapasafe-text-large text-muted-foreground max-w-2xl mx-auto">
                Leveraging the power of blockchain for secure, transparent, and efficient savings
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="sapasafe-heading-3 mb-2">Celo Blockchain</h3>
                    <p className="sapasafe-text-small text-muted-foreground">
                      Built on Celo's mobile-first blockchain, ensuring fast, secure, and low-cost transactions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="sapasafe-heading-3 mb-2">Mobile-First Design</h3>
                    <p className="sapasafe-text-small text-muted-foreground">
                      Optimized for mobile devices, making it easy to save on the go.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <h3 className="sapasafe-heading-3 mb-2">Multi-Currency Support</h3>
                    <p className="sapasafe-text-small text-muted-foreground">
                      Support for multiple African currencies with real-time conversion rates.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="sapasafe-card p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="sapasafe-text-body font-medium">Transaction Speed</span>
                    <span className="sapasafe-text-body font-bold text-success">~5 seconds</span>
                  </div>
                  <div className="sapasafe-progress">
                    <div className="sapasafe-progress-bar" style={{ width: '95%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="sapasafe-text-body font-medium">Security Level</span>
                    <span className="sapasafe-text-body font-bold text-success">99.9%</span>
                  </div>
                  <div className="sapasafe-progress">
                    <div className="sapasafe-progress-bar" style={{ width: '99%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="sapasafe-text-body font-medium">Cost Efficiency</span>
                    <span className="sapasafe-text-body font-bold text-success">~$0.01</span>
                  </div>
                  <div className="sapasafe-progress">
                    <div className="sapasafe-progress-bar" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="sapasafe-heading-2 mb-6">What Our Users Say</h2>
              <p className="sapasafe-text-large text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied users who have transformed their savings habits
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="sapasafe-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="sapasafe-text-small text-muted-foreground mb-4">
                  "SapaSafe helped me save ₦500,000 in just 6 months. The gamification makes saving fun!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">A</span>
                  </div>
                  <div>
                    <p className="sapasafe-text-small font-medium">Aisha, Lagos</p>
                    <p className="sapasafe-text-caption text-muted-foreground">Student</p>
                  </div>
                </div>
              </div>
              
              <div className="sapasafe-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="sapasafe-text-small text-muted-foreground mb-4">
                  "The best savings app I've ever used. The penalties actually help me stay disciplined."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent font-bold">K</span>
                  </div>
                  <div>
                    <p className="sapasafe-text-small font-medium">Kwame, Accra</p>
                    <p className="sapasafe-text-caption text-muted-foreground">Entrepreneur</p>
                  </div>
                </div>
              </div>
              
              <div className="sapasafe-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="sapasafe-text-small text-muted-foreground mb-4">
                  "Finally, a savings platform that understands African financial needs!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                    <span className="text-info font-bold">M</span>
                  </div>
                  <div>
                    <p className="sapasafe-text-small font-medium">Muthoni, Nairobi</p>
                    <p className="sapasafe-text-caption text-muted-foreground">Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background border-t border-border/50">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand & Mission */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">SapaSafe</h3>
                    <p className="text-xs text-muted-foreground">Beat Sapa Together</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Helping African youth build wealth through disciplined savings. 
                  Join the movement to end financial insecurity.
                </p>
              </div>

              {/* Quick Links */}
              <div className="text-center">
                <h4 className="font-semibold mb-4 text-foreground">Quick Start</h4>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Supported Currencies</a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Safety & Security</a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Help Center</a>
                </div>
              </div>

              {/* Trust & Support */}
              <div className="text-center md:text-right">
                <h4 className="font-semibold mb-4 text-foreground">Support</h4>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Contact Us</a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Community</a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Status Page</a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">Report Issue</a>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="border-t border-border/30 pt-6 mb-6">
              <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Built on Celo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>5 African Countries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-info rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-border/30 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  <span>&copy; 2025 SapaSafe. Empowering African youth.</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
