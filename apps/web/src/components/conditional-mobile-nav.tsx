"use client"

import { useNav } from "@/components/nav-context"
import { MobileNav } from "@/components/mobile-nav"

export function ConditionalMobileNav() {
  const { showMobileNav } = useNav()
  
  if (!showMobileNav) {
    return null
  }
  
  return <MobileNav />
}
