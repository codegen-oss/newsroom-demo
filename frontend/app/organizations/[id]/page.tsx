'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { organizationsApi, userApi } from '@/lib/api';
import { FaUsers, FaUserPlus, FaCrown, FaTrash, FaEdit, FaCreditCard, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface Organization {
  id: string;
  name: string;
  subscription: {
    tier: string;
    status: string;
    price: number;
    features: string[];
  };
  created_at: string;
  members: Member[];
}

interface Member {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  user?: {
    id: string;
    email: string;
    display_name: string;
  };
}

interface User {
  id: string;
  email: string;
  display_name: string;
}

export default function OrganizationDetail() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orgId = params?.id as string;
  
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Invite member state
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  
  // Subscription state
  const [showUpgradeForm, setShowUpgradeForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Fetch organization details
    if (isAuthenticated && orgId) {
      fetchOrganizationDetails();
    }
  }, [isAuthenticated, authLoading, router, orgId]);

  const fetchOrganizationDetails = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Get organization details
      const orgResponse = await organizationsApi.getOrganization(orgId);
      setOrganization(orgResponse.data);
      
      // Get members with user details
      const membersResponse = await organizationsApi.getMembers(orgId);
      setMembers(membersResponse.data);
      
      // Check if current user is admin
      const currentUserMember = membersResponse.data.find(
        (member: Member) => member.user_id === user?.id
      );
      setIsAdmin(currentUserMember?.role === 'admin');
      
    } catch (err) {
      console.error('Error fetching organization details:', err);
      setError('Failed to load organization details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    setInviteError('');
    
    try {
      await organizationsApi.inviteMember(orgId, {
        email: inviteEmail,
        role: inviteRole
      });
      
      // Reset form and refresh members
      setInviteEmail('');
      setInviteRole('member');
      setShowInviteForm(false);
      
      // Refresh members list
      const membersResponse = await organizationsApi.getMembers(orgId);
      setMembers(membersResponse.data);
      
    } catch (err: any) {
      console.error('Error inviting member:', err);
      setInviteError(err.response?.data?.detail || 'Failed to invite member. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }
    
    try {
      await organizationsApi.removeMember(orgId, userId);
      
      // Refresh members list
      const membersResponse = await organizationsApi.getMembers(orgId);
      setMembers(membersResponse.data);
      
    } catch (err) {
      console.error('Error removing member:', err);
      alert('Failed to remove member. Please try again.');
    }
  };

  const handleUpdateMemberRole = async (userId: string, newRole: string) => {
    try {
      await organizationsApi.updateMember(orgId, userId, { role: newRole });
      
      // Refresh members list
      const membersResponse = await organizationsApi.getMembers(orgId);
      setMembers(membersResponse.data);
      
    } catch (err) {
      console.error('Error updating member role:', err);
      alert('Failed to update member role. Please try again.');
    }
  };

  const handleUpgradeSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpgrading(true);
    setUpgradeError('');
    
    try {
      await organizationsApi.updateOrganization(orgId, {
        subscription: {
          tier: selectedTier,
          status: 'active',
          price: selectedTier === 'basic' ? 9.99 : selectedTier === 'premium' ? 29.99 : 99.99,
          features: getSubscriptionFeatures(selectedTier)
        }
      });
      
      // Reset form and refresh organization
      setSelectedTier('');
      setShowUpgradeForm(false);
      
      // Refresh organization details
      const orgResponse = await organizationsApi.getOrganization(orgId);
      setOrganization(orgResponse.data);
      
    } catch (err: any) {
      console.error('Error upgrading subscription:', err);
      setUpgradeError(err.response?.data?.detail || 'Failed to upgrade subscription. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const getSubscriptionFeatures = (tier: string) => {
    if (tier === 'basic') {
      return [
        'Up to 5 members',
        'Basic content access',
        'Standard support'
      ];
    } else if (tier === 'premium') {
      return [
        'Up to 20 members',
        'Premium content access',
        'Priority support',
        'Custom branding'
      ];
    } else if (tier === 'enterprise') {
      return [
        'Unlimited members',
        'All content access',
        '24/7 dedicated support',
        'Custom branding',
        'API access',
        'Advanced analytics'
      ];
    }
    return [];
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
          <div className="mt-4">
            <Link href="/organizations" className="text-primary-600 hover:text-primary-800">
              &larr; Back to Organizations
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Organization not found.</p>
            <div className="mt-4">
              <Link href="/organizations" className="text-primary-600 hover:text-primary-800">
                &larr; Back to Organizations
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/organizations" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6">
          <FaArrowLeft className="mr-2" /> Back to Organizations
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">{organization.name}</h1>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {organization.subscription?.tier 
                  ? organization.subscription.tier.charAt(0).toUpperCase() + organization.subscription.tier.slice(1) 
                  : 'Basic'} Plan
              </div>
            </div>
            
            {isAdmin && (
              <button 
                onClick={() => setShowUpgradeForm(true)}
                className="mt-4 md:mt-0 btn-secondary flex items-center gap-2"
              >
                <FaCreditCard /> Manage Subscription
              </button>
            )}
          </div>
          
          {/* Subscription details */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-medium text-gray-800 mb-2">
              {organization.subscription?.tier 
                ? organization.subscription.tier.charAt(0).toUpperCase() + organization.subscription.tier.slice(1) 
                : 'Basic'} Plan Features
            </h3>
            <ul className="text-gray-600 space-y-2">
              {organization.subscription?.features ? (
                organization.subscription.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))
              ) : (
                getSubscriptionFeatures('basic').map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))
              )}
            </ul>
            <p className="text-sm text-gray-500 mt-2">
              {organization.subscription?.price 
                ? `$${organization.subscription.price}/month` 
                : 'Free tier'}
            </p>
          </div>
        </div>
        
        {/* Members section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <FaUsers className="mr-2" /> Members
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your organization members and their roles
              </p>
            </div>
            
            {isAdmin && (
              <button 
                onClick={() => setShowInviteForm(true)}
                className="mt-4 md:mt-0 btn-primary flex items-center gap-2"
              >
                <FaUserPlus /> Invite Member
              </button>
            )}
          </div>
          
          {/* Invite form */}
          {showInviteForm && (
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium text-gray-800 mb-4">Invite New Member</h3>
              
              {inviteError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{inviteError}</span>
                </div>
              )}
              
              <form onSubmit={handleInviteMember}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => setShowInviteForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isInviting}
                  >
                    {isInviting ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Upgrade subscription form */}
          {showUpgradeForm && (
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium text-gray-800 mb-4">Upgrade Subscription</h3>
              
              {upgradeError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{upgradeError}</span>
                </div>
              )}
              
              <form onSubmit={handleUpgradeSubscription}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className={`p-4 border rounded-md ${selectedTier === 'basic' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Basic</h4>
                      <div className="text-lg font-bold">$9.99<span className="text-sm font-normal text-gray-500">/mo</span></div>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      {getSubscriptionFeatures('basic').map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-4 w-4 text-green-500 mr-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className={`w-full py-2 rounded-md ${selectedTier === 'basic' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                      onClick={() => setSelectedTier('basic')}
                    >
                      {selectedTier === 'basic' ? 'Selected' : 'Select'}
                    </button>
                  </div>
                  
                  <div className={`p-4 border rounded-md ${selectedTier === 'premium' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Premium</h4>
                      <div className="text-lg font-bold">$29.99<span className="text-sm font-normal text-gray-500">/mo</span></div>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      {getSubscriptionFeatures('premium').map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-4 w-4 text-green-500 mr-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className={`w-full py-2 rounded-md ${selectedTier === 'premium' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                      onClick={() => setSelectedTier('premium')}
                    >
                      {selectedTier === 'premium' ? 'Selected' : 'Select'}
                    </button>
                  </div>
                  
                  <div className={`p-4 border rounded-md ${selectedTier === 'enterprise' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Enterprise</h4>
                      <div className="text-lg font-bold">$99.99<span className="text-sm font-normal text-gray-500">/mo</span></div>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 mb-4">
                      {getSubscriptionFeatures('enterprise').map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-4 w-4 text-green-500 mr-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className={`w-full py-2 rounded-md ${selectedTier === 'enterprise' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                      onClick={() => setSelectedTier('enterprise')}
                    >
                      {selectedTier === 'enterprise' ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => setShowUpgradeForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isUpgrading || !selectedTier}
                  >
                    {isUpgrading ? 'Updating...' : 'Update Subscription'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Members list */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  {isAdmin && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {member.user?.display_name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.user?.display_name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {member.user?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {member.role === 'admin' && <FaCrown className="text-yellow-500 mr-1" />}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.role === 'admin' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : member.role === 'viewer'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </span>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {member.user_id !== user?.id ? (
                          <div className="flex justify-end space-x-2">
                            <select
                              className="text-xs border border-gray-300 rounded-md"
                              value={member.role}
                              onChange={(e) => handleUpdateMemberRole(member.user_id, e.target.value)}
                            >
                              <option value="admin">Admin</option>
                              <option value="member">Member</option>
                              <option value="viewer">Viewer</option>
                            </select>
                            <button
                              onClick={() => handleRemoveMember(member.user_id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500">You</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Organization content section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Organization Content</h2>
              <p className="text-gray-600 mt-1">
                Manage content specific to your organization
              </p>
            </div>
            
            {isAdmin && (
              <Link 
                href={`/articles/create?organization=${orgId}`}
                className="mt-4 md:mt-0 btn-primary"
              >
                Create Content
              </Link>
            )}
          </div>
          
          <div className="text-center py-8">
            <p className="text-gray-600">
              Organization-specific content will appear here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

