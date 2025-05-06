import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import ProfileForm from '../../components/profile/ProfileForm';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
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
        <title>Profile - News Room</title>
        <meta name="description" content="Manage your News Room profile and preferences" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Your Profile</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-1">
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 rounded-md bg-primary-50 text-primary-700 font-medium"
                >
                  Profile Settings
                </Link>
                <Link 
                  href="/profile/subscription" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Subscription
                </Link>
                {user?.subscriptionTier === 'organization' && (
                  <Link 
                    href="/organization" 
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Organization
                  </Link>
                )}
              </nav>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <ProfileForm />
          </div>
        </div>
      </div>
    </>
  );
}

