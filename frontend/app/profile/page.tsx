'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { userApi } from '@/lib/api';
import { FaUser, FaEnvelope, FaCrown, FaTags, FaGlobe, FaLightbulb, FaSpinner, FaSave, FaMoon, FaSun, FaBell, FaCog } from 'react-icons/fa';
import { fadeIn, slideUp, staggerContainer, subscriptionTierStyles } from '@/lib/theme';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Toggle from '@/components/ui/Toggle';

interface UserInterests {
  id: string;
  user_id: string;
  categories: string[];
  regions: string[];
  topics: string[];
}

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  emailDigest?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [interests, setInterests] = useState<UserInterests | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    notifications: true,
    emailDigest: false,
    fontSize: 'medium'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Available options
  const availableCategories = ['politics', 'economy', 'technology', 'science', 'markets', 'diplomacy'];
  const availableRegions = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania', 'Global'];
  const availableTopics = ['elections', 'startups', 'AI', 'space', 'markets', 'trade', 'innovation', 'diplomacy'];

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Set initial display name from user data
    if (user) {
      setDisplayName(user.display_name);
      
      // Set initial preferences from user data
      if (user.preferences) {
        setPreferences({
          ...preferences,
          ...user.preferences
        });
      }
    }

    // Fetch user interests
    if (isAuthenticated) {
      fetchUserInterests();
    }
  }, [isAuthenticated, authLoading, router, user]);

  const fetchUserInterests = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getInterests();
      setInterests(response.data);
      setSelectedCategories(response.data.categories || []);
      setSelectedRegions(response.data.regions || []);
      setSelectedTopics(response.data.topics || []);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        // Interests not found, set defaults
        setInterests(null);
        setSelectedCategories([]);
        setSelectedRegions([]);
        setSelectedTopics([]);
      } else {
        console.error('Error fetching user interests:', err);
        setError('Failed to load your preferences. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // Update user profile
      await userApi.updateProfile({ 
        display_name: displayName,
        preferences: preferences
      });

      // Update or create interests
      if (interests) {
        await userApi.updateInterests({
          categories: selectedCategories,
          regions: selectedRegions,
          topics: selectedTopics
        });
      } else {
        await userApi.createInterests({
          user_id: user?.id,
          categories: selectedCategories,
          regions: selectedRegions,
          topics: selectedTopics
        });
      }

      setSuccessMessage('Profile updated successfully!');
      
      // Refresh interests data
      fetchUserInterests();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region) 
        : [...prev, region]
    );
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };

  // Get subscription tier styles
  const tierStyle = user?.subscription_tier 
    ? subscriptionTierStyles[user.subscription_tier as keyof typeof subscriptionTierStyles] 
    : subscriptionTierStyles.free;

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.h1 
          className="text-3xl font-bold mb-8 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Profile
        </motion.h1>

        {/* Error and success messages */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" 
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" 
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="block sm:inline">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                  <FaUser className="mr-2 text-primary-600" />
                  Basic Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-500 mr-2" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      placeholder="Your display name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Subscription Tier</label>
                    <div className={`flex items-center p-3 rounded-md ${tierStyle.bg} ${tierStyle.border}`}>
                      <FaCrown className={`mr-2 ${tierStyle.icon}`} />
                      <span className={tierStyle.text}>
                        {user?.subscription_tier 
                          ? user.subscription_tier.charAt(0).toUpperCase() + user.subscription_tier.slice(1) 
                          : 'Free'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Contact support to change your subscription</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                  <FaCog className="mr-2 text-primary-600" />
                  App Preferences
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                    <div className="flex space-x-2">
                      <Button
                        variant={preferences.theme === 'light' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setPreferences({...preferences, theme: 'light'})}
                        icon={<FaSun />}
                      >
                        Light
                      </Button>
                      <Button
                        variant={preferences.theme === 'dark' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setPreferences({...preferences, theme: 'dark'})}
                        icon={<FaMoon />}
                      >
                        Dark
                      </Button>
                      <Button
                        variant={preferences.theme === 'system' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setPreferences({...preferences, theme: 'system'})}
                      >
                        System
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Toggle
                      enabled={preferences.notifications || false}
                      onChange={(enabled) => setPreferences({...preferences, notifications: enabled})}
                      label="Push Notifications"
                    />
                    <p className="text-sm text-gray-500 mt-1">Receive notifications for new articles</p>
                  </div>
                  
                  <div>
                    <Toggle
                      enabled={preferences.emailDigest || false}
                      onChange={(enabled) => setPreferences({...preferences, emailDigest: enabled})}
                      label="Email Digest"
                    />
                    <p className="text-sm text-gray-500 mt-1">Receive weekly email digest of top articles</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
                    <div className="flex space-x-2">
                      <Button
                        variant={preferences.fontSize === 'small' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setPreferences({...preferences, fontSize: 'small'})}
                      >
                        Small
                      </Button>
                      <Button
                        variant={preferences.fontSize === 'medium' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setPreferences({...preferences, fontSize: 'medium'})}
                      >
                        Medium
                      </Button>
                      <Button
                        variant={preferences.fontSize === 'large' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setPreferences({...preferences, fontSize: 'large'})}
                      >
                        Large
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                  <FaTags className="mr-2 text-primary-600" />
                  Content Preferences
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-3">Categories of Interest</label>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map(category => (
                        <motion.div
                          key={category}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <button
                            onClick={() => toggleCategory(category)}
                            className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                              selectedCategories.includes(category)
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <FaGlobe className="mr-2" />
                      Regions of Interest
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableRegions.map(region => (
                        <motion.div
                          key={region}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <button
                            onClick={() => toggleRegion(region)}
                            className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                              selectedRegions.includes(region)
                                ? 'bg-secondary-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {region}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <FaLightbulb className="mr-2" />
                      Topics of Interest
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTopics.map(topic => (
                        <motion.div
                          key={topic}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <button
                            onClick={() => toggleTopic(topic)}
                            className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                              selectedTopics.includes(topic)
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {topic.charAt(0).toUpperCase() + topic.slice(1)}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                  <FaBell className="mr-2 text-primary-600" />
                  Notification Preferences
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Toggle
                      enabled={preferences.newArticleNotifications || false}
                      onChange={(enabled) => setPreferences({...preferences, newArticleNotifications: enabled})}
                      label="New Article Notifications"
                    />
                    <p className="text-sm text-gray-500 mt-1">Get notified when new articles in your interests are published</p>
                  </div>
                  
                  <div>
                    <Toggle
                      enabled={preferences.commentNotifications || false}
                      onChange={(enabled) => setPreferences({...preferences, commentNotifications: enabled})}
                      label="Comment Notifications"
                    />
                    <p className="text-sm text-gray-500 mt-1">Get notified when someone replies to your comments</p>
                  </div>
                  
                  <div>
                    <Toggle
                      enabled={preferences.weeklyDigest || false}
                      onChange={(enabled) => setPreferences({...preferences, weeklyDigest: enabled})}
                      label="Weekly Digest"
                    />
                    <p className="text-sm text-gray-500 mt-1">Receive a weekly summary of top articles</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="flex justify-end mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleSaveProfile}
            disabled={isSaving}
            variant="primary"
            size="lg"
            icon={isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
