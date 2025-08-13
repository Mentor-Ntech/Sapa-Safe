"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, BarChart3, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Vaults",
    href: "/vaults",
    icon: Wallet,
  },
  {
    name: "Stats",
    href: "/stats",
    icon: BarChart3,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-sm">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sapasafe-nav-item",
                isActive
                  ? "sapasafe-nav-item-active"
                  : "sapasafe-nav-item-inactive"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mb-1 transition-all duration-200",
                isActive 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-muted-foreground"
              )}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-xs font-semibold transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
