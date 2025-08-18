import { useAccount } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'

export interface UserProfile {
  address: string
  fullName: string
  email: string
  country: string
  registeredAt: number
}

export const useUserProfile = () => {
  const { address, isConnected } = useAccount()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load user profile from localStorage
  const loadUserProfile = useCallback(async () => {
    if (!address) {
      setUserProfile(null)
      return
    }

    try {
      setIsLoading(true)
      const stored = localStorage.getItem(`user_profile_${address}`)
      if (stored) {
        const profile = JSON.parse(stored) as UserProfile
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      setUserProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [address])

  // Save user profile to localStorage
  const saveUserProfile = useCallback(async (profile: Omit<UserProfile, 'address' | 'registeredAt'>) => {
    if (!address) {
      throw new Error('No wallet connected')
    }

    try {
      setIsLoading(true)
      const userProfile: UserProfile = {
        address,
        ...profile,
        registeredAt: Date.now()
      }

      // Store in localStorage
      localStorage.setItem(`user_profile_${address}`, JSON.stringify(userProfile))
      
      // Store in global user registry
      const allUsers = JSON.parse(localStorage.getItem('sapasafe_users') || '[]')
      const existingIndex = allUsers.findIndex((u: UserProfile) => u.address === address)
      
      if (existingIndex >= 0) {
        allUsers[existingIndex] = userProfile
      } else {
        allUsers.push(userProfile)
      }
      
      localStorage.setItem('sapasafe_users', JSON.stringify(allUsers))
      
      setUserProfile(userProfile)
      return userProfile
    } catch (error) {
      console.error('Error saving user profile:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [address])

  // Update user profile
  const updateUserProfile = useCallback(async (updates: Partial<Omit<UserProfile, 'address' | 'registeredAt'>>) => {
    if (!userProfile) {
      throw new Error('No user profile found')
    }

    const updatedProfile = { ...userProfile, ...updates }
    return await saveUserProfile({
      fullName: updatedProfile.fullName,
      email: updatedProfile.email,
      country: updatedProfile.country
    })
  }, [userProfile, saveUserProfile])

  // Check if user is registered
  const isUserRegistered = useCallback(() => {
    return !!userProfile
  }, [userProfile])

  // Get all users (for admin purposes)
  const getAllUsers = useCallback(() => {
    try {
      const allUsers = JSON.parse(localStorage.getItem('sapasafe_users') || '[]')
      return allUsers as UserProfile[]
    } catch (error) {
      console.error('Error getting all users:', error)
      return []
    }
  }, [])

  // Load profile when address changes
  useEffect(() => {
    loadUserProfile()
  }, [loadUserProfile])

  return {
    // State
    userProfile,
    isLoading,
    isConnected,
    
    // Actions
    loadUserProfile,
    saveUserProfile,
    updateUserProfile,
    isUserRegistered,
    getAllUsers,
    
    // Computed
    isRegistered: isUserRegistered(),
  }
}
