import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { VAULT_FACTORY_ABI } from '../ABI'
import { getVaultFactoryAddress } from '../config/contracts'
import { useAccount, useChainId } from 'wagmi'

export const useVaultFactory = () => {
  const { address } = useAccount()
  
  // Using Alfajores testnet
  const vaultFactoryAddress = getVaultFactoryAddress('alfajores')
  
  // console.log('VaultFactory hook:', { 
  //   address, 
  //   chainId, 
  //   vaultFactoryAddress,
  //   isAlfajores: chainId === 44787 
  // })

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
  
  // console.log('User vaults query:', { 
  //   userVaults, 
  //   isLoadingUserVaults, 
  //   userVaultsError,
  //   hasAddress: !!address 
  // })

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
    isSuccess: isCreateVaultSuccess 
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
  const createVaultWithParams = (
    tokenAddress: `0x${string}`,
    amount: bigint,
    duration: bigint,
    goal: string
  ) => {
    return createVault({
      address: vaultFactoryAddress as `0x${string}`,
      abi: VAULT_FACTORY_ABI,
      functionName: 'createVault',
      args: [tokenAddress, amount, duration, goal],
    })
  }

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
    
    // Write functions
    createVault,
    isCreatingVault,
    createVaultError,
    isCreateVaultPending,
    isCreateVaultSuccess,
    createVaultWithParams,
    
    // Transaction data
    createVaultData,
  }
}
