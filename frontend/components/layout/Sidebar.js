import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const router = useRouter();

  const categories = [
    { id: 'geopolitics', name: 'Geopolitics' },
    { id: 'economy', name: 'Economy' },
    { id: 'technology', name: 'Technology' },
  ];

  const regions = [
    { id: 'north-america', name: 'North America' },
    { id: 'europe', name: 'Europe' },
    { id: 'asia', name: 'Asia' },
    { id: 'middle-east', name: 'Middle East' },
    { id: 'africa', name: 'Africa' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-10 bg-primary-600 text-white p-3 rounded-full shadow-lg"
        onClick={toggleSidebar}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar content */}
      <aside
        className={`bg-white border-r border-gray-200 h-full md:block ${
          isOpen ? 'block fixed md:relative inset-0 z-50 md:z-0 w-64' : 'hidden'
        }`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">News Filters</h2>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Categories
            </h3>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/news?category=${category.id}`}
                    className={`block px-2 py-1 rounded ${
                      router.query.category === category.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Regions
            </h3>
            <ul className="space-y-1">
              {regions.map((region) => (
                <li key={region.id}>
                  <Link
                    href={`/news?region=${region.id}`}
                    className={`block px-2 py-1 rounded ${
                      router.query.region === region.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {region.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {user && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                Subscription
              </h3>
              <div className="bg-gray-100 rounded-md p-3">
                <p className="text-sm font-medium">
                  Current Plan: <span className="capitalize">{user.subscriptionTier || 'Free'}</span>
                </p>
                {user.subscriptionTier !== 'organization' && (
                  <Link href="/profile/subscription" className="text-sm text-primary-600 hover:text-primary-800 mt-2 inline-block">
                    Upgrade Plan
                  </Link>
                )}
              </div>
            </div>
          )}
          
          {user && preferences?.favoriteTopics?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                Your Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {preferences.favoriteTopics.map((topic) => (
                  <Link
                    key={topic}
                    href={`/news?topic=${topic}`}
                    className="inline-block px-2 py-1 bg-gray-100 text-xs rounded-full hover:bg-gray-200"
                  >
                    {topic}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

