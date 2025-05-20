'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaUser, FaEnvelope, FaCrown, FaEdit, FaSave, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/lib/auth/AuthContext'
import api from '@/lib/api/axios'

interface UserPreferences {
  categories: string[]
  regions: string[]
  topics: string[]
}

interface UserProfile {
  id: string
  email: string
  display_name: string
  subscription_tier: 'free' | 'individual' | 'organization'
  created_at: string
  preferences: UserPreferences
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  // Available options for preferences
  const availableCategories = ['Geopolitics', 'Economy', 'Technology', 'Science', 'Culture', 'Sports']
  const availableRegions = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania', 'Middle East']
  const availableTopics = ['Politics', 'Business', 'Innovation', 'Climate', 'Health', 'Education', 'Entertainment']

  // Fetch user profile
  useEffect(() => {
    if (!token) {
      router.push('/auth/login')
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await api.get('/users/me')
        setProfile(response.data)
        setDisplayName(response.data.display_name)
        setSelectedCategories(response.data.preferences?.categories || [])
        setSelectedRegions(response.data.preferences?.regions || [])
        setSelectedTopics(response.data.preferences?.topics || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to load profile. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token, router])

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  // Get subscription tier display
  const getSubscriptionTierDisplay = () => {
    if (!profile) return null
    
    switch (profile.subscription_tier) {
      case 'free':
        return (
          <Badge variant="default">Free Tier</Badge>
        )
      case 'individual':
        return (
          <Badge variant="primary">Premium Tier</Badge>
        )
      case 'organization':
        return (
          <Badge variant="secondary">Organization Tier</Badge>
        )
      default:
        return null
    }
  }

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  // Toggle region selection
  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region))
    } else {
      setSelectedRegions([...selectedRegions, region])
    }
  }

  // Toggle topic selection
  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic))
    } else {
      setSelectedTopics([...selectedTopics, topic])
    }
  }

  // Save profile changes
  const saveChanges = async () => {
    try {
      setUpdateError(null)
      setUpdateSuccess(false)
      
      const updatedProfile = {
        display_name: displayName,
        preferences: {
          categories: selectedCategories,
          regions: selectedRegions,
          topics: selectedTopics
        }
      }
      
      await api.put('/users/me', updatedProfile)
      
      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          display_name: displayName,
          preferences: {
            categories: selectedCategories,
            regions: selectedRegions,
            topics: selectedTopics
          }
        })
      }
      
      setIsEditing(false)
      setUpdateSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      setUpdateError('Failed to update profile. Please try again.')
    }
  }

  // Cancel editing
  const cancelEditing = () => {
    if (profile) {
      setDisplayName(profile.display_name)
      setSelectedCategories(profile.preferences?.categories || [])
      setSelectedRegions(profile.preferences?.regions || [])
      setSelectedTopics(profile.preferences?.topics || [])
    }
    setIsEditing(false)
    setUpdateError(null)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner text="Loading profile..." />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : profile ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Profile header */}
              <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                <p className="text-gray-400">Manage your account and preferences</p>
              </motion.div>
              
              {/* Success message */}
              {updateSuccess && (
                <motion.div 
                  className="bg-green-900/20 border border-green-900 text-green-200 rounded-lg p-4 mb-6 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaCheck className="mr-2" />
                  Profile updated successfully!
                </motion.div>
              )}
              
              {/* Error message */}
              {updateError && (
                <ErrorMessage message={updateError} />
              )}
              
              {/* Profile card */}
              <motion.div variants={itemVariants} className="mb-8">
                <Card variant="bordered">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-xl font-bold">Account Information</h2>
                      {!isEditing ? (
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(true)}
                          icon={<FaEdit />}
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            onClick={cancelEditing}
                            icon={<FaTimes />}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="primary" 
                            onClick={saveChanges}
                            icon={<FaSave />}
                          >
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <div className="flex items-center text-gray-400 mb-1">
                            <FaUser className="mr-2" /> Display Name
                          </div>
                          {isEditing ? (
                            <input
                              type="text"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              className="input w-full"
                            />
                          ) : (
                            <div className="text-lg font-medium">{profile.display_name}</div>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center text-gray-400 mb-1">
                            <FaEnvelope className="mr-2" /> Email
                          </div>
                          <div className="text-lg">{profile.email}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="mb-4">
                          <div className="flex items-center text-gray-400 mb-1">
                            <FaCrown className="mr-2" /> Subscription
                          </div>
                          <div className="flex items-center">
                            {profile.subscription_tier === 'free' && (
                              <Badge variant="default">Free Tier</Badge>
                            )}
                            {profile.subscription_tier === 'individual' && (
                              <Badge variant="primary">Premium Tier</Badge>
                            )}
                            {profile.subscription_tier === 'organization' && (
                              <Badge variant="secondary">Organization Tier</Badge>
                            )}
                            
                            {profile.subscription_tier === 'free' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                href="/"
                                className="ml-4"
                              >
                                Upgrade
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-gray-400 mb-1">
                            Member Since
                          </div>
                          <div>{formatDate(profile.created_at)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              {/* Preferences */}
              <motion.div variants={itemVariants}>
                <Card variant="bordered">
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">News Preferences</h2>
                    
                    {/* Categories */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {availableCategories.map((category) => (
                          <button
                            key={category}
                            onClick={() => isEditing && toggleCategory(category)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              selectedCategories.includes(category)
                                ? 'bg-primary-600 text-white'
                                : isEditing
                                ? 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                                : 'bg-dark-700 text-gray-300'
                            } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Regions */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Regions</h3>
                      <div className="flex flex-wrap gap-2">
                        {availableRegions.map((region) => (
                          <button
                            key={region}
                            onClick={() => isEditing && toggleRegion(region)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              selectedRegions.includes(region)
                                ? 'bg-secondary-600 text-white'
                                : isEditing
                                ? 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                                : 'bg-dark-700 text-gray-300'
                            } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                          >
                            {region}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Topics */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {availableTopics.map((topic) => (
                          <button
                            key={topic}
                            onClick={() => isEditing && toggleTopic(topic)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              selectedTopics.includes(topic)
                                ? 'bg-primary-600 text-white'
                                : isEditing
                                ? 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                                : 'bg-dark-700 text-gray-300'
                            } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">Please log in to view your profile.</p>
              <Button 
                variant="primary" 
                href="/auth/login"
              >
                Log In
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
