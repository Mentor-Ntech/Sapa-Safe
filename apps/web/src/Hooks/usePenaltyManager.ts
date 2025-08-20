import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { PENALTY_MANAGER_ABI } from '../ABI'
import { getPenaltyManagerAddress } from '../config/contracts'
import { useChainId } from 'wagmi'
import { useCallback } from 'react'

export const usePenaltyManager = () => {
  // Using Alfajores testnet
  const penaltyManagerAddress = getPenaltyManagerAddress('alfajores')
  const chainId = useChainId()

  console.log('PenaltyManager hook:', { 
    penaltyManagerAddress,
    chainId,
    isAlfajores: chainId === 44787 
  })

  // Read: Get penalty percentage
  const { 
    data: penaltyPercentage, 
    isLoading: isLoadingPenaltyPercentage 
  } = useReadContract({
    address: penaltyManagerAddress as `0x${string}`,
    abi: PENALTY_MANAGER_ABI,
    functionName: 'getPenaltyPercentageAsPercent',
  })

  console.log('Penalty percentage query:', { 
    penaltyPercentage, 
    isLoadingPenaltyPercentage 
  })

  // Read: Get treasury address
  const { 
    data: treasuryAddress, 
    isLoading: isLoadingTreasury 
  } = useReadContract({
    address: penaltyManagerAddress as `0x${string}`,
    abi: PENALTY_MANAGER_ABI,
    functionName: 'getTreasuryAddress',
  })

  console.log('Treasury address query:', { 
    treasuryAddress, 
    isLoadingTreasury 
  })

  // Helper function to calculate penalty for an amount
  const calculatePenalty = useCallback(async (amount: bigint) => {
    try {
      console.log('Calculating penalty for amount:', amount.toString())
      
      // This would typically call the contract, but for now we'll use a simple calculation
      // The contract uses 10% penalty (1000 basis points)
      const penalty = (amount * 10n) / 100n
      const remainingAmount = amount - penalty
      
      console.log('Penalty calculation:', {
        originalAmount: amount.toString(),
        penalty: penalty.toString(),
        remainingAmount: remainingAmount.toString()
      })
      
      return { penalty, remainingAmount }
    } catch (error) {
      console.error('Error calculating penalty:', error)
      throw error
    }
  }, [])

  // Helper function to check if penalty is acceptable
  const isPenaltyAcceptable = useCallback(async (amount: bigint) => {
    try {
      const { penalty } = await calculatePenalty(amount)
      return penalty > 0n && penalty < amount
    } catch (error) {
      console.error('Error checking penalty acceptability:', error)
      return false
    }
  }, [calculatePenalty])

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

  // Write: Update treasury address (admin only)
  const { 
    data: updateTreasuryData, 
    writeContract: updateTreasury, 
    isPending: isUpdatingTreasury,
    error: updateTreasuryError 
  } = useWriteContract()

  const { 
    isLoading: isUpdateTreasuryPending, 
    isSuccess: isUpdateTreasurySuccess 
  } = useWaitForTransactionReceipt({
    hash: updateTreasuryData,
  })

  // Helper functions
  const updatePenaltyPercentage = useCallback((newPercentage: bigint) => {
    console.log('Updating penalty percentage to:', newPercentage.toString())
    
    return updatePenalty({
      address: penaltyManagerAddress as `0x${string}`,
      abi: PENALTY_MANAGER_ABI,
      functionName: 'updatePenaltyPercentage',
      args: [newPercentage],
    })
  }, [updatePenalty, penaltyManagerAddress])

  const updateTreasuryAddress = useCallback((newTreasury: `0x${string}`) => {
    console.log('Updating treasury address to:', newTreasury)
    
    return updateTreasury({
      address: penaltyManagerAddress as `0x${string}`,
      abi: PENALTY_MANAGER_ABI,
      functionName: 'updateTreasuryAddress',
      args: [newTreasury],
    })
  }, [updateTreasury, penaltyManagerAddress])

  return {
    // Address
    penaltyManagerAddress,
    
    // Read functions
    penaltyPercentage,
    isLoadingPenaltyPercentage,
    treasuryAddress,
    isLoadingTreasury,
    calculatePenalty,
    isPenaltyAcceptable,
    
    // Write functions (admin only)
    updatePenaltyPercentage,
    isUpdatingPenalty,
    updatePenaltyError,
    isUpdatePenaltyPending,
    isUpdatePenaltySuccess,
    updateTreasuryAddress,
    isUpdatingTreasury,
    updateTreasuryError,
    isUpdateTreasuryPending,
    isUpdateTreasurySuccess,
    
    // Transaction data
    updatePenaltyData,
    updateTreasuryData,
  }
}
