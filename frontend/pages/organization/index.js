import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../../contexts/AuthContext';
import OrganizationDashboard from '../../components/organization/OrganizationDashboard';

export default function OrganizationPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated or not an organization member
    if (!loading && (!isAuthenticated || user?.subscriptionTier !== 'organization')) {
      router.push('/profile/subscription');
    }
  }, [isAuthenticated, loading, router, user]);

  if (loading || !isAuthenticated || user?.subscriptionTier !== 'organization') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-4 w-5/6"></div>
          <div className="h-6 bg-gray-200 rounded mb-4 w-4/6"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Organization - News Room</title>
        <meta name="description" content="Manage your organization on News Room" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Organization</h1>
        </div>
        
        <OrganizationDashboard />
      </div>
    </>
  );
}

