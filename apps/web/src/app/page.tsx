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
                <div className="sapasafe-text-large font-bold text-primary mb-2">$2M+</div>
                <p className="sapasafe-text-small">Total Saved</p>
              </div>
              <div className="text-center">
                <div className="sapasafe-text-large font-bold text-primary mb-2">95%</div>
                <p className="sapasafe-text-small">Success Rate</p>
              </div>
              <div className="text-center">
                <div className="sapasafe-text-large font-bold text-primary mb-2">24/7</div>
                <p className="sapasafe-text-small">Secure</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="sapasafe-btn-primary sapasafe-btn-large"
                onClick={() => router.push("/register")}
              >
                Start Saving Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="sapasafe-btn-outline"
                onClick={() => router.push("/dashboard")}
              >
                View Dashboard
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="sapasafe-heading-2 mb-4">Why Choose SapaSafe?</h2>
              <p className="sapasafe-text-large text-muted-foreground max-w-2xl mx-auto">
                Built specifically for African youth with features that matter most
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="sapasafe-feature-card sapasafe-fade-in">
                <div className="sapasafe-feature-icon">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="sapasafe-feature-title">Secure Savings</h3>
                <p className="sapasafe-feature-description">
                  Your funds are locked in time-bound smart contracts on the blockchain. 
                  No early withdrawals, no excuses - just disciplined saving.
                </p>
              </div>
              
              <div className="sapasafe-feature-card sapasafe-fade-in">
                <div className="sapasafe-feature-icon">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="sapasafe-feature-title">Build Wealth</h3>
                <p className="sapasafe-feature-description">
                  Set monthly savings goals and watch your wealth grow. 
                  Perfect for saving for education, business, or emergencies.
                </p>
              </div>
              
              <div className="sapasafe-feature-card sapasafe-fade-in">
                <div className="sapasafe-feature-icon">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="sapasafe-feature-title">African Focused</h3>
                <p className="sapasafe-feature-description">
                  Built for African currencies and financial needs. 
                  Support for Naira, Cedi, Shilling, Rand, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-accent/5 via-background to-primary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="sapasafe-heading-2 mb-4">How It Works</h2>
              <p className="sapasafe-text-large text-muted-foreground max-w-2xl mx-auto">
                Get started with SapaSafe in just 3 simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="sapasafe-step-number">1</div>
                <h3 className="sapasafe-step-title">Connect Wallet</h3>
                <p className="sapasafe-step-description">
                  Connect your Valora, MetaMask, or any Celo wallet to get started
                </p>
              </div>
              
              <div className="text-center">
                <div className="sapasafe-step-number">2</div>
                <h3 className="sapasafe-step-title">Create Vault</h3>
                <p className="sapasafe-step-description">
                  Set your savings goal, duration, and monthly amount. Choose your preferred currency.
                </p>
              </div>
              
              <div className="text-center">
                <div className="sapasafe-step-number">3</div>
                <h3 className="sapasafe-step-title">Start Saving</h3>
                <p className="sapasafe-step-description">
                  Make monthly payments and watch your savings grow. Stay committed to your goals!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="sapasafe-stat-number">₦500M+</div>
                <p className="sapasafe-stat-label">Total Saved in Naira</p>
              </div>
              <div className="text-center">
                <div className="sapasafe-stat-number">₵50M+</div>
                <p className="sapasafe-stat-label">Total Saved in Cedis</p>
              </div>
              <div className="text-center">
                <div className="sapasafe-stat-number">KSh 100M+</div>
                <p className="sapasafe-stat-label">Total Saved in Shillings</p>
              </div>
              <div className="text-center">
                <div className="sapasafe-stat-number">R 25M+</div>
                <p className="sapasafe-stat-label">Total Saved in Rands</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="sapasafe-heading-2 mb-6">Ready to Beat Sapa?</h2>
            <p className="sapasafe-text-large text-muted-foreground mb-8">
              Join thousands of African youth who are already building wealth through disciplined savings
            </p>
            <Button 
              size="lg" 
              className="sapasafe-btn-primary sapasafe-btn-large"
              onClick={() => router.push("/register")}
            >
              Start Your Savings Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
