'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { userApi } from '@/lib/api';
import { FaUser, FaEnvelope, FaCrown, FaTags, FaGlobe, FaLightbulb, FaSpinner, FaSave } from 'react-icons/fa';

interface UserInterests {
  id: string;
  user_id: string;
  categories: string[];
  regions: string[];
  topics: string[];
}

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [interests, setInterests] = useState<UserInterests | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
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
      await userApi.updateProfile({ display_name: displayName });

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

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        {/* Error and success messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaUser className="mr-2 text-primary-600" />
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 mr-2" />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input bg-gray-100"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input"
                placeholder="Your display name"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Subscription Tier</label>
              <div className="flex items-center">
                <FaCrown className="text-gray-500 mr-2" />
                <input
                  type="text"
                  value={user?.subscription_tier ? user.subscription_tier.charAt(0).toUpperCase() + user.subscription_tier.slice(1) : ''}
                  disabled
                  className="input bg-gray-100"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Contact support to change your subscription</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaTags className="mr-2 text-primary-600" />
            Content Preferences
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-3">Categories of Interest</label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategories.includes(category)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-3 flex items-center">
                <FaGlobe className="mr-2" />
                Regions of Interest
              </label>
              <div className="flex flex-wrap gap-2">
                {availableRegions.map(region => (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedRegions.includes(region)
                        ? 'bg-secondary-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-3 flex items-center">
                <FaLightbulb className="mr-2" />
                Topics of Interest
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTopics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTopics.includes(topic)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="btn-primary flex items-center"
          >
            {isSaving ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

