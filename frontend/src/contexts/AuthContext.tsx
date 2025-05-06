'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { api } from '@/lib/api'

type User = {
  id: string
  email: string
  displayName: string
  subscriptionTier: 'free' | 'individual' | 'organization'
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, displayName: string, subscriptionTier: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token')
          setUser(null)
        } else {
          // Fetch user data
          fetchUserData(token)
        }
      } catch (error) {
        console.error('Invalid token:', error)
        localStorage.removeItem('token')
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  const fetchUserData = async (token: string) => {
    try {
      const response = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await api.post('/token', new URLSearchParams({
        username: email,
        password: password
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      
      const { access_token } = response.data
      localStorage.setItem('token', access_token)
      
      await fetchUserData(access_token)
    } catch (error) {
      console.error('Login error:', error)
      throw new Error('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const register = async (email: string, password: string, displayName: string, subscriptionTier: string) => {
    setIsLoading(true)
    try {
      await api.post('/users', {
        email,
        password,
        display_name: displayName,
        subscription_tier: subscriptionTier,
        preferences: {}
      })
      
      // Auto login after registration
      await login(email, password)
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error('Registration failed. Email may already be in use.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
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

