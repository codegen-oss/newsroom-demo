'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setIsLoading(true)

    try {
      await register(email, password, displayName)
      router.push('/')
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-dark-700 rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary-900 text-white py-6 px-8">
          <h2 className="text-2xl font-bold">Create an Account</h2>
          <p className="text-primary-200 mt-1">Join NewsRoom for the latest news</p>
        </div>
        
        <form onSubmit={handleSubmit} className="py-8 px-8">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="displayName" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:border-dark-500 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:border-dark-500 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:border-dark-500 dark:text-white"
              required
              minLength={6}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-600 dark:border-dark-500 dark:text-white"
              required
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

