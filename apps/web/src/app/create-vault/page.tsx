"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Wallet, Calendar, DollarSign } from "lucide-react"

const tokens = [
  { symbol: "cNGN", name: "Nigerian Naira", country: "🇳🇬 Nigeria", minAmount: "500" },
  { symbol: "cGHS", name: "Ghanaian Cedi", country: "🇬🇭 Ghana", minAmount: "5" },
  { symbol: "cKES", name: "Kenyan Shilling", country: "🇰🇪 Kenya", minAmount: "500" },
  { symbol: "cZAR", name: "South African Rand", country: "🇿🇦 South Africa", minAmount: "50" },
  { symbol: "cXOF", name: "West African CFA", country: "🇸🇳 Senegal", minAmount: "5000" },
]

const durations = [
  { label: "1 Month", value: "1", days: 30 },
  { label: "3 Months", value: "3", days: 90 },
  { label: "6 Months", value: "6", days: 180 },
  { label: "1 Year", value: "12", days: 365 },
]

export default function CreateVaultPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    token: "",
    amount: "",
    duration: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const selectedToken = tokens.find(t => t.symbol === formData.token)
  const selectedDuration = durations.find(d => d.value === formData.duration)

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate vault creation
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsLoading(false)
    router.push("/vaults")
  }

  const canProceed = () => {
    switch (step) {
      case 1: return formData.token
      case 2: return formData.amount && parseFloat(formData.amount) >= parseFloat(selectedToken?.minAmount || "0")
      case 3: return formData.duration
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Vault</h1>
            <p className="text-green-100">Step {step} of 3</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Select Token */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Choose Your Currency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tokens.map((token) => (
                  <div
                    key={token.symbol}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.token === token.symbol
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, token: token.symbol }))}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{token.country}</span>
                          <Badge variant="secondary">{token.symbol}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{token.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Min: {token.minAmount} {token.symbol}
                        </p>
                      </div>
                      {formData.token === token.symbol && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Enter Amount */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Enter Amount
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Selected Currency</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedToken?.country}</span>
                    <Badge variant="secondary">{selectedToken?.symbol}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount to Save</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder={`Enter amount (min: ${selectedToken?.minAmount} ${selectedToken?.symbol})`}
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="pr-20"
                    />
                    <span className="absolute right-3 top-3 text-sm text-muted-foreground">
                      {selectedToken?.symbol}
                    </span>
                  </div>
                  {formData.amount && parseFloat(formData.amount) < parseFloat(selectedToken?.minAmount || "0") && (
                    <p className="text-sm text-red-600">
                      Amount must be at least {selectedToken?.minAmount} {selectedToken?.symbol}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Choose Duration */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Choose Lock Duration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Vault Summary</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.amount} {selectedToken?.symbol} • {selectedToken?.name}
                  </p>
                </div>

                <div className="space-y-3">
                  {durations.map((duration) => (
                    <div
                      key={duration.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.duration === duration.value
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, duration: duration.value }))}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{duration.label}</p>
                          <p className="text-sm text-muted-foreground">{duration.days} days</p>
                        </div>
                        {formData.duration === duration.value && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-1">⚠️ Important</p>
                  <p className="text-xs text-yellow-700">
                    Early withdrawal incurs a 10% penalty. Make sure you can commit to the full duration.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            {step < 3 ? (
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()}
                className="flex-1"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={!canProceed() || isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Creating Vault..." : "Create Vault"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
