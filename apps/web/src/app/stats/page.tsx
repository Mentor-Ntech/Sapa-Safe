import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Calendar, Award } from "lucide-react"

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">Savings Analytics</h1>
        <p className="text-emerald-100">Track your wealth building journey</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Saved</p>
                  <p className="text-2xl font-bold">$1,250</p>
                  <p className="text-xs text-green-600">+15% this month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Savings Goal</p>
                  <p className="text-2xl font-bold">$2,000</p>
                  <p className="text-xs text-blue-600">62.5% complete</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress to $2,000 goal</span>
                <span>62.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full" style={{ width: '62.5%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground">
                $750 more to reach your goal
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vault Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vault Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Completed Vaults</p>
                  <p className="text-sm text-muted-foreground">Successfully completed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">5</p>
                <p className="text-xs text-muted-foreground">83% success rate</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Active Vaults</p>
                  <p className="text-sm text-muted-foreground">Currently locked</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">3</p>
                <p className="text-xs text-muted-foreground">$1,250 locked</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Early Withdrawals</p>
                  <p className="text-sm text-muted-foreground">Penalties paid</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-xs text-muted-foreground">$10 penalty</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Savings Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">December 2023</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  $500
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">November 2023</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  $300
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">October 2023</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  $450
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="font-medium text-sm">First Vault</p>
                <p className="text-xs text-muted-foreground">Created your first vault</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-medium text-sm">Goal Setter</p>
                <p className="text-xs text-muted-foreground">Set a savings goal</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <p className="font-medium text-sm">Consistent Saver</p>
                <p className="text-xs text-muted-foreground">3 months in a row</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg opacity-50">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-6 w-6 text-gray-400" />
                </div>
                <p className="font-medium text-sm">Millionaire</p>
                <p className="text-xs text-muted-foreground">Save $1M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
