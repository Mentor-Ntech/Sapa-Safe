"use client"

import { useState, useEffect } from "react"
import { useVaults, useTokenRegistry, useTransactions, useVaultFactory } from "@/Hooks"
import { useAccount, useReadContract } from "wagmi"
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
    checkVaultCreationStatus,
    isLoading: isVaultLoading,
    vaultFactory
  } = useVaults()

  const { 
    approveTokensForFactory,
    isApprovingTokens,
    checkTokenAllowance
  } = useVaultFactory()
  const { 
    supportedTokens, 
    isLoadingSupportedTokens: isTokenLoading 
  } = useTokenRegistry()
  const { addTransaction } = useTransactions()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    token: '',
    targetAmount: '',
    totalMonths: '',
    goal: ''
  })

  // Check user's token balance
  const { data: userTokenBalance } = useReadContract({
    address: (() => {
      if (!formData.token) return undefined
      const tokenAddressMap: Record<string, `0x${string}`> = {
        'cNGN': '0x4a5b03B8b16122D330306c65e4CA4BC5Dd6511d0' as `0x${string}`,
        'cGHS': '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375' as `0x${string}`,
        'cKES': '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92' as `0x${string}`,
        'cZAR': '0x1e5b44015Ff90610b54000DAad31C89b3284df4d' as `0x${string}`,
        'cXOF': '0xB0FA15e002516d0301884059c0aaC0F0C72b019D' as `0x${string}`,
      }
      return tokenAddressMap[formData.token]
    })(),
    abi: [
      {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!formData.token,
    }
  })
  const [isCreating, setIsCreating] = useState(false)

  // Available currencies from token registry
  // Use supported tokens directly (they now include fallback currencies)
  const availableCurrencies = Array.isArray(supportedTokens) ? supportedTokens : []
  
  // Duration options (months)
  const durations = [
    { value: '1', label: '1 Month', months: 1 },
    { value: '2', label: '2 Months', months: 2 },
    { value: '3', label: '3 Months', months: 3 },
    { value: '4', label: '4 Months', months: 4 },
    { value: '5', label: '5 Months', months: 5 },
    { value: '6', label: '6 Months', months: 6 },
    { value: '12', label: '12 Months', months: 12 },
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
        return formData.token && formData.targetAmount
      case 2:
        return formData.totalMonths
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
      
      // Convert target amount to bigint (assuming 18 decimals)
      const targetAmountInWei = BigInt(parseFloat(formData.targetAmount) * 10**18)
      const totalMonths = parseInt(formData.totalMonths)
      

      
      // Get the correct token address for the selected token
      const tokenAddressMap: Record<string, `0x${string}`> = {
        'cNGN': '0x4a5b03B8b16122D330306c65e4CA4BC5Dd6511d0' as `0x${string}`,
        'cGHS': '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375' as `0x${string}`,
        'cKES': '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92' as `0x${string}`,
        'cZAR': '0x1e5b44015Ff90610b54000DAad31C89b3284df4d' as `0x${string}`,
        'cXOF': '0xB0FA15e002516d0301884059c0aaC0F0C72b019D' as `0x${string}`,
      }
      
      const tokenAddress = tokenAddressMap[formData.token]
      if (!tokenAddress) {
        throw new Error(`Token ${formData.token} not supported`)
      }
      

      
      // For monthly savings, we don't need to check balance upfront since payments are monthly
      // The user will need to have enough tokens for each monthly payment
      
      // Create the vault
      console.log('Creating monthly savings vault...')
      const result = await createNewVault(
        formData.token,
        targetAmountInWei,
        totalMonths,
        formData.goal
      )

      console.log('Vault creation result:', result)
      toast.success('Vault creation transaction sent! Check your wallet for approval popup.')
      
      // Add transaction to tracking
      addTransaction({
        hash: vaultFactory.createVaultData || '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
        type: 'create_vault',
        status: 'pending',
        description: `Created ${formData.token} vault`,
        metadata: { 
          token: formData.token, 
          targetAmount: formData.targetAmount, 
          totalMonths: formData.totalMonths,
          goal: formData.goal 
        }
      })
      
      // Wait for transaction confirmation and refresh data
      const checkInterval = setInterval(async () => {
        const isSuccess = await checkVaultCreationStatus()
        if (isSuccess) {
          clearInterval(checkInterval)
          toast.success('Vault created successfully!')
          
          // Force refresh before navigating
          console.log('Vault created, refreshing data...')
          await refreshVaultData()
          
          router.push('/vaults')
        }
      }, 2000) // Check every 2 seconds
      
      // Timeout after 30 seconds
      setTimeout(() => {
        clearInterval(checkInterval)
        toast.info('Transaction may still be processing. Check your vaults page.')
        router.push('/vaults')
      }, 30000)
    } catch (error) {
      console.error('Error creating vault:', error)
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Insufficient token balance')) {
          toast.error('Insufficient token balance. Please check your wallet.')
        } else if (error.message.includes('Amount below minimum')) {
          toast.error('Amount is below the minimum requirement.')
        } else if (error.message.includes('Token not supported')) {
          toast.error('Selected token is not supported.')
        } else {
          toast.error(`Failed to create vault: ${error.message}`)
        }
      } else {
        toast.error('Failed to create vault. Please try again.')
      }
    } finally {
      setIsCreating(false)
    }
  }

  const getSelectedCurrency = () => {
    return availableCurrencies.find(c => c.symbol === formData.token)
  }

  const getSelectedDuration = () => {
    return durations.find(d => d.value === formData.totalMonths)
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
              {currentStep === 1 && 'Choose Currency & Target Amount'}
              {currentStep === 2 && 'Select Savings Duration'}
              {currentStep === 3 && 'Set Your Goal'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Select the currency and total amount you want to save. You will pay monthly installments.'}
              {currentStep === 2 && 'Choose how many months you want to save over'}
              {currentStep === 3 && 'Describe your savings goal for motivation'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Currency & Target Amount */}
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
                  {formData.token && userTokenBalance && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Balance: {Number(userTokenBalance) / 10**18} {formData.token}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="targetAmount" className="sapasafe-text-sm font-medium">
                    Target Amount
                  </Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    placeholder="Enter total amount to save"
                    value={formData.targetAmount}
                    onChange={(e) => handleInputChange('targetAmount', e.target.value)}
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

            {/* Step 2: Savings Duration */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="totalMonths" className="sapasafe-text-sm font-medium">
                    Savings Duration
                  </Label>
                  <Select 
                    value={formData.totalMonths} 
                    onValueChange={(value: string) => handleInputChange('totalMonths', value)}
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
                      <span className="sapasafe-text-sm font-medium">Monthly Savings Plan</span>
                    </div>
                    <p className="sapasafe-text-sm text-muted-foreground">
                      You will save monthly over {getSelectedDuration()?.months} months. 
                      Early withdrawal will incur a 10% penalty.
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
                    <p><span className="text-muted-foreground">Target Amount:</span> {formData.targetAmount}</p>
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
