'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { organizationsApi } from '@/lib/api';
import { FaPlus, FaSpinner, FaUsers, FaBuilding, FaCreditCard } from 'react-icons/fa';
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
}

export default function Organizations() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Fetch organizations
    if (isAuthenticated) {
      fetchOrganizations();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await organizationsApi.getOrganizations();
      setOrganizations(response.data);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError('Failed to load organizations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionBadgeColor = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'bg-green-100 text-green-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'enterprise':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Organizations</h1>
            <p className="text-gray-600">
              Manage your organizations and team memberships
            </p>
          </div>
          
          <Link 
            href="/organizations/create" 
            className="mt-4 md:mt-0 btn-primary flex items-center gap-2"
          >
            <FaPlus /> Create Organization
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-primary-600" />
          </div>
        ) : (
          <>
            {/* Organizations list */}
            {organizations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                  <div key={org.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">{org.name}</h2>
                      
                      <div className="flex items-center mb-4">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getSubscriptionBadgeColor(org.subscription?.tier || 'basic')}`}>
                          {org.subscription?.tier ? org.subscription.tier.charAt(0).toUpperCase() + org.subscription.tier.slice(1) : 'Basic'} Plan
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <FaUsers className="mr-2" />
                          <span>Members</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaBuilding className="mr-2" />
                          <span>Organization Content</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaCreditCard className="mr-2" />
                          <span>
                            {org.subscription?.price 
                              ? `$${org.subscription.price}/month` 
                              : 'Free'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <Link 
                          href={`/organizations/${org.id}`}
                          className="btn-secondary w-full text-center"
                        >
                          Manage Organization
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <FaBuilding className="mx-auto text-5xl text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No Organizations Yet</h2>
                <p className="text-gray-600 mb-6">
                  Create your first organization to collaborate with your team
                </p>
                <Link 
                  href="/organizations/create" 
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <FaPlus /> Create Organization
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

