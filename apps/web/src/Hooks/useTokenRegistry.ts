import { useReadContract } from 'wagmi'
import { TOKEN_REGISTRY_ABI } from '../ABI'
import { getTokenRegistryAddress } from '../config/contracts'
import { useChainId } from 'wagmi'
import { useCallback, useMemo } from 'react'

export const useTokenRegistry = () => {
  // Using Alfajores testnet
  const tokenRegistryAddress = getTokenRegistryAddress('alfajores')
  const chainId = useChainId()

  console.log('TokenRegistry hook:', { 
    tokenRegistryAddress,
    chainId,
    isAlfajores: chainId === 44787 
  })

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
  
  console.log('Supported tokens query:', { 
    supportedTokenAddresses, 
    isLoadingSupportedTokens, 
    supportedTokensError
  })
  
  // Process supported tokens to get full information
  const supportedTokens = useMemo(() => {
    console.log('Processing supported tokens...')
    console.log('supportedTokenAddresses:', supportedTokenAddresses)
    console.log('isArray:', Array.isArray(supportedTokenAddresses))
    console.log('Token registry address:', tokenRegistryAddress)
    
    if (!supportedTokenAddresses || !Array.isArray(supportedTokenAddresses)) {
      console.log('No supported token addresses, returning fallback currencies')
      console.log('This suggests the token registry is not properly initialized')
      return [
        { symbol: "cNGN", name: "Nigerian Naira", logo: "🇳🇬", minAmount: "500000000000000000000", address: "0x4a5b03B8b16122D330306c65e4CA4BC5Dd6511d0" },
        { symbol: "cGHS", name: "Ghanaian Cedi", logo: "🇬🇭", minAmount: "5000000000000000000", address: "0x295B66bE7714458Af45E6A6Ea142A5358A6cA375" },
        { symbol: "cKES", name: "Kenyan Shilling", logo: "🇰🇪", minAmount: "500000000000000000000", address: "0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92" },
        { symbol: "cZAR", name: "South African Rand", logo: "🇿🇦", minAmount: "50000000000000000000", address: "0x1e5b44015Ff90610b54000DAad31C89b3284df4d" },
        { symbol: "cXOF", name: "West African CFA", logo: "🇸🇳", minAmount: "50000000000000000000", address: "0xB0FA15e002516d0301884059c0aaC0F0C72b019D" },
      ]
    }
    
    // Map token addresses to their corresponding info
    const tokenAddressToInfo: Record<string, any> = {
      '0x4a5b03B8b16122D330306c65e4CA4BC5Dd6511d0': { symbol: "cNGN", name: "Nigerian Naira", logo: "🇳🇬", minAmount: "500000000000000000000", address: "0x4a5b03B8b16122D330306c65e4CA4BC5Dd6511d0" },
      '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375': { symbol: "cGHS", name: "Ghanaian Cedi", logo: "🇬🇭", minAmount: "5000000000000000000", address: "0x295B66bE7714458Af45E6A6Ea142A5358A6cA375" },
      '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92': { symbol: "cKES", name: "Kenyan Shilling", logo: "🇰🇪", minAmount: "500000000000000000000", address: "0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92" },
      '0x1e5b44015Ff90610b54000DAad31C89b3284df4d': { symbol: "cZAR", name: "South African Rand", logo: "🇿🇦", minAmount: "50000000000000000000", address: "0x1e5b44015Ff90610b54000DAad31C89b3284df4d" },
      '0xB0FA15e002516d0301884059c0aaC0F0C72b019D': { symbol: "cXOF", name: "West African CFA", logo: "🇸🇳", minAmount: "50000000000000000000", address: "0xB0FA15e002516d0301884059c0aaC0F0C72b019D" },
    }
    
    // Return tokens that are actually supported by the contract
    const processedTokens = supportedTokenAddresses
      .map(address => tokenAddressToInfo[address])
      .filter(Boolean)
    
    console.log('Processed tokens:', processedTokens)
    console.log('Number of supported tokens from contract:', processedTokens.length)
    return processedTokens
  }, [supportedTokenAddresses, tokenRegistryAddress])

  // Read: Get token by address
  const getTokenByAddress = useCallback((tokenAddress: `0x${string}`) => {
    return supportedTokens.find(token => token.address === tokenAddress) || {
      address: tokenAddress,
      symbol: '',
      name: '',
      decimals: 18,
      logo: '🪙',
      minAmount: '0'
    }
  }, [supportedTokens])

  // Read: Check if token is supported
  const isTokenSupported = useCallback((tokenAddress: `0x${string}`) => {
    return supportedTokens.some(token => token.address === tokenAddress)
  }, [supportedTokens])

  // Read: Get token info from contract
  const { 
    data: tokenInfo,
    isLoading: isLoadingTokenInfo,
    error: tokenInfoError
  } = useReadContract({
    address: tokenRegistryAddress as `0x${string}`,
    abi: TOKEN_REGISTRY_ABI,
    functionName: 'getTokenInfo',
    args: ['0x4a5b03B8b16122D330306c65e4CA4BC5Dd6511d0' as `0x${string}`], // Test with cNGN
  })

  console.log('Token info query:', { 
    tokenInfo, 
    isLoadingTokenInfo, 
    tokenInfoError 
  })

  return {
    // Address
    tokenRegistryAddress,
    
    // Read functions
    supportedTokens,
    isLoadingSupportedTokens,
    refetchSupportedTokens,
    supportedTokensError,
    getTokenByAddress,
    isTokenSupported,
    tokenInfo,
    isLoadingTokenInfo,
    tokenInfoError,
  }
}
