'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiUsers, FiBarChart2, FiFileText, FiSettings, FiPlus, FiMail, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';

// Mock organization data
const mockOrganization = {
  id: '1',
  name: 'Acme Corporation',
  logo: 'https://images.unsplash.com/photo-1568122506084-57d12d22b683?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
  industry: 'Technology',
  size: '50-100',
  billingEmail: 'billing@acmecorp.com',
  subscription: {
    plan: 'Enterprise',
    seats: 25,
    usedSeats: 18,
    startDate: '2025-01-01T00:00:00Z',
    renewalDate: '2026-01-01T00:00:00Z',
  },
  createdAt: '2025-01-01T00:00:00Z',
};

// Mock members data
const mockMembers = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@acmecorp.com',
    role: 'admin',
    joinedAt: '2025-01-01T10:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.williams@acmecorp.com',
    role: 'admin',
    joinedAt: '2025-01-02T14:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@acmecorp.com',
    role: 'member',
    joinedAt: '2025-01-05T09:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@acmecorp.com',
    role: 'member',
    joinedAt: '2025-01-10T11:20:00Z',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '5',
    name: 'David Park',
    email: 'david.park@acmecorp.com',
    role: 'viewer',
    joinedAt: '2025-02-15T16:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Mock analytics data
const mockAnalytics = {
  totalReads: 1248,
  topCategories: [
    { name: 'Technology', percentage: 45 },
    { name: 'Economy', percentage: 30 },
    { name: 'Geopolitics', percentage: 15 },
    { name: 'Environment', percentage: 10 },
  ],
  readsByDay: [
    { day: 'Mon', count: 120 },
    { day: 'Tue', count: 150 },
    { day: 'Wed', count: 180 },
    { day: 'Thu', count: 220 },
    { day: 'Fri', count: 190 },
    { day: 'Sat', count: 110 },
    { day: 'Sun', count: 90 },
  ],
  mostReadArticles: [
    { id: '1', title: 'Global Economic Summit Addresses Climate Change Initiatives', reads: 78 },
    { id: '2', title: 'New Technology Breakthrough in Quantum Computing', reads: 65 },
    { id: '3', title: 'Diplomatic Relations Strengthen Between Eastern Nations', reads: 52 },
  ],
};

// Tabs for organization sections
const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
  { id: 'members', label: 'Team Members', icon: <FiUsers /> },
  { id: 'articles', label: 'Shared Articles', icon: <FiFileText /> },
  { id: 'settings', label: 'Settings', icon: <FiSettings /> },
];

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Organization header */}
      <div className="glass-card mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Organization logo */}
          <div className="relative h-24 w-24 rounded-lg overflow-hidden border-4 border-white dark:border-dark-100 shadow-lg">
            <Image
              src={mockOrganization.logo}
              alt={mockOrganization.name}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Organization info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{mockOrganization.name}</h1>
              <span className="px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 rounded text-xs font-medium">
                {mockOrganization.subscription.plan}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{mockOrganization.industry} · {mockOrganization.size} employees</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Member since:</span>{' '}
                <span className="font-medium">{formatDate(mockOrganization.createdAt)}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Renewal date:</span>{' '}
                <span className="font-medium">{formatDate(mockOrganization.subscription.renewalDate)}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Seats:</span>{' '}
                <span className="font-medium">{mockOrganization.subscription.usedSeats}/{mockOrganization.subscription.seats} used</span>
              </div>
            </div>
          </div>
          
          {/* Edit organization button */}
          <div className="md:self-start">
            <button className="btn btn-ghost flex items-center">
              <FiEdit className="mr-1.5" />
              Edit Organization
            </button>
          </div>
        </div>
      </div>

      {/* Organization content */}
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
          </nav>
        </aside>
        
        {/* Main content area */}
        <div className="md:col-span-3">
          {/* Dashboard tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card">
                  <h3 className="text-lg font-medium mb-2">Total Reads</h3>
                  <p className="text-3xl font-bold">{mockAnalytics.totalReads}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last 30 days
                  </p>
                </div>
                
                <div className="glass-card">
                  <h3 className="text-lg font-medium mb-2">Team Members</h3>
                  <p className="text-3xl font-bold">{mockMembers.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mockOrganization.subscription.usedSeats}/{mockOrganization.subscription.seats} seats used
                  </p>
                </div>
                
                <div className="glass-card">
                  <h3 className="text-lg font-medium mb-2">Subscription</h3>
                  <p className="text-xl font-bold">{mockOrganization.subscription.plan}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Renews on {formatDate(mockOrganization.subscription.renewalDate)}
                  </p>
                </div>
              </div>
              
              {/* Reading activity chart */}
              <div className="glass-card">
                <h3 className="text-lg font-medium mb-4">Reading Activity</h3>
                
                <div className="h-64 flex items-end justify-between space-x-2">
                  {mockAnalytics.readsByDay.map((day) => (
                    <div key={day.day} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-primary-500 dark:bg-primary-600 rounded-t-md transition-all duration-500"
                        style={{ height: `${(day.count / 220) * 100}%` }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {day.day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Top categories and most read articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card">
                  <h3 className="text-lg font-medium mb-4">Top Categories</h3>
                  
                  <div className="space-y-4">
                    {mockAnalytics.topCategories.map((category) => (
                      <div key={category.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{category.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="glass-card">
                  <h3 className="text-lg font-medium mb-4">Most Read Articles</h3>
                  
                  <div className="space-y-4">
                    {mockAnalytics.mostReadArticles.map((article, index) => (
                      <div key={article.id} className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-medium mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <Link href={`/article/${article.id}`} className="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            {article.title}
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {article.reads} reads
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link href="/search" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      View all articles
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Export data */}
              <div className="glass-card">
                <h3 className="text-lg font-medium mb-4">Reports</h3>
                
                <div className="flex flex-wrap gap-4">
                  <button className="btn btn-ghost flex items-center">
                    <FiDownload className="mr-1.5" />
                    Export Reading Analytics
                  </button>
                  <button className="btn btn-ghost flex items-center">
                    <FiDownload className="mr-1.5" />
                    Export Member Activity
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Members tab */}
          {activeTab === 'members' && (
            <div className="glass-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Team Members</h2>
                <button className="btn btn-primary flex items-center">
                  <FiPlus className="mr-1.5" />
                  Invite Member
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Joined</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMembers.map((member) => (
                      <tr key={member.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-200">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image
                                className="h-10 w-10 rounded-full"
                                src={member.avatar}
                                alt={member.name}
                                width={40}
                                height={40}
                              />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{member.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{member.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.role === 'admin'
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                              : member.role === 'member'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{formatDate(member.joinedAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400" aria-label="Edit member">
                              <FiEdit />
                            </button>
                            <button className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" aria-label="Remove member">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mockOrganization.subscription.usedSeats} of {mockOrganization.subscription.seats} seats used
                  </p>
                  <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    Upgrade to add more seats
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Shared Articles tab */}
          {activeTab === 'articles' && (
            <div className="glass-card">
              <h2 className="text-xl font-semibold mb-6">Shared Articles</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Articles shared within your organization.
              </p>
              
              {/* This would be populated with actual shared articles in a real implementation */}
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  This section would display articles shared within your organization.
                </p>
                <Link href="/dashboard">
                  <button className="btn btn-primary">
                    Browse Articles
                  </button>
                </Link>
              </div>
            </div>
          )}
          
          {/* Settings tab */}
          {activeTab === 'settings' && (
            <div className="glass-card">
              <h2 className="text-xl font-semibold mb-6">Organization Settings</h2>
              
              <div className="space-y-8">
                {/* Organization details */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Organization Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        className="input w-full"
                        defaultValue={mockOrganization.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Industry
                      </label>
                      <select className="input w-full">
                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Healthcare</option>
                        <option>Education</option>
                        <option>Manufacturing</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Size
                      </label>
                      <select className="input w-full">
                        <option>1-10</option>
                        <option>11-50</option>
                        <option selected>50-100</option>
                        <option>101-500</option>
                        <option>501-1000</option>
                        <option>1000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Billing Email
                      </label>
                      <input
                        type="email"
                        className="input w-full"
                        defaultValue={mockOrganization.billingEmail}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Subscription management */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-4">Subscription Management</h3>
                  
                  <div className="bg-gray-50 dark:bg-dark-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Current Plan</span>
                      <span className="font-medium">{mockOrganization.subscription.plan}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Seats</span>
                      <span className="font-medium">{mockOrganization.subscription.seats}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Renewal Date</span>
                      <span className="font-medium">{formatDate(mockOrganization.subscription.renewalDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <button className="btn btn-primary">
                      Upgrade Plan
                    </button>
                    <button className="btn btn-ghost">
                      Add More Seats
                    </button>
                    <button className="text-red-600 dark:text-red-400 hover:underline text-sm">
                      Cancel Subscription
                    </button>
                  </div>
                </div>
                
                {/* Team settings */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-4">Team Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="allow-sharing"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="allow-sharing" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Allow members to share articles with the team
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="allow-comments"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="allow-comments" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Allow members to comment on articles
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="allow-invites"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allow-invites" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Allow admins to invite new members
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Danger zone */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-4 text-red-600 dark:text-red-400">Danger Zone</h3>
                  
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="text-base font-medium text-red-800 dark:text-red-300 mb-2">Delete Organization</h4>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                      Once you delete an organization, there is no going back. Please be certain.
                    </p>
                    <button className="btn bg-red-600 hover:bg-red-700 text-white">
                      Delete Organization
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
        </div>
      </div>
    </div>
  );
}

