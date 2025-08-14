import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Skeleton */}
      <div className="bg-primary text-white px-4 py-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2 bg-white/20" />
          <Skeleton className="h-6 w-48 bg-white/20" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="sapasafe-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          <Card className="sapasafe-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Vault CTA Skeleton */}
        <Card className="sapasafe-card">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Skeleton className="w-16 h-16 rounded-lg mx-auto" />
              <Skeleton className="h-6 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Active Vaults Skeleton */}
        <Card className="sapasafe-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            </div>
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>

        {/* Recent Activity Skeleton */}
        <Card className="sapasafe-card">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 p-3 rounded-lg border">
              <Skeleton className="w-3 h-3 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg border">
              <Skeleton className="w-3 h-3 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
