"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Clock, TrendingUp, CheckCircle, Sparkles, Trophy, Users, Zap } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

export default function Home() {
  const router = useRouter()
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 sapasafe-badge sapasafe-badge-gold sapasafe-bounce-in">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold">Built on Celo Blockchain</span>
          </div>

          {/* Main Heading */}
          <h1 className="sapasafe-heading-1 mb-6 sapasafe-fade-in">
            Beat <span className="text-primary">Sapa</span> with{" "}
            <span className="text-accent">Smart Savings</span>
          </h1>

          {/* Subtitle */}
          <p className="sapasafe-text-large text-muted-foreground mb-12 max-w-2xl mx-auto sapasafe-slide-up">
            Join thousands of African youth building wealth through disciplined savings. 
            Lock your funds in time-bound vaults and earn rewards for staying committed.
          </p>

          {/* CTA Button */}
          <div className="mb-16 sapasafe-bounce-in">
            {isConnected ? (
              <Button 
                size="lg" 
                className="sapasafe-btn-primary text-lg px-8 py-4"
                onClick={() => router.push("/register")}
              >
                Continue to Registration
              </Button>
            ) : (
              <div className="flex justify-center">
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
                        size="lg"
                        className="sapasafe-btn-primary text-lg px-8 py-4"
                        onClick={openConnectModal}
                        disabled={!ready}
                      >
                        {!ready ? 'Loading...' : connected ? 'Connected' : 'Connect Wallet to Start'}
                      </Button>
                    )
                  }}
                </ConnectButton.Custom>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <div className="sapasafe-card sapasafe-card-interactive p-6 text-center sapasafe-fade-in">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="sapasafe-heading-3 mb-3">Secure Vaults</h3>
              <p className="sapasafe-text-small">
                Time-locked smart contracts ensure your savings stay safe and committed
              </p>
            </div>
            
            <div className="sapasafe-card sapasafe-card-interactive p-6 text-center sapasafe-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="sapasafe-heading-3 mb-3">Flexible Goals</h3>
              <p className="sapasafe-text-small">
                Choose from 1 week to 1 year lock periods with customizable amounts
              </p>
            </div>
            
            <div className="sapasafe-card sapasafe-card-interactive p-6 text-center sapasafe-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-info" />
              </div>
              <h3 className="sapasafe-heading-3 mb-3">Earn Rewards</h3>
              <p className="sapasafe-text-small">
                Build streaks, unlock achievements, and earn bonus rewards for discipline
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="sapasafe-card p-8 sapasafe-slide-up">
            <h2 className="sapasafe-heading-2 mb-8">Trusted by African Youth</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="sapasafe-heading-2 mb-4">How SapaSafe Works</h2>
            <p className="sapasafe-text-large text-muted-foreground">
              Simple steps to start your wealth-building journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center sapasafe-fade-in">
              <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="sapasafe-heading-3 mb-2">Connect Wallet</h3>
              <p className="sapasafe-text-small">
                Link your wallet and choose your preferred African currency
              </p>
            </div>
            
            <div className="text-center sapasafe-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-accent text-white rounded-lg flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="sapasafe-heading-3 mb-2">Set Your Goal</h3>
              <p className="sapasafe-text-small">
                Choose amount, duration, and create your savings vault
              </p>
            </div>
            
            <div className="text-center sapasafe-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-info text-white rounded-lg flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="sapasafe-heading-3 mb-2">Earn Rewards</h3>
              <p className="sapasafe-text-small">
                Stay disciplined, build streaks, and unlock achievements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Currency Support */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="sapasafe-heading-2 mb-4">Supported Currencies</h2>
            <p className="sapasafe-text-large text-muted-foreground">
              Save in your local currency with stablecoin backing
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="sapasafe-card p-4 text-center currency-ngn rounded-lg">
              <div className="text-2xl mb-2">₦</div>
              <p className="sapasafe-text-small font-medium">Nigerian Naira</p>
            </div>
            <div className="sapasafe-card p-4 text-center currency-ghs rounded-lg">
              <div className="text-2xl mb-2">₵</div>
              <p className="sapasafe-text-small font-medium">Ghanaian Cedi</p>
            </div>
            <div className="sapasafe-card p-4 text-center currency-kes rounded-lg">
              <div className="text-2xl mb-2">KSh</div>
              <p className="sapasafe-text-small font-medium">Kenyan Shilling</p>
            </div>
            <div className="sapasafe-card p-4 text-center currency-zar rounded-lg">
              <div className="text-2xl mb-2">R</div>
              <p className="sapasafe-text-small font-medium">South African Rand</p>
            </div>
            <div className="sapasafe-card p-4 text-center currency-xof rounded-lg">
              <div className="text-2xl mb-2">CFA</div>
              <p className="sapasafe-text-small font-medium">West African CFA</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
