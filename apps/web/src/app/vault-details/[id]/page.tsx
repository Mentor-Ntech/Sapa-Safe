"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSavingsVault, usePenaltyManager, useTokenRegistry } from "@/Hooks"
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
  const tokenRegistry = useTokenRegistry()
  
  // Get token symbol from registry
  const tokenSymbol = vault.vaultInfo?.token ? 
    tokenRegistry.supportedTokens.find(t => t.address.toLowerCase() === vault.vaultInfo?.token.toLowerCase())?.symbol || 'TOKEN' 
    : 'TOKEN'
  
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
      // Make the monthly payment (approval is handled by the contract)
      await vault.makeMonthlyPayment(Number(vault.currentMonth))
      
      toast.success('Monthly payment initiated! Check your wallet for confirmation.')
      setShowMonthlyPaymentModal(false)
    } catch (error) {
      console.error('Error making monthly payment:', error)
      toast.error('Failed to make monthly payment')
    }
  }

  const handleProcessMissedPayment = async () => {
    if (!vault.vaultInfo || !vault.currentMonth) {
      toast.error('Vault information not available')
      return
    }

    try {
      await vault.processMissedPaymentForMonth(Number(vault.currentMonth))
      toast.success('Missed payment processed! Check your wallet for confirmation.')
    } catch (error) {
      console.error('Error processing missed payment:', error)
      toast.error('Failed to process missed payment')
    }
  }

  const handleProcessAllMissedPayments = async () => {
    if (!vault.vaultInfo) {
      toast.error('Vault information not available')
      return
    }

    try {
      await vault.processAllMissedPaymentsUpTo(Number(vault.currentMonth))
      toast.success('All missed payments processed! Check your wallet for confirmation.')
    } catch (error) {
      console.error('Error processing all missed payments:', error)
      toast.error('Failed to process missed payments')
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
            <p className="text-gray-600 mb-4">Please connect your wallet to view vault details.</p>
            <Button onClick={() => router.push('/')}>Connect Wallet</Button>
          </div>
        </div>
      </div>
    )
  }

  if (!vault.vaultInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading vault information...</p>
          </div>
        </div>
      </div>
    )
  }

  const vaultInfo = vault.vaultInfo
  const currentMonth = Number(vault.currentMonth)
  const progressPercentage = Number(vault.progressPercentage) || 0
  const isCompleted = Boolean(vault.isCompleted)
  const canWithdrawCompleted = Boolean(vault.canWithdrawCompleted)
  const canWithdrawEarly = Boolean(vault.canWithdrawEarly)
  const paymentSummary = vault.paymentSummary
  const nextPaymentDueDate = vault.nextPaymentDueDate

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/vaults')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vaults
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Vault Details</h1>
        </div>

        {/* Vault Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              Vault Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Vault Address</Label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">{vaultAddress}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Status</Label>
                <Badge variant={isCompleted ? "default" : "secondary"}>
                  {isCompleted ? "Completed" : "Active"}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Target Amount</Label>
                <p className="text-lg font-semibold">
                  {vaultInfo.targetAmount ? (Number(vaultInfo.targetAmount) / 1e18).toFixed(2) : '0'} {tokenSymbol}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Monthly Amount</Label>
                <p className="text-lg font-semibold">
                  {vaultInfo.monthlyAmount ? (Number(vaultInfo.monthlyAmount) / 1e18).toFixed(2) : '0'} {tokenSymbol}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Total Months</Label>
                <p className="text-lg font-semibold">{vaultInfo.totalMonths || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress and Current Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Month: {currentMonth}</span>
                  <span>{progressPercentage}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-500">Current Balance</Label>
                  <p className="text-lg font-semibold">
                    {vaultInfo.currentBalance ? (Number(vaultInfo.currentBalance) / 1e18).toFixed(2) : '0'} {tokenSymbol}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-500">Total Paid</Label>
                  <p className="text-lg font-semibold">
                    {vaultInfo.totalPaid ? (Number(vaultInfo.totalPaid) / 1e18).toFixed(2) : '0'} {tokenSymbol}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isCompleted && (
                <Button 
                  onClick={() => setShowMonthlyPaymentModal(true)}
                  className="w-full"
                  disabled={currentMonth > vaultInfo.totalMonths}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Make Monthly Payment
                </Button>
              )}
              
              {canWithdrawCompleted && (
                <Button 
                  onClick={handleWithdraw}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Withdraw Completed Funds
                </Button>
              )}
              
              {canWithdrawEarly && (
                <Button 
                  onClick={() => setShowEarlyWithdrawConfirm(true)}
                  variant="destructive"
                  className="w-full"
                  disabled={isWithdrawing}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Early Withdrawal (10% Penalty)
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        {paymentSummary && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Total Penalties</Label>
                  <p className="text-lg font-semibold text-red-600">
                    {paymentSummary.totalPenaltiesPaid ? (Number(paymentSummary.totalPenaltiesPaid) / 1e18).toFixed(2) : '0'} {tokenSymbol}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Missed Payments</Label>
                  <p className="text-lg font-semibold">
                    {paymentSummary.missedPaymentsCount || 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Next Payment Due</Label>
                  <p className="text-sm">
                    {nextPaymentDueDate ? new Date(Number(nextPaymentDueDate) * 1000).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              {paymentSummary.missedPaymentsCount > 0 && (
                <div className="mt-4 space-y-2">
                  <Button 
                    onClick={handleProcessMissedPayment}
                    variant="outline"
                    size="sm"
                  >
                    Process Latest Missed Payment
                  </Button>
                  <Button 
                    onClick={handleProcessAllMissedPayments}
                    variant="outline"
                    size="sm"
                  >
                    Process All Missed Payments
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Monthly Payment Modal */}
        {showMonthlyPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Make Monthly Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  You're about to make a payment for month {currentMonth}. 
                  Amount: {vaultInfo.monthlyAmount ? (Number(vaultInfo.monthlyAmount) / 1e18).toFixed(2) : '0'} {tokenSymbol}
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleMonthlyPayment}
                    className="flex-1"
                  >
                    Confirm Payment
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowMonthlyPaymentModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Early Withdrawal Confirmation Modal */}
        {showEarlyWithdrawConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-red-600">Early Withdrawal Warning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertTriangle className="h-5 w-5 text-red-600 mb-2" />
                  <p className="text-sm text-red-800">
                    Early withdrawal will incur a 10% penalty on your total saved amount. 
                    This action cannot be undone.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Current Balance:</strong> {vaultInfo.currentBalance ? (Number(vaultInfo.currentBalance) / 1e18).toFixed(2) : '0'} {tokenSymbol}
                  </p>
                  <p className="text-sm text-red-600">
                    <strong>Penalty (10%):</strong> {vaultInfo.currentBalance ? (Number(vaultInfo.currentBalance) * 0.1 / 1e18).toFixed(2) : '0'} {tokenSymbol}
                  </p>
                  <p className="text-sm">
                    <strong>You'll Receive:</strong> {vaultInfo.currentBalance ? (Number(vaultInfo.currentBalance) * 0.9 / 1e18).toFixed(2) : '0'} {tokenSymbol}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleEarlyWithdraw}
                    variant="destructive"
                    className="flex-1"
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Confirm Early Withdrawal'
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowEarlyWithdrawConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
