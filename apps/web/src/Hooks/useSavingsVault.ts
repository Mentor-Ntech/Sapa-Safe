import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { SAVINGS_VAULT_ABI } from '../ABI'
import { useAccount, useChainId } from 'wagmi'
import { useCallback } from 'react'

export const useSavingsVault = (vaultAddress?: `0x${string}`) => {
  const { address } = useAccount()
  const chainId = useChainId()

  console.log('SavingsVault hook:', { 
    vaultAddress,
    userAddress: address,
    chainId,
    isAlfajores: chainId === 44787 
  })

  // Read: Get vault info (13-element tuple)
  const { 
    data: vaultInfo, 
    isLoading: isLoadingVaultInfo, 
    refetch: refetchVaultInfo 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getVaultInfo',
    query: {
      enabled: !!vaultAddress,
    }
  })

  console.log('Vault info query:', { 
    vaultInfo, 
    isLoadingVaultInfo 
  })

  // Read: Get current month
  const { 
    data: currentMonth, 
    isLoading: isLoadingCurrentMonth 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'currentMonth',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Get monthly payment info
  const { 
    data: monthlyPayment, 
    isLoading: isLoadingMonthlyPayment 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getMonthlyPayment',
    args: [currentMonth || 1n],
    query: {
      enabled: !!vaultAddress && !!currentMonth,
    }
  })

  // Read: Get progress percentage
  const { 
    data: progressPercentage, 
    isLoading: isLoadingProgress 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getProgressPercentage',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Check if vault is completed
  const { 
    data: isCompleted, 
    isLoading: isLoadingCompleted 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'isCompleted',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Check if can withdraw early
  const { 
    data: canWithdrawEarly, 
    isLoading: isLoadingCanWithdrawEarly 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'canWithdrawEarly',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Check if can withdraw completed
  const { 
    data: canWithdrawCompleted, 
    isLoading: isLoadingCanWithdrawCompleted 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'canWithdrawCompleted',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Get next payment due date
  const { 
    data: nextPaymentDueDate, 
    isLoading: isLoadingNextPaymentDate 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getNextPaymentDueDate',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Get missed payments count
  const { 
    data: missedPaymentsCount, 
    isLoading: isLoadingMissedPayments 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getMissedPaymentsCount',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Get payment summary
  const { 
    data: paymentSummary, 
    isLoading: isLoadingPaymentSummary 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getPaymentSummary',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Write: Make monthly payment
  const { 
    data: makePaymentData, 
    writeContract: makePayment, 
    isPending: isMakingPayment,
    error: makePaymentError 
  } = useWriteContract()

  const { 
    isLoading: isMakePaymentPending, 
    isSuccess: isMakePaymentSuccess 
  } = useWaitForTransactionReceipt({
    hash: makePaymentData,
  })

  // Write: Process missed payment
  const { 
    data: processMissedPaymentData, 
    writeContract: processMissedPayment, 
    isPending: isProcessingMissedPayment,
    error: processMissedPaymentError 
  } = useWriteContract()

  const { 
    isLoading: isProcessMissedPaymentPending, 
    isSuccess: isProcessMissedPaymentSuccess 
  } = useWaitForTransactionReceipt({
    hash: processMissedPaymentData,
  })

  // Write: Process all missed payments
  const { 
    data: processAllMissedPaymentsData, 
    writeContract: processAllMissedPayments, 
    isPending: isProcessingAllMissedPayments,
    error: processAllMissedPaymentsError 
  } = useWriteContract()

  const { 
    isLoading: isProcessAllMissedPaymentsPending, 
    isSuccess: isProcessAllMissedPaymentsSuccess 
  } = useWaitForTransactionReceipt({
    hash: processAllMissedPaymentsData,
  })

  // Write: Withdraw completed (no penalty)
  const { 
    data: withdrawCompletedData, 
    writeContract: withdrawCompleted, 
    isPending: isWithdrawingCompleted,
    error: withdrawCompletedError 
  } = useWriteContract()

  const { 
    isLoading: isWithdrawCompletedPending, 
    isSuccess: isWithdrawCompletedSuccess 
  } = useWaitForTransactionReceipt({
    hash: withdrawCompletedData,
  })

  // Write: Withdraw early (with penalty)
  const { 
    data: withdrawEarlyData, 
    writeContract: withdrawEarly, 
    isPending: isWithdrawingEarly,
    error: withdrawEarlyError 
  } = useWriteContract()

  const { 
    isLoading: isWithdrawEarlyPending, 
    isSuccess: isWithdrawEarlySuccess 
  } = useWaitForTransactionReceipt({
    hash: withdrawEarlyData,
  })

  // Helper functions
  const makeMonthlyPayment = useCallback((month: number) => {
    if (!vaultAddress) {
      console.error('No vault address provided')
      return
    }
    
    console.log('Making monthly payment for month:', month, 'in vault:', vaultAddress)
    
    return makePayment({
      address: vaultAddress,
      abi: SAVINGS_VAULT_ABI,
      functionName: 'makeMonthlyPayment',
      args: [BigInt(month)],
    })
  }, [vaultAddress, makePayment])

  const processMissedPaymentForMonth = useCallback((month: number) => {
    if (!vaultAddress) {
      console.error('No vault address provided')
      return
    }
    
    console.log('Processing missed payment for month:', month, 'in vault:', vaultAddress)
    
    return processMissedPayment({
      address: vaultAddress,
      abi: SAVINGS_VAULT_ABI,
      functionName: 'processMissedPayment',
      args: [BigInt(month)],
    })
  }, [vaultAddress, processMissedPayment])

  const processAllMissedPaymentsUpTo = useCallback((upToMonth: number) => {
    if (!vaultAddress) {
      console.error('No vault address provided')
      return
    }
    
    console.log('Processing all missed payments up to month:', upToMonth, 'in vault:', vaultAddress)
    
    return processAllMissedPayments({
      address: vaultAddress,
      abi: SAVINGS_VAULT_ABI,
      functionName: 'processAllMissedPayments',
      args: [BigInt(upToMonth)],
    })
  }, [vaultAddress, processAllMissedPayments])

  const withdrawCompletedFunds = useCallback(() => {
    if (!vaultAddress) {
      console.error('No vault address provided')
      return
    }
    
    console.log('Withdrawing completed funds from vault:', vaultAddress)
    
    return withdrawCompleted({
      address: vaultAddress,
      abi: SAVINGS_VAULT_ABI,
      functionName: 'withdrawCompleted',
    })
  }, [vaultAddress, withdrawCompleted])

  const withdrawEarlyFunds = useCallback(() => {
    if (!vaultAddress) {
      console.error('No vault address provided')
      return
    }
    
    console.log('Withdrawing early from vault:', vaultAddress)
    
    return withdrawEarly({
      address: vaultAddress,
      abi: SAVINGS_VAULT_ABI,
      functionName: 'withdrawEarly',
    })
  }, [vaultAddress, withdrawEarly])

  // Parse vault info into structured data
  const parsedVaultInfo = vaultInfo && Array.isArray(vaultInfo) ? {
    owner: vaultInfo[0] as `0x${string}`,
    token: vaultInfo[1] as `0x${string}`,
    targetAmount: vaultInfo[2] as bigint,
    monthlyAmount: vaultInfo[3] as bigint,
    totalMonths: vaultInfo[4] as bigint,
    currentBalance: vaultInfo[5] as bigint,
    totalPaid: vaultInfo[6] as bigint,
    totalPenalties: vaultInfo[7] as bigint,
    startDate: vaultInfo[8] as bigint,
    endDate: vaultInfo[9] as bigint,
    status: vaultInfo[10] as number, // VaultStatus enum
    isActive: vaultInfo[11] as boolean,
    withdrawalTime: vaultInfo[12] as bigint,
  } : null

  // Parse payment summary into structured data
  const parsedPaymentSummary = paymentSummary && Array.isArray(paymentSummary) ? {
    totalShouldPay: paymentSummary[0] as bigint,
    totalActuallyPaid: paymentSummary[1] as bigint,
    totalPenaltiesPaid: paymentSummary[2] as bigint,
    missedPaymentsCount: paymentSummary[3] as bigint,
    completedPaymentsCount: paymentSummary[4] as bigint,
  } : null

  // Parse monthly payment into structured data
  const parsedMonthlyPayment = monthlyPayment && Array.isArray(monthlyPayment) ? {
    dueDate: monthlyPayment[0] as bigint,
    amount: monthlyPayment[1] as bigint,
    status: monthlyPayment[2] as number, // PaymentStatus enum
    penaltyAmount: monthlyPayment[3] as bigint,
    penaltyPaid: monthlyPayment[4] as boolean,
  } : null

  return {
    // Vault address
    vaultAddress,
    
    // Parsed vault info
    vaultInfo: parsedVaultInfo,
    isLoadingVaultInfo,
    refetchVaultInfo,
    
    // Monthly payment system
    currentMonth,
    isLoadingCurrentMonth,
    monthlyPayment: parsedMonthlyPayment,
    isLoadingMonthlyPayment,
    progressPercentage,
    isLoadingProgress,
    isCompleted,
    isLoadingCompleted,
    
    // Payment management
    canWithdrawEarly,
    isLoadingCanWithdrawEarly,
    canWithdrawCompleted,
    isLoadingCanWithdrawCompleted,
    nextPaymentDueDate,
    isLoadingNextPaymentDate,
    missedPaymentsCount,
    isLoadingMissedPayments,
    paymentSummary: parsedPaymentSummary,
    isLoadingPaymentSummary,
    
    // Write functions
    makeMonthlyPayment,
    isMakingPayment,
    makePaymentError,
    isMakePaymentPending,
    isMakePaymentSuccess,
    
    processMissedPaymentForMonth,
    isProcessingMissedPayment,
    processMissedPaymentError,
    isProcessMissedPaymentPending,
    isProcessMissedPaymentSuccess,
    
    processAllMissedPaymentsUpTo,
    isProcessingAllMissedPayments,
    processAllMissedPaymentsError,
    isProcessAllMissedPaymentsPending,
    isProcessAllMissedPaymentsSuccess,
    
    withdrawCompletedFunds,
    isWithdrawingCompleted,
    withdrawCompletedError,
    isWithdrawCompletedPending,
    isWithdrawCompletedSuccess,
    
    withdrawEarlyFunds,
    isWithdrawingEarly,
    withdrawEarlyError,
    isWithdrawEarlyPending,
    isWithdrawEarlySuccess,
    
    // Transaction data
    makePaymentData,
    processMissedPaymentData,
    processAllMissedPaymentsData,
    withdrawCompletedData,
    withdrawEarlyData,
  }
}
