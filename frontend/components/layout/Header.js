import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-display font-bold text-primary-700">
            News Room
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`nav-link ${router.pathname === '/' ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>
              Home
            </Link>
            <Link href="/news" className={`nav-link ${router.pathname.startsWith('/news') ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>
              News
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/profile" className={`nav-link ${router.pathname.startsWith('/profile') ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>
                  Profile
                </Link>
                {user?.subscriptionTier === 'organization' && (
                  <Link href="/organization" className={`nav-link ${router.pathname.startsWith('/organization') ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>
                    Organization
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="btn btn-outline text-sm">
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn btn-primary text-sm">
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
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
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className={`nav-link ${router.pathname === '/' ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>
                Home
              </Link>
              <Link href="/news" className={`nav-link ${router.pathname.startsWith('/news') ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>
                News
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className={`nav-link ${router.pathname.startsWith('/profile') ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>
                    Profile
                  </Link>
                  {user?.subscriptionTier === 'organization' && (
                    <Link href="/organization" className={`nav-link ${router.pathname.startsWith('/organization') ? 'text-primary-600 font-medium' : 'text-gray-600'}`}>
                      Organization
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline text-sm w-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/auth/login" className="btn btn-outline text-sm w-full text-center">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="btn btn-primary text-sm w-full text-center">
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

