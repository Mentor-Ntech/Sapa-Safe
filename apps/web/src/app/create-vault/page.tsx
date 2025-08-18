"use client"

import { useState, useEffect } from "react"
import { useVaults, useTokenRegistry, useTransactions } from "@/Hooks"
import { useAccount } from "wagmi"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check, PiggyBank, Clock, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CreateVaultPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { 
    createNewVault, 
    refreshVaultData,
    isLoading: isVaultLoading 
  } = useVaults()
  const { 
    supportedTokens, 
    isLoadingSupportedTokens: isTokenLoading 
  } = useTokenRegistry()
  const { addTransaction } = useTransactions()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    token: '',
    amount: '',
    duration: '',
    goal: ''
  })
  const [isCreating, setIsCreating] = useState(false)

  // Available currencies from token registry
  console.log('Supported tokens from contract:', supportedTokens)
  console.log('Is loading tokens:', isTokenLoading)
  
  // Use supported tokens directly (they now include fallback currencies)
  const availableCurrencies = Array.isArray(supportedTokens) ? supportedTokens : []
  
  console.log('Available currencies:', availableCurrencies)
  
  // Duration options
  const durations = [
    { value: '30', label: '1 Month (30 days)', days: 30 },
    { value: '60', label: '2 Months (60 days)', days: 60 },
    { value: '90', label: '3 Months (90 days)', days: 90 },
    { value: '120', label: '4 Months (120 days)', days: 120 },
    { value: '150', label: '5 Months (150 days)', days: 150 },
    { value: '180', label: '6 Months (180 days)', days: 180 },
    { value: '365', label: '1 Year (365 days)', days: 365 },
  ]

  // Not connected state
  if (!isConnected) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="sapasafe-heading-1 mb-4">Connect Your Wallet</h1>
            <p className="sapasafe-text text-muted-foreground">
              Connect your wallet to create a savings vault
            </p>
          </div>
        </div>
      </PageTransition>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.token && formData.amount
      case 2:
        return formData.duration
      case 3:
        return formData.goal
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleCreateVault = async () => {
    if (!validateStep(3)) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsCreating(true)
      
      // Convert amount to bigint (assuming 18 decimals)
      const amountInWei = BigInt(parseFloat(formData.amount) * 10**18)
      const durationInSeconds = BigInt(parseInt(formData.duration) * 24 * 60 * 60) // days to seconds
      
      const result = await createNewVault(
        formData.token,
        amountInWei,
        durationInSeconds,
        formData.goal
      )

      // Note: createNewVault returns void, so we'll just show success
      addTransaction({
        hash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
        type: 'create_vault',
        status: 'pending',
        description: `Created ${formData.token} vault`,
        metadata: { 
          token: formData.token, 
          amount: formData.amount, 
          duration: formData.duration,
          goal: formData.goal 
        }
      })
      
      // Refresh vault data to include the newly created vault
      await refreshVaultData()
      
      toast.success('Vault creation initiated!')
      router.push('/vaults')
    } catch (error) {
      console.error('Error creating vault:', error)
      toast.error('Failed to create vault')
    } finally {
      setIsCreating(false)
    }
  }

  const getSelectedCurrency = () => {
    return availableCurrencies.find(c => c.symbol === formData.token)
  }

  const getSelectedDuration = () => {
    return durations.find(d => d.value === formData.duration)
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="sapasafe-btn-outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="sapasafe-heading-1">Create New Vault</h1>
            <p className="sapasafe-text text-muted-foreground">
              Set up your savings goal and lock your funds
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep >= step 
                  ? 'bg-primary text-white' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {currentStep > step ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 3 && (
                <div className={`
                  w-16 h-0.5 mx-2
                  ${currentStep > step ? 'bg-primary' : 'bg-muted'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="sapasafe-card">
          <CardHeader>
            <CardTitle className="sapasafe-heading-3">
              {currentStep === 1 && 'Choose Currency & Amount'}
              {currentStep === 2 && 'Select Lock Duration'}
              {currentStep === 3 && 'Set Your Goal'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Select the currency and amount you want to save'}
              {currentStep === 2 && 'Choose how long you want to lock your funds'}
              {currentStep === 3 && 'Describe your savings goal for motivation'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Currency & Amount */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="token" className="sapasafe-text-sm font-medium">
                    Currency
                  </Label>
                  <Select 
                    value={formData.token} 
                    onValueChange={(value: string) => handleInputChange('token', value)}
                  >
                    <SelectTrigger className="sapasafe-input">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCurrencies.map((currency: any) => (
                        <SelectItem key={currency.symbol} value={currency.symbol}>
                          <div className="flex items-center gap-2">
                            <span>{currency.logo}</span>
                            <span>{currency.symbol} - {currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount" className="sapasafe-text-sm font-medium">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="sapasafe-input"
                  />
                  {getSelectedCurrency() && (
                    <p className="sapasafe-text-xs text-muted-foreground mt-1">
                      Minimum: {Number(getSelectedCurrency()?.minAmount || 0) / 10**18} {formData.token}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Duration */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="duration" className="sapasafe-text-sm font-medium">
                    Lock Duration
                  </Label>
                  <Select 
                    value={formData.duration} 
                    onValueChange={(value: string) => handleInputChange('duration', value)}
                  >
                    <SelectTrigger className="sapasafe-input">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{duration.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {getSelectedDuration() && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="sapasafe-text-sm font-medium">Lock Period</span>
                    </div>
                    <p className="sapasafe-text-sm text-muted-foreground">
                      Your funds will be locked for {getSelectedDuration()?.days} days. 
                      Early withdrawal will incur a penalty.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Goal */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal" className="sapasafe-text-sm font-medium">
                    Savings Goal
                  </Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Emergency fund, Vacation, Business capital"
                    value={formData.goal}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    className="sapasafe-input"
                  />
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="sapasafe-text-sm font-medium">Vault Summary</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Currency:</span> {formData.token}</p>
                    <p><span className="text-muted-foreground">Amount:</span> {formData.amount}</p>
                    <p><span className="text-muted-foreground">Duration:</span> {getSelectedDuration()?.label}</p>
                    <p><span className="text-muted-foreground">Goal:</span> {formData.goal}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 1}
                className="sapasafe-btn-outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {currentStep < 3 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="sapasafe-btn-primary"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleCreateVault}
                  disabled={!validateStep(3) || isCreating || isVaultLoading}
                  className="sapasafe-btn-primary"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PiggyBank className="h-4 w-4 mr-2" />
                      Create Vault
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
