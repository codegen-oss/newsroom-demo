'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'

type UserInterest = {
  id: string
  user_id: string
  categories: string[]
  regions: string[]
  topics: string[]
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  
  const [displayName, setDisplayName] = useState('')
  const [interests, setInterests] = useState<UserInterest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Form state for adding/editing interests
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  
  // Available options
  const availableCategories = ['politics', 'economy', 'technology', 'science', 'geopolitics', 'business']
  const availableRegions = ['Global', 'US', 'Europe', 'Asia', 'Africa', 'Middle East', 'Latin America']
  const availableTopics = ['elections', 'markets', 'startups', 'AI', 'climate', 'trade', 'diplomacy', 'space']
  
  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    setDisplayName(user.displayName)
    
    const fetchUserInterests = async () => {
      try {
        const response = await api.get('/users/me/interests')
        setInterests(response.data)
        
        // If user has interests, set the form values
        if (response.data.length > 0) {
          const userInterest = response.data[0]
          setSelectedCategories(userInterest.categories || [])
          setSelectedRegions(userInterest.regions || [])
          setSelectedTopics(userInterest.topics || [])
        }
      } catch (error) {
        console.error('Error fetching user interests:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserInterests()
  }, [user, authLoading, router])
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    setIsSaving(true)
    setMessage(null)
    
    try {
      // Update user profile
      await api.put('/users/me', {
        display_name: displayName
      })
      
      // Update or create user interests
      if (interests.length > 0) {
        await api.put(`/users/me/interests/${interests[0].id}`, {
          categories: selectedCategories,
          regions: selectedRegions,
          topics: selectedTopics
        })
      } else {
        await api.post('/users/me/interests', {
          categories: selectedCategories,
          regions: selectedRegions,
          topics: selectedTopics
        })
      }
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.'
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }
  
  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    )
  }
  
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }
  
  if (authLoading || isLoading) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
              <div className="space-y-6">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }
  
  if (!user) {
    return null // Router will redirect to login
  }
  
  return (
    <>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          
          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Subscription</p>
                <p className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100 mr-2">
                    {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                  </span>
                  {user.subscriptionTier !== 'organization' && (
                    <button className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                      Upgrade
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
            
            <div className="mb-6">
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input w-full"
                disabled={isSaving}
              />
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">News Preferences</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Select your interests to personalize your news feed.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedCategories.includes(category)
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                      disabled={isSaving}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Regions
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableRegions.map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => toggleRegion(region)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedRegions.includes(region)
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                      disabled={isSaving}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topics
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTopics.includes(topic)
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                      disabled={isSaving}
                    >
                      {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </>
  )
}

