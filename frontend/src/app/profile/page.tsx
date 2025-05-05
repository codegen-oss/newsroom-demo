'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { useGetUserQuery, useUpdateUserPreferencesMutation } from '../../store/services/apiSlice';
import { updatePreferences } from '../../store/slices/authSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { FiUser, FiMail, FiSettings, FiCreditCard, FiAlertCircle, FiCheck } from 'react-icons/fi';
import Link from 'next/link';

const categories = [
  'Politics',
  'Economy',
  'Technology',
  'Science',
  'Health',
  'Sports',
  'Entertainment',
  'World',
];

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { data: userData, isLoading } = useGetUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  
  const [updateUserPreferences, { isLoading: isUpdating }] = useUpdateUserPreferencesMutation();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Set initial values from user data
  useEffect(() => {
    if (user?.preferences) {
      setSelectedCategories(user.preferences.categories || []);
      setDarkMode(user.preferences.darkMode || false);
      setEmailNotifications(user.preferences.emailNotifications || false);
    }
  }, [user]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSavePreferences = async () => {
    try {
      const updatedPreferences = {
        categories: selectedCategories,
        darkMode,
        emailNotifications,
      };
      
      const result = await updateUserPreferences(updatedPreferences).unwrap();
      dispatch(updatePreferences(updatedPreferences));
      
      setSuccessMessage('Preferences updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update preferences', error);
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
        <Link href="/subscription" className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          Subscription
        </Link>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start">
          <FiCheck className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Preferences Form */}
      <Card variant="bordered">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <FiSettings className="mr-2" />
            Preferences
          </h2>

          <div className="space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Preferred Categories
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select categories you're interested in to personalize your news feed.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Display Settings
              </h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="darkMode"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                />
                <label
                  htmlFor="darkMode"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Enable dark mode by default
                </label>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Notification Settings
              </h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                />
                <label
                  htmlFor="emailNotifications"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Receive email notifications for new articles in your preferred categories
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSavePreferences}
                isLoading={isUpdating}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

