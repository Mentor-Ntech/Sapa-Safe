import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { PENALTY_MANAGER_ABI } from '../ABI'
import { getPenaltyManagerAddress } from '../config/contracts'
import { useChainId } from 'wagmi'

export const usePenaltyManager = () => {
  // Using Alfajores testnet
  const penaltyManagerAddress = getPenaltyManagerAddress('alfajores')

  // Read: Get penalty percentage
  const { 
    data: penaltyPercentage, 
    isLoading: isLoadingPenaltyPercentage 
  } = useReadContract({
    address: penaltyManagerAddress as `0x${string}`,
    abi: PENALTY_MANAGER_ABI,
    functionName: 'getPenaltyPercentage',
  })

  // Read: Get penalty amount for a vault
  const getPenaltyAmount = (vaultAddress: `0x${string}`, amount: bigint) => {
    return useReadContract({
      address: penaltyManagerAddress as `0x${string}`,
      abi: PENALTY_MANAGER_ABI,
      functionName: 'calculatePenalty',
      args: [vaultAddress, amount],
      query: {
        enabled: !!vaultAddress && !!amount,
      }
    })
  }

  // Read: Check if withdrawal is early
  const isEarlyWithdrawal = (vaultAddress: `0x${string}`) => {
    return useReadContract({
      address: penaltyManagerAddress as `0x${string}`,
      abi: PENALTY_MANAGER_ABI,
      functionName: 'isEarlyWithdrawal',
      args: [vaultAddress],
      query: {
        enabled: !!vaultAddress,
      }
    })
  }

  // Read: Get vault lock period
  const getVaultLockPeriod = (vaultAddress: `0x${string}`) => {
    return useReadContract({
      address: penaltyManagerAddress as `0x${string}`,
      abi: PENALTY_MANAGER_ABI,
      functionName: 'getVaultLockPeriod',
      args: [vaultAddress],
      query: {
        enabled: !!vaultAddress,
      }
    })
  }

  // Read: Get vault start time
  const getVaultStartTime = (vaultAddress: `0x${string}`) => {
    return useReadContract({
      address: penaltyManagerAddress as `0x${string}`,
      abi: PENALTY_MANAGER_ABI,
      functionName: 'getVaultStartTime',
      args: [vaultAddress],
      query: {
        enabled: !!vaultAddress,
      }
    })
  }

  // Read: Get time remaining until unlock
  const getTimeRemaining = (vaultAddress: `0x${string}`) => {
    return useReadContract({
      address: penaltyManagerAddress as `0x${string}`,
      abi: PENALTY_MANAGER_ABI,
      functionName: 'getTimeRemaining',
      args: [vaultAddress],
      query: {
        enabled: !!vaultAddress,
      }
    })
  }

  // Read: Get penalty history for a vault
  const getPenaltyHistory = (vaultAddress: `0x${string}`) => {
    return useReadContract({
      address: penaltyManagerAddress as `0x${string}`,
      abi: PENALTY_MANAGER_ABI,
      functionName: 'getPenaltyHistory',
      args: [vaultAddress],
      query: {
        enabled: !!vaultAddress,
      }
    })
  }

  // Write: Update penalty percentage (admin only)
  const { 
    data: updatePenaltyData, 
    writeContract: updatePenalty, 
    isPending: isUpdatingPenalty,
    error: updatePenaltyError 
  } = useWriteContract()

  const { 
    isLoading: isUpdatePenaltyPending, 
    isSuccess: isUpdatePenaltySuccess 
  } = useWaitForTransactionReceipt({
    hash: updatePenaltyData,
  })

  // Write: Set vault lock period (admin only)
  const { 
    data: setLockPeriodData, 
    writeContract: setLockPeriod, 
    isPending: isSettingLockPeriod,
    error: setLockPeriodError 
  } = useWriteContract()

  const { 
    isLoading: isSetLockPeriodPending, 
    isSuccess: isSetLockPeriodSuccess 
  } = useWaitForTransactionReceipt({
    hash: setLockPeriodData,
  })

  // Write: Process penalty (called by vault)
  const { 
    data: processPenaltyData, 
    writeContract: processPenalty, 
    isPending: isProcessingPenalty,
    error: processPenaltyError 
  } = useWriteContract()

  const { 
    isLoading: isProcessPenaltyPending, 
    isSuccess: isProcessPenaltySuccess 
  } = useWaitForTransactionReceipt({
    hash: processPenaltyData,
  })

  // Helper functions
  const updatePenaltyPercentage = (newPercentage: bigint) => {
    return updatePenalty({
      address: penaltyManagerAddress as `0x${string}`,
      abi: PENALTY_MANAGER_ABI,
      functionName: 'updatePenaltyPercentage',
      args: [newPercentage],
    })
  }

  const setVaultLockPeriod = (vaultAddress: `0x${string}`, lockPeriod: bigint) => {
    return setLockPeriod({
      address: penaltyManagerAddress as `0x${string}`,
      abi: PENALTY_MANAGER_ABI,
      functionName: 'setVaultLockPeriod',
      args: [vaultAddress, lockPeriod],
    })
  }

  const processVaultPenalty = (vaultAddress: `0x${string}`, amount: bigint) => {
    return processPenalty({
      address: penaltyManagerAddress as `0x${string}`,
      abi: PENALTY_MANAGER_ABI,
      functionName: 'processPenalty',
      args: [vaultAddress, amount],
    })
  }

  return {
    // Address
    penaltyManagerAddress,
    
    // Read functions
    penaltyPercentage,
    isLoadingPenaltyPercentage,
    getPenaltyAmount,
    isEarlyWithdrawal,
    getVaultLockPeriod,
    getVaultStartTime,
    getTimeRemaining,
    getPenaltyHistory,
    
    // Write functions (admin only)
    updatePenaltyPercentage,
    isUpdatingPenalty,
    updatePenaltyError,
    isUpdatePenaltyPending,
    isUpdatePenaltySuccess,
    setVaultLockPeriod,
    isSettingLockPeriod,
    setLockPeriodError,
    isSetLockPeriodPending,
    isSetLockPeriodSuccess,
    processVaultPenalty,
    isProcessingPenalty,
    processPenaltyError,
    isProcessPenaltyPending,
    isProcessPenaltySuccess,
    
    // Transaction data
    updatePenaltyData,
    setLockPeriodData,
    processPenaltyData,
  }
}
