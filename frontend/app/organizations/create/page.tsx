'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { organizationsApi } from '@/lib/api';
import { FaBuilding, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function CreateOrganization() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await organizationsApi.createOrganization({
        name,
        subscription: {
          tier: 'basic',
          status: 'active'
        }
      });
      
      // Redirect to organizations page
      router.push('/organizations');
    } catch (err: any) {
      console.error('Error creating organization:', err);
      setError(err.response?.data?.detail || 'Failed to create organization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/organizations" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6">
          <FaArrowLeft className="mr-2" /> Back to Organizations
        </Link>
        
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <FaBuilding className="mx-auto text-5xl text-primary-600 mb-4" />
            <h1 className="text-3xl font-bold">Create New Organization</h1>
            <p className="text-gray-600 mt-2">
              Set up your team workspace for collaboration
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Organization Name*
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter organization name"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe your organization"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Basic Plan Features</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Up to 5 team members
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Basic content access
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Standard support
                </li>
              </ul>
              <p className="text-sm text-gray-500 mt-2">
                You can upgrade your plan anytime after creation.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Organization'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

