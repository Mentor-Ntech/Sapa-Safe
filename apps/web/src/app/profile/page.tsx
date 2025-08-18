"use client"

import { useUserProfile, useVaults, useTransactions } from "@/Hooks"
import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Shield, Bell, HelpCircle, LogOut, Edit, Camera, Wallet } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { userProfile, isRegistered, isLoading: isProfileLoading } = useUserProfile()
  const { getUserVaults } = useVaults()
  const { getTransactionStats } = useTransactions()

  // Not connected state
  if (!isConnected) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="sapasafe-heading-1 mb-4">Connect Your Wallet</h1>
            <p className="sapasafe-text text-muted-foreground">
              Connect your wallet to view your profile
            </p>
          </div>
        </div>
      </PageTransition>
    )
  }

  // Not registered state
  if (!isRegistered) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="sapasafe-heading-1 mb-4">Complete Registration</h1>
            <p className="sapasafe-text text-muted-foreground">
              Please complete your registration to view your profile
            </p>
            <Button 
              onClick={() => router.push('/register')}
              className="sapasafe-btn-primary mt-4"
            >
              Complete Registration
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  // Loading state
  if (isProfileLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="sapasafe-text text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </PageTransition>
    )
  }

  const transactionStats = getTransactionStats()

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-8">
          <div>
            <h1 className="sapasafe-heading-2 mb-2">Profile</h1>
            <p className="sapasafe-text-large opacity-90">Manage your account settings</p>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Profile Info */}
          <Card className="sapasafe-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0 bg-white"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="sapasafe-heading-3">{userProfile?.fullName || 'User'}</h2>
                    <Button size="sm" variant="ghost" className="p-1">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="sapasafe-text-small text-muted-foreground mb-2">
                    {userProfile?.email || 'No email provided'}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="sapasafe-status-success">Verified</Badge>
                    <Badge className="sapasafe-status-info">{userProfile?.country || 'Unknown'}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <p className="sapasafe-text-xs text-muted-foreground">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="sapasafe-card sapasafe-card-interactive">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="sapasafe-text-small mb-1">Total Transactions</p>
                    <p className="sapasafe-heading-2 text-primary">{transactionStats.total}</p>
                    <p className="sapasafe-text-caption text-success">
                      {transactionStats.successful} successful
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sapasafe-card sapasafe-card-interactive">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="sapasafe-text-small mb-1">Success Rate</p>
                    <p className="sapasafe-heading-2 text-accent">{transactionStats.successRate.toFixed(1)}%</p>
                    <p className="sapasafe-text-caption text-success">
                      {transactionStats.successful}/{transactionStats.total} completed
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <Card className="sapasafe-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <span className="sapasafe-heading-3">Account Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <p className="sapasafe-text-body font-medium">Notifications</p>
                    <p className="sapasafe-text-small text-muted-foreground">Manage your notification preferences</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="sapasafe-btn-outline">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-accent" />
                  <div>
                    <p className="sapasafe-text-body font-medium">Security</p>
                    <p className="sapasafe-text-small text-muted-foreground">Manage your account security</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="sapasafe-btn-outline">
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-info/5 rounded-lg border border-info/20">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-info" />
                  <div>
                    <p className="sapasafe-text-body font-medium">Help & Support</p>
                    <p className="sapasafe-text-small text-muted-foreground">Get help and contact support</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="sapasafe-btn-outline">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Registration Info */}
          <Card className="sapasafe-card">
            <CardHeader>
              <CardTitle className="sapasafe-heading-3">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="sapasafe-text-small text-muted-foreground">Registration Date</span>
                <span className="sapasafe-text-body">
                  {userProfile?.registeredAt ? new Date(userProfile.registeredAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="sapasafe-text-small text-muted-foreground">Country</span>
                <span className="sapasafe-text-body">{userProfile?.country || 'Not specified'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="sapasafe-text-small text-muted-foreground">Email</span>
                <span className="sapasafe-text-body">{userProfile?.email || 'Not provided'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card className="sapasafe-card">
            <CardContent className="p-6">
              <Button 
                variant="outline" 
                className="w-full sapasafe-btn-outline text-error border-error/20 hover:bg-error/5"
                onClick={() => {
                  toast.info('Wallet disconnection handled by your wallet provider')
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
