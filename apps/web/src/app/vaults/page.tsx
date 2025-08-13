"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, CheckCircle, AlertCircle, Filter } from "lucide-react"

export default function VaultsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Vaults</h1>
            <p className="text-purple-100">Manage your savings vaults</p>
          </div>
          <Button size="sm" className="bg-white/20 hover:bg-white/30">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Create Vault CTA */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Start a New Vault</h3>
                <p className="text-sm text-muted-foreground">
                  Lock your funds and build wealth
                </p>
              </div>
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => router.push("/create-vault")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vaults List */}
        <div className="space-y-4">
          {/* Active Vault */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">cNGN Savings Vault</h3>
                  <p className="text-sm text-muted-foreground">Created Dec 15, 2023</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">500 NGN</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unlocks</p>
                  <p className="font-semibold">Mar 15, 2024</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => router.push("/vault-details/1")}
                >
                  View Details
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => router.push("/vault-details/1")}
                >
                  Early Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Another Active Vault */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">cGHS Savings Vault</h3>
                  <p className="text-sm text-muted-foreground">Created Nov 20, 2023</p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Almost Done
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">200 GHS</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unlocks</p>
                  <p className="font-semibold">Feb 20, 2024</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => router.push("/vault-details/2")}
                >
                  View Details
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => router.push("/vault-details/2")}
                >
                  Early Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Completed Vault */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">cKES Savings Vault</h3>
                  <p className="text-sm text-muted-foreground">Created Sep 10, 2023</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold">1,000 KES</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="font-semibold">Dec 10, 2023</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => router.push("/vault-details/3")}
              >
                View Details
              </Button>
            </CardContent>
          </Card>

          {/* Early Withdrawn Vault */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">cZAR Savings Vault</h3>
                  <p className="text-sm text-muted-foreground">Created Oct 5, 2023</p>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Early Withdrawn
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Original Amount</p>
                  <p className="font-semibold">100 ZAR</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Penalty Paid</p>
                  <p className="font-semibold text-red-600">10 ZAR</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => router.push("/vault-details/4")}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
