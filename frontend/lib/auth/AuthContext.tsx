'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import axios from 'axios'

// Types
export interface User {
  id: string
  email: string
  display_name: string
  subscription_tier: 'free' | 'individual' | 'organization'
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        const decodedToken = jwtDecode<{ sub: string, exp: number }>(storedToken)
        const currentTime = Date.now() / 1000
        
        if (decodedToken.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        } else {
          // Valid token, fetch user data
          setToken(storedToken)
          fetchUserData(storedToken)
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  // Fetch user data with token
  const fetchUserData = async (authToken: string) => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUser(null)
      localStorage.removeItem('token')
      setToken(null)
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.post('http://localhost:8000/api/token', 
        new URLSearchParams({
          username: email,
          password: password
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      
      const { access_token } = response.data
      localStorage.setItem('token', access_token)
      setToken(access_token)
      await fetchUserData(access_token)
      router.push('/articles')
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await axios.post('http://localhost:8000/api/register', {
        email,
        password,
        display_name: displayName,
        subscription_tier: 'free'
      })
      
      // Auto login after registration
      await login(email, password)
    } catch (error: any) {
      console.error('Registration error:', error)
      setError(error.response?.data?.detail || 'Registration failed. Please try again.')
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    router.push('/')
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

