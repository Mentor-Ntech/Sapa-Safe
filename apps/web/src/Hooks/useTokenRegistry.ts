import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TOKEN_REGISTRY_ABI } from '../ABI'
import { getTokenRegistryAddress } from '../config/contracts'
import { useChainId } from 'wagmi'
import { useCallback, useMemo } from 'react'

export const useTokenRegistry = () => {
  // Using Alfajores testnet
  const tokenRegistryAddress = getTokenRegistryAddress('alfajores')
  
  console.log('TokenRegistry hook - address:', tokenRegistryAddress)

  // Read: Get all supported tokens
  const { 
    data: supportedTokenAddresses, 
    isLoading: isLoadingSupportedTokens, 
    refetch: refetchSupportedTokens,
    error: supportedTokensError
  } = useReadContract({
    address: tokenRegistryAddress as `0x${string}`,
    abi: TOKEN_REGISTRY_ABI,
    functionName: 'getSupportedTokens',
  })
  
  console.log('TokenRegistry query:', { 
    supportedTokenAddresses, 
    isLoadingSupportedTokens, 
    supportedTokensError,
    hasAddress: !!tokenRegistryAddress 
  })
  
  // Process supported tokens to get full information
  const supportedTokens = useMemo(() => {
    if (!supportedTokenAddresses || !Array.isArray(supportedTokenAddresses)) {
      return []
    }
    
    // For now, return fallback currencies since we need to implement proper token info fetching
    return [
      { symbol: "cNGN", name: "Nigerian Naira", logo: "🇳🇬", minAmount: "500000000000000000000" },
      { symbol: "cGHS", name: "Ghanaian Cedi", logo: "🇬🇭", minAmount: "5000000000000000000" },
      { symbol: "cKES", name: "Kenyan Shilling", logo: "🇰🇪", minAmount: "500000000000000000000" },
      { symbol: "cZAR", name: "South African Rand", logo: "🇿🇦", minAmount: "50000000000000000000" },
      { symbol: "cXOF", name: "West African CFA", logo: "🇸🇳", minAmount: "50000000000000000000" },
    ]
  }, [supportedTokenAddresses])

  // Read: Get token by address
  const getTokenByAddress = useCallback((tokenAddress: `0x${string}`) => {
    // This should return a promise or use a different pattern
    // For now, we'll return a simple object structure
    return {
      address: tokenAddress,
      symbol: '',
      name: '',
      decimals: 18,
      logo: '🪙',
      minAmount: '0'
    }
  }, [])

  // Read: Check if token is supported
  const isTokenSupported = useCallback((tokenAddress: `0x${string}`) => {
    // Return a boolean based on supported tokens
    return Array.isArray(supportedTokens) && supportedTokens.some((token: any) => token.address === tokenAddress)
  }, [supportedTokens])

  // Read: Get token metadata
  const getTokenMetadata = useCallback((tokenAddress: `0x${string}`) => {
    // Return metadata from supported tokens
    return Array.isArray(supportedTokens) ? supportedTokens.find((token: any) => token.address === tokenAddress) || null : null
  }, [supportedTokens])

  // Read: Get token rate
  const getTokenRate = useCallback((tokenAddress: `0x${string}`) => {
    // Return a default rate or fetch from contract
    return {
      rate: 1,
      lastUpdated: Date.now()
    }
  }, [])

  // Read: Get total supported tokens count
  const { 
    data: totalSupportedTokens, 
    isLoading: isLoadingTotalTokens 
  } = useReadContract({
    address: tokenRegistryAddress as `0x${string}`,
    abi: TOKEN_REGISTRY_ABI,
    functionName: 'getTotalSupportedTokens',
  })

  // Write: Add new token (admin only)
  const { 
    data: addTokenData, 
    writeContract: addToken, 
    isPending: isAddingToken,
    error: addTokenError 
  } = useWriteContract()

  const { 
    isLoading: isAddTokenPending, 
    isSuccess: isAddTokenSuccess 
  } = useWaitForTransactionReceipt({
    hash: addTokenData,
  })

  // Write: Remove token (admin only)
  const { 
    data: removeTokenData, 
    writeContract: removeToken, 
    isPending: isRemovingToken,
    error: removeTokenError 
  } = useWriteContract()

  const { 
    isLoading: isRemoveTokenPending, 
    isSuccess: isRemoveTokenSuccess 
  } = useWaitForTransactionReceipt({
    hash: removeTokenData,
  })

  // Write: Update token rate (admin only)
  const { 
    data: updateRateData, 
    writeContract: updateRate, 
    isPending: isUpdatingRate,
    error: updateRateError 
  } = useWriteContract()

  const { 
    isLoading: isUpdateRatePending, 
    isSuccess: isUpdateRateSuccess 
  } = useWaitForTransactionReceipt({
    hash: updateRateData,
  })

  // Helper functions
  const addSupportedToken = (
    tokenAddress: `0x${string}`,
    symbol: string,
    name: string,
    decimals: number,
    rate: bigint
  ) => {
    return addToken({
      address: tokenRegistryAddress as `0x${string}`,
      abi: TOKEN_REGISTRY_ABI,
      functionName: 'addToken',
      args: [tokenAddress, symbol, name, decimals, rate],
    })
  }

  const removeSupportedToken = (tokenAddress: `0x${string}`) => {
    return removeToken({
      address: tokenRegistryAddress as `0x${string}`,
      abi: TOKEN_REGISTRY_ABI,
      functionName: 'removeToken',
      args: [tokenAddress],
    })
  }

  const updateTokenRate = (tokenAddress: `0x${string}`, newRate: bigint) => {
    return updateRate({
      address: tokenRegistryAddress as `0x${string}`,
      abi: TOKEN_REGISTRY_ABI,
      functionName: 'updateTokenRate',
      args: [tokenAddress, newRate],
    })
  }

  return {
    // Address
    tokenRegistryAddress,
    
    // Read functions
    supportedTokens,
    isLoadingSupportedTokens,
    refetchSupportedTokens,
    getTokenByAddress,
    isTokenSupported,
    getTokenMetadata,
    getTokenRate,
    totalSupportedTokens,
    isLoadingTotalTokens,
    
    // Write functions (admin only)
    addSupportedToken,
    isAddingToken,
    addTokenError,
    isAddTokenPending,
    isAddTokenSuccess,
    removeSupportedToken,
    isRemovingToken,
    removeTokenError,
    isRemoveTokenPending,
    isRemoveTokenSuccess,
    updateTokenRate,
    isUpdatingRate,
    updateRateError,
    isUpdateRatePending,
    isUpdateRateSuccess,
    
    // Transaction data
    addTokenData,
    removeTokenData,
    updateRateData,
  }
}
