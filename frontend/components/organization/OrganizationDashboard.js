import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import OrganizationMembers from './OrganizationMembers';
import OrganizationSettings from './OrganizationSettings';

export default function OrganizationDashboard() {
  const { user } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [activeTab, setActiveTab] = useState('members');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, this would fetch organization data from the API
    const fetchOrganization = async () => {
      try {
        // Mock data for demo
        setOrganization({
          id: '123',
          name: 'Acme Corporation',
          subscription: {
            plan: 'organization',
            seats: 10,
            usedSeats: 4,
            renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          members: [
            { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'member' },
            { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'member' },
            { id: '4', name: user?.displayName || 'Current User', email: user?.email || 'current@example.com', role: 'admin' },
          ],
        });
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load organization data');
        setIsLoading(false);
      }
    };

    if (user?.subscriptionTier === 'organization') {
      fetchOrganization();
    } else {
      setIsLoading(false);
      setError('You do not have access to organization features');
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-4 w-5/6"></div>
        <div className="h-6 bg-gray-200 rounded mb-4 w-4/6"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Organization Found</h2>
        <p className="text-gray-600 mb-6">
          You are not currently part of an organization.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{organization.name}</h2>
        
        <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
          {organization.subscription.usedSeats} / {organization.subscription.seats} Seats Used
        </div>
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('members')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'members'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>
      
      {activeTab === 'members' && (
        <OrganizationMembers 
          members={organization.members} 
          currentUserId={user?.id}
        />
      )}
      
      {activeTab === 'settings' && (
        <OrganizationSettings 
          organization={organization}
          isAdmin={organization.members.some(m => m.email === user?.email && m.role === 'admin')}
        />
      )}
    </div>
  );
}

