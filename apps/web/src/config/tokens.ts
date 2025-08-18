// Supported tokens configuration
export const SUPPORTED_TOKENS = {
  // Nigerian Naira (cNGN)
  cNGN: {
    symbol: 'cNGN',
    name: 'Celo Nigerian Naira',
    decimals: 18,
    logo: '🇳🇬',
    country: 'Nigeria',
    currency: 'NGN',
    testnetAddress: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', // Alfajores cNGN
    mainnetAddress: '', // To be updated
  },
  // Ghanaian Cedi (cGHS)
  cGHS: {
    symbol: 'cGHS',
    name: 'Celo Ghanaian Cedi',
    decimals: 18,
    logo: '🇬🇭',
    country: 'Ghana',
    currency: 'GHS',
    testnetAddress: '0xE4D517785D091D49c60d073f9136dC4672B3aCF5', // Alfajores cGHS
    mainnetAddress: '', // To be updated
  },
  // Kenyan Shilling (cKES)
  cKES: {
    symbol: 'cKES',
    name: 'Celo Kenyan Shilling',
    decimals: 18,
    logo: '🇰🇪',
    country: 'Kenya',
    currency: 'KES',
    testnetAddress: '0x765DE816845861e75A25fCA122bb6898B8B1282a', // Alfajores cKES
    mainnetAddress: '', // To be updated
  },
  // South African Rand (cZAR)
  cZAR: {
    symbol: 'cZAR',
    name: 'Celo South African Rand',
    decimals: 18,
    logo: '🇿🇦',
    country: 'South Africa',
    currency: 'ZAR',
    testnetAddress: '0x90Ca507a5D4458a4C6C624978d16bC04129aA749', // Alfajores cZAR
    mainnetAddress: '', // To be updated
  },
  // West African CFA (cXOF)
  cXOF: {
    symbol: 'cXOF',
    name: 'Celo West African CFA',
    decimals: 18,
    logo: '🇸🇳',
    country: 'Senegal',
    currency: 'XOF',
    testnetAddress: '0xE919F65739c26a42616b7b8eedC6b5524d1e3aC8', // Alfajores cXOF
    mainnetAddress: '', // To be updated
  },
} as const

// Get token by symbol
export const getTokenBySymbol = (symbol: string) => {
  return SUPPORTED_TOKENS[symbol as keyof typeof SUPPORTED_TOKENS]
}

// Get token by address
export const getTokenByAddress = (address: string, network: 'alfajores' | 'celo' = 'alfajores') => {
  const tokens = Object.values(SUPPORTED_TOKENS)
  return tokens.find(token => 
    network === 'alfajores' ? token.testnetAddress === address : token.mainnetAddress === address
  )
}

// Get all supported tokens
export const getAllTokens = () => {
  return Object.values(SUPPORTED_TOKENS)
}

// Get tokens by country
export const getTokensByCountry = (country: string) => {
  return Object.values(SUPPORTED_TOKENS).filter(token => token.country === country)
}

// Token address getters
export const getTokenAddress = (symbol: string, network: 'alfajores' | 'celo' = 'alfajores') => {
  const token = getTokenBySymbol(symbol)
  if (!token) return null
  
  return network === 'alfajores' ? token.testnetAddress : token.mainnetAddress
}
