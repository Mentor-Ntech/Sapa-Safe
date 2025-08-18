import { useVaultFactory } from './useVaultFactory'
import { useSavingsVault } from './useSavingsVault'
import { useTokenRegistry } from './useTokenRegistry'
import { usePenaltyManager } from './usePenaltyManager'
import { useAccount } from 'wagmi'
import { useState, useCallback } from 'react'

export const useVaults = () => {
  const { address } = useAccount()
  const [selectedVault, setSelectedVault] = useState<`0x${string}` | undefined>()
  const [isFetchingVaults, setIsFetchingVaults] = useState(false)
  
  // Initialize all contract hooks
  const vaultFactory = useVaultFactory()
  const tokenRegistry = useTokenRegistry()
  const penaltyManager = usePenaltyManager()
  
  // Get vault instance for selected vault
  const vault = useSavingsVault(selectedVault)

  // High-level vault operations
  const createNewVault = useCallback(async (
    tokenSymbol: string,
    amount: bigint,
    duration: bigint,
    goal: string
  ) => {
    try {
      // For now, we'll use a simple mapping since we're using fallback currencies
      // In a real implementation, you'd get the token address from the registry
      const tokenAddressMap: Record<string, `0x${string}`> = {
        'cNGN': '0x0000000000000000000000000000000000000001' as `0x${string}`,
        'cGHS': '0x0000000000000000000000000000000000000002' as `0x${string}`,
        'cKES': '0x0000000000000000000000000000000000000003' as `0x${string}`,
        'cZAR': '0x0000000000000000000000000000000000000004' as `0x${string}`,
        'cXOF': '0x0000000000000000000000000000000000000005' as `0x${string}`,
      }

      const tokenAddress = tokenAddressMap[tokenSymbol]
      if (!tokenAddress) {
        throw new Error(`Token ${tokenSymbol} not supported`)
      }

      // Create vault using factory
      const result = await vaultFactory.createVaultWithParams(
        tokenAddress,
        amount,
        duration,
        goal
      )

      return result
    } catch (error) {
      console.error('Error creating vault:', error)
      throw error
    }
  }, [vaultFactory])

  const depositToVault = useCallback(async (
    vaultAddress: `0x${string}`,
    amount: bigint
  ) => {
    try {
      setSelectedVault(vaultAddress)
      const result = await vault.depositFunds(amount)
      return result
    } catch (error) {
      console.error('Error depositing to vault:', error)
      throw error
    }
  }, [vault])

  const withdrawFromVault = useCallback(async (
    vaultAddress: `0x${string}`,
    isEmergency: boolean = false
  ) => {
    try {
      setSelectedVault(vaultAddress)
      
      if (isEmergency) {
        const result = await vault.emergencyWithdrawFunds()
        return result
      } else {
        const result = await vault.withdrawFunds()
        return result
      }
    } catch (error) {
      console.error('Error withdrawing from vault:', error)
      throw error
    }
  }, [vault])

  const getVaultPenalty = useCallback(async (
    vaultAddress: `0x${string}`,
    amount: bigint
  ) => {
    try {
      const penalty = await penaltyManager.getPenaltyAmount(vaultAddress, amount)
      return penalty
    } catch (error) {
      console.error('Error getting vault penalty:', error)
      throw error
    }
  }, [penaltyManager])

  const checkEarlyWithdrawal = useCallback(async (
    vaultAddress: `0x${string}`
  ) => {
    try {
      const isEarly = await penaltyManager.isEarlyWithdrawal(vaultAddress)
      return isEarly
    } catch (error) {
      console.error('Error checking early withdrawal:', error)
      throw error
    }
  }, [penaltyManager])

  const getVaultTimeRemaining = useCallback(async (
    vaultAddress: `0x${string}`
  ) => {
    try {
      const timeRemaining = await penaltyManager.getTimeRemaining(vaultAddress)
      return timeRemaining
    } catch (error) {
      console.error('Error getting time remaining:', error)
      throw error
    }
  }, [penaltyManager])

  // Vault analytics and insights
  const getVaultAnalytics = useCallback(async (vaultAddress: `0x${string}`) => {
    try {
      setSelectedVault(vaultAddress)
      
      const vaultDetails = vault.vaultDetails
      const vaultBalance = vault.vaultBalance
      const vaultStatus = vault.vaultStatus
      
      // Only calculate penalty if we have a balance and it's a valid bigint
      let penaltyAmount = null
      if (vaultBalance && typeof vaultBalance === 'bigint' && vaultBalance > 0n) {
        penaltyAmount = await penaltyManager.getPenaltyAmount(vaultAddress, vaultBalance)
      }

      // Calculate progress safely
      let progress = 0
      if (vaultDetails && vaultBalance && typeof vaultBalance === 'bigint') {
        const details = vaultDetails as any
        if (details.goal && typeof details.goal === 'bigint' && details.goal > 0n) {
          progress = Number(vaultBalance) / Number(details.goal) * 100
        }
      }

      return {
        details: vaultDetails,
        balance: vaultBalance,
        status: vaultStatus,
        penaltyAmount,
        progress
      }
    } catch (error) {
      console.error('Error getting vault analytics:', error)
      throw error
    }
  }, [vault, penaltyManager])

  // User vault management
  const getUserVaults = useCallback(async () => {
    try {
      setIsFetchingVaults(true)
      // console.log('Fetching user vaults...')
      
      // Check if we have a valid address
      if (!address) {
        // console.log('No address available')
        return []
      }
      
      // Refetch user vaults to get the latest data
      await vaultFactory.refetchUserVaults()
      const vaults = vaultFactory.userVaults || []
      // console.log('User vaults fetched:', vaults)
      
      // If vaults is null or undefined, return empty array
      if (!vaults) {
        // console.log('No vaults data returned, returning empty array')
        return []
      }
      
      return vaults
    } catch (error) {
      console.error('Error getting user vaults:', error)
      // Return empty array instead of throwing to prevent UI from breaking
      return []
    } finally {
      setIsFetchingVaults(false)
    }
  }, [vaultFactory, address])

  const refreshVaultData = useCallback(async () => {
    try {
      await Promise.all([
        vaultFactory.refetchUserVaults(),
        vault.refetchVaultDetails(),
        tokenRegistry.refetchSupportedTokens()
      ])
    } catch (error) {
      console.error('Error refreshing vault data:', error)
      throw error
    }
  }, [vaultFactory, vault, tokenRegistry])

  return {
    // State
    selectedVault,
    setSelectedVault,
    
    // Contract hooks
    vaultFactory,
    vault,
    tokenRegistry,
    penaltyManager,
    
    // High-level operations
    createNewVault,
    depositToVault,
    withdrawFromVault,
    getVaultPenalty,
    checkEarlyWithdrawal,
    getVaultTimeRemaining,
    getVaultAnalytics,
    getUserVaults,
    refreshVaultData,
    
    // Loading states
    isLoading: 
      vaultFactory.isLoadingUserVaults ||
      (selectedVault ? vault.isLoadingVaultDetails : false) ||
      tokenRegistry.isLoadingSupportedTokens ||
      isFetchingVaults,
    
    // Error states
    hasError: 
      vaultFactory.createVaultError ||
      vault.depositError ||
      vault.withdrawError ||
      tokenRegistry.addTokenError,
  }
}
