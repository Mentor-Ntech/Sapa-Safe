"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Shield, Bell, HelpCircle, LogOut, Edit, Camera } from "lucide-react"
import { PageTransition } from "@/components/page-transition"

export default function ProfilePage() {
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
                    <h2 className="sapasafe-heading-3">John Doe</h2>
                    <Button size="sm" variant="ghost" className="p-1">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="sapasafe-text-small text-muted-foreground mb-2">john.doe@example.com</p>
                  <div className="flex items-center gap-2">
                    <Badge className="sapasafe-status-success">Verified</Badge>
                    <Badge className="sapasafe-status-info">Premium</Badge>
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
                    <p className="sapasafe-text-small mb-1">Total Vaults</p>
                    <p className="sapasafe-heading-2 text-primary">8</p>
                    <p className="sapasafe-text-caption text-success">+2 this month</p>
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
                    <p className="sapasafe-heading-2 text-accent">87%</p>
                    <p className="sapasafe-text-caption text-success">7/8 completed</p>
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
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="sapasafe-text-body font-semibold">Notifications</p>
                    <p className="sapasafe-text-small text-muted-foreground">Manage your alerts</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="sapasafe-text-body font-semibold">Security</p>
                    <p className="sapasafe-text-small text-muted-foreground">Password & 2FA settings</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-info/5 rounded-lg border border-info/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="sapasafe-text-body font-semibold">Help & Support</p>
                    <p className="sapasafe-text-small text-muted-foreground">Get help when you need it</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="sapasafe-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <span className="sapasafe-heading-3">Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="sapasafe-text-body font-semibold">Default Currency</p>
                    <p className="sapasafe-text-small text-muted-foreground">Nigerian Naira (₦)</p>
                  </div>
                  <Badge className="sapasafe-status-success">Active</Badge>
                </div>
              </div>

              <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="sapasafe-text-body font-semibold">Language</p>
                    <p className="sapasafe-text-small text-muted-foreground">English</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-info/5 rounded-lg border border-info/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="sapasafe-text-body font-semibold">Time Zone</p>
                    <p className="sapasafe-text-small text-muted-foreground">West Africa Time (WAT)</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card className="sapasafe-card">
            <CardContent className="p-4">
              <Button 
                variant="outline" 
                className="w-full sapasafe-btn-outline text-error border-error/20 hover:bg-error/5"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
