"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { useUserProfile } from "@/Hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Mail, Globe, ArrowRight, Wallet } from "lucide-react"
import { toast } from "sonner"
import { PageTransition } from "@/components/page-transition"
import { useNav } from "@/components/nav-context"

export default function Register() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { userProfile, saveUserProfile, isRegistered, isLoading: isProfileLoading, loadUserProfile } = useUserProfile()
  const { setShowMobileNav } = useNav()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Hide mobile navigation on registration page
    setShowMobileNav(false)
    
    // Cleanup: show mobile navigation when leaving this page
    return () => {
      setShowMobileNav(true)
    }
  }, [setShowMobileNav])

  // Check if user is already registered
  useEffect(() => {
    if (isRegistered && userProfile) {
      toast.info('You are already registered!')
      router.push('/dashboard')
    }
  }, [isRegistered, userProfile, router])

  // Not connected state
  if (!isConnected || !address) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="sapasafe-heading-1 mb-4">Connect Your Wallet</h1>
            <p className="sapasafe-text text-muted-foreground">
              Connect your wallet to complete registration
            </p>
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
            <p className="sapasafe-text text-muted-foreground">Loading...</p>
          </div>
        </div>
      </PageTransition>
    )
  }

  const countries = [
    { code: "NG", name: "Nigeria", flag: "🇳🇬" },
    { code: "GH", name: "Ghana", flag: "🇬🇭" },
    { code: "KE", name: "Kenya", flag: "🇰🇪" },
    { code: "ZA", name: "South Africa", flag: "🇿🇦" },
    { code: "SN", name: "Senegal", flag: "🇸🇳" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.email || !formData.country) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    
    try {
      await saveUserProfile({
        fullName: formData.fullName,
        email: formData.email,
        country: formData.country
      })

      toast.success("Registration successful! Welcome to SapaSafe!")
      
      // Force reload profile and wait a bit before navigation
      await loadUserProfile()
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
      
    } catch (error) {
      console.error('Registration error:', error)
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-white border-b border-border shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold">Complete Registration</h1>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="sapasafe-heading-2 mb-2">Welcome to SapaSafe</h2>
              <p className="sapasafe-text-small text-muted-foreground">
                Complete your profile to start your savings journey
              </p>
              
              {/* Wallet Info */}
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 justify-center">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="sapasafe-text-sm font-medium">Connected Wallet</span>
                </div>
                <p className="sapasafe-text-xs text-muted-foreground mt-1">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="sapasafe-text-body font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="sapasafe-text-body font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country" className="sapasafe-text-body font-medium">
                  Country/Region
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select value={formData.country} onValueChange={(value: string) => setFormData({ ...formData, country: value })}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full sapasafe-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Complete Registration</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="sapasafe-text-caption text-muted-foreground">
                By registering, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
