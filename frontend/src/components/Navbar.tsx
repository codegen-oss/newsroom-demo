'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-2xl font-bold text-primary-600">NewsRoom</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/articles" 
              className={`hover:text-primary-600 transition-colors ${isActive('/articles') ? 'text-primary-600 font-medium' : 'text-gray-700'}`}
            >
              Articles
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className={`hover:text-primary-600 transition-colors ${isActive('/profile') ? 'text-primary-600 font-medium' : 'text-gray-700'}`}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Logout
                </button>
                <div className="ml-4 flex items-center">
                  <div className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                    {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                  </div>
                  <span className="ml-2 font-medium">{user.displayName}</span>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link 
              href="/articles" 
              className={`block py-2 ${isActive('/articles') ? 'text-primary-600 font-medium' : 'text-gray-700'}`}
              onClick={closeMenu}
            >
              Articles
            </Link>
            
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className={`block py-2 ${isActive('/profile') ? 'text-primary-600 font-medium' : 'text-gray-700'}`}
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <div className="py-2">
                  <div className="flex items-center mb-2">
                    <div className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
                    </div>
                    <span className="ml-2 font-medium">{user.displayName}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary-600"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="block py-2 text-gray-700"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="block py-2 text-primary-600 font-medium"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

