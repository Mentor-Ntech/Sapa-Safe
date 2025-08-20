import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { VAULT_FACTORY_ABI } from '../ABI'
import { getVaultFactoryAddress } from '../config/contracts'
import { useAccount, useChainId } from 'wagmi'
import { useCallback } from 'react'

export const useVaultFactory = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  
  // Using Alfajores testnet
  const vaultFactoryAddress = getVaultFactoryAddress('alfajores')
  
  console.log('VaultFactory hook:', { 
    address, 
    chainId, 
    vaultFactoryAddress,
    isAlfajores: chainId === 44787 
  })

  // Read: Get user's vaults
  const { 
    data: userVaults, 
    isLoading: isLoadingUserVaults, 
    refetch: refetchUserVaults,
    error: userVaultsError
  } = useReadContract({
    address: vaultFactoryAddress as `0x${string}`,
    abi: VAULT_FACTORY_ABI,
    functionName: 'getUserVaults',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })
  
  console.log('User vaults query:', { 
    userVaults, 
    isLoadingUserVaults, 
    userVaultsError,
    hasAddress: !!address 
  })

  // Read: Get total vault count
  const { 
    data: totalVaults, 
    isLoading: isLoadingTotalVaults 
  } = useReadContract({
    address: vaultFactoryAddress as `0x${string}`,
    abi: VAULT_FACTORY_ABI,
    functionName: 'getTotalVaults',
  })

  // Write: Create new vault
  const { 
    data: createVaultData, 
    writeContract: createVault, 
    isPending: isCreatingVault,
    error: createVaultError 
  } = useWriteContract()

  const { 
    isLoading: isCreateVaultPending, 
    isSuccess: isCreateVaultSuccess,
    error: createVaultReceiptError,
    data: createVaultReceipt
  } = useWaitForTransactionReceipt({
    hash: createVaultData,
  })

  // Helper function to get vault by ID
  const getVaultById = (vaultId: bigint) => {
    return useReadContract({
      address: vaultFactoryAddress as `0x${string}`,
      abi: VAULT_FACTORY_ABI,
      functionName: 'getVaultById',
      args: [vaultId],
      query: {
        enabled: !!vaultId,
      }
    })
  }

  // Helper function to create vault with parameters
  const createVaultWithParams = useCallback(async (
    tokenAddress: `0x${string}`,
    amount: bigint,
    duration: bigint,
    goal: string
  ) => {
    try {
      console.log('Creating vault with params:', { tokenAddress, amount: amount.toString(), duration: duration.toString() })
      
      if (!address) {
        throw new Error('No wallet address available')
      }
      
      if (!tokenAddress || !amount || !duration) {
        throw new Error('Missing required parameters')
      }
      
      // Check if we're on the correct network
      if (chainId !== 44787) { // Alfajores chain ID
        throw new Error(`Wrong network! Expected Alfajores (44787), got ${chainId}`)
      }
      
      // Set deadline to 20 minutes from now
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200) // 20 minutes
      
      console.log('Calling createVault with args:', [tokenAddress, amount.toString(), duration.toString(), deadline.toString()])
      
      // Call createVault - this will trigger the transaction
      createVault({
        address: vaultFactoryAddress as `0x${string}`,
        abi: VAULT_FACTORY_ABI,
        functionName: 'createVault',
        args: [tokenAddress, amount, duration, deadline],
      })
      
      console.log('✅ Vault creation transaction sent!')
      return createVaultData
      
    } catch (error) {
      console.error('Error in createVaultWithParams:', error)
      throw error
    }
  }, [address, chainId, vaultFactoryAddress, createVault, createVaultData])

  // Write: Approve tokens for the factory
  const { 
    writeContract: approveTokens,
    isPending: isApprovingTokens,
    error: approveTokensError 
  } = useWriteContract()

  // Read: Check token allowance
  const { 
    data: tokenAllowance,
    refetch: refetchTokenAllowance,
    isLoading: isLoadingTokenAllowance
  } = useReadContract({
    address: address ? '0x4a5b03B8b16122D330306c65e4CA4BC5Dd6511d0' as `0x${string}` : undefined, // Default to cNGN
    abi: [
      {
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' }
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      }
    ],
    functionName: 'allowance',
    args: address ? [address as `0x${string}`, vaultFactoryAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Helper function to check token allowance
  const checkTokenAllowance = useCallback(async (tokenAddress: `0x${string}`, amount: bigint) => {
    try {
      console.log('Checking token allowance...')
      console.log('- Current allowance:', tokenAllowance?.toString() || '0')
      console.log('- Required amount:', amount.toString())
      
      return tokenAllowance && tokenAllowance >= amount
    } catch (error) {
      console.error('Error checking token allowance:', error)
      return false
    }
  }, [tokenAllowance])

  // Helper function to approve tokens
  const approveTokensForFactory = useCallback(async (tokenAddress: `0x${string}`, amount: bigint) => {
    try {
      console.log('Approving tokens for factory address:', vaultFactoryAddress)
      console.log('Token address:', tokenAddress)
      console.log('Amount:', amount.toString())
      
      approveTokens({
        address: tokenAddress,
        abi: [
          {
            inputs: [
              { name: 'spender', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            name: 'approve',
            outputs: [{ name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        functionName: 'approve',
        args: [vaultFactoryAddress as `0x${string}`, amount],
      })
      
      console.log('✅ Token approval transaction sent!')
      return true
    } catch (error) {
      console.error('Error approving tokens:', error)
      throw error
    }
  }, [approveTokens, vaultFactoryAddress])

  // Read: Get user's active vaults
  const { 
    data: userActiveVaults, 
    isLoading: isLoadingUserActiveVaults, 
    refetch: refetchUserActiveVaults,
    error: userActiveVaultsError
  } = useReadContract({
    address: vaultFactoryAddress as `0x${string}`,
    abi: VAULT_FACTORY_ABI,
    functionName: 'getUserActiveVaults',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Read: Get user's completed vaults
  const { 
    data: userCompletedVaults, 
    isLoading: isLoadingUserCompletedVaults, 
    refetch: refetchUserCompletedVaults,
    error: userCompletedVaultsError
  } = useReadContract({
    address: vaultFactoryAddress as `0x${string}`,
    abi: VAULT_FACTORY_ABI,
    functionName: 'getUserCompletedVaults',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Read: Get user's early withdrawn vaults
  const { 
    data: userEarlyWithdrawnVaults, 
    isLoading: isLoadingUserEarlyWithdrawnVaults, 
    refetch: refetchUserEarlyWithdrawnVaults,
    error: userEarlyWithdrawnVaultsError
  } = useReadContract({
    address: vaultFactoryAddress as `0x${string}`,
    abi: VAULT_FACTORY_ABI,
    functionName: 'getUserEarlyWithdrawnVaults',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Read: Get user's vault status summary
  const { 
    data: userVaultStatusSummary, 
    isLoading: isLoadingUserVaultStatusSummary, 
    refetch: refetchUserVaultStatusSummary,
    error: userVaultStatusSummaryError
  } = useReadContract({
    address: vaultFactoryAddress as `0x${string}`,
    abi: VAULT_FACTORY_ABI,
    functionName: 'getUserVaultStatusSummary',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // Helper functions for status-based vaults
  const getUserActiveVaults = useCallback(async (userAddress: string) => {
    try {
      console.log('Getting user active vaults for:', userAddress)
      await refetchUserActiveVaults()
      return userActiveVaults || []
    } catch (error) {
      console.error('Error getting user active vaults:', error)
      return []
    }
  }, [userActiveVaults, refetchUserActiveVaults])

  const getUserCompletedVaults = useCallback(async (userAddress: string) => {
    try {
      console.log('Getting user completed vaults for:', userAddress)
      await refetchUserCompletedVaults()
      return userCompletedVaults || []
    } catch (error) {
      console.error('Error getting user completed vaults:', error)
      return []
    }
  }, [userCompletedVaults, refetchUserCompletedVaults])

  const getUserEarlyWithdrawnVaults = useCallback(async (userAddress: string) => {
    try {
      console.log('Getting user early withdrawn vaults for:', userAddress)
      await refetchUserEarlyWithdrawnVaults()
      return userEarlyWithdrawnVaults || []
    } catch (error) {
      console.error('Error getting user early withdrawn vaults:', error)
      return []
    }
  }, [userEarlyWithdrawnVaults, refetchUserEarlyWithdrawnVaults])

  const getUserVaultStatusSummary = useCallback(async (userAddress: string) => {
    try {
      console.log('Getting user vault status summary for:', userAddress)
      await refetchUserVaultStatusSummary()
      return userVaultStatusSummary || { activeCount: 0, completedCount: 0, earlyWithdrawnCount: 0, terminatedCount: 0 }
    } catch (error) {
      console.error('Error getting user vault status summary:', error)
      return { activeCount: 0, completedCount: 0, earlyWithdrawnCount: 0, terminatedCount: 0 }
    }
  }, [userVaultStatusSummary, refetchUserVaultStatusSummary])

  return {
    // Address
    vaultFactoryAddress,
    
    // Read functions
    userVaults,
    isLoadingUserVaults,
    refetchUserVaults,
    totalVaults,
    isLoadingTotalVaults,
    getVaultById,
    
    // Status-based read functions
    userActiveVaults,
    isLoadingUserActiveVaults,
    refetchUserActiveVaults,
    userCompletedVaults,
    isLoadingUserCompletedVaults,
    refetchUserCompletedVaults,
    userEarlyWithdrawnVaults,
    isLoadingUserEarlyWithdrawnVaults,
    refetchUserEarlyWithdrawnVaults,
    userVaultStatusSummary,
    isLoadingUserVaultStatusSummary,
    refetchUserVaultStatusSummary,
    
    // Write functions
    createVault,
    isCreatingVault,
    createVaultError,
    isCreateVaultPending,
    isCreateVaultSuccess,
    createVaultWithParams,
    approveTokensForFactory,
    isApprovingTokens,
    approveTokensError,
    checkTokenAllowance,
    
    // Helper functions for status-based vaults
    getUserActiveVaults,
    getUserCompletedVaults,
    getUserEarlyWithdrawnVaults,
    getUserVaultStatusSummary,
    
    // Transaction data
    createVaultData,
  }
}
