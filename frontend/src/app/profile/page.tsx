'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { useGetUserQuery, useUpdateUserPreferencesMutation } from '../../store/services/apiSlice';
import { updatePreferences } from '../../store/slices/authSlice';
import Card from '../../components/ui/Card';
import Link from 'next/link';
import { FiUser, FiMail, FiCreditCard } from 'react-icons/fi';
import UserSettingsPanel from '../../components/ui/UserSettingsPanel';
import { UserPreferences } from '../../types';

const categories = [
  { id: 'politics', name: 'Politics' },
  { id: 'economy', name: 'Economy' },
  { id: 'technology', name: 'Technology' },
  { id: 'science', name: 'Science' },
  { id: 'health', name: 'Health' },
  { id: 'sports', name: 'Sports' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'world', name: 'World' },
];

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading } = useGetUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  
  const [updateUserPreferences, { isLoading: isUpdating }] = useUpdateUserPreferencesMutation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSavePreferences = async (preferences: UserPreferences) => {
    try {
      await updateUserPreferences(preferences).unwrap();
      dispatch(updatePreferences(preferences));
    } catch (error) {
      console.error('Failed to update preferences', error);
      throw error;
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card variant="elevated" className="mb-8">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <FiUser size={48} />
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.name}
              </h1>
              <div className="flex items-center justify-center sm:justify-start mt-1 text-gray-500 dark:text-gray-400">
                <FiMail className="mr-1" />
                <span>{user?.email}</span>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light/20 text-primary">
                  {user?.subscription.charAt(0).toUpperCase() + user?.subscription.slice(1)} Subscription
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
        <button className="px-4 py-2 border-b-2 border-primary text-primary font-medium">
          Preferences
        </button>
        <Link href="/subscription" className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center">
          <FiCreditCard className="mr-1" size={16} />
          Subscription
        </Link>
      </div>

      {/* User Settings Panel */}
      <UserSettingsPanel
        preferences={user?.preferences || { categories: [], darkMode: false, emailNotifications: false }}
        categories={categories}
        onSave={handleSavePreferences}
      />
    </div>
  );
}
