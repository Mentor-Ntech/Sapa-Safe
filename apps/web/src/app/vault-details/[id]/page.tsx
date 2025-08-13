"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  History
} from "lucide-react"

// Mock vault data
const vaultData = {
  id: "1",
  token: "cNGN",
  tokenName: "Nigerian Naira",
  country: "🇳🇬 Nigeria",
  amount: "500",
  lockStartDate: "2023-12-15",
  unlockDate: "2024-03-15",
  status: "active", // active, completed, early-withdrawn
  daysRemaining: 45,
  progress: 65, // percentage complete
  penalty: "50", // penalty amount if early withdrawal
  returnedAmount: "450", // amount returned after penalty
}

export default function VaultDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [showEarlyWithdrawConfirm, setShowEarlyWithdrawConfirm] = useState(false)

  const handleWithdraw = async () => {
    setIsWithdrawing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsWithdrawing(false)
    router.push("/vaults")
  }

  const handleEarlyWithdraw = async () => {
    setIsWithdrawing(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsWithdrawing(false)
    setShowEarlyWithdrawConfirm(false)
    router.push("/vaults")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "sapasafe-status-info"
      case "completed": return "sapasafe-status-success"
      case "early-withdrawn": return "sapasafe-status-error"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="h-4 w-4" />
      case "completed": return <CheckCircle className="h-4 w-4" />
      case "early-withdrawn": return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
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
            <h1 className="sapasafe-heading-2">{vaultData.token} Savings Vault</h1>
            <p className="sapasafe-text-large opacity-90">Vault #{vaultData.id}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Status Card */}
        <Card className="sapasafe-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="sapasafe-heading-3">{vaultData.amount} {vaultData.token}</h2>
                  <p className="sapasafe-text-small">{vaultData.tokenName}</p>
                </div>
              </div>
              <Badge className={getStatusColor(vaultData.status)}>
                {getStatusIcon(vaultData.status)}
                <span className="ml-1 capitalize">{vaultData.status}</span>
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between sapasafe-text-small">
                <span>Progress</span>
                <span>{vaultData.progress}%</span>
              </div>
              <div className="sapasafe-progress">
                <div 
                  className="sapasafe-progress-bar" 
                  style={{ width: `${vaultData.progress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vault Details */}
        <Card className="sapasafe-card">
          <CardHeader>
            <CardTitle className="sapasafe-heading-3">Vault Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="sapasafe-text-small">Lock Start</p>
                <p className="sapasafe-text-body font-medium">{vaultData.lockStartDate}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="sapasafe-text-small">Unlock Date</p>
                <p className="sapasafe-text-body font-medium">{vaultData.unlockDate}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="sapasafe-text-small">Days Remaining</p>
                <p className="sapasafe-text-body font-medium">{vaultData.daysRemaining} days</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="sapasafe-text-small">Currency</p>
                <p className="sapasafe-text-body font-medium">{vaultData.country} {vaultData.token}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {vaultData.status === "active" && (
          <Card className="sapasafe-card">
            <CardHeader>
              <CardTitle className="sapasafe-heading-3">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vaultData.daysRemaining > 0 ? (
                <>
                  <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      <p className="sapasafe-text-body font-medium text-warning">Early Withdrawal Warning</p>
                    </div>
                    <p className="sapasafe-text-small text-warning mb-3">
                      Withdrawing early will incur a 10% penalty. You'll receive {vaultData.returnedAmount} {vaultData.token} instead of {vaultData.amount} {vaultData.token}.
                    </p>
                    <Button 
                      className="w-full bg-error text-white hover:bg-error/90 font-semibold"
                      onClick={() => setShowEarlyWithdrawConfirm(true)}
                    >
                      Early Withdraw ({vaultData.penalty} {vaultData.token} penalty)
                    </Button>
                  </div>
                </>
              ) : (
                <Button 
                  className="sapasafe-btn-accent w-full"
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? "Processing..." : "Withdraw Funds"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Transaction History */}
        <Card className="sapasafe-card">
          <CardHeader>
            <CardTitle className="sapasafe-heading-3 flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-success/5 rounded-lg border border-success/20">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="sapasafe-text-body font-medium">Vault Created</p>
                <p className="sapasafe-text-caption">{vaultData.lockStartDate} • {vaultData.amount} {vaultData.token} locked</p>
              </div>
            </div>

            {vaultData.status === "completed" && (
              <div className="flex items-center gap-3 p-3 bg-info/5 rounded-lg border border-info/20">
                <div className="w-3 h-3 bg-info rounded-full"></div>
                <div className="flex-1">
                  <p className="sapasafe-text-body font-medium">Vault Completed</p>
                  <p className="sapasafe-text-caption">{vaultData.unlockDate} • {vaultData.amount} {vaultData.token} withdrawn</p>
                </div>
              </div>
            )}

            {vaultData.status === "early-withdrawn" && (
              <div className="flex items-center gap-3 p-3 bg-error/5 rounded-lg border border-error/20">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <div className="flex-1">
                  <p className="sapasafe-text-body font-medium">Early Withdrawal</p>
                  <p className="sapasafe-text-caption">2024-01-15 • {vaultData.returnedAmount} {vaultData.token} returned (10% penalty applied)</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Early Withdrawal Confirmation Modal */}
      {showEarlyWithdrawConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="sapasafe-card w-full max-w-md">
            <CardHeader>
              <CardTitle className="sapasafe-heading-3 flex items-center gap-2 text-error">
                <AlertTriangle className="h-5 w-5" />
                Confirm Early Withdrawal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="sapasafe-text-small text-muted-foreground">
                Are you sure you want to withdraw early? This action cannot be undone.
              </p>
              <div className="p-3 bg-error/5 rounded-lg border border-error/20">
                <p className="sapasafe-text-small font-medium text-error">Penalty Details:</p>
                <p className="sapasafe-text-small text-error">
                  • Original amount: {vaultData.amount} {vaultData.token}<br/>
                  • Penalty (10%): {vaultData.penalty} {vaultData.token}<br/>
                  • You'll receive: {vaultData.returnedAmount} {vaultData.token}
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowEarlyWithdrawConfirm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-error text-white hover:bg-error/90 font-semibold"
                  onClick={handleEarlyWithdraw}
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? "Processing..." : "Confirm Withdrawal"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
