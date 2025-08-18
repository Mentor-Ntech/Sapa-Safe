import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { SAVINGS_VAULT_ABI } from '../ABI'
import { useAccount } from 'wagmi'

export const useSavingsVault = (vaultAddress?: `0x${string}`) => {
  const { address } = useAccount()

  // Read: Get vault details
  const { 
    data: vaultDetails, 
    isLoading: isLoadingVaultDetails, 
    refetch: refetchVaultDetails 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getVaultDetails',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Get vault balance
  const { 
    data: vaultBalance, 
    isLoading: isLoadingBalance 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getBalance',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Get vault status
  const { 
    data: vaultStatus, 
    isLoading: isLoadingStatus 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'getVaultStatus',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Get vault owner
  const { 
    data: vaultOwner, 
    isLoading: isLoadingOwner 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'owner',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Get vault token
  const { 
    data: vaultToken, 
    isLoading: isLoadingToken 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'token',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Get vault goal
  const { 
    data: vaultGoal, 
    isLoading: isLoadingGoal 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'goal',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Get vault duration
  const { 
    data: vaultDuration, 
    isLoading: isLoadingDuration 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'duration',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Read: Get vault start time
  const { 
    data: vaultStartTime, 
    isLoading: isLoadingStartTime 
  } = useReadContract({
    address: vaultAddress,
    abi: SAVINGS_VAULT_ABI,
    functionName: 'startTime',
    query: {
      enabled: !!vaultAddress,
    }
  })

  // Write: Deposit funds
  const { 
    data: depositData, 
    writeContract: deposit, 
    isPending: isDepositing,
    error: depositError 
  } = useWriteContract()

  const { 
    isLoading: isDepositPending, 
    isSuccess: isDepositSuccess 
  } = useWaitForTransactionReceipt({
    hash: depositData,
  })

  // Write: Withdraw funds (normal)
  const { 
    data: withdrawData, 
    writeContract: withdraw, 
    isPending: isWithdrawing,
    error: withdrawError 
  } = useWriteContract()

  const { 
    isLoading: isWithdrawPending, 
    isSuccess: isWithdrawSuccess 
  } = useWaitForTransactionReceipt({
    hash: withdrawData,
  })

  // Write: Emergency withdraw (with penalty)
  const { 
    data: emergencyWithdrawData, 
    writeContract: emergencyWithdraw, 
    isPending: isEmergencyWithdrawing,
    error: emergencyWithdrawError 
  } = useWriteContract()

  const { 
    isLoading: isEmergencyWithdrawPending, 
    isSuccess: isEmergencyWithdrawSuccess 
  } = useWaitForTransactionReceipt({
    hash: emergencyWithdrawData,
  })

  // Helper functions
  const depositFunds = (amount: bigint) => {
    if (!vaultAddress) return
    return deposit({
      address: vaultAddress,
      abi: SAVINGS_VAULT_ABI,
      functionName: 'deposit',
      args: [amount],
    })
  }

  const withdrawFunds = () => {
    if (!vaultAddress) return
    return withdraw({
      address: vaultAddress,
      abi: SAVINGS_VAULT_ABI,
      functionName: 'withdraw',
    })
  }

  const emergencyWithdrawFunds = () => {
    if (!vaultAddress) return
    return emergencyWithdraw({
      address: vaultAddress,
      abi: SAVINGS_VAULT_ABI,
      functionName: 'emergencyWithdraw',
    })
  }

  return {
    // Vault address
    vaultAddress,
    
    // Read functions
    vaultDetails,
    isLoadingVaultDetails,
    refetchVaultDetails,
    vaultBalance,
    isLoadingBalance,
    vaultStatus,
    isLoadingStatus,
    vaultOwner,
    isLoadingOwner,
    vaultToken,
    isLoadingToken,
    vaultGoal,
    isLoadingGoal,
    vaultDuration,
    isLoadingDuration,
    vaultStartTime,
    isLoadingStartTime,
    
    // Write functions
    depositFunds,
    isDepositing,
    depositError,
    isDepositPending,
    isDepositSuccess,
    withdrawFunds,
    isWithdrawing,
    withdrawError,
    isWithdrawPending,
    isWithdrawSuccess,
    emergencyWithdrawFunds,
    isEmergencyWithdrawing,
    emergencyWithdrawError,
    isEmergencyWithdrawPending,
    isEmergencyWithdrawSuccess,
    
    // Transaction data
    depositData,
    withdrawData,
    emergencyWithdrawData,
  }
}
