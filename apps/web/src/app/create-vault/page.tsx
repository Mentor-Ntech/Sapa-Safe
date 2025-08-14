"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, DollarSign, Calendar, Target, CheckCircle } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { toast } from "sonner"

const currencies = [
  { code: "cNGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "cGHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "cKES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "cZAR", name: "South African Rand", symbol: "R" },
  { code: "cXOF", name: "West African CFA", symbol: "CFA" },
]

const durations = [
  { value: "30", label: "30 days (1 month)" },
  { value: "60", label: "60 days (2 months)" },
  { value: "90", label: "90 days (3 months)" },
  { value: "180", label: "180 days (6 months)" },
  { value: "365", label: "365 days (1 year)" },
]

export default function CreateVaultPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    amount: "",
    currency: "",
    duration: "",
    goal: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step === 1 && (!formData.amount || !formData.currency)) {
      toast.error("Please fill in all required fields")
      return
    }
    if (step === 2 && !formData.duration) {
      toast.error("Please select a duration")
      return
    }
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleCreateVault = () => {
    toast.success("Vault created successfully!")
    router.push("/vaults")
  }

  const selectedCurrency = currencies.find(c => c.code === formData.currency)

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="sapasafe-heading-2 mb-2">Create New Vault</h1>
              <p className="sapasafe-text-large opacity-90">Step {step} of 3</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Progress Steps */}
          <Card className="sapasafe-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
                  </div>
                  <span className={`sapasafe-text-small ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                    Amount & Currency
                  </span>
                </div>
                <div className="flex-1 h-px bg-muted mx-4"></div>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > 2 ? <CheckCircle className="h-4 w-4" /> : '2'}
                  </div>
                  <span className={`sapasafe-text-small ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                    Duration
                  </span>
                </div>
                <div className="flex-1 h-px bg-muted mx-4"></div>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    3
                  </div>
                  <span className={`sapasafe-text-small ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                    Review
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          {step === 1 && (
            <Card className="sapasafe-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <span className="sapasafe-heading-3">Amount & Currency</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount to Save</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className="pl-12"
                    />
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value: string) => handleInputChange("currency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{currency.symbol}</span>
                            <span>{currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Savings Goal (Optional)</Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Emergency Fund, Travel, etc."
                    value={formData.goal}
                    onChange={(e) => handleInputChange("goal", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="sapasafe-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <span className="sapasafe-heading-3">Lock Duration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Duration</Label>
                  <div className="grid gap-3">
                    {durations.map((duration) => (
                      <div
                        key={duration.value}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          formData.duration === duration.value
                            ? 'bg-primary/5 border-primary/20'
                            : 'bg-muted/5 border-muted hover:bg-muted/10'
                        }`}
                        onClick={() => handleInputChange("duration", duration.value)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="sapasafe-text-body font-medium">{duration.label}</span>
                          {formData.duration === duration.value && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-warning mt-0.5" />
                    <div>
                      <p className="sapasafe-text-body font-semibold text-warning">Important Note</p>
                      <p className="sapasafe-text-small text-muted-foreground mt-1">
                        Early withdrawals will incur a penalty fee. Make sure you can commit to the full duration.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="sapasafe-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-info rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="sapasafe-heading-3">Review & Create</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="sapasafe-text-body font-semibold">Amount</span>
                      <span className="sapasafe-text-body font-semibold text-primary">
                        {selectedCurrency?.symbol}{parseInt(formData.amount).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="flex items-center justify-between">
                      <span className="sapasafe-text-body font-semibold">Currency</span>
                      <span className="sapasafe-text-body font-semibold text-accent">
                        {selectedCurrency?.name} ({selectedCurrency?.code})
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-info/5 rounded-lg border border-info/20">
                    <div className="flex items-center justify-between">
                      <span className="sapasafe-text-body font-semibold">Duration</span>
                      <span className="sapasafe-text-body font-semibold text-info">
                        {durations.find(d => d.value === formData.duration)?.label}
                      </span>
                    </div>
                  </div>

                  {formData.goal && (
                    <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                      <div className="flex items-center justify-between">
                        <span className="sapasafe-text-body font-semibold">Goal</span>
                        <span className="sapasafe-text-body font-semibold text-success">
                          {formData.goal}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-warning mt-0.5" />
                    <div>
                      <p className="sapasafe-text-body font-semibold text-warning">Final Confirmation</p>
                      <p className="sapasafe-text-small text-muted-foreground mt-1">
                        By creating this vault, you agree to the terms and understand that early withdrawals will incur penalties.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {step > 1 && (
              <Button 
                variant="outline" 
                className="flex-1 sapasafe-btn-outline"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            {step < 3 ? (
              <Button 
                className="flex-1 sapasafe-btn-primary"
                onClick={handleNext}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                className="flex-1 sapasafe-btn-accent"
                onClick={handleCreateVault}
              >
                Create Vault
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
