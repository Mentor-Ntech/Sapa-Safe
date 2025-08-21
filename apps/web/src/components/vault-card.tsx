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
  Loader2,
  PiggyBank,
  Target,
  TrendingUp
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

  // Get status info based on vault status
  const getStatusInfo = () => {
    if (!vault.vaultInfo) {
      return {
        color: "sapasafe-status-info",
        icon: <Clock className="h-4 w-4" />,
        text: "Loading...",
        description: "Loading vault information"
      }
    }

    const status = vault.vaultInfo.status
    const isActive = vault.vaultInfo.isActive
    const canWithdrawCompleted = Boolean(vault.canWithdrawCompleted)
    const canWithdrawEarly = Boolean(vault.canWithdrawEarly)

    switch (status) {
      case 0: // ACTIVE
        if (isActive) {
          if (canWithdrawCompleted) {
            return {
              color: "sapasafe-status-success",
              icon: <CheckCircle className="h-4 w-4" />,
              text: "Ready to Withdraw",
              description: "Savings plan completed - ready for withdrawal"
            }
          } else if (canWithdrawEarly) {
            return {
              color: "sapasafe-status-warning",
              icon: <AlertTriangle className="h-4 w-4" />,
              text: "Early Withdrawal Available",
              description: "Can withdraw early with 10% penalty"
            }
          } else {
            return {
              color: "sapasafe-status-info",
              icon: <Clock className="h-4 w-4" />,
              text: "Active",
              description: "Monthly savings plan in progress"
            }
          }
        } else {
          return {
            color: "sapasafe-status-info",
            icon: <Clock className="h-4 w-4" />,
            text: "Active",
            description: "Vault is active"
          }
        }
      case 1: // WITHDRAWN_EARLY
        return {
          color: "sapasafe-status-error",
          icon: <AlertTriangle className="h-4 w-4" />,
          text: "Early Withdrawn",
          description: "Vault was withdrawn early with penalty"
        }
      case 2: // COMPLETED
        return {
          color: "sapasafe-status-success",
          icon: <CheckCircle className="h-4 w-4" />,
          text: "Completed",
          description: "Savings plan successfully completed"
        }
      case 3: // TERMINATED
        return {
          color: "sapasafe-status-error",
          icon: <AlertTriangle className="h-4 w-4" />,
          text: "Terminated",
          description: "Vault was terminated"
        }
      default:
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
      
      // Perform early withdrawal (penalty calculated in contract)
      await vault.withdrawEarlyFunds()
      
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
    if (!vault.canWithdrawCompleted) {
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

  // Get progress percentage
  const getProgressPercentage = () => {
    if (!vault.progressPercentage) return 0
    return Number(vault.progressPercentage)
  }

  // Get current balance
  const getCurrentBalance = () => {
    if (!vault.vaultInfo) return '0'
    return formatAmount(vault.vaultInfo.currentBalance)
  }

  // Get target amount
  const getTargetAmount = () => {
    if (!vault.vaultInfo) return '0'
    return formatAmount(vault.vaultInfo.targetAmount)
  }

  // Get monthly amount
  const getMonthlyAmount = () => {
    if (!vault.vaultInfo) return '0'
    return formatAmount(vault.vaultInfo.monthlyAmount)
  }

  // Loading state
  if (vault.isLoadingVaultInfo) {
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

  // No vault info
  if (!vault.vaultInfo) {
    return (
      <Card className="sapasafe-card">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="sapasafe-text-sm text-muted-foreground">Vault not found</p>
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
              Monthly Savings #{index + 1}
            </CardTitle>
            <CardDescription>
              {vaultAddress.slice(0, 8)}...{vaultAddress.slice(-6)}
            </CardDescription>
          </div>
          <Badge className={statusInfo.color}>
            <div className="flex items-center gap-1">
              {statusInfo.icon}
              <span>{statusInfo.text}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="sapasafe-text-xs text-muted-foreground">Progress</span>
            <span className="sapasafe-text-xs font-medium">
              {getProgressPercentage()}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300 bg-primary"
              style={{ 
                width: `${getProgressPercentage()}%`
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Month {Number(vault.currentMonth) || 0} of {vault.vaultInfo.totalMonths}</span>
            <span>{vault.paymentSummary?.completedPaymentsCount || 0} payments</span>
          </div>
        </div>

        {/* Vault Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="sapasafe-text-xs text-muted-foreground">Current Balance</p>
            <p className="sapasafe-heading-4 flex items-center gap-1">
              <PiggyBank className="h-4 w-4 text-success" />
              {getCurrentBalance()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="sapasafe-text-xs text-muted-foreground">Target Amount</p>
            <p className="sapasafe-heading-4 flex items-center gap-1">
              <Target className="h-4 w-4 text-primary" />
              {getTargetAmount()}
            </p>
          </div>
        </div>

        {/* Monthly Payment Info */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="sapasafe-text-xs font-medium text-primary">Monthly Payment</p>
          </div>
          <p className="sapasafe-text-sm">
            {getMonthlyAmount()} per month
          </p>
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
          
          {Boolean(vault.canWithdrawCompleted) && (
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
          
          {Boolean(vault.canWithdrawEarly) && !Boolean(vault.canWithdrawCompleted) && (
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
