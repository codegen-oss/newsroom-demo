import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">NewsRoom</span>
              </Link>
              
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <Link 
                  href="/" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    router.pathname === '/' 
                      ? 'border-blue-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  News Feed
                </Link>
                {user && (
                  <Link 
                    href="/admin/articles" 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      router.pathname.startsWith('/admin') 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </nav>
            </div>
            
            <div className="hidden md:ml-6 md:flex md:items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    {user.displayName} 
                    <span className="ml-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {user.subscriptionTier}
                    </span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/login" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                router.pathname === '/' 
                  ? 'border-blue-500 text-blue-700 bg-blue-50' 
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              News Feed
            </Link>
            {user && (
              <Link 
                href="/admin/articles" 
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  router.pathname.startsWith('/admin') 
                    ? 'border-blue-500 text-blue-700 bg-blue-50' 
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                Admin
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-1">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-500">Signed in as</p>
                  <p className="text-sm font-medium text-gray-800">{user.displayName}</p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {user.subscriptionTier}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link 
                  href="/login" 
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NewsRoom. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

