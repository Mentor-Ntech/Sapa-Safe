"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, TrendingUp, Clock, Wallet, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-8">
        <div>
          <h1 className="sapasafe-heading-2 mb-2">Welcome back, John! 👋</h1>
          <p className="sapasafe-text-large opacity-90">Ready to beat Sapa today?</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="sapasafe-card sapasafe-card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="sapasafe-text-small mb-1">Total Saved</p>
                  <p className="sapasafe-heading-2 text-primary">₦125,000</p>
                  <p className="sapasafe-text-caption text-success">+15% this month</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sapasafe-card sapasafe-card-interactive">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="sapasafe-text-small mb-1">Active Vaults</p>
                  <p className="sapasafe-heading-2 text-accent">3</p>
                  <p className="sapasafe-text-caption text-success">All on track</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Vault CTA */}
        <Card className="sapasafe-card sapasafe-card-interactive bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="sapasafe-heading-3 mb-2">Start a New Savings Goal</h3>
              <p className="sapasafe-text-small mb-4 max-w-md mx-auto">
                Lock your funds and build wealth with discipline. Choose from multiple African currencies.
              </p>
              <Button 
                className="sapasafe-btn-primary w-full"
                onClick={() => router.push("/create-vault")}
              >
                Create New Vault
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Vaults Preview */}
        <Card className="sapasafe-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="sapasafe-heading-3">Active Vaults</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="sapasafe-card-interactive p-4 currency-ngn rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="sapasafe-text-large font-semibold">cNGN Vault</p>
                  <p className="sapasafe-text-small">₦50,000 • 3 months left</p>
                </div>
                <div className="text-right">
                  <p className="sapasafe-text-small font-semibold text-success">On Track</p>
                  <div className="sapasafe-progress mt-1">
                    <div className="sapasafe-progress-bar" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sapasafe-card-interactive p-4 currency-ghs rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="sapasafe-text-large font-semibold">cGHS Vault</p>
                  <p className="sapasafe-text-small">₵2,000 • 1 month left</p>
                </div>
                <div className="text-right">
                  <p className="sapasafe-text-small font-semibold text-warning">Almost Done</p>
                  <div className="sapasafe-progress mt-1">
                    <div className="sapasafe-progress-bar" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full sapasafe-btn-outline"
              onClick={() => router.push("/vaults")}
            >
              View All Vaults
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="sapasafe-card">
          <CardHeader>
            <CardTitle className="sapasafe-heading-3">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-success/5 rounded-lg border border-success/20">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="sapasafe-text-body font-medium">Vault Created</p>
                <p className="sapasafe-text-caption">cNGN Vault • 2 days ago</p>
              </div>
              <div className="text-right">
                <p className="sapasafe-text-body font-semibold text-success">+₦50,000</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-info/5 rounded-lg border border-info/20">
              <div className="w-3 h-3 bg-info rounded-full"></div>
              <div className="flex-1">
                <p className="sapasafe-text-body font-medium">Vault Completed</p>
                <p className="sapasafe-text-caption">cKES Vault • 1 week ago</p>
              </div>
              <div className="text-right">
                <p className="sapasafe-text-body font-semibold text-info">+KSh 100,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
