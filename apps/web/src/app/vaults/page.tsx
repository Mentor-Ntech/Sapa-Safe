"use client"

import { useState, useEffect } from "react"
import { useVaults, useTransactions } from "@/Hooks"
import { useAccount } from "wagmi"
import { PageTransition } from "@/components/page-transition"
import { EmptyState } from "@/components/empty-state"
import { VaultCard } from "@/components/vault-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Plus, 
  PiggyBank,
  RefreshCw,
  Clock
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function VaultsPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { 
    userVaults: vaultsFromHook, 
    getUserVaults, 
    withdrawFromVault,
    refreshVaultData,
    isLoading,
    getVaultPenalty,
    vaultFactory
  } = useVaults()
  const { addTransaction, hasPendingTransactions } = useTransactions()
  
  // Use vaults directly from the hook - these are vault addresses
  const userVaults: string[] = Array.isArray(vaultsFromHook) ? vaultsFromHook : []
  
  // Get status-based vaults directly from vaultFactory
  const activeVaults: string[] = Array.isArray(vaultFactory.userActiveVaults) ? vaultFactory.userActiveVaults : []
  const completedVaults: string[] = Array.isArray(vaultFactory.userCompletedVaults) ? vaultFactory.userCompletedVaults : []
  const earlyWithdrawnVaults: string[] = Array.isArray(vaultFactory.userEarlyWithdrawnVaults) ? vaultFactory.userEarlyWithdrawnVaults : []
  const vaultStatusSummary = vaultFactory.userVaultStatusSummary || { activeCount: 0, completedCount: 0, earlyWithdrawnCount: 0, terminatedCount: 0 }
  const isLoadingStatusData = vaultFactory.isLoadingUserActiveVaults || vaultFactory.isLoadingUserCompletedVaults || vaultFactory.isLoadingUserEarlyWithdrawnVaults || vaultFactory.isLoadingUserVaultStatusSummary

  const handleCreateVault = () => {
    router.push('/create-vault')
  }

  const handleViewDetails = (vaultAddress: string) => {
    router.push(`/vault-details?id=${vaultAddress}`)
  }

  const handleRefresh = async () => {
    try {
      console.log('Manually refreshing vault data...')
      await refreshVaultData()
      
      // Refresh status-based vault data
      await vaultFactory.refetchUserActiveVaults()
      await vaultFactory.refetchUserCompletedVaults()
      await vaultFactory.refetchUserEarlyWithdrawnVaults()
      await vaultFactory.refetchUserVaultStatusSummary()
      
      console.log('Vault data refreshed')
      toast.success('Vault data refreshed')
    } catch (error) {
      console.error('Error refreshing vault data:', error)
      toast.error('Failed to refresh vault data')
    }
  }



  // Loading state
  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  // Not connected state
  if (!isConnected) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="sapasafe-heading-1 mb-4">Connect Your Wallet</h1>
            <p className="sapasafe-text text-muted-foreground">
              Connect your wallet to view your savings vaults
            </p>
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
              icon={<PiggyBank className="h-12 w-12" />}
              title="No Vaults Found"
              description="You haven't created any savings vaults yet. Start your savings journey today!"
              actionLabel="Create Your First Vault"
              onAction={handleCreateVault}
            />
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="sapasafe-heading-1">My Vaults</h1>
            <p className="sapasafe-text text-muted-foreground">
              Manage your savings vaults and track your progress
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="sapasafe-btn-outline"
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleCreateVault} className="sapasafe-btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create Vault
            </Button>
          </div>
        </div>

        {/* Pending Transactions Alert */}
        {hasPendingTransactions && (
          <Card className="sapasafe-card mb-6 border-warning/20 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="sapasafe-text-sm font-medium text-warning">
                    You have pending transactions
                  </p>
                  <p className="sapasafe-text-xs text-muted-foreground">
                    Some of your vault operations are being processed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Vaults */}
        {activeVaults.length > 0 && (
          <div className="mb-8">
            <h2 className="sapasafe-heading-3 mb-4">Active Vaults ({activeVaults.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeVaults.map((vaultAddress, index) => (
                <VaultCard
                  key={index}
                  vaultAddress={vaultAddress}
                  index={index}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Vaults */}
        {completedVaults.length > 0 && (
          <div className="mb-8">
            <h2 className="sapasafe-heading-3 mb-4">Completed Vaults ({completedVaults.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedVaults.map((vaultAddress, index) => (
                <VaultCard
                  key={index}
                  vaultAddress={vaultAddress}
                  index={index}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* Early Withdrawn Vaults */}
        {earlyWithdrawnVaults.length > 0 && (
          <div className="mb-8">
            <h2 className="sapasafe-heading-3 mb-4">Early Withdrawn Vaults ({earlyWithdrawnVaults.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earlyWithdrawnVaults.map((vaultAddress, index) => (
                <VaultCard
                  key={index}
                  vaultAddress={vaultAddress}
                  index={index}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Vaults State */}
        {activeVaults.length === 0 && completedVaults.length === 0 && earlyWithdrawnVaults.length === 0 && (
          <EmptyState
            icon={<PiggyBank className="h-12 w-12" />}
            title="No Vaults Yet"
            description="Create your first savings vault to start building your financial future"
            onAction={handleCreateVault}
            actionLabel="Create Your First Vault"
          />
        )}


      </div>
    </PageTransition>
  )
}
