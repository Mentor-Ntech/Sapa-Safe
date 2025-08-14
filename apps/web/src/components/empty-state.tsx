import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Wallet, TrendingUp, Target } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  variant?: "vaults" | "stats" | "activity"
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  actionLabel, 
  onAction,
  variant = "vaults"
}: EmptyStateProps) {
  const getDefaultIcon = () => {
    switch (variant) {
      case "vaults":
        return <Wallet className="h-12 w-12 text-muted-foreground" />
      case "stats":
        return <TrendingUp className="h-12 w-12 text-muted-foreground" />
      case "activity":
        return <Target className="h-12 w-12 text-muted-foreground" />
      default:
        return <Wallet className="h-12 w-12 text-muted-foreground" />
    }
  }

  return (
    <Card className="sapasafe-card">
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
            {icon || getDefaultIcon()}
          </div>
          <div className="space-y-2">
            <h3 className="sapasafe-heading-3 text-muted-foreground">{title}</h3>
            <p className="sapasafe-text-small text-muted-foreground max-w-sm">
              {description}
            </p>
          </div>
          {actionLabel && onAction && (
            <Button 
              className="sapasafe-btn-primary"
              onClick={onAction}
            >
              <Plus className="h-4 w-4 mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
