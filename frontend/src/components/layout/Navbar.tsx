'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { FiSun, FiMoon, FiMenu, FiX, FiSearch, FiUser, FiHome, FiFileText, FiBriefcase } from 'react-icons/fi';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-30 top-0 left-0 transition-all duration-300 ${
        scrolled 
          ? 'glass shadow-glass-lg' 
          : 'bg-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center" aria-label="News Room Home">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 text-transparent bg-clip-text">
                News Room
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-200 transition-colors duration-200 focus-visible-outline"
                aria-label="Dashboard"
              >
                <FiHome className="mr-1.5" />
                Dashboard
              </Link>
              <Link 
                href="/article" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-200 transition-colors duration-200 focus-visible-outline"
                aria-label="Articles"
              >
                <FiFileText className="mr-1.5" />
                Articles
              </Link>
              <Link 
                href="/search" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-200 transition-colors duration-200 focus-visible-outline"
                aria-label="Search"
              >
                <FiSearch className="mr-1.5" />
                Search
              </Link>
              <Link 
                href="/organization" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-200 transition-colors duration-200 focus-visible-outline"
                aria-label="Organization"
              >
                <FiBriefcase className="mr-1.5" />
                Organization
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-200 transition-colors duration-200 focus-visible-outline mr-2"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {/* Sign in button */}
            <Link href="/profile">
              <button 
                type="button" 
                className="btn btn-primary flex items-center"
                aria-label="Sign In"
              >
                <FiUser className="mr-1.5" />
                Sign In
              </button>
            </Link>

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                type="button"
                className="p-2 rounded-md text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-200 transition-colors duration-200 focus-visible-outline"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle menu"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <FiX className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <FiMenu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden glass mt-2 mx-4 rounded-lg overflow-hidden transition-all duration-300`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-200 transition-colors duration-200 w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            <FiHome className="mr-2" />
            Dashboard
          </Link>
          <Link
            href="/article"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-200 transition-colors duration-200 w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            <FiFileText className="mr-2" />
            Articles
          </Link>
          <Link
            href="/search"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-200 transition-colors duration-200 w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            <FiSearch className="mr-2" />
            Search
          </Link>
          <Link
            href="/organization"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-dark-200 transition-colors duration-200 w-full"
            onClick={() => setIsMenuOpen(false)}
          >
            <FiBriefcase className="mr-2" />
            Organization
          </Link>
        </div>
      </div>
    </nav>
  );
}
