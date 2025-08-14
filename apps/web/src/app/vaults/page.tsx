"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react"
import { EmptyState } from "@/components/empty-state"
import { PageTransition } from "@/components/page-transition"
import { toast } from "sonner"

// Mock data - in real app this would come from API
const mockVaults = [
  {
    id: "1",
    token: "cNGN",
    amount: "50000",
    status: "active",
    daysRemaining: 45,
    progress: 65,
  },
  {
    id: "2", 
    token: "cGHS",
    amount: "2000",
    status: "active",
    daysRemaining: 15,
    progress: 85,
  },
  {
    id: "3",
    token: "cKES", 
    amount: "100000",
    status: "completed",
    daysRemaining: 0,
    progress: 100,
  },
  {
    id: "4",
    token: "cNGN",
    amount: "25000", 
    status: "early-withdrawn",
    daysRemaining: 0,
    progress: 30,
  }
]

export default function VaultsPage() {
  const router = useRouter()
  const [vaults] = useState(mockVaults)

  const activeVaults = vaults.filter(v => v.status === "active")
  const completedVaults = vaults.filter(v => v.status === "completed")
  const earlyWithdrawnVaults = vaults.filter(v => v.status === "early-withdrawn")

  const handleCreateVault = () => {
    toast.success("Creating new vault...")
    router.push("/create-vault")
  }

  const handleViewDetails = (id: string) => {
    toast.info("Loading vault details...")
    router.push(`/vault-details/${id}`)
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

  const formatAmount = (amount: string, token: string) => {
    const num = parseInt(amount)
    if (token === "cNGN") return `₦${num.toLocaleString()}`
    if (token === "cGHS") return `₵${num.toLocaleString()}`
    if (token === "cKES") return `KSh ${num.toLocaleString()}`
    return `${amount} ${token}`
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="sapasafe-heading-2 mb-2">My Vaults</h1>
              <p className="sapasafe-text-large opacity-90">Manage your savings goals</p>
            </div>
            <Button 
              className="sapasafe-btn-accent"
              onClick={handleCreateVault}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Active Vaults */}
          <div>
            <h2 className="sapasafe-heading-3 mb-4">Active Vaults</h2>
            {activeVaults.length > 0 ? (
              <div className="space-y-4">
                {activeVaults.map((vault) => (
                  <Card key={vault.id} className="sapasafe-card sapasafe-card-interactive">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="sapasafe-text-large font-bold">{vault.token}</span>
                          </div>
                          <div>
                            <p className="sapasafe-text-body font-semibold">
                              {formatAmount(vault.amount, vault.token)}
                            </p>
                            <p className="sapasafe-text-small text-muted-foreground">
                              {vault.daysRemaining} days remaining
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(vault.status)}>
                            {getStatusIcon(vault.status)}
                            <span className="ml-1 capitalize">{vault.status}</span>
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(vault.id)}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between sapasafe-text-small mb-1">
                          <span>Progress</span>
                          <span>{vault.progress}%</span>
                        </div>
                        <div className="sapasafe-progress">
                          <div 
                            className="sapasafe-progress-bar" 
                            style={{ width: `${vault.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Active Vaults"
                description="Start your savings journey by creating your first vault. Set your goals and watch your wealth grow."
                variant="vaults"
                actionLabel="Create Your First Vault"
                onAction={handleCreateVault}
              />
            )}
          </div>

          {/* Completed Vaults */}
          {completedVaults.length > 0 && (
            <div>
              <h2 className="sapasafe-heading-3 mb-4">Completed Vaults</h2>
              <div className="space-y-4">
                {completedVaults.map((vault) => (
                  <Card key={vault.id} className="sapasafe-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <span className="sapasafe-text-large font-bold">{vault.token}</span>
                          </div>
                          <div>
                            <p className="sapasafe-text-body font-semibold">
                              {formatAmount(vault.amount, vault.token)}
                            </p>
                            <p className="sapasafe-text-small text-success">Successfully completed</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(vault.status)}>
                            {getStatusIcon(vault.status)}
                            <span className="ml-1 capitalize">{vault.status}</span>
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(vault.id)}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Early Withdrawn Vaults */}
          {earlyWithdrawnVaults.length > 0 && (
            <div>
              <h2 className="sapasafe-heading-3 mb-4">Early Withdrawn</h2>
              <div className="space-y-4">
                {earlyWithdrawnVaults.map((vault) => (
                  <Card key={vault.id} className="sapasafe-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                            <span className="sapasafe-text-large font-bold">{vault.token}</span>
                          </div>
                          <div>
                            <p className="sapasafe-text-body font-semibold">
                              {formatAmount(vault.amount, vault.token)}
                            </p>
                            <p className="sapasafe-text-small text-error">Early withdrawal (penalty applied)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(vault.status)}>
                            {getStatusIcon(vault.status)}
                            <span className="ml-1 capitalize">{vault.status}</span>
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(vault.id)}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
