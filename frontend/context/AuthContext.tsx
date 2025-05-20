'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, displayName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll simulate a successful login with mock data
      const mockUser: User = {
        id: '1',
        email,
        displayName: email.split('@')[0],
        subscriptionTier: 'free',
        preferences: {},
        createdAt: new Date().toISOString()
      }
      
      const mockToken = 'mock-jwt-token'
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('token', mockToken)
      
      setUser(mockUser)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    try {
      // In a real app, this would make an API call
      // For now, we'll simulate a successful registration with mock data
      const mockUser: User = {
        id: '1',
        email,
        displayName,
        subscriptionTier: 'free',
        preferences: {},
        createdAt: new Date().toISOString()
      }
      
      const mockToken = 'mock-jwt-token'
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('token', mockToken)
      
      setUser(mockUser)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading,
      login,
      logout,
      register
    }}>
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

