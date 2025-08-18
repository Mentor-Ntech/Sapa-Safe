import { useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export interface Transaction {
  hash: `0x${string}`
  type: 'create_vault' | 'deposit' | 'withdraw' | 'emergency_withdraw' | 'register_user' | 'update_profile'
  status: 'pending' | 'success' | 'failed'
  timestamp: number
  description: string
  metadata?: any
}

export const useTransactions = () => {
  const { address } = useAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pendingTransactions, setPendingTransactions] = useState<Set<`0x${string}`>>(new Set())

  // Add a new transaction
  const addTransaction = useCallback((transaction: Omit<Transaction, 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      timestamp: Date.now(),
    }
    
    setTransactions(prev => [newTransaction, ...prev])
    setPendingTransactions(prev => new Set(prev).add(transaction.hash))
    
    // Show toast notification
    toast.info(`Transaction submitted: ${transaction.description}`, {
      description: `Hash: ${transaction.hash.slice(0, 10)}...`,
    })
  }, [])

  // Update transaction status
  const updateTransactionStatus = useCallback((hash: `0x${string}`, status: 'success' | 'failed') => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.hash === hash 
          ? { ...tx, status } 
          : tx
      )
    )
    
    setPendingTransactions(prev => {
      const newSet = new Set(prev)
      newSet.delete(hash)
      return newSet
    })

    // Show success/failure toast
    const transaction = transactions.find(tx => tx.hash === hash)
    if (transaction) {
      if (status === 'success') {
        toast.success(`Transaction successful: ${transaction.description}`)
      } else {
        toast.error(`Transaction failed: ${transaction.description}`)
      }
    }
  }, [transactions])

  // Get transaction by hash
  const getTransaction = useCallback((hash: `0x${string}`) => {
    return transactions.find(tx => tx.hash === hash)
  }, [transactions])

  // Get transactions by type
  const getTransactionsByType = useCallback((type: Transaction['type']) => {
    return transactions.filter(tx => tx.type === type)
  }, [transactions])

  // Get recent transactions
  const getRecentTransactions = useCallback((limit: number = 10) => {
    return transactions.slice(0, limit)
  }, [transactions])

  // Clear completed transactions
  const clearCompletedTransactions = useCallback(() => {
    setTransactions(prev => prev.filter(tx => tx.status === 'pending'))
  }, [])

  // Clear all transactions
  const clearAllTransactions = useCallback(() => {
    setTransactions([])
    setPendingTransactions(new Set())
  }, [])

  // Get transaction statistics
  const getTransactionStats = useCallback(() => {
    const total = transactions.length
    const pending = transactions.filter(tx => tx.status === 'pending').length
    const successful = transactions.filter(tx => tx.status === 'success').length
    const failed = transactions.filter(tx => tx.status === 'failed').length

    return {
      total,
      pending,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0
    }
  }, [transactions])

  // Monitor pending transactions
  useEffect(() => {
    const monitorTransaction = async (hash: `0x${string}`) => {
      try {
        // This would typically use a blockchain provider to check transaction status
        // For now, we'll simulate with a timeout
        setTimeout(() => {
          // Simulate success (in real implementation, check actual blockchain)
          updateTransactionStatus(hash, 'success')
        }, 5000)
      } catch (error) {
        console.error('Error monitoring transaction:', error)
        updateTransactionStatus(hash, 'failed')
      }
    }

    pendingTransactions.forEach(hash => {
      monitorTransaction(hash)
    })
  }, [pendingTransactions, updateTransactionStatus])

  // Persist transactions to localStorage
  useEffect(() => {
    if (address) {
      const key = `transactions_${address}`
      localStorage.setItem(key, JSON.stringify(transactions))
    }
  }, [transactions, address])

  // Load transactions from localStorage
  useEffect(() => {
    if (address) {
      const key = `transactions_${address}`
      const saved = localStorage.getItem(key)
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Transaction[]
          setTransactions(parsed)
          
          // Restore pending transactions
          const pending = parsed
            .filter(tx => tx.status === 'pending')
            .map(tx => tx.hash)
          setPendingTransactions(new Set(pending))
        } catch (error) {
          console.error('Error loading transactions:', error)
        }
      }
    }
  }, [address])

  return {
    // State
    transactions,
    pendingTransactions,
    
    // Actions
    addTransaction,
    updateTransactionStatus,
    getTransaction,
    getTransactionsByType,
    getRecentTransactions,
    clearCompletedTransactions,
    clearAllTransactions,
    
    // Statistics
    getTransactionStats,
    
    // Utilities
    hasPendingTransactions: pendingTransactions.size > 0,
    pendingCount: pendingTransactions.size,
  }
}
