'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/lib/api'

type User = {
  id: string
  email: string
  displayName: string
  subscriptionTier: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string, subscriptionTier: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token')
    
    if (token) {
      fetchUser(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUser = async (token: string) => {
    try {
      const response = await api.get('/users/me')
      
      // Transform the response to match our User type
      const userData: User = {
        id: response.data.id,
        email: response.data.email,
        displayName: response.data.display_name,
        subscriptionTier: response.data.subscription_tier
      }
      
      setUser(userData)
    } catch (err) {
      console.error('Error fetching user:', err)
      localStorage.removeItem('token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // For demo purposes, we'll simulate a successful login
      // In a real app, this would make an API call
      
      // Simulate API call
      const mockUsers = [
        { id: '1', email: 'free@example.com', password: 'password123', displayName: 'Free User', subscriptionTier: 'free' },
        { id: '2', email: 'premium@example.com', password: 'password123', displayName: 'Premium User', subscriptionTier: 'individual' },
        { id: '3', email: 'org@example.com', password: 'password123', displayName: 'Org User', subscriptionTier: 'organization' }
      ]
      
      const user = mockUsers.find(u => u.email === email && u.password === password)
      
      if (!user) {
        throw new Error('Invalid email or password')
      }
      
      // Simulate getting a token
      const token = 'mock_jwt_token_' + user.id
      
      // Store token
      localStorage.setItem('token', token)
      
      // Set user
      setUser({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        subscriptionTier: user.subscriptionTier
      })
      
      return
    } catch (err: any) {
      throw new Error(err.message || 'Login failed')
    }
  }

  const register = async (email: string, password: string, displayName: string, subscriptionTier: string) => {
    try {
      // For demo purposes, we'll simulate a successful registration
      // In a real app, this would make an API call
      
      // Simulate API call
      const userId = Math.random().toString(36).substring(2, 15)
      
      // Simulate getting a token
      const token = 'mock_jwt_token_' + userId
      
      // Store token
      localStorage.setItem('token', token)
      
      // Set user
      setUser({
        id: userId,
        email,
        displayName,
        subscriptionTier
      })
      
      return
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

