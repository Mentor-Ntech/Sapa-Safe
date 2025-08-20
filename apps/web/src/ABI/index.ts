import VaultFactoryABI from './VaultFactory.json'
import SavingsVaultABI from './SavingsVault.json'
import TokenRegistryABI from './TokenRegistry.json'
import PenaltyManagerABI from './PenaltyManager.json'

export {
  VaultFactoryABI,
  SavingsVaultABI,
  TokenRegistryABI,
  PenaltyManagerABI,
}

// Export ABI arrays for direct use with Wagmi
export const VAULT_FACTORY_ABI = VaultFactoryABI
export const SAVINGS_VAULT_ABI = SavingsVaultABI
export const TOKEN_REGISTRY_ABI = TokenRegistryABI
export const PENALTY_MANAGER_ABI = PenaltyManagerABI
