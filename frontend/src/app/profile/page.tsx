'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiUser, FiSettings, FiCreditCard, FiBookmark, FiClock, FiEdit, FiBell, FiGlobe, FiMoon, FiSun, FiLogOut } from 'react-icons/fi';

// Mock user data
const mockUser = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  subscriptionTier: 'individual',
  subscriptionStatus: 'active',
  subscriptionExpiry: '2025-12-31T23:59:59Z',
  createdAt: '2024-01-15T10:30:00Z',
  lastLogin: '2025-05-08T14:22:10Z',
  savedArticles: 24,
  readingHistory: 87,
};

// Tabs for profile sections
const tabs = [
  { id: 'profile', label: 'Profile', icon: <FiUser /> },
  { id: 'subscription', label: 'Subscription', icon: <FiCreditCard /> },
  { id: 'saved', label: 'Saved Articles', icon: <FiBookmark /> },
  { id: 'history', label: 'Reading History', icon: <FiClock /> },
  { id: 'settings', label: 'Settings', icon: <FiSettings /> },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState('english');

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Subscription tier display
  const getSubscriptionBadge = () => {
    switch (mockUser.subscriptionTier) {
      case 'free':
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs font-medium">Free</span>;
      case 'individual':
        return <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded text-xs font-medium">Individual</span>;
      case 'organization':
        return <span className="px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 rounded text-xs font-medium">Organization</span>;
      default:
        return null;
    }
  };

  // Subscription status display
  const getStatusBadge = () => {
    switch (mockUser.subscriptionStatus) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs font-medium">Active</span>;
      case 'expired':
        return <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-xs font-medium">Expired</span>;
      case 'trial':
        return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium">Trial</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="glass-card mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile image */}
          <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-dark-100 shadow-lg">
            <Image
              src={mockUser.profileImage}
              alt={mockUser.name}
              fill
              className="object-cover"
            />
          </div>
          
          {/* User info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{mockUser.name}</h1>
              {getSubscriptionBadge()}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{mockUser.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Member since:</span>{' '}
                <span className="font-medium">{formatDate(mockUser.createdAt)}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Last login:</span>{' '}
                <span className="font-medium">{formatDate(mockUser.lastLogin)}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Articles read:</span>{' '}
                <span className="font-medium">{mockUser.readingHistory}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Saved articles:</span>{' '}
                <span className="font-medium">{mockUser.savedArticles}</span>
              </div>
            </div>
          </div>
          
          {/* Edit profile button */}
          <div className="md:self-start">
            <button className="btn btn-ghost flex items-center">
              <FiEdit className="mr-1.5" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar navigation */}
        <aside className="md:col-span-1">
          <nav className="glass-card">
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-200'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full flex items-center px-4 py-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                <FiLogOut className="mr-3" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </nav>
        </aside>
        
        {/* Main content area */}
        <div className="md:col-span-3">
          {/* Profile tab */}
          {activeTab === 'profile' && (
            <div className="glass-card">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      defaultValue={mockUser.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="input w-full"
                      defaultValue={mockUser.email}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="input w-full h-24"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Geopolitics', 'Economy', 'Technology', 'Environment', 'Science', 'Health', 'Culture'].map((interest) => (
                      <label key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          defaultChecked={['Geopolitics', 'Economy', 'Technology'].includes(interest)}
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Subscription tab */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {/* Current plan */}
              <div className="glass-card">
                <h2 className="text-xl font-semibold mb-6">Current Subscription</h2>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-medium">Individual Plan</h3>
                      {getStatusBadge()}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      $9.99/month, billed monthly
                    </p>
                  </div>
                  <button className="btn btn-ghost">
                    Change Plan
                  </button>
                </div>
                
                <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Next billing date</span>
                    <span className="font-medium">June 15, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Payment method</span>
                    <span className="font-medium">•••• 4242</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="btn btn-ghost">
                    Update Payment Method
                  </button>
                  <button className="text-red-600 dark:text-red-400 hover:underline text-sm">
                    Cancel Subscription
                  </button>
                </div>
              </div>
              
              {/* Available plans */}
              <div className="glass-card">
                <h2 className="text-xl font-semibold mb-6">Available Plans</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Free plan */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">Free</h3>
                    <p className="text-2xl font-bold mb-4">$0<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span></p>
                    
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">5 articles per day</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">Basic personalization</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">Standard news updates</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Ad-free experience</span>
                      </li>
                    </ul>
                    
                    <button className="btn btn-ghost w-full" disabled>
                      Current Plan
                    </button>
                  </div>
                  
                  {/* Individual plan */}
                  <div className="border-2 border-primary-500 dark:border-primary-400 rounded-lg p-6 relative">
                    <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                      CURRENT
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2">Individual</h3>
                    <p className="text-2xl font-bold mb-4">$9.99<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span></p>
                    
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">Unlimited articles</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">Advanced personalization</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">Ad-free experience</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">Premium content access</span>
                      </li>
                    </ul>
                    
                    <button className="btn btn-primary w-full" disabled>
                      Current Plan
                    </button>
                  </div>
                  
                  {/* Organization plan */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-2">Organization</h3>
                    <p className="text-2xl font-bold mb-4">$49<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span></p>
                    
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">All Individual features</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">Team sharing capabilities</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">Collaborative workspaces</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">API access</span>
                      </li>
                    </ul>
                    
                    <button className="btn btn-ghost w-full">
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings tab */}
          {activeTab === 'settings' && (
            <div className="glass-card">
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              
              <div className="space-y-8">
                {/* Appearance */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Appearance</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
                    <div className="flex items-center">
                      {darkMode ? <FiMoon className="mr-3" /> : <FiSun className="mr-3" />}
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {darkMode ? 'Currently using dark mode' : 'Currently using light mode'}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
                
                {/* Notifications */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
                      <div className="flex items-center">
                        <FiBell className="mr-3" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive news updates and recommendations via email
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
                      <div className="flex items-center">
                        <FiBell className="mr-3" />
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive breaking news alerts on your device
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={pushNotifications}
                          onChange={() => setPushNotifications(!pushNotifications)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Language */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Language</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
                    <div className="flex items-center">
                      <FiGlobe className="mr-3" />
                      <div>
                        <p className="font-medium">Preferred Language</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Select your preferred language for the application
                        </p>
                      </div>
                    </div>
                    <select
                      className="input bg-white dark:bg-dark-100"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="chinese">Chinese</option>
                    </select>
                  </div>
                </div>
                
                {/* Account actions */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                  
                  <div className="space-y-4">
                    <button className="btn btn-ghost text-gray-700 dark:text-gray-300">
                      Change Password
                    </button>
                    
                    <button className="text-red-600 dark:text-red-400 hover:underline">
                      Delete Account
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="btn btn-primary">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Saved Articles tab */}
          {activeTab === 'saved' && (
            <div className="glass-card">
              <h2 className="text-xl font-semibold mb-6">Saved Articles</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You have saved {mockUser.savedArticles} articles for later reading.
              </p>
              
              {/* This would be populated with actual saved articles in a real implementation */}
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This section would display your saved articles.
                </p>
                <Link href="/dashboard">
                  <button className="btn btn-primary">
                    Browse Articles
                  </button>
                </Link>
              </div>
            </div>
          )}
          
          {/* Reading History tab */}
          {activeTab === 'history' && (
            <div className="glass-card">
              <h2 className="text-xl font-semibold mb-6">Reading History</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You have read {mockUser.readingHistory} articles.
              </p>
              
              {/* This would be populated with actual reading history in a real implementation */}
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This section would display your reading history.
                </p>
                <Link href="/dashboard">
                  <button className="btn btn-primary">
                    Browse Articles
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

