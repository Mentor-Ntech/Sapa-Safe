"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Mail, Globe, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const countries = [
  { code: "NG", name: "Nigeria", currency: "₦ NGN" },
  { code: "GH", name: "Ghana", currency: "₵ GHS" },
  { code: "KE", name: "Kenya", currency: "KSh KES" },
  { code: "ZA", name: "South Africa", currency: "R ZAR" },
  { code: "SN", name: "Senegal", currency: "CFA XOF" },
  { code: "ET", name: "Ethiopia", currency: "ETB" },
  { code: "UG", name: "Uganda", currency: "UGX" },
  { code: "TZ", name: "Tanzania", currency: "TZS" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.country) {
      newErrors.country = "Please select your country"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  const selectedCountry = countries.find(c => c.code === formData.country)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="sapasafe-heading-2">Complete Your Profile</h1>
              <p className="sapasafe-text-large opacity-90">Join the SapaSafe community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <Card className="sapasafe-card sapasafe-card-elevated max-w-md mx-auto">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="sapasafe-heading-3">Welcome to SapaSafe!</CardTitle>
            <p className="sapasafe-text-small text-muted-foreground">
              Tell us a bit about yourself to personalize your savings experience
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="sapasafe-text-body font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Full Name
                  </div>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("fullName", e.target.value)}
                  className={cn(
                    "sapasafe-text-body",
                    errors.fullName && "border-error focus:border-error"
                  )}
                />
                {errors.fullName && (
                  <p className="sapasafe-text-caption text-error">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="sapasafe-text-body font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address
                  </div>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                  className={cn(
                    "sapasafe-text-body",
                    errors.email && "border-error focus:border-error"
                  )}
                />
                {errors.email && (
                  <p className="sapasafe-text-caption text-error">{errors.email}</p>
                )}
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country" className="sapasafe-text-body font-medium">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Country/Region
                  </div>
                </Label>
                <Select
                  value={formData.country}
                  onValueChange={(value: string) => handleInputChange("country", value)}
                >
                  <SelectTrigger
                    className={cn(
                      "sapasafe-text-body",
                      errors.country && "border-error focus:border-error"
                    )}
                  >
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center justify-between w-full">
                          <span>{country.name}</span>
                          <span className="text-muted-foreground text-sm">
                            {country.currency}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="sapasafe-text-caption text-error">{errors.country}</p>
                )}
              </div>

              {/* Selected Country Info */}
              {selectedCountry && (
                <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="sapasafe-text-body font-semibold">
                        {selectedCountry.name}
                      </p>
                      <p className="sapasafe-text-caption text-muted-foreground">
                        Primary currency: {selectedCountry.currency}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full sapasafe-btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Complete Registration"
                )}
              </Button>

              {/* Terms */}
              <p className="sapasafe-text-caption text-center text-muted-foreground">
                By continuing, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
