"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSavingsVault, usePenaltyManager } from "@/Hooks"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Clock, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  History,
  Loader2,
  CreditCard,
  CalendarDays,
  Target,
  PiggyBank
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
  const [showMonthlyPaymentModal, setShowMonthlyPaymentModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(1)

  console.log('Vault details:', {
    vaultAddress,
    vaultInfo: vault.vaultInfo,
    currentMonth: vault.currentMonth,
    monthlyPayment: vault.monthlyPayment,
    progressPercentage: vault.progressPercentage,
    isCompleted: vault.isCompleted,
    canWithdrawCompleted: vault.canWithdrawCompleted,
    canWithdrawEarly: vault.canWithdrawEarly,
    paymentSummary: vault.paymentSummary
  })

  const handleWithdraw = async () => {
    if (!vault.canWithdrawCompleted) {
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
      
      // Perform early withdrawal (penalty is calculated in the contract)
      await vault.withdrawEarlyFunds()
      
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

  const handleMonthlyPayment = async () => {
    if (!vault.vaultInfo || !vault.currentMonth) {
      toast.error('Vault information not available')
      return
    }

    try {
      setIsWithdrawing(true)
      await vault.makeMonthlyPayment(Number(vault.currentMonth))
      toast.success('Monthly payment initiated! Check your wallet for confirmation.')
      setShowMonthlyPaymentModal(false)
    } catch (error) {
      console.error('Error making monthly payment:', error)
      toast.error('Failed to make monthly payment')
    } finally {
      setIsWithdrawing(false)
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return "sapasafe-status-info" // ACTIVE
      case 1: return "sapasafe-status-warning" // WITHDRAWN_EARLY
      case 2: return "sapasafe-status-success" // COMPLETED
      case 3: return "sapasafe-status-error" // TERMINATED
      default: return "sapasafe-status-info"
    }
  }

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0: return <Clock className="h-4 w-4" />
      case 1: return <AlertTriangle className="h-4 w-4" />
      case 2: return <CheckCircle className="h-4 w-4" />
      case 3: return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return "Active"
      case 1: return "Early Withdrawn"
      case 2: return "Completed"
      case 3: return "Terminated"
      default: return "Unknown"
    }
  }

  const formatAmount = (amount: bigint, decimals: number = 18) => {
    if (!amount) return '0'
    return (Number(amount) / 10**decimals).toFixed(2)
  }

  const formatDate = (timestamp: bigint) => {
    if (!timestamp) return 'N/A'
    return new Date(Number(timestamp) * 1000).toLocaleDateString()
  }

  const getMonthlyAmount = () => {
    if (!vault.vaultInfo) return '0'
    return formatAmount(vault.vaultInfo.monthlyAmount)
  }

  const getTargetAmount = () => {
    if (!vault.vaultInfo) return '0'
    return formatAmount(vault.vaultInfo.targetAmount)
  }

  const getCurrentBalance = () => {
    if (!vault.vaultInfo) return '0'
    return formatAmount(vault.vaultInfo.currentBalance)
  }

  const getProgressPercentage = () => {
    if (!vault.progressPercentage) return 0
    return Number(vault.progressPercentage)
  }

  // Loading state
  if (vault.isLoadingVaultInfo) {
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

  // No vault info
  if (!vault.vaultInfo) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="sapasafe-heading-1 mb-4">Vault Not Found</h1>
            <p className="sapasafe-text text-muted-foreground">
              The vault you're looking for doesn't exist or you don't have access to it.
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
            <h1 className="sapasafe-heading-2">Monthly Savings Vault</h1>
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
                  <PiggyBank className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="sapasafe-heading-3">Vault Overview</h3>
                  <p className="sapasafe-text text-muted-foreground">
                    Monthly savings progress and status
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(vault.vaultInfo.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(vault.vaultInfo.status)}
                  <span>{getStatusText(vault.vaultInfo.status)}</span>
                </div>
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="sapasafe-text-sm text-muted-foreground">Target Amount</p>
                <p className="sapasafe-heading-2 text-primary">
                  {getTargetAmount()}
                </p>
                <p className="sapasafe-text-xs text-muted-foreground">Total goal</p>
              </div>
              <div className="space-y-2">
                <p className="sapasafe-text-sm text-muted-foreground">Current Balance</p>
                <p className="sapasafe-heading-2 text-success">
                  {getCurrentBalance()}
                </p>
                <p className="sapasafe-text-xs text-muted-foreground">Amount saved</p>
              </div>
              <div className="space-y-2">
                <p className="sapasafe-text-sm text-muted-foreground">Monthly Payment</p>
                <p className="sapasafe-heading-2 text-accent">
                  {getMonthlyAmount()}
                </p>
                <p className="sapasafe-text-xs text-muted-foreground">Per month</p>
              </div>
              <div className="space-y-2">
                <p className="sapasafe-text-sm text-muted-foreground">Progress</p>
                <p className="sapasafe-heading-2 text-primary">
                  {getProgressPercentage()}%
                </p>
                <p className="sapasafe-text-xs text-muted-foreground">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card className="sapasafe-card">
          <CardHeader>
            <CardTitle className="sapasafe-heading-3">Savings Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="sapasafe-text-sm text-muted-foreground">Monthly Savings Progress</span>
                <span className="sapasafe-text-sm font-medium">
                  {getProgressPercentage()}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-300 bg-primary"
                  style={{ 
                    width: `${getProgressPercentage()}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Month {Number(vault.currentMonth) || 0} of {vault.vaultInfo.totalMonths}</span>
                <span>{vault.paymentSummary?.completedPaymentsCount || 0} payments made</span>
              </div>
            </div>

            {vault.paymentSummary && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="sapasafe-text-sm text-muted-foreground">Missed Payments</p>
                  <p className="sapasafe-heading-3 text-warning">
                    {Number(vault.paymentSummary.missedPaymentsCount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="sapasafe-text-sm text-muted-foreground">Total Penalties</p>
                  <p className="sapasafe-heading-3 text-error">
                    {formatAmount(vault.paymentSummary.totalPenaltiesPaid)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Payment Card */}
        {vault.vaultInfo.status === 0 && vault.vaultInfo.isActive && (
          <Card className="sapasafe-card">
            <CardHeader>
              <CardTitle className="sapasafe-heading-3">Monthly Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <p className="sapasafe-text-sm font-medium text-primary">
                    Current Month: {Number(vault.currentMonth) || 0}
                  </p>
                </div>
                <p className="sapasafe-text-xs text-muted-foreground">
                  Make your monthly payment of {getMonthlyAmount()} to continue your savings plan.
                </p>
              </div>
              
              <Button 
                onClick={() => setShowMonthlyPaymentModal(true)}
                disabled={isWithdrawing}
                className="w-full sapasafe-btn-primary"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Make Monthly Payment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Actions Card */}
        <Card className="sapasafe-card">
          <CardHeader>
            <CardTitle className="sapasafe-heading-3">Vault Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vault.canWithdrawCompleted ? (
              <div className="space-y-3">
                <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <p className="sapasafe-text-sm font-medium text-success">
                      Ready for Withdrawal
                    </p>
                  </div>
                  <p className="sapasafe-text-xs text-muted-foreground">
                    Your savings plan is complete! You can withdraw the full amount without any penalty.
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
                    You can withdraw early, but this will incur a 10% penalty on your current balance.
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
                  Vault is Active
                </p>
                <p className="sapasafe-text text-muted-foreground">
                  Continue making monthly payments to complete your savings plan.
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
                  <p className="sapasafe-text-sm text-muted-foreground">Start Date</p>
                  <p className="sapasafe-text">
                    {formatDate(vault.vaultInfo.startDate)}
                  </p>
                </div>
                <div>
                  <p className="sapasafe-text-sm text-muted-foreground">End Date</p>
                  <p className="sapasafe-text">
                    {formatDate(vault.vaultInfo.endDate)}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="sapasafe-text-sm text-muted-foreground">Total Months</p>
                  <p className="sapasafe-text">
                    {Number(vault.vaultInfo.totalMonths)}
                  </p>
                </div>
                <div>
                  <p className="sapasafe-text-sm text-muted-foreground">Total Paid</p>
                  <p className="sapasafe-text">
                    {formatAmount(vault.vaultInfo.totalPaid)}
                  </p>
                </div>
                <div>
                  <p className="sapasafe-text-sm text-muted-foreground">Total Penalties</p>
                  <p className="sapasafe-text">
                    {formatAmount(vault.vaultInfo.totalPenalties)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Payment Modal */}
      {showMonthlyPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="sapasafe-card max-w-md mx-4">
            <CardHeader>
              <CardTitle className="sapasafe-heading-3">
                Make Monthly Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="sapasafe-text-sm text-muted-foreground">Payment Amount</p>
                <p className="sapasafe-heading-2 text-primary">{getMonthlyAmount()}</p>
                <p className="sapasafe-text-xs text-muted-foreground">
                  Month {Number(vault.currentMonth) || 0} of {vault.vaultInfo.totalMonths}
                </p>
              </div>
              
              <p className="sapasafe-text-sm text-muted-foreground">
                This will transfer {getMonthlyAmount()} from your wallet to the vault.
              </p>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowMonthlyPaymentModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleMonthlyPayment}
                  disabled={isWithdrawing}
                  className="flex-1 sapasafe-btn-primary"
                >
                  {isWithdrawing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  {isWithdrawing ? 'Processing...' : 'Make Payment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                Early withdrawal will incur a 10% penalty on your current balance of {getCurrentBalance()}. Are you sure you want to proceed?
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
