"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, BarChart3 } from "lucide-react"
import { PageTransition } from "@/components/page-transition"

export default function StatsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-8">
          <div>
            <h1 className="sapasafe-heading-2 mb-2">Savings Analytics</h1>
            <p className="sapasafe-text-large opacity-90">Track your financial progress</p>
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
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sapasafe-card sapasafe-card-interactive">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="sapasafe-text-small mb-1">Monthly Goal</p>
                    <p className="sapasafe-heading-2 text-accent">₦50,000</p>
                    <p className="sapasafe-text-caption text-success">80% completed</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Savings Trend */}
          <Card className="sapasafe-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="sapasafe-heading-3">Savings Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div>
                    <p className="sapasafe-text-body font-semibold">This Month</p>
                    <p className="sapasafe-text-small text-muted-foreground">December 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="sapasafe-text-body font-semibold text-success">+₦25,000</p>
                    <p className="sapasafe-text-small text-success">+20% vs last month</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div>
                    <p className="sapasafe-text-body font-semibold">Last Month</p>
                    <p className="sapasafe-text-small text-muted-foreground">November 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="sapasafe-text-body font-semibold text-accent">+₦20,000</p>
                    <p className="sapasafe-text-small text-accent">+15% vs previous</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-info/5 rounded-lg border border-info/20">
                  <div>
                    <p className="sapasafe-text-body font-semibold">October 2024</p>
                    <p className="sapasafe-text-small text-muted-foreground">Previous month</p>
                  </div>
                  <div className="text-right">
                    <p className="sapasafe-text-body font-semibold text-info">+₦17,500</p>
                    <p className="sapasafe-text-small text-info">+12% vs previous</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vault Performance */}
          <Card className="sapasafe-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="sapasafe-heading-3">Vault Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="sapasafe-text-body font-semibold">cNGN Vault</p>
                    <p className="sapasafe-text-small text-success">65% complete</p>
                  </div>
                  <div className="sapasafe-progress">
                    <div className="sapasafe-progress-bar" style={{ width: '65%' }}></div>
                  </div>
                  <p className="sapasafe-text-small text-muted-foreground mt-2">₦50,000 • 45 days remaining</p>
                </div>

                <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="sapasafe-text-body font-semibold">cGHS Vault</p>
                    <p className="sapasafe-text-small text-warning">85% complete</p>
                  </div>
                  <div className="sapasafe-progress">
                    <div className="sapasafe-progress-bar" style={{ width: '85%' }}></div>
                  </div>
                  <p className="sapasafe-text-small text-muted-foreground mt-2">₵2,000 • 15 days remaining</p>
                </div>

                <div className="p-4 bg-info/5 rounded-lg border border-info/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="sapasafe-text-body font-semibold">cKES Vault</p>
                    <p className="sapasafe-text-small text-info">100% complete</p>
                  </div>
                  <div className="sapasafe-progress">
                    <div className="sapasafe-progress-bar" style={{ width: '100%' }}></div>
                  </div>
                  <p className="sapasafe-text-small text-success mt-2">KSh 100,000 • Successfully completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Savings Goals */}
          <Card className="sapasafe-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-info rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="sapasafe-heading-3">Savings Goals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="sapasafe-text-body font-semibold">Emergency Fund</p>
                      <p className="sapasafe-text-small text-muted-foreground">Target: ₦200,000</p>
                    </div>
                    <div className="text-right">
                      <p className="sapasafe-text-body font-semibold text-primary">₦125,000</p>
                      <p className="sapasafe-text-small text-primary">62.5% complete</p>
                    </div>
                  </div>
                  <div className="sapasafe-progress mt-3">
                    <div className="sapasafe-progress-bar" style={{ width: '62.5%' }}></div>
                  </div>
                </div>

                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="sapasafe-text-body font-semibold">Travel Fund</p>
                      <p className="sapasafe-text-small text-muted-foreground">Target: ₦100,000</p>
                    </div>
                    <div className="text-right">
                      <p className="sapasafe-text-body font-semibold text-accent">₦75,000</p>
                      <p className="sapasafe-text-small text-accent">75% complete</p>
                    </div>
                  </div>
                  <div className="sapasafe-progress mt-3">
                    <div className="sapasafe-progress-bar" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
