import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useOrganization } from '../contexts/OrganizationContext';
import OrganizationCard from '../components/Organization/OrganizationCard';
import OrganizationForm from '../components/Organization/OrganizationForm';
import MembersList from '../components/Organization/MembersList';

const OrganizationsPage = () => {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { 
    organizations,
    currentOrganization,
    members,
    loading: orgLoading,
    error,
    selectOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    addMember,
    updateMember,
    removeMember,
    isOrgAdmin
  } = useOrganization();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);
  
  const handleCreateOrg = async (orgData) => {
    try {
      setMessage({ type: '', text: '' });
      await createOrganization(orgData);
      setShowCreateForm(false);
      setMessage({ type: 'success', text: 'Organization created successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: error || 'Failed to create organization' });
    }
  };
  
  const handleUpdateOrg = async (orgData) => {
    try {
      setMessage({ type: '', text: '' });
      await updateOrganization(editingOrg.id, orgData);
      setEditingOrg(null);
      setMessage({ type: 'success', text: 'Organization updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: error || 'Failed to update organization' });
    }
  };
  
  const handleDeleteOrg = async (orgId) => {
    if (!window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }
    
    try {
      setMessage({ type: '', text: '' });
      await deleteOrganization(orgId);
      setMessage({ type: 'success', text: 'Organization deleted successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: error || 'Failed to delete organization' });
    }
  };
  
  if (authLoading || orgLoading) {
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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          
          <button
            onClick={() => {
              setEditingOrg(null);
              setShowCreateForm(!showCreateForm);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showCreateForm ? 'Cancel' : 'Create Organization'}
          </button>
        </div>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Organization</h2>
            <OrganizationForm 
              onSubmit={handleCreateOrg}
              buttonText="Create Organization"
            />
          </div>
        )}
        
        {editingOrg && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Edit Organization</h2>
            <OrganizationForm 
              organization={editingOrg}
              onSubmit={handleUpdateOrg}
              buttonText="Update Organization"
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Your Organizations</h2>
              
              {organizations.length > 0 ? (
                <div className="space-y-4">
                  {organizations.map((org) => (
                    <OrganizationCard
                      key={org.id}
                      organization={org}
                      isActive={currentOrganization?.id === org.id}
                      onClick={() => selectOrganization(org.id)}
                      onEdit={() => {
                        setShowCreateForm(false);
                        setEditingOrg(org);
                      }}
                      onDelete={() => handleDeleteOrg(org.id)}
                      isAdmin={isOrgAdmin(org.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any organizations yet.</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Create Your First Organization
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {currentOrganization ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{currentOrganization.name}</h2>
                      <p className="text-gray-600 mt-1">
                        {currentOrganization.description || 'No description provided'}
                      </p>
                    </div>
                    
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {currentOrganization.subscription.tier.charAt(0).toUpperCase() + 
                       currentOrganization.subscription.tier.slice(1)} Plan
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-500">Subscription</h3>
                      <p className="mt-1 text-lg font-semibold">
                        {currentOrganization.subscription.tier.charAt(0).toUpperCase() + 
                         currentOrganization.subscription.tier.slice(1)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-500">Seats</h3>
                      <p className="mt-1 text-lg font-semibold">
                        {currentOrganization.subscription.seats}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-500">Billing Cycle</h3>
                      <p className="mt-1 text-lg font-semibold">
                        {currentOrganization.subscription.billing_cycle.charAt(0).toUpperCase() + 
                         currentOrganization.subscription.billing_cycle.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <MembersList
                  members={members}
                  onUpdateMember={(userId, data) => updateMember(currentOrganization.id, userId, data)}
                  onRemoveMember={(userId) => removeMember(currentOrganization.id, userId)}
                  onAddMember={(data) => addMember(currentOrganization.id, data)}
                  isAdmin={isOrgAdmin(currentOrganization.id)}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">
                    {organizations.length > 0 
                      ? 'Select an organization to view details' 
                      : 'Create an organization to get started'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationsPage;

