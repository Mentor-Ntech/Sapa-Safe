"use client"

import { useState, useEffect } from "react"
import { useSavingsVault, usePenaltyManager } from "@/Hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface VaultCardProps {
  vaultAddress: string
  index: number
  onViewDetails: (address: string) => void
}

export function VaultCard({ vaultAddress, index, onViewDetails }: VaultCardProps) {
  const vault = useSavingsVault(vaultAddress as `0x${string}`)
  const penaltyManager = usePenaltyManager()
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  // Format amount
  const formatAmount = (amount: bigint, decimals: number = 18) => {
    if (!amount || typeof amount !== 'bigint') return '0'
    return (Number(amount) / 10**decimals).toFixed(2)
  }

  // Format time
  const formatTime = (seconds: bigint) => {
    if (!seconds || typeof seconds !== 'bigint') return '0 days'
    const days = Number(seconds) / (24 * 60 * 60)
    if (days < 1) return '< 1 day'
    return `${Math.ceil(days)} days`
  }

  // Get status info based on vault status
  const getStatusInfo = () => {
    const vaultStatus = typeof vault.vaultStatus === 'number' ? vault.vaultStatus : 0
    const isUnlocked = Boolean(vault.isUnlocked)
    const canWithdraw = Boolean(vault.canWithdraw)
    const canWithdrawEarly = Boolean(vault.canWithdrawEarly)
    const isVaultActive = Boolean(vault.isVaultActive)

    // Check vault status first
    if (vaultStatus === 1) { // WITHDRAWN_EARLY
      return {
        color: "sapasafe-status-error",
        icon: <AlertTriangle className="h-4 w-4" />,
        text: "Early Withdrawn",
        description: "Vault was withdrawn early with penalty"
      }
    } else if (vaultStatus === 2) { // COMPLETED
      return {
        color: "sapasafe-status-success",
        icon: <CheckCircle className="h-4 w-4" />,
        text: "Completed",
        description: "Vault was successfully completed"
      }
    } else if (vaultStatus === 3) { // TERMINATED
      return {
        color: "sapasafe-status-error",
        icon: <AlertTriangle className="h-4 w-4" />,
        text: "Terminated",
        description: "Vault was terminated"
      }
    } else if (vaultStatus === 0 && isVaultActive) { // ACTIVE
      if (isUnlocked && canWithdraw) {
        return {
          color: "sapasafe-status-success",
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Ready to Withdraw",
          description: "Vault is unlocked and ready for withdrawal"
        }
      } else if (canWithdrawEarly) {
        return {
          color: "sapasafe-status-warning",
          icon: <AlertTriangle className="h-4 w-4" />,
          text: "Early Withdrawal Available",
          description: "Can withdraw early with penalty"
        }
      } else {
        return {
          color: "sapasafe-status-info",
          icon: <Clock className="h-4 w-4" />,
          text: "Active",
          description: "Vault is active and locked"
        }
      }
    } else {
      return {
        color: "sapasafe-status-info",
        icon: <Clock className="h-4 w-4" />,
        text: "Unknown",
        description: "Vault status unknown"
      }
    }
  }

  const statusInfo = getStatusInfo()

  // Handle early withdrawal
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
    } catch (error) {
      console.error('Error with early withdrawal:', error)
      toast.error('Failed to process early withdrawal')
    } finally {
      setIsWithdrawing(false)
    }
  }

  // Handle normal withdrawal
  const handleWithdraw = async () => {
    if (!vault.canWithdraw) {
      toast.error('Vault is not ready for withdrawal')
      return
    }

    try {
      setIsWithdrawing(true)
      await vault.withdrawCompletedFunds()
      toast.success('Withdrawal initiated! Check your wallet for confirmation.')
    } catch (error) {
      console.error('Error withdrawing:', error)
      toast.error('Failed to withdraw funds')
    } finally {
      setIsWithdrawing(false)
    }
  }

  // Loading state
  if (vault.isLoadingVaultInfo || vault.isLoadingBalance) {
    return (
      <Card className="sapasafe-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sapasafe-card hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="sapasafe-heading-4">
              Vault #{index + 1}
            </CardTitle>
            <CardDescription>
              {vaultAddress.slice(0, 8)}...{vaultAddress.slice(-6)}
            </CardDescription>
          </div>
          <Badge className={statusInfo.color}>
            {statusInfo.icon}
            {statusInfo.text}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vault Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="sapasafe-text-xs text-muted-foreground">Balance</p>
            <p className="sapasafe-heading-4 flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              {formatAmount(typeof vault.vaultBalance === 'bigint' ? vault.vaultBalance : 0n)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="sapasafe-text-xs text-muted-foreground">Time Remaining</p>
            <p className="sapasafe-heading-4 flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary" />
              {formatTime(typeof vault.remainingTime === 'bigint' ? vault.remainingTime : 0n)}
            </p>
          </div>
        </div>

        {/* Status Description */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="sapasafe-text-xs text-muted-foreground">
            {statusInfo.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 sapasafe-btn-outline"
            onClick={() => onViewDetails(vaultAddress)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Details
          </Button>
          
          {Boolean(vault.canWithdraw) && (
            <Button 
              size="sm" 
              className="flex-1 sapasafe-btn-primary"
              onClick={handleWithdraw}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
            </Button>
          )}
          
          {Boolean(vault.canWithdrawEarly) && !Boolean(vault.canWithdraw) && (
            <Button 
              size="sm" 
              className="flex-1 border-error/20 text-error hover:bg-error/5"
              onClick={handleEarlyWithdraw}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="mr-2 h-4 w-4" />
              )}
              {isWithdrawing ? 'Withdrawing...' : 'Early Withdraw'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
