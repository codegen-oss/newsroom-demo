'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiSearch, FiLogOut, FiSettings, FiCreditCard, FiChevronDown } from 'react-icons/fi';
import { useTheme } from './ThemeProvider';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Search', href: '/search' },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary dark:text-primary-light">
                NewsRoom
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(link.href)
                      ? 'bg-primary-light/20 text-primary dark:text-primary-light'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Search"
            >
              <Link href="/search">
                <FiSearch size={20} />
              </Link>
            </button>
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-1 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="User menu"
                  aria-expanded={isUserDropdownOpen}
                >
                  <FiUser size={20} />
                  <span className="text-sm font-medium hidden lg:block">{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown size={16} className={`transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <FiUser className="mr-2" size={16} />
                      Profile
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <FiSettings className="mr-2" size={16} />
                      Settings
                    </Link>
                    <Link
                      href="/subscription"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <FiCreditCard className="mr-2" size={16} />
                      Subscription
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <FiLogOut className="mr-2" size={16} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Slide in from the right */}
      <div 
        className={`fixed inset-y-0 right-0 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } w-64 bg-white dark:bg-gray-800 shadow-lg z-20 transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.href)
                  ? 'bg-primary-light/20 text-primary dark:text-primary-light'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={toggleMenu}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          {isAuthenticated ? (
            <div className="px-4 py-2">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <FiUser className="text-gray-500" size={20} />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">{user?.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  onClick={toggleMenu}
                >
                  <FiUser className="mr-2" size={16} />
                  Profile
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  onClick={toggleMenu}
                >
                  <FiSettings className="mr-2" size={16} />
                  Settings
                </Link>
                <Link
                  href="/subscription"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  onClick={toggleMenu}
                >
                  <FiCreditCard className="mr-2" size={16} />
                  Subscription
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FiLogOut className="mr-2" size={16} />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2">
              <Link
                href="/auth/login"
                className="block w-full text-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Sign In
              </Link>
              <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  href="/auth/register"
                  className="text-primary hover:text-primary-dark font-medium"
                  onClick={toggleMenu}
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        ></div>
      )}
    </nav>
  );
}
