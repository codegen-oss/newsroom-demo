import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary dark:text-white">
                NewsRoom
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/category" className="border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Categories
              </Link>
              <Link href="/search" className="border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Search
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <ThemeToggle />
            <div className="ml-3 relative">
              <div>
                <Link href="/profile" className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
                <Link href="/auth/login" className="bg-primary text-white hover:bg-primary-dark px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Dashboard
          </Link>
          <Link href="/category" className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Categories
          </Link>
          <Link href="/search" className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Search
          </Link>
          <Link href="/profile" className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Profile
          </Link>
          <Link href="/auth/login" className="bg-primary text-white hover:bg-primary-dark block px-3 py-2 rounded-md text-base font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

