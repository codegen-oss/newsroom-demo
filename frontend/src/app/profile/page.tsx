'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import Link from 'next/link'

type UserInterest = {
  id: string
  categories: string[]
  regions: string[]
  topics: string[]
}

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [interests, setInterests] = useState<UserInterest | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  // Available options for interests
  const availableCategories = ['politics', 'technology', 'business', 'science', 'economy', 'geopolitics', 'health', 'entertainment']
  const availableRegions = ['US', 'Europe', 'Asia', 'Africa', 'Middle East', 'Latin America', 'Global']
  const availableTopics = ['elections', 'startups', 'markets', 'space', 'trade', 'AI', 'diplomacy', 'climate', 'innovation']

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    } else if (user) {
      setDisplayName(user.displayName)
      fetchUserInterests()
    }
  }, [user, isLoading, router])

  const fetchUserInterests = async () => {
    try {
      const response = await api.get('/users/interests')
      if (response.data && response.data.length > 0) {
        setInterests(response.data[0])
      } else {
        setInterests({
          id: '',
          categories: [],
          regions: [],
          topics: []
        })
      }
    } catch (err) {
      console.error('Error fetching user interests:', err)
      setError('Failed to load your interests. Please try again.')
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.put(`/users/${user?.id}`, {
        display_name: displayName
      })
      setSuccess('Profile updated successfully!')
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateInterests = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!interests) return
    
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (interests.id) {
        await api.put(`/users/interests/${interests.id}`, {
          categories: interests.categories,
          regions: interests.regions,
          topics: interests.topics
        })
      } else {
        await api.post('/users/interests', {
          categories: interests.categories,
          regions: interests.regions,
          topics: interests.topics
        })
        await fetchUserInterests()
      }
      setSuccess('Interests updated successfully!')
    } catch (err) {
      console.error('Error updating interests:', err)
      setError('Failed to update interests. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleInterest = (type: 'categories' | 'regions' | 'topics', value: string) => {
    if (!interests) return
    
    const current = interests[type] || []
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value]
    
    setInterests({
      ...interests,
      [type]: updated
    })
  }

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Account Info</h2>
              <div className="mb-4">
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">Subscription</p>
                <p className="font-medium capitalize">{user.subscriptionTier}</p>
              </div>
              <div className="mt-6">
                <button 
                  onClick={() => logout()}
                  className="btn-outline w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                  <label htmlFor="displayName" className="block mb-2">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
            
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">News Preferences</h2>
              <p className="text-gray-600 mb-6">
                Select your interests to personalize your news feed.
              </p>
              
              {interests && (
                <form onSubmit={handleUpdateInterests}>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map(category => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => toggleInterest('categories', category)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            interests.categories?.includes(category)
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Regions</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableRegions.map(region => (
                        <button
                          key={region}
                          type="button"
                          onClick={() => toggleInterest('regions', region)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            interests.regions?.includes(region)
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableTopics.map(topic => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleInterest('topics', topic)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            interests.topics?.includes(topic)
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

