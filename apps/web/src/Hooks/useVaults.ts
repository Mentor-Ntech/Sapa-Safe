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

    console.log('useVaults hook:', { 
        address,
        selectedVault,
        isFetchingVaults
    })

    // High-level vault operations
    const createNewVault = useCallback(async (
        tokenSymbol: string,
        targetAmount: bigint,
        totalMonths: number,
        goal: string
    ) => {
        try {
            console.log('Creating new monthly savings vault:', { 
                tokenSymbol, 
                targetAmount: targetAmount.toString(), 
                totalMonths,
                goal 
            })

            // Get token addresses from the TokenRegistry contract
            const tokenAddressMap: Record<string, `0x${string}`> = {
                'cNGN': '0x4a5b03B8b16122D330306c65e4CA4BC5Dd6511d0' as `0x${string}`, // Nigerian Naira
                'cGHS': '0x295B66bE7714458Af45E6A6Ea142A5358A6cA375' as `0x${string}`, // Ghanaian Cedi
                'cKES': '0x1E0433C1769271ECcF4CFF9FDdD515eefE6CdF92' as `0x${string}`, // Kenyan Shilling
                'cZAR': '0x1e5b44015Ff90610b54000DAad31C89b3284df4d' as `0x${string}`, // South African Rand
                'cXOF': '0xB0FA15e002516d0301884059c0aaC0F0C72b019D' as `0x${string}`, // West African CFA
            }

            const tokenAddress = tokenAddressMap[tokenSymbol]
            if (!tokenAddress) {
                throw new Error(`Token ${tokenSymbol} not supported`)
            }

            console.log('Token address resolved:', tokenAddress)

            // Create vault using factory (goal is stored locally, not in contract)
            const result = await vaultFactory.createVaultWithParams(
                tokenAddress,
                targetAmount,
                totalMonths,
                goal // This will be ignored by the contract but kept for local tracking
            )

            console.log('Monthly savings vault creation result:', result)
            return result
        } catch (error) {
            console.error('Error creating monthly savings vault:', error)
            throw error
        }
    }, [vaultFactory])

    const withdrawFromVault = useCallback(async (
        vaultAddress: `0x${string}`,
        isEarly: boolean = false
    ) => {
        try {
            console.log('Withdrawing from vault:', { vaultAddress, isEarly })
            
            setSelectedVault(vaultAddress)

            if (isEarly) {
                const result = await vault.withdrawEarlyFunds()
                return result
            } else {
                const result = await vault.withdrawCompletedFunds()
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
            console.log('Getting vault penalty:', { vaultAddress, amount: amount.toString() })
            
            const { penalty, remainingAmount } = await penaltyManager.calculatePenalty(amount)
            
            console.log('Penalty calculation result:', { 
                penalty: penalty.toString(), 
                remainingAmount: remainingAmount.toString() 
            })
            
            return { penalty, remainingAmount }
        } catch (error) {
            console.error('Error getting vault penalty:', error)
            throw error
        }
    }, [penaltyManager])

    // New status-based vault functions
    const getActiveVaults = useCallback(async () => {
        try {
            console.log('Fetching active vaults...')
            if (!address) return []
            
            const activeVaults = await vaultFactory.getUserActiveVaults(address)
            console.log('Active vaults:', activeVaults)
            return activeVaults
        } catch (error) {
            console.error('Error getting active vaults:', error)
            return []
        }
    }, [vaultFactory, address])

    const getCompletedVaults = useCallback(async () => {
        try {
            console.log('Fetching completed vaults...')
            if (!address) return []
            
            const completedVaults = await vaultFactory.getUserCompletedVaults(address)
            console.log('Completed vaults:', completedVaults)
            return completedVaults
        } catch (error) {
            console.error('Error getting completed vaults:', error)
            return []
        }
    }, [vaultFactory, address])

    const getEarlyWithdrawnVaults = useCallback(async () => {
        try {
            console.log('Fetching early withdrawn vaults...')
            if (!address) return []
            
            const earlyWithdrawnVaults = await vaultFactory.getUserEarlyWithdrawnVaults(address)
            console.log('Early withdrawn vaults:', earlyWithdrawnVaults)
            return earlyWithdrawnVaults
        } catch (error) {
            console.error('Error getting early withdrawn vaults:', error)
            return []
        }
    }, [vaultFactory, address])

    const getVaultStatusSummary = useCallback(async () => {
        try {
            console.log('Fetching vault status summary...')
            if (!address) return { activeCount: 0, completedCount: 0, earlyWithdrawnCount: 0, terminatedCount: 0 }
            
            const summary = await vaultFactory.getUserVaultStatusSummary(address)
            console.log('Vault status summary:', summary)
            return summary
        } catch (error) {
            console.error('Error getting vault status summary:', error)
            return { activeCount: 0, completedCount: 0, earlyWithdrawnCount: 0, terminatedCount: 0 }
        }
    }, [vaultFactory, address])

    // Monthly payment operations
    const makeMonthlyPayment = useCallback(async (
        vaultAddress: `0x${string}`,
        month: number
    ) => {
        try {
            console.log('Making monthly payment:', { vaultAddress, month })
            setSelectedVault(vaultAddress)
            
            const result = await vault.makeMonthlyPayment(month)
            return result
        } catch (error) {
            console.error('Error making monthly payment:', error)
            throw error
        }
    }, [vault])

    const processMissedPayment = useCallback(async (
        vaultAddress: `0x${string}`,
        month: number
    ) => {
        try {
            console.log('Processing missed payment:', { vaultAddress, month })
            setSelectedVault(vaultAddress)
            
            const result = await vault.processMissedPaymentForMonth(month)
            return result
        } catch (error) {
            console.error('Error processing missed payment:', error)
            throw error
        }
    }, [vault])

    const processAllMissedPayments = useCallback(async (
        vaultAddress: `0x${string}`,
        upToMonth: number
    ) => {
        try {
            console.log('Processing all missed payments:', { vaultAddress, upToMonth })
            setSelectedVault(vaultAddress)
            
            const result = await vault.processAllMissedPaymentsUpTo(upToMonth)
            return result
        } catch (error) {
            console.error('Error processing all missed payments:', error)
            throw error
        }
    }, [vault])

    const refreshVaultData = useCallback(async () => {
        try {
            console.log('Refreshing vault data...')
            setIsFetchingVaults(true)
            
            // Refetch user vaults from factory
            await vaultFactory.refetchUserVaults()
            
            console.log('Vault data refreshed successfully')
        } catch (error) {
            console.error('Error refreshing vault data:', error)
            throw error
        } finally {
            setIsFetchingVaults(false)
        }
    }, [vaultFactory])

    const checkVaultCreationStatus = useCallback(async () => {
        try {
            console.log('Checking vault creation status...')
            
            // Check if the latest transaction was successful
            if (vaultFactory.isCreateVaultSuccess) {
                console.log('Vault creation was successful')
                return true
            }
            
            if (vaultFactory.createVaultError) {
                console.log('Vault creation failed:', vaultFactory.createVaultError)
                return false
            }
            
            console.log('Vault creation status unknown')
            return false
        } catch (error) {
            console.error('Error checking vault creation status:', error)
            return false
        }
    }, [vaultFactory])

    const getUserVaults = useCallback(async () => {
        try {
            setIsFetchingVaults(true)
            console.log('Fetching user vaults...')
            
            if (!address) {
                console.log('No address available')
                return []
            }
            
            console.log('Refetching user vaults from contract...')
            await vaultFactory.refetchUserVaults()
            
            const vaults = vaultFactory.userVaults || []
            console.log('User vaults fetched:', vaults)
            console.log('Number of vaults:', Array.isArray(vaults) ? vaults.length : 'Not an array')
            
            if (!vaults) {
                console.log('No vaults data returned, returning empty array')
                return []
            }
            
            return vaults
        } catch (error) {
            console.error('Error getting user vaults:', error)
            return []
        } finally {
            setIsFetchingVaults(false)
        }
    }, [vaultFactory, address])

    // Computed values
    const isLoading = vaultFactory.isLoadingUserVaults || isFetchingVaults
    const userVaults = vaultFactory.userVaults || []
    const totalVaults = vaultFactory.totalVaults || 0n

    return {
        // State
        selectedVault,
        setSelectedVault,
        isFetchingVaults,
        
        // Data
        userVaults,
        totalVaults,
        isLoading,
        
        // Operations
        createNewVault,
        withdrawFromVault,
        getVaultPenalty,
        refreshVaultData,
        checkVaultCreationStatus,
        getUserVaults,
        
        // New status-based operations
        getActiveVaults,
        getCompletedVaults,
        getEarlyWithdrawnVaults,
        getVaultStatusSummary,
        
        // Monthly payment operations
        makeMonthlyPayment,
        processMissedPayment,
        processAllMissedPayments,
        
        // Contract hooks
        vaultFactory,
        tokenRegistry,
        penaltyManager,
        vault,
    }
}
