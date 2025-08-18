import VaultFactoryABI from './VaultFactory.json'
import SavingsVaultABI from './SavingsVault.json'
import TokenRegistryABI from './TokenRegistry.json'
import PenaltyManagerABI from './PenaltyManager.json'
import SapaSafeProxyABI from './SapaSafeProxy.json'

export {
  VaultFactoryABI,
  SavingsVaultABI,
  TokenRegistryABI,
  PenaltyManagerABI,
  SapaSafeProxyABI,
}

// Export ABI arrays for direct use with Wagmi
export const VAULT_FACTORY_ABI = VaultFactoryABI.abi
export const SAVINGS_VAULT_ABI = SavingsVaultABI.abi
export const TOKEN_REGISTRY_ABI = TokenRegistryABI.abi
export const PENALTY_MANAGER_ABI = PenaltyManagerABI.abi
export const SAPASAFE_PROXY_ABI = SapaSafeProxyABI.abi
