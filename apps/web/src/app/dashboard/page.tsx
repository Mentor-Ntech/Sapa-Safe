// "use client"

// import { useState, useEffect } from "react"
// import { useVaults, useTransactions, useUserProfile } from "@/Hooks"
// import { useAccount, useChainId } from "wagmi"
// import { PageTransition } from "@/components/page-transition"
// import { DashboardSkeleton } from "@/components/dashboard-skeleton"
// import { EmptyState } from "@/components/empty-state"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { 
//   Plus, 
//   TrendingUp, 
//   Wallet, 
//   Clock, 
//   Target,
//   ArrowRight,
//   PiggyBank,
//   Shield,
//   Zap,
//   User,
//   CheckCircle
// } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"

// export default function Dashboard() {
//   const router = useRouter()
//   const { address, isConnected } = useAccount()
//   const chainId = useChainId()
//   const { 
//     userVaults: vaultsFromHook, 
//     totalVaults,
//     isLoading,
//     refreshVaultData,
//     vaultFactory
//   } = useVaults()
//   const { getTransactionStats, hasPendingTransactions } = useTransactions()
//   const { userProfile, isRegistered, isLoading: isProfileLoading } = useUserProfile()
  
//   // Get status-based vaults directly from vaultFactory
//   const activeVaults: string[] = Array.isArray(vaultFactory.userActiveVaults) ? vaultFactory.userActiveVaults : []
//   const completedVaults: string[] = Array.isArray(vaultFactory.userCompletedVaults) ? vaultFactory.userCompletedVaults : []
//   const earlyWithdrawnVaults: string[] = Array.isArray(vaultFactory.userEarlyWithdrawnVaults) ? vaultFactory.userEarlyWithdrawnVaults : []
//   const vaultStatusSummary: any = vaultFactory.userVaultStatusSummary || { activeCount: 0, completedCount: 0, earlyWithdrawnCount: 0, terminatedCount: 0 }
//   const isLoadingStatusData = vaultFactory.isLoadingUserActiveVaults || vaultFactory.isLoadingUserCompletedVaults || vaultFactory.isLoadingUserEarlyWithdrawnVaults || vaultFactory.isLoadingUserVaultStatusSummary
  
//   const [analytics, setAnalytics] = useState<any>(null)
//   const [isLoadingData, setIsLoadingData] = useState(true)

//   // Load user data
//   useEffect(() => {
//     const loadDashboardData = async () => {
//       if (!isConnected || !address) {
//         console.log('Not connected or no address')
//         setIsLoadingData(false)
//         return
//       }

//       try {
//         // console.log('Loading dashboard data...')
//         setIsLoadingData(true)
        
//         // Add timeout to prevent infinite loading
//         const timeoutPromise = new Promise((_, reject) => {
//           setTimeout(() => reject(new Error('Data loading timeout')), 10000)
//         })
        
//         // Get user vaults with timeout
//         await refreshVaultData()
        
//         // Refresh status-based vault data
//         await vaultFactory.refetchUserActiveVaults()
//         await vaultFactory.refetchUserCompletedVaults()
//         await vaultFactory.refetchUserEarlyWithdrawnVaults()
//         await vaultFactory.refetchUserVaultStatusSummary()

//         // For now, skip analytics since we don't have detailed vault info yet
//         setAnalytics(null)

//       } catch (error) {
//         console.error('Error loading dashboard data:', error)
//         toast.error('Failed to load dashboard data')
//         // Set empty vaults to prevent infinite loading

//       } finally {
//         // console.log('Dashboard data loading complete')
//         setIsLoadingData(false)
//       }
//     }

//     loadDashboardData()
//   }, [isConnected, address, userProfile, isRegistered, isProfileLoading])

//   const handleCreateVault = () => {
//     router.push('/create-vault')
//   }

//   const handleViewAllVaults = () => {
//     router.push('/vaults')
//   }

//   const handleViewVault = (vaultAddress: string) => {
//     router.push(`/vault-details/${vaultAddress}`)
//   }

//   // Calculate quick stats using status-based data
//   const totalVaultsCount = activeVaults.length + completedVaults.length + earlyWithdrawnVaults.length
  
//   // TODO: Calculate total saved from vault balances - for now use a placeholder
//   const totalSaved = 0n // This should be calculated by summing all active vault balances
  
//   const transactionStats = getTransactionStats()

//   // Loading state with timeout
//   // console.log('Loading states:', { isLoadingData, isLoading, isProfileLoading })
  
//   // Add a timeout to prevent infinite loading
//   const [loadingTimeout, setLoadingTimeout] = useState(false)
  
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoadingTimeout(true)
//     }, 15000) // 15 seconds timeout
    
//     return () => clearTimeout(timer)
//   }, [])
  
//   if ((isLoadingData || isLoading || isProfileLoading) && !loadingTimeout) {
//     // console.log('Showing dashboard skeleton')
//     return <DashboardSkeleton />
//   }

//   // Not connected state
//   if (!isConnected) {
//     return (
//       <PageTransition>
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center">
//             <h1 className="sapasafe-heading-1 mb-4">Connect Your Wallet</h1>
//             <p className="sapasafe-text text-muted-foreground">
//               Connect your wallet to start saving with SapaSafe
//             </p>
//           </div>
//         </div>
//       </PageTransition>
//     )
//   }

//   // Network check - ensure we're on Alfajores
//   if (chainId !== 44787) {
//     return (
//       <PageTransition>
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center">
//             <h1 className="sapasafe-heading-1 mb-4">Switch to Alfajores</h1>
//             <p className="sapasafe-text text-muted-foreground mb-6">
//               SapaSafe is currently only available on Celo Alfajores testnet
//             </p>
//             <Button 
//               onClick={() => window.open('https://docs.celo.org/network/alfajores', '_blank')}
//               className="sapasafe-btn-primary"
//             >
//               Learn How to Switch Networks
//             </Button>
//           </div>
//         </div>
//       </PageTransition>
//     )
//   }

//   // Not registered state
//   if (!isRegistered) {
//     return (
//       <PageTransition>
//         <div className="container mx-auto px-4 py-8">
//           <div className="max-w-2xl mx-auto">
//             <EmptyState
//               icon={<User className="h-12 w-12" />}
//               title="Complete Your Registration"
//               description="Please complete your profile to start using SapaSafe"
//               actionLabel="Complete Registration"
//               onAction={() => router.push('/register')}
//             />
//           </div>
//         </div>
//       </PageTransition>
//     )
//   }

//   // No vaults state - show main dashboard with welcome message
//   if (totalVaultsCount === 0 && !isLoadingStatusData) {
//     return (
//       <PageTransition>
//         <div className="container mx-auto px-4 py-8">
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//             <div>
//               <h1 className="sapasafe-heading-1">
//                 Welcome to SapaSafe, {userProfile?.fullName || 'Saver'}! 🎉
//               </h1>
//               <p className="sapasafe-text text-muted-foreground">
//                 You're all set up! Ready to start your savings journey?
//               </p>
//             </div>
//             <div className="flex gap-2 mt-4 sm:mt-0">
//               <Button onClick={handleCreateVault} className="sapasafe-btn-primary">
//                 <Plus className="mr-2 h-4 w-4" />
//                 Create Your First Vault
//               </Button>
//             </div>
//           </div>

//           {/* Welcome Card */}
//           <Card className="sapasafe-card mb-8">
//             <CardContent className="p-6">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <PiggyBank className="h-8 w-8 text-primary" />
//                 </div>
//                 <h2 className="sapasafe-heading-2 mb-2">Start Your Savings Journey</h2>
//                 <p className="sapasafe-text text-muted-foreground mb-6">
//                   Create your first savings vault to begin building financial discipline and achieve your goals.
//                 </p>
//                 <Button onClick={handleCreateVault} size="lg" className="sapasafe-btn-primary">
//                   <Plus className="mr-2 h-4 w-4" />
//                   Create Your First Vault
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Quick Stats (empty state) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <Card className="sapasafe-card">
//               <CardHeader className="pb-3">
//                 <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
//                   <Wallet className="h-5 w-5 text-primary" />
//                   Active Vaults
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="sapasafe-heading-2 text-primary">{activeVaults.length}</p>
//                 <p className="sapasafe-text-xs text-muted-foreground">
//                   {activeVaults.length === 0 ? 'No vaults yet' : `${activeVaults.length} vault${activeVaults.length === 1 ? '' : 's'}`}
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="sapasafe-card">
//               <CardHeader className="pb-3">
//                 <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
//                   <Target className="h-5 w-5 text-success" />
//                   Total Saved
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="sapasafe-heading-2 text-success">0</p>
//                 <p className="sapasafe-text-xs text-muted-foreground">Start saving today</p>
//               </CardContent>
//             </Card>

//             <Card className="sapasafe-card">
//               <CardHeader className="pb-3">
//                 <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
//                   <CheckCircle className="h-5 w-5 text-success" />
//                   Completed
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="sapasafe-heading-2 text-success">0</p>
//                 <p className="sapasafe-text-xs text-muted-foreground">Goals achieved</p>
//               </CardContent>
//             </Card>

//             <Card className="sapasafe-card">
//               <CardHeader className="pb-3">
//                 <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
//                   <TrendingUp className="h-5 w-5 text-primary" />
//                   Success Rate
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="sapasafe-heading-2 text-primary">-</p>
//                 <p className="sapasafe-text-xs text-muted-foreground">Create vaults to see</p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </PageTransition>
//     )
//   }

//   return (
//     <PageTransition>
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//           <div>
//             <h1 className="sapasafe-heading-1">
//               Welcome back, {userProfile?.fullName || 'Saver'}! 👋
//             </h1>
//             <p className="sapasafe-text text-muted-foreground">
//               Track your savings progress and manage your vaults
//             </p>
//           </div>
//           <div className="flex gap-2 mt-4 sm:mt-0">
//             <Button onClick={handleCreateVault} className="sapasafe-btn-primary">
//               <Plus className="mr-2 h-4 w-4" />
//               Create Vault
//             </Button>
//           </div>
//         </div>

//         {/* Pending Transactions Alert */}
//         {hasPendingTransactions && (
//           <Card className="sapasafe-card mb-6 border-warning/20 bg-warning/5">
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <Clock className="h-5 w-5 text-warning" />
//                 <div>
//                   <p className="sapasafe-text-sm font-medium text-warning">
//                     You have pending transactions
//                   </p>
//                   <p className="sapasafe-text-xs text-muted-foreground">
//                     Some of your vault operations are being processed
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card className="sapasafe-card">
//             <CardHeader className="pb-3">
//               <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
//                 <Wallet className="h-5 w-5 text-primary" />
//                 Active Vaults
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="sapasafe-heading-2">{activeVaults.length}</div>
//               <p className="sapasafe-text-xs text-muted-foreground">
//                 Currently locked vaults
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="sapasafe-card">
//             <CardHeader className="pb-3">
//               <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
//                 <PiggyBank className="h-5 w-5 text-success" />
//                 Total Vaults
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="sapasafe-heading-2">{totalVaultsCount}</div>
//               <p className="sapasafe-text-xs text-muted-foreground">
//                 All vaults created
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="sapasafe-card">
//             <CardHeader className="pb-3">
//               <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
//                 <Target className="h-5 w-5 text-accent" />
//                 Total Saved
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="sapasafe-heading-2">
//                 {totalSaved ? `${Number(totalSaved) / 10**18}` : '0'} 
//               </div>
//               <p className="sapasafe-text-xs text-muted-foreground">
//                 Across all vaults
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="sapasafe-card">
//             <CardHeader className="pb-3">
//               <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
//                 <Shield className="h-5 w-5 text-info" />
//                 Completed
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="sapasafe-heading-2">{completedVaults.length}</div>
//               <p className="sapasafe-text-xs text-muted-foreground">
//                 Successfully completed vaults
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Active Vaults Preview */}
//         <Card className="sapasafe-card mb-8">
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <div>
//                 <CardTitle className="sapasafe-heading-3">Active Vaults</CardTitle>
//                 <CardDescription>
//                   Your currently locked savings vaults
//                 </CardDescription>
//               </div>
//               <Button 
//                 variant="ghost" 
//                 onClick={handleViewAllVaults}
//                 className="sapasafe-btn-outline"
//               >
//                 View All
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {activeVaults.length === 0 ? (
//               <div className="text-center py-8">
//                 <p className="sapasafe-text text-muted-foreground">
//                   No active vaults. Create your first vault to start saving!
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {activeVaults.slice(0, 3).map((vaultAddress, index) => (
//                   <div 
//                     key={index}
//                     className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
//                     onClick={() => handleViewVault(vaultAddress)}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
//                         <PiggyBank className="h-6 w-6 text-primary" />
//                       </div>
//                       <div>
//                         <h4 className="sapasafe-heading-4">
//                           Vault #{index + 1}
//                         </h4>
//                         <p className="sapasafe-text-sm text-muted-foreground">
//                           {vaultAddress.slice(0, 8)}...{vaultAddress.slice(-6)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="sapasafe-heading-4">
//                         View Details
//                       </div>
//                       <Badge variant="secondary" className="sapasafe-status-info">
//                         Active
//                       </Badge>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Recent Activity */}
//         <Card className="sapasafe-card">
//           <CardHeader>
//             <CardTitle className="sapasafe-heading-3">Recent Activity</CardTitle>
//             <CardDescription>
//               Your latest vault operations and transactions
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {transactionStats.total === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="sapasafe-text text-muted-foreground">
//                     No recent activity. Create a vault to get started!
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {/* This would show actual transaction history */}
//                   <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
//                         <Plus className="h-4 w-4 text-success" />
//                       </div>
//                       <div>
//                         <p className="sapasafe-text-sm font-medium">Vault Created</p>
//                         <p className="sapasafe-text-xs text-muted-foreground">
//                           {new Date().toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                     <Badge variant="secondary" className="sapasafe-status-success">
//                       Success
//                     </Badge>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </PageTransition>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { useVaults, useTransactions, useUserProfile } from "@/Hooks"
import { useAccount, useChainId } from "wagmi"
import { PageTransition } from "@/components/page-transition"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  TrendingUp, 
  Wallet, 
  Clock, 
  Target,
  ArrowRight,
  PiggyBank,
  Shield,
  Zap,
  User,
  CheckCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Dashboard() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { 
    userVaults: vaultsFromHook, 
    totalVaults,
    isLoading,
    refreshVaultData,
    vaultFactory
  } = useVaults()
  const { getTransactionStats, hasPendingTransactions } = useTransactions()
  const { userProfile, isRegistered, isLoading: isProfileLoading } = useUserProfile()
  
  // Get status-based vaults directly from vaultFactory
  const activeVaults: string[] = Array.isArray(vaultFactory.userActiveVaults) ? vaultFactory.userActiveVaults : []
  const completedVaults: string[] = Array.isArray(vaultFactory.userCompletedVaults) ? vaultFactory.userCompletedVaults : []
  const earlyWithdrawnVaults: string[] = Array.isArray(vaultFactory.userEarlyWithdrawnVaults) ? vaultFactory.userEarlyWithdrawnVaults : []
  const vaultStatusSummary: any = vaultFactory.userVaultStatusSummary || { activeCount: 0, completedCount: 0, earlyWithdrawnCount: 0, terminatedCount: 0 }
  const isLoadingStatusData = vaultFactory.isLoadingUserActiveVaults || vaultFactory.isLoadingUserCompletedVaults || vaultFactory.isLoadingUserEarlyWithdrawnVaults || vaultFactory.isLoadingUserVaultStatusSummary
  
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Load user data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isConnected || !address) {
        console.log('Not connected or no address')
        setIsLoadingData(false)
        return
      }

      try {
        // console.log('Loading dashboard data...')
        setIsLoadingData(true)
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Data loading timeout')), 15000)
        })
        
        // Race the data loading against the timeout
        await Promise.race([
          (async () => {
            // Get user vaults
            await refreshVaultData()
            
            // Refresh status-based vault data
            await vaultFactory.refetchUserActiveVaults()
            await vaultFactory.refetchUserCompletedVaults()
            await vaultFactory.refetchUserEarlyWithdrawnVaults()
            await vaultFactory.refetchUserVaultStatusSummary()

            // For now, skip analytics since we don't have detailed vault info yet
            setAnalytics(null)
          })(),
          timeoutPromise
        ])

      } catch (error) {
        console.error('Error loading dashboard data:', error)
        if (error instanceof Error && error.message === 'Data loading timeout') {
          toast.error('Data loading timed out. Please try again.')
        } else {
          toast.error('Failed to load dashboard data')
        }
        // Set empty vaults to prevent infinite loading

      } finally {
        // console.log('Dashboard data loading complete')
        setIsLoadingData(false)
      }
    }

    loadDashboardData()
  }, [isConnected, address, userProfile, isRegistered, isProfileLoading])

  const handleCreateVault = () => {
    router.push('/create-vault')
  }

  const handleViewAllVaults = () => {
    router.push('/vaults')
  }

  const handleViewVault = (vaultAddress: string) => {
    router.push(`/vault-details/${vaultAddress}`)
  }

  // Calculate quick stats using status-based data
  const totalVaultsCount = activeVaults.length + completedVaults.length + earlyWithdrawnVaults.length
  
  // TODO: Calculate total saved from vault balances - for now use a placeholder
  const totalSaved = 0n // This should be calculated by summing all active vault balances
  
  const transactionStats = getTransactionStats()

  // Loading state with timeout
  // console.log('Loading states:', { isLoadingData, isLoading, isProfileLoading })
  
  // Add a timeout to prevent infinite loading
  const [loadingTimeout, setLoadingTimeout] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true)
    }, 15000) // 15 seconds timeout
    
    return () => clearTimeout(timer)
  }, [])
  
  if ((isLoadingData || isLoading || isProfileLoading) && !loadingTimeout) {
    // console.log('Showing dashboard skeleton')
    return <DashboardSkeleton />
  }

  // Not connected state
  if (!isConnected) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="sapasafe-heading-1 mb-4">Connect Your Wallet</h1>
            <p className="sapasafe-text text-muted-foreground">
              Connect your wallet to start saving with SapaSafe
            </p>
          </div>
        </div>
      </PageTransition>
    )
  }

  // Network check - ensure we're on Alfajores
  if (chainId !== 44787) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="sapasafe-heading-1 mb-4">Switch to Alfajores</h1>
            <p className="sapasafe-text text-muted-foreground mb-6">
              SapaSafe is currently only available on Celo Alfajores testnet
            </p>
            <Button 
              onClick={() => window.open('https://docs.celo.org/network/alfajores', '_blank')}
              className="sapasafe-btn-primary"
            >
              Learn How to Switch Networks
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  // Not registered state
  if (!isRegistered) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <EmptyState
              icon={<User className="h-12 w-12" />}
              title="Complete Your Registration"
              description="Please complete your profile to start using SapaSafe"
              actionLabel="Complete Registration"
              onAction={() => router.push('/register')}
            />
          </div>
        </div>
      </PageTransition>
    )
  }

  // No vaults state - show main dashboard with welcome message
  if (totalVaultsCount === 0 && !isLoadingStatusData) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="sapasafe-heading-1">
                Welcome to SapaSafe, {userProfile?.fullName || 'Saver'}! 🎉
              </h1>
              <p className="sapasafe-text text-muted-foreground">
                You're all set up! Ready to start your savings journey?
              </p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button onClick={handleCreateVault} className="sapasafe-btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Vault
              </Button>
            </div>
          </div>

          {/* Welcome Card */}
          <Card className="sapasafe-card mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PiggyBank className="h-8 w-8 text-primary" />
                </div>
                <h2 className="sapasafe-heading-2 mb-2">Start Your Savings Journey</h2>
                <p className="sapasafe-text text-muted-foreground mb-6">
                  Create your first savings vault to begin building financial discipline and achieve your goals.
                </p>
                <Button onClick={handleCreateVault} size="lg" className="sapasafe-btn-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Vault
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats (empty state) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="sapasafe-card">
              <CardHeader className="pb-3">
                <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Active Vaults
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="sapasafe-heading-2 text-primary">{activeVaults.length}</p>
                <p className="sapasafe-text-xs text-muted-foreground">
                  {activeVaults.length === 0 ? 'No vaults yet' : `${activeVaults.length} vault${activeVaults.length === 1 ? '' : 's'}`}
                </p>
              </CardContent>
            </Card>

            <Card className="sapasafe-card">
              <CardHeader className="pb-3">
                <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-success" />
                  Total Saved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="sapasafe-heading-2 text-success">0</p>
                <p className="sapasafe-text-xs text-muted-foreground">Start saving today</p>
              </CardContent>
            </Card>

            <Card className="sapasafe-card">
              <CardHeader className="pb-3">
                <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="sapasafe-heading-2 text-success">0</p>
                <p className="sapasafe-text-xs text-muted-foreground">Goals achieved</p>
              </CardContent>
            </Card>

            <Card className="sapasafe-card">
              <CardHeader className="pb-3">
                <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="sapasafe-heading-2 text-primary">-</p>
                <p className="sapasafe-text-xs text-muted-foreground">Create vaults to see</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="sapasafe-heading-1">
              Welcome back, {userProfile?.fullName || 'Saver'}! 👋
            </h1>
            <p className="sapasafe-text text-muted-foreground">
              Track your savings progress and manage your vaults
            </p>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button onClick={handleCreateVault} className="sapasafe-btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create Vault
            </Button>
          </div>
        </div>

        {/* Pending Transactions Alert */}
        {hasPendingTransactions && (
          <Card className="sapasafe-card mb-6 border-warning/20 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="sapasafe-text-sm font-medium text-warning">
                    You have pending transactions
                  </p>
                  <p className="sapasafe-text-xs text-muted-foreground">
                    Some of your vault operations are being processed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="sapasafe-card">
            <CardHeader className="pb-3">
              <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Active Vaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="sapasafe-heading-2">{activeVaults.length}</div>
              <p className="sapasafe-text-xs text-muted-foreground">
                Currently locked vaults
              </p>
            </CardContent>
          </Card>

          <Card className="sapasafe-card">
            <CardHeader className="pb-3">
              <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-success" />
                Total Vaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="sapasafe-heading-2">{totalVaultsCount}</div>
              <p className="sapasafe-text-xs text-muted-foreground">
                All vaults created
              </p>
            </CardContent>
          </Card>

          <Card className="sapasafe-card">
            <CardHeader className="pb-3">
              <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Total Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="sapasafe-heading-2">
                {totalSaved ? `${Number(totalSaved) / 10**18}` : '0'} 
              </div>
              <p className="sapasafe-text-xs text-muted-foreground">
                Across all vaults
              </p>
            </CardContent>
          </Card>

          <Card className="sapasafe-card">
            <CardHeader className="pb-3">
              <CardTitle className="sapasafe-heading-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-info" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="sapasafe-heading-2">{completedVaults.length}</div>
              <p className="sapasafe-text-xs text-muted-foreground">
                Successfully completed vaults
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Vaults Preview */}
        <Card className="sapasafe-card mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="sapasafe-heading-3">Active Vaults</CardTitle>
                <CardDescription>
                  Your currently locked savings vaults
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                onClick={handleViewAllVaults}
                className="sapasafe-btn-outline"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeVaults.length === 0 ? (
              <div className="text-center py-8">
                <p className="sapasafe-text text-muted-foreground">
                  No active vaults. Create your first vault to start saving!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeVaults.slice(0, 3).map((vaultAddress, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewVault(vaultAddress)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <PiggyBank className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="sapasafe-heading-4">
                          Vault #{index + 1}
                        </h4>
                        <p className="sapasafe-text-sm text-muted-foreground">
                          {vaultAddress.slice(0, 8)}...{vaultAddress.slice(-6)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="sapasafe-heading-4">
                        View Details
                      </div>
                      <Badge variant="secondary" className="sapasafe-status-info">
                        Active
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="sapasafe-card">
          <CardHeader>
            <CardTitle className="sapasafe-heading-3">Recent Activity</CardTitle>
            <CardDescription>
              Your latest vault operations and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactionStats.total === 0 ? (
                <div className="text-center py-8">
                  <p className="sapasafe-text text-muted-foreground">
                    No recent activity. Create a vault to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* This would show actual transaction history */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                        <Plus className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="sapasafe-text-sm font-medium">Vault Created</p>
                        <p className="sapasafe-text-xs text-muted-foreground">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="sapasafe-status-success">
                      Success
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
