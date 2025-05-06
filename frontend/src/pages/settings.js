import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import UserSettingsForm from '../components/UserPreferences/UserSettingsForm';
import InterestSelector from '../components/UserPreferences/InterestSelector';
import SubscriptionTierSelector from '../components/UserPreferences/SubscriptionTierSelector';

const SettingsPage = () => {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, updateUserProfile } = useAuth();
  const { 
    interests, 
    loading: preferencesLoading, 
    saveInterests,
    addCategory, 
    removeCategory,
    addRegion, 
    removeRegion,
    addTopic, 
    removeTopic
  } = useUserPreferences();
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);
  
  const handleSaveInterests = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      // If interests don't exist yet, create them with empty arrays
      if (!interests) {
        await saveInterests({
          categories: [],
          regions: [],
          topics: []
        });
      }
      
      setMessage({ type: 'success', text: 'Preferences saved successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save preferences' });
    } finally {
      setSaving(false);
    }
  };
  
  const handleSubscriptionChange = async (tier) => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      
      await updateUserProfile({ subscription_tier: tier });
      
      setMessage({ type: 'success', text: 'Subscription updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update subscription' });
    } finally {
      setSaving(false);
    }
  };
  
  if (authLoading || preferencesLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Settings</h1>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserSettingsForm />
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Interests & Preferences</h3>
              
              {interests ? (
                <>
                  <InterestSelector
                    title="Categories"
                    items={interests.categories || []}
                    selectedItems={interests.categories || []}
                    onAdd={addCategory}
                    onRemove={removeCategory}
                  />
                  
                  <InterestSelector
                    title="Regions"
                    items={interests.regions || []}
                    selectedItems={interests.regions || []}
                    onAdd={addRegion}
                    onRemove={removeRegion}
                  />
                  
                  <InterestSelector
                    title="Topics"
                    items={interests.topics || []}
                    selectedItems={interests.topics || []}
                    onAdd={addTopic}
                    onRemove={removeTopic}
                  />
                </>
              ) : (
                <button
                  onClick={handleSaveInterests}
                  disabled={saving}
                  className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    saving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? 'Setting up...' : 'Set Up Preferences'}
                </button>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Subscription</h3>
              
              <SubscriptionTierSelector
                selectedTier={user?.subscription_tier || 'free'}
                onChange={handleSubscriptionChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

