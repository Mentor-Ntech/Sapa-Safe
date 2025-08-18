"use client"

import { useState, useEffect } from "react"
import { useVaults, useTransactions } from "@/Hooks"
import { useAccount } from "wagmi"
import { PageTransition } from "@/components/page-transition"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Eye, 
  AlertTriangle, 
  Clock,
  PiggyBank,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function VaultsPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { 
    vaultFactory, 
    getUserVaults, 
    getVaultAnalytics,
    withdrawFromVault,
    refreshVaultData,
    isLoading,
    hasError 
  } = useVaults()
  const { addTransaction, hasPendingTransactions } = useTransactions()
  
  const [userVaults, setUserVaults] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Load user vaults
  useEffect(() => {
    const loadVaults = async () => {
      if (!isConnected || !address) {
        setIsLoadingData(false)
        return
      }

      try {
        setIsLoadingData(true)
        const vaults = await getUserVaults()
        setUserVaults(Array.isArray(vaults) ? vaults : [])
      } catch (error) {
        console.error('Error loading vaults:', error)
        toast.error('Failed to load vaults')
      } finally {
        setIsLoadingData(false)
      }
    }

    loadVaults()
  }, [isConnected, address, getUserVaults])

  const handleCreateVault = () => {
    router.push('/create-vault')
  }

  const handleViewDetails = (vaultAddress: string) => {
    router.push(`/vault-details/${vaultAddress}`)
  }

  const handleRefresh = async () => {
    try {
      await refreshVaultData()
      toast.success('Vault data refreshed')
    } catch (error) {
      console.error('Error refreshing vault data:', error)
      toast.error('Failed to refresh vault data')
    }
  }

  const handleEarlyWithdraw = async (vaultAddress: string, amount: bigint) => {
    try {
      await withdrawFromVault(vaultAddress as `0x${string}`, true)
      
      addTransaction({
        hash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
        type: 'emergency_withdraw',
        status: 'pending',
        description: 'Early withdrawal with penalty',
        metadata: { vaultAddress, amount: amount.toString() }
      })
      
      toast.success('Early withdrawal initiated')
    } catch (error) {
      console.error('Error with early withdrawal:', error)
      toast.error('Failed to process early withdrawal')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LOCKED':
        return 'sapasafe-status-info'
      case 'WITHDRAWN_COMPLETED':
        return 'sapasafe-status-success'
      case 'WITHDRAWN_EARLY':
        return 'sapasafe-status-error'
      default:
        return 'sapasafe-status-info'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'LOCKED':
        return <Clock className="h-4 w-4" />
      case 'WITHDRAWN_COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'WITHDRAWN_EARLY':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatAmount = (amount: bigint, decimals: number = 18) => {
    if (!amount) return '0'
    return (Number(amount) / 10**decimals).toFixed(2)
  }

  // Loading state
  if (isLoadingData || isLoading) {
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
  if (userVaults.length === 0) {
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

  // Categorize vaults
  const activeVaults = userVaults.filter(vault => vault.status === 'LOCKED')
  const completedVaults = userVaults.filter(vault => vault.status === 'WITHDRAWN_COMPLETED')
  const earlyWithdrawnVaults = userVaults.filter(vault => vault.status === 'WITHDRAWN_EARLY')

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
            <h2 className="sapasafe-heading-3 mb-4">Active Vaults</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeVaults.map((vault, index) => (
                <Card key={index} className="sapasafe-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="sapasafe-heading-4">
                          Vault #{index + 1}
                        </CardTitle>
                        <CardDescription>
                          {vault.token} • {vault.duration} days
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(vault.status)}>
                        {getStatusIcon(vault.status)}
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="sapasafe-text-sm text-muted-foreground">Balance</span>
                      <span className="sapasafe-heading-4">
                        {formatAmount(vault.balance || 0n)}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 sapasafe-btn-outline"
                        onClick={() => handleViewDetails(vault.address)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 border-error/20 text-error hover:bg-error/5"
                        onClick={() => handleEarlyWithdraw(vault.address, vault.balance || 0n)}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Early Withdraw
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Vaults */}
        {completedVaults.length > 0 && (
          <div className="mb-8">
            <h2 className="sapasafe-heading-3 mb-4">Completed Vaults</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedVaults.map((vault, index) => (
                <Card key={index} className="sapasafe-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="sapasafe-heading-4">
                          Vault #{index + 1}
                        </CardTitle>
                        <CardDescription>
                          {vault.token} • Completed
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(vault.status)}>
                        {getStatusIcon(vault.status)}
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="sapasafe-text-sm text-muted-foreground">Final Amount</span>
                      <span className="sapasafe-heading-4">
                        {formatAmount(vault.balance || 0n)}
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sapasafe-btn-outline"
                      onClick={() => handleViewDetails(vault.address)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Early Withdrawn Vaults */}
        {earlyWithdrawnVaults.length > 0 && (
          <div className="mb-8">
            <h2 className="sapasafe-heading-3 mb-4">Early Withdrawn Vaults</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earlyWithdrawnVaults.map((vault, index) => (
                <Card key={index} className="sapasafe-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="sapasafe-heading-4">
                          Vault #{index + 1}
                        </CardTitle>
                        <CardDescription>
                          {vault.token} • Early Withdrawn
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(vault.status)}>
                        {getStatusIcon(vault.status)}
                        Early Withdrawn
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="sapasafe-text-sm text-muted-foreground">Amount Returned</span>
                      <span className="sapasafe-heading-4">
                        {formatAmount(vault.balance || 0n)}
                      </span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sapasafe-btn-outline"
                      onClick={() => handleViewDetails(vault.address)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
