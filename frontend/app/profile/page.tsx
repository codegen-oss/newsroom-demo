'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SubscriptionTier } from '@/types'

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('free')
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
    
    if (user) {
      setDisplayName(user.displayName)
      setSelectedTier(user.subscriptionTier)
    }
  }, [isAuthenticated, loading, router, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setUpdateSuccess(false)
    
    // In a real app, this would make an API call to update the user profile
    // For now, we'll just simulate a successful update
    setTimeout(() => {
      setIsUpdating(false)
      setUpdateSuccess(true)
    }, 1000)
  }

  if (loading || !isAuthenticated || !user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-dark-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Your Profile</h1>
          
          <div className="bg-white dark:bg-dark-700 rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary-900 text-white py-6 px-8">
              <h2 className="text-2xl font-bold">Account Information</h2>
              <p className="text-primary-200 mt-1">Manage your profile and subscription</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              {updateSuccess && (
                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  Profile updated successfully!
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-dark-600 dark:border-dark-500 dark:text-gray-300"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your email cannot be changed
                </p>
              </div>
              
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
              
              <div className="mb-8">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Subscription Tier
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTier === 'free' 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                    onClick={() => setSelectedTier('free')}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        id="tier-free"
                        name="subscription-tier"
                        checked={selectedTier === 'free'}
                        onChange={() => setSelectedTier('free')}
                        className="mr-2"
                      />
                      <label htmlFor="tier-free" className="font-bold text-gray-800 dark:text-white">
                        Free
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Basic access to free articles
                    </p>
                    <p className="mt-2 font-bold text-gray-900 dark:text-white">$0 / month</p>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTier === 'individual' 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                    onClick={() => setSelectedTier('individual')}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        id="tier-individual"
                        name="subscription-tier"
                        checked={selectedTier === 'individual'}
                        onChange={() => setSelectedTier('individual')}
                        className="mr-2"
                      />
                      <label htmlFor="tier-individual" className="font-bold text-gray-800 dark:text-white">
                        Individual
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Access to premium content and features
                    </p>
                    <p className="mt-2 font-bold text-gray-900 dark:text-white">$9.99 / month</p>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTier === 'organization' 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                    onClick={() => setSelectedTier('organization')}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        id="tier-organization"
                        name="subscription-tier"
                        checked={selectedTier === 'organization'}
                        onChange={() => setSelectedTier('organization')}
                        className="mr-2"
                      />
                      <label htmlFor="tier-organization" className="font-bold text-gray-800 dark:text-white">
                        Organization
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Full access for your entire organization
                    </p>
                    <p className="mt-2 font-bold text-gray-900 dark:text-white">$49.99 / month</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 bg-white dark:bg-dark-700 rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary-900 text-white py-6 px-8">
              <h2 className="text-2xl font-bold">Preferences</h2>
              <p className="text-primary-200 mt-1">Customize your news feed</p>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Categories of Interest</h3>
                <div className="flex flex-wrap gap-2">
                  {['economy', 'global', 'technology', 'ai', 'geopolitics', 'asia', 'europe', 'americas', 'climate', 'science'].map(category => (
                    <label 
                      key={category}
                      className="inline-flex items-center px-3 py-2 border rounded-lg cursor-pointer transition-colors border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700"
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Display Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      defaultChecked
                    />
                    <span className="text-gray-700 dark:text-gray-300">Show article summaries</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      defaultChecked
                    />
                    <span className="text-gray-700 dark:text-gray-300">Enable dark mode</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Receive email notifications</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}

