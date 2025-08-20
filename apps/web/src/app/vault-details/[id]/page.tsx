"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSavingsVault, usePenaltyManager } from "@/Hooks"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  History,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

export default function VaultDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const vaultAddress = params.id as `0x${string}`
  
  // Use the vault hook to get real data
  const vault = useSavingsVault(vaultAddress)
  const penaltyManager = usePenaltyManager()
  
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [showEarlyWithdrawConfirm, setShowEarlyWithdrawConfirm] = useState(false)

  console.log('Vault details:', {
    vaultAddress,
    vaultInfo: vault.vaultInfo,
    vaultBalance: vault.vaultBalance,
    isUnlocked: vault.isUnlocked,
    remainingTime: vault.remainingTime,
    canWithdraw: vault.canWithdraw,
    canWithdrawEarly: vault.canWithdrawEarly
  })

  const handleWithdraw = async () => {
    if (!vault.canWithdraw) {
      toast.error('Vault is not ready for withdrawal')
      return
    }

    try {
      setIsWithdrawing(true)
      await vault.withdrawCompletedFunds()
      toast.success('Withdrawal initiated! Check your wallet for confirmation.')
      router.push("/vaults")
    } catch (error) {
      console.error('Error withdrawing:', error)
      toast.error('Failed to withdraw funds')
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleEarlyWithdraw = async () => {
    if (!vault.canWithdrawEarly) {
      toast.error('Early withdrawal not available')
      return
    }

    try {
      setIsWithdrawing(true)
      
      // Calculate penalty
      const balance = typeof vault.vaultBalance === 'bigint' ? vault.vaultBalance : 0n
      const { penalty } = await penaltyManager.calculatePenalty(balance)
      
      // Perform early withdrawal
      await vault.withdrawEarlyFunds(penalty)
      
      toast.success('Early withdrawal initiated! Check your wallet for confirmation.')
      setShowEarlyWithdrawConfirm(false)
      router.push("/vaults")
    } catch (error) {
      console.error('Error with early withdrawal:', error)
      toast.error('Failed to process early withdrawal')
    } finally {
      setIsWithdrawing(false)
    }
  }

  const getStatusColor = (isUnlocked: boolean) => {
    return isUnlocked ? "sapasafe-status-success" : "sapasafe-status-info"
  }

  const getStatusIcon = (isUnlocked: boolean) => {
    return isUnlocked ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />
  }

  const getStatusText = (isUnlocked: boolean) => {
    return isUnlocked ? "Unlocked" : "Locked"
  }

  const formatAmount = (amount: bigint, decimals: number = 18) => {
    if (!amount) return '0'
    return (Number(amount) / 10**decimals).toFixed(2)
  }

  const formatTime = (seconds: bigint) => {
    if (!seconds) return '0 days'
    const days = Number(seconds) / (24 * 60 * 60)
    return `${Math.ceil(days)} days`
  }

  // Loading state
  if (vault.isLoadingVaultInfo || vault.isLoadingBalance) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading vault details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="sapasafe-heading-1 mb-4">Connect Your Wallet</h1>
            <p className="sapasafe-text text-muted-foreground">
              Connect your wallet to view vault details
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="sapasafe-heading-2">Savings Vault</h1>
            <p className="sapasafe-text-large opacity-90">
              {vaultAddress.slice(0, 8)}...{vaultAddress.slice(-6)}
            </p>
          </div>
        </div>
      </div>

            <div className="px-4 py-6 space-y-6">
        {/* Overview Card */}
        <Card className="sapasafe-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="sapasafe-heading-3">Vault Overview</h3>
                  <p className="sapasafe-text text-muted-foreground">
                    Current vault status and key information
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(Boolean(vault.isUnlocked))}>
                {getStatusIcon(Boolean(vault.isUnlocked))}
                {getStatusText(Boolean(vault.isUnlocked))}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="sapasafe-text-sm text-muted-foreground">Vault Balance</p>
                <p className="sapasafe-heading-2 text-primary">
                  {formatAmount(typeof vault.vaultBalance === 'bigint' ? vault.vaultBalance : 0n)}
                </p>
                <p className="sapasafe-text-xs text-muted-foreground">Total locked amount</p>
              </div>
              <div className="space-y-2">
                <p className="sapasafe-text-sm text-muted-foreground">Time Remaining</p>
                <p className="sapasafe-heading-2 text-primary">
                  {formatTime(typeof vault.remainingTime === 'bigint' ? vault.remainingTime : 0n)}
                </p>
                <p className="sapasafe-text-xs text-muted-foreground">Until unlock</p>
              </div>
              <div className="space-y-2">
                <p className="sapasafe-text-sm text-muted-foreground">Vault Address</p>
                <p className="sapasafe-text-sm font-mono bg-muted p-2 rounded">
                  {vaultAddress.slice(0, 8)}...{vaultAddress.slice(-6)}
                </p>
                <p className="sapasafe-text-xs text-muted-foreground">Contract address</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card className="sapasafe-card">
          <CardHeader>
            <CardTitle className="sapasafe-heading-3">Lock Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="sapasafe-text-sm text-muted-foreground">Lock Period Progress</span>
                <span className="sapasafe-text-sm font-medium">
                  {vault.isUnlocked ? '100%' : 'In Progress'}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    vault.isUnlocked ? 'bg-success' : 'bg-primary'
                  }`}
                  style={{ 
                    width: vault.isUnlocked ? '100%' : '50%' // Simplified progress for now
                  }}
                ></div>
              </div>
              <p className="sapasafe-text-xs text-muted-foreground">
                {vault.isUnlocked 
                  ? 'Vault is fully unlocked and ready for withdrawal'
                  : 'Vault is still in lock period'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="sapasafe-card">
          <CardHeader>
            <CardTitle className="sapasafe-heading-3">Vault Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vault.canWithdraw ? (
              <div className="space-y-3">
                <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <p className="sapasafe-text-sm font-medium text-success">
                      Ready for Withdrawal
                    </p>
                  </div>
                  <p className="sapasafe-text-xs text-muted-foreground">
                    Your vault is unlocked and ready for withdrawal. You can withdraw the full amount without any penalty.
                  </p>
                </div>
                <Button 
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="w-full sapasafe-btn-primary"
                >
                  {isWithdrawing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw Funds'}
                </Button>
              </div>
            ) : vault.canWithdrawEarly ? (
              <div className="space-y-3">
                <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <p className="sapasafe-text-sm font-medium text-warning">
                      Early Withdrawal Available
                    </p>
                  </div>
                  <p className="sapasafe-text-xs text-muted-foreground">
                    You can withdraw early, but this will incur a 10% penalty on your locked amount.
                  </p>
                </div>
                <Button 
                  onClick={() => setShowEarlyWithdrawConfirm(true)}
                  disabled={isWithdrawing}
                  className="w-full border-error/20 text-error hover:bg-error/5"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Early Withdrawal (with penalty)
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="sapasafe-heading-4 text-muted-foreground mb-2">
                  Vault is Locked
                </p>
                <p className="sapasafe-text text-muted-foreground">
                  Your vault is still in the lock period. Wait for the lock period to end before you can withdraw your funds.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

                {/* Vault Info Card */}
        <Card className="sapasafe-card">
          <CardHeader>
            <CardTitle className="sapasafe-heading-3">Vault Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="sapasafe-text-sm text-muted-foreground">Vault Address</p>
                  <p className="sapasafe-text font-mono bg-muted p-2 rounded">
                    {vaultAddress}
                  </p>
                </div>
                <div>
                  <p className="sapasafe-text-sm text-muted-foreground">Current Status</p>
                  <Badge className={getStatusColor(Boolean(vault.isUnlocked))}>
                    {getStatusIcon(Boolean(vault.isUnlocked))}
                    {getStatusText(Boolean(vault.isUnlocked))}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="sapasafe-text-sm text-muted-foreground">Can Withdraw</p>
                  <Badge className={vault.canWithdraw ? "sapasafe-status-success" : "sapasafe-status-info"}>
                    {vault.canWithdraw ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <p className="sapasafe-text-sm text-muted-foreground">Early Withdrawal</p>
                  <Badge className={vault.canWithdrawEarly ? "sapasafe-status-warning" : "sapasafe-status-info"}>
                    {vault.canWithdrawEarly ? "Available" : "Not Available"}
                  </Badge>
                </div>
              </div>
            </div>
            
            {typeof vault.vaultStatusString === 'string' && vault.vaultStatusString !== 'Unknown' && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="sapasafe-text-sm text-muted-foreground">Status Details</p>
                <p className="sapasafe-text">
                  {vault.vaultStatusString}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Early Withdrawal Confirmation Modal */}
      {showEarlyWithdrawConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="sapasafe-card max-w-md mx-4">
            <CardHeader>
              <CardTitle className="sapasafe-heading-3 text-error">
                Confirm Early Withdrawal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="sapasafe-text">
                Early withdrawal will incur a 10% penalty. Are you sure you want to proceed?
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowEarlyWithdrawConfirm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEarlyWithdraw}
                  disabled={isWithdrawing}
                  className="flex-1 border-error/20 text-error hover:bg-error/5"
                >
                  {isWithdrawing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="mr-2 h-4 w-4" />
                  )}
                  {isWithdrawing ? 'Processing...' : 'Confirm'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
