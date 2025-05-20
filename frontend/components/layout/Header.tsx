import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaNewspaper, FaBars, FaTimes, FaUser } from 'react-icons/fa'
import { useAuth } from '@/lib/auth/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="bg-dark-900 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <FaNewspaper className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                NewsRoom
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              href="/articles" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/articles') 
                  ? 'bg-dark-700 text-white' 
                  : 'text-gray-300 hover:bg-dark-800 hover:text-white'
              }`}
            >
              Articles
            </Link>
            <Link 
              href="/categories" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/categories') 
                  ? 'bg-dark-700 text-white' 
                  : 'text-gray-300 hover:bg-dark-800 hover:text-white'
              }`}
            >
              Categories
            </Link>
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/profile') 
                      ? 'bg-dark-700 text-white' 
                      : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  Profile
                </Link>
                <button 
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-dark-800 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/auth/login') 
                      ? 'bg-dark-700 text-white' 
                      : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-800 border-b border-dark-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/articles" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/articles') 
                  ? 'bg-dark-700 text-white' 
                  : 'text-gray-300 hover:bg-dark-700 hover:text-white'
              }`}
              onClick={closeMenu}
            >
              Articles
            </Link>
            <Link 
              href="/categories" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/categories') 
                  ? 'bg-dark-700 text-white' 
                  : 'text-gray-300 hover:bg-dark-700 hover:text-white'
              }`}
              onClick={closeMenu}
            >
              Categories
            </Link>
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/profile') 
                      ? 'bg-dark-700 text-white' 
                      : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                  }`}
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    logout()
                    closeMenu()
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-dark-700 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/auth/login') 
                      ? 'bg-dark-700 text-white' 
                      : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                  }`}
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

