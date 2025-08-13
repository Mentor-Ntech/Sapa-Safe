import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, MapPin, Settings, Bell, Shield, HelpCircle, LogOut } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-slate-100">Manage your account settings</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* User Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-muted-foreground">john.doe@example.com</p>
                <Badge variant="secondary" className="mt-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  Nigeria
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">8</p>
                <p className="text-sm text-muted-foreground">Total Vaults</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">5</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Edit Profile</p>
                  <p className="text-sm text-muted-foreground">Update your information</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Email Preferences</p>
                  <p className="text-sm text-muted-foreground">Manage notifications</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bell className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">Vault alerts and reminders</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Wallet Security</p>
                  <p className="text-sm text-muted-foreground">Manage wallet connections</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Manage
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Disconnect Wallet</p>
                  <p className="text-sm text-muted-foreground">Sign out from this device</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Help Center</p>
                  <p className="text-sm text-muted-foreground">FAQs and guides</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Visit
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Contact Support</p>
                  <p className="text-sm text-muted-foreground">Get help from our team</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Contact
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">SapaSafe</h3>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              <p className="text-xs text-muted-foreground">
                Built on Celo • Secure African Savings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
