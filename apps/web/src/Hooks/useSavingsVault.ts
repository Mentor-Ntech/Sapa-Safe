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

  // Read: Get vault info
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

  // Read: Get vault balance
  const { 
    data: vaultBalance, 
    isLoading: isLoadingBalance 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getVaultBalance',
    query: {
      enabled: !!vaultAddress,
    }
  })

  console.log('Vault balance query:', { 
    vaultBalance, 
    isLoadingBalance 
  })

  // Read: Check if vault is unlocked
  const { 
    data: isUnlocked, 
    isLoading: isLoadingUnlockStatus 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'isUnlocked',
    query: {
      enabled: !!vaultAddress,
    }
  })

  console.log('Vault unlock status query:', { 
    isUnlocked, 
    isLoadingUnlockStatus 
  })

  // Read: Get remaining time
  const { 
    data: remainingTime, 
    isLoading: isLoadingRemainingTime 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getRemainingTime',
    query: {
      enabled: !!vaultAddress,
    }
  })

  console.log('Remaining time query:', { 
    remainingTime, 
    isLoadingRemainingTime 
  })

  // Read: Get vault status string
  const { 
    data: vaultStatusString, 
    isLoading: isLoadingStatusString 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getVaultStatusString',
    query: {
      enabled: !!vaultAddress,
    }
  })

  console.log('Vault status string query:', { 
    vaultStatusString, 
    isLoadingStatusString 
  })

  // Read: Get vault status (enum)
  const { 
    data: vaultStatus, 
    isLoading: isLoadingVaultStatus 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getVaultStatus',
    query: {
      enabled: !!vaultAddress,
    }
  })

  console.log('Vault status query:', { 
    vaultStatus, 
    isLoadingVaultStatus 
  })

  // Read: Check if vault is active
  const { 
    data: isVaultActive, 
    isLoading: isLoadingVaultActive 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'isVaultActive',
    query: {
      enabled: !!vaultAddress,
    }
  })

  console.log('Vault active query:', { 
    isVaultActive, 
    isLoadingVaultActive 
  })

  // Read: Get withdrawal details
  const { 
    data: withdrawalDetails, 
    isLoading: isLoadingWithdrawalDetails 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getWithdrawalDetails',
    query: {
      enabled: !!vaultAddress,
    }
  })

  console.log('Withdrawal details query:', { 
    withdrawalDetails, 
    isLoadingWithdrawalDetails 
  })

  // Read: Check if can withdraw
  const { 
    data: canWithdraw, 
    isLoading: isLoadingCanWithdraw 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'canWithdraw',
    query: {
      enabled: !!vaultAddress,
    }
  })

  console.log('Can withdraw query:', { 
    canWithdraw, 
    isLoadingCanWithdraw 
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

  console.log('Can withdraw early query:', { 
    canWithdrawEarly, 
    isLoadingCanWithdrawEarly 
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

  const withdrawEarlyFunds = useCallback((penaltyAmount: bigint) => {
    if (!vaultAddress) {
      console.error('No vault address provided')
      return
    }
    
    console.log('Withdrawing early from vault:', vaultAddress, 'with penalty:', penaltyAmount.toString())
    
    return withdrawEarly({
      address: vaultAddress,
      abi: SAVINGS_VAULT_ABI,
      functionName: 'withdrawEarly',
      args: [penaltyAmount],
    })
  }, [vaultAddress, withdrawEarly])

  return {
    // Vault address
    vaultAddress,
    
    // Read functions
    vaultInfo,
    isLoadingVaultInfo,
    refetchVaultInfo,
    vaultBalance,
    isLoadingBalance,
    isUnlocked,
    isLoadingUnlockStatus,
    remainingTime,
    isLoadingRemainingTime,
    vaultStatusString,
    isLoadingStatusString,
    vaultStatus,
    isLoadingVaultStatus,
    isVaultActive,
    isLoadingVaultActive,
    withdrawalDetails,
    isLoadingWithdrawalDetails,
    canWithdraw,
    isLoadingCanWithdraw,
    canWithdrawEarly,
    isLoadingCanWithdrawEarly,
    
    // Write functions
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
    withdrawCompletedData,
    withdrawEarlyData,
  }
}
