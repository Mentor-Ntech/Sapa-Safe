"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, BarChart3, Loader2 } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { useVaults, useUserProfile } from "@/Hooks"
import { useAccount, useChainId } from "wagmi"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function StatsPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { 
    vaultFactory
  } = useVaults()
  const { userProfile, isRegistered, isLoading: isProfileLoading } = useUserProfile()
  
  // Get status-based vaults directly from vaultFactory
  const activeVaults: string[] = Array.isArray(vaultFactory.userActiveVaults) ? vaultFactory.userActiveVaults : []
  const completedVaults: string[] = Array.isArray(vaultFactory.userCompletedVaults) ? vaultFactory.userCompletedVaults : []
  const earlyWithdrawnVaults: string[] = Array.isArray(vaultFactory.userEarlyWithdrawnVaults) ? vaultFactory.userEarlyWithdrawnVaults : []
  const vaultStatusSummary: any = vaultFactory.userVaultStatusSummary || { activeCount: 0, completedCount: 0, earlyWithdrawnCount: 0, terminatedCount: 0 }
  const isLoadingStatusData = vaultFactory.isLoadingUserActiveVaults || vaultFactory.isLoadingUserCompletedVaults || vaultFactory.isLoadingUserEarlyWithdrawnVaults || vaultFactory.isLoadingUserVaultStatusSummary
  
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [statsData, setStatsData] = useState({
    totalSaved: 0n,
    totalVaults: 0,
    activeVaults: 0,
    completedVaults: 0,
    successRate: 0,
    monthlyGrowth: 0,
    vaultPerformance: [] as any[],
    savingsGoals: [] as any[]
  })

  // Load stats data
  useEffect(() => {
    const loadStatsData = async () => {
      if (!isConnected || !address) {
        setIsLoadingData(false)
        return
      }

      try {
        setIsLoadingData(true)
        
        // Calculate basic stats
        const totalVaults = activeVaults.length + completedVaults.length + earlyWithdrawnVaults.length
        const successRate = totalVaults > 0 ? (completedVaults.length / totalVaults) * 100 : 0
        
        // TODO: Calculate total saved from actual vault balances
        const totalSaved = 0n // This should be calculated by summing all active vault balances
        
        // TODO: Calculate monthly growth from historical data
        const monthlyGrowth = 0 // This would need historical data
        
        // TODO: Calculate vault performance from actual vault data
        const vaultPerformance: any[] = [] // This would need detailed vault information
        
        // TODO: Calculate savings goals from user profile and vault data
        const savingsGoals: any[] = [] // This would need user goals and progress
        
        setStatsData({
          totalSaved,
          totalVaults,
          activeVaults: activeVaults.length,
          completedVaults: completedVaults.length,
          successRate,
          monthlyGrowth,
          vaultPerformance,
          savingsGoals
        })
        
      } catch (error) {
        console.error('Error loading stats data:', error)
      } finally {
        setIsLoadingData(false)
      }
    }

    if (isConnected && address) {
      loadStatsData()
    }
  }, [isConnected, address, activeVaults, completedVaults, earlyWithdrawnVaults])

  // Loading state
  if ((isLoadingData || isProfileLoading) && isConnected) {
    return <DashboardSkeleton />
  }

  // Not connected state
  if (!isConnected) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="sapasafe-heading-1 mb-4">Connect Your Wallet</h1>
            <p className="sapasafe-text text-muted-foreground">
              Connect your wallet to view your savings analytics
            </p>
          </div>
        </div>
      </PageTransition>
    )
  }

  // Network check - ensure we're on Alfajores
  if (chainId !== 44787) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="sapasafe-heading-1 mb-4">Switch to Alfajores</h1>
            <p className="sapasafe-text text-muted-foreground mb-6">
              SapaSafe is currently only available on Celo Alfajores testnet
            </p>
            <Button 
              onClick={() => window.open('https://docs.celo.org/network/alfajores', '_blank')}
              className="sapasafe-btn-primary"
            >
              Learn How to Switch Networks
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  // Not registered state
  if (!isRegistered) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <EmptyState
              icon={<Target className="h-12 w-12" />}
              title="Complete Your Registration"
              description="Please complete your profile to view your savings analytics"
              actionLabel="Complete Registration"
              onAction={() => router.push('/register')}
            />
          </div>
        </div>
      </PageTransition>
    )
  }

  // No vaults state
  const totalVaultsCount = activeVaults.length + completedVaults.length + earlyWithdrawnVaults.length
  if (totalVaultsCount === 0 && !isLoadingStatusData) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <EmptyState
              icon={<BarChart3 className="h-12 w-12" />}
              title="No Analytics Available"
              description="Create your first vault to start tracking your savings progress"
              actionLabel="Create Your First Vault"
              onAction={() => router.push('/create-vault')}
            />
          </div>
        </div>
      </PageTransition>
    )
  }
  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-8">
          <div>
            <h1 className="sapasafe-heading-2 mb-2">Savings Analytics</h1>
            <p className="sapasafe-text-large opacity-90">Track your financial progress</p>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="sapasafe-card sapasafe-card-interactive">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="sapasafe-text-small mb-1">Total Saved</p>
                    <p className="sapasafe-heading-2 text-primary">
                      {statsData.totalSaved ? `${Number(statsData.totalSaved) / 10**18}` : '0'} cNGN
                    </p>
                    <p className="sapasafe-text-caption text-success">
                      {statsData.monthlyGrowth > 0 ? `+${statsData.monthlyGrowth}%` : '0%'} this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sapasafe-card sapasafe-card-interactive">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="sapasafe-text-small mb-1">Success Rate</p>
                    <p className="sapasafe-heading-2 text-accent">{statsData.successRate.toFixed(1)}%</p>
                    <p className="sapasafe-text-caption text-success">
                      {statsData.completedVaults} of {statsData.totalVaults} vaults completed
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vault Statistics */}
          <Card className="sapasafe-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="sapasafe-heading-3">Vault Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div>
                    <p className="sapasafe-text-body font-semibold">Active Vaults</p>
                    <p className="sapasafe-text-small text-muted-foreground">Currently locked</p>
                  </div>
                  <div className="text-right">
                    <p className="sapasafe-text-body font-semibold text-primary">{statsData.activeVaults}</p>
                    <p className="sapasafe-text-small text-primary">
                      {statsData.totalVaults > 0 ? `${((statsData.activeVaults / statsData.totalVaults) * 100).toFixed(1)}%` : '0%'} of total
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div>
                    <p className="sapasafe-text-body font-semibold">Completed Vaults</p>
                    <p className="sapasafe-text-small text-muted-foreground">Successfully finished</p>
                  </div>
                  <div className="text-right">
                    <p className="sapasafe-text-body font-semibold text-accent">{statsData.completedVaults}</p>
                    <p className="sapasafe-text-small text-accent">
                      {statsData.totalVaults > 0 ? `${((statsData.completedVaults / statsData.totalVaults) * 100).toFixed(1)}%` : '0%'} success rate
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-info/5 rounded-lg border border-info/20">
                  <div>
                    <p className="sapasafe-text-body font-semibold">Total Vaults</p>
                    <p className="sapasafe-text-small text-muted-foreground">All time created</p>
                  </div>
                  <div className="text-right">
                    <p className="sapasafe-text-body font-semibold text-info">{statsData.totalVaults}</p>
                    <p className="sapasafe-text-small text-info">
                      {earlyWithdrawnVaults.length} early withdrawals
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vault Performance */}
          <Card className="sapasafe-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="sapasafe-heading-3">Vault Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeVaults.length === 0 && completedVaults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="sapasafe-text text-muted-foreground">
                    No vaults to display. Create your first vault to see performance metrics.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeVaults.length > 0 && (
                    <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                      <div className="flex items-center justify-between mb-2">
                        <p className="sapasafe-text-body font-semibold">Active Vaults</p>
                        <p className="sapasafe-text-small text-success">{activeVaults.length} vaults</p>
                      </div>
                      <div className="sapasafe-progress">
                        <div className="sapasafe-progress-bar" style={{ width: '100%' }}></div>
                      </div>
                      <p className="sapasafe-text-small text-muted-foreground mt-2">
                        Currently locked • {statsData.totalSaved ? `${Number(statsData.totalSaved) / 10**18}` : '0'} cNGN total
                      </p>
                    </div>
                  )}

                  {completedVaults.length > 0 && (
                    <div className="p-4 bg-info/5 rounded-lg border border-info/20">
                      <div className="flex items-center justify-between mb-2">
                        <p className="sapasafe-text-body font-semibold">Completed Vaults</p>
                        <p className="sapasafe-text-small text-info">{completedVaults.length} vaults</p>
                      </div>
                      <div className="sapasafe-progress">
                        <div className="sapasafe-progress-bar" style={{ width: '100%' }}></div>
                      </div>
                      <p className="sapasafe-text-small text-success mt-2">
                        Successfully completed • {statsData.successRate.toFixed(1)}% success rate
                      </p>
                    </div>
                  )}

                  {earlyWithdrawnVaults.length > 0 && (
                    <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                      <div className="flex items-center justify-between mb-2">
                        <p className="sapasafe-text-body font-semibold">Early Withdrawn Vaults</p>
                        <p className="sapasafe-text-small text-warning">{earlyWithdrawnVaults.length} vaults</p>
                      </div>
                      <div className="sapasafe-progress">
                        <div className="sapasafe-progress-bar" style={{ width: '100%' }}></div>
                      </div>
                      <p className="sapasafe-text-small text-muted-foreground mt-2">
                        Withdrawn before completion • Penalties applied
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Savings Goals */}
          <Card className="sapasafe-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-info rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="sapasafe-heading-3">Savings Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="sapasafe-text text-muted-foreground mb-4">
                  Savings goals feature coming soon!
                </p>
                <p className="sapasafe-text-small text-muted-foreground">
                  You'll be able to set and track custom savings goals with progress indicators.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
