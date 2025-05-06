'use client'

import Link from 'next/link'
import { FeaturedArticles } from '@/components/FeaturedArticles'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Stay Informed with NewsRoom
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your trusted source for geopolitics, economy, and technology news with a focus on what matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/articles" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Browse Articles
            </Link>
            {!user && (
              <Link href="/auth/register" className="btn-primary bg-transparent border-2 border-white hover:bg-white/10">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Articles</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our latest and most impactful stories from around the world.
          </p>
        </div>
        
        <FeaturedArticles />
        
        <div className="text-center mt-10">
          <Link href="/articles" className="btn-primary">
            View All Articles
          </Link>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the subscription tier that best fits your needs and get access to premium content.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="card p-6 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <p className="text-3xl font-bold">$0<span className="text-gray-500 text-lg font-normal">/month</span></p>
                <p className="text-gray-600 mt-4">
                  Basic access to public news and limited features.
                </p>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to free articles</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic news feed</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Email newsletter</span>
                </li>
              </ul>
              
              <Link href="/auth/register?plan=free" className="btn-outline w-full text-center">
                Sign Up Free
              </Link>
            </div>
            
            {/* Individual Tier */}
            <div className="card p-6 flex flex-col h-full border-primary-500 border-2 relative">
              <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 text-sm">
                Popular
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Individual</h3>
                <p className="text-3xl font-bold">$9.99<span className="text-gray-500 text-lg font-normal">/month</span></p>
                <p className="text-gray-600 mt-4">
                  Premium access for individual users with enhanced features.
                </p>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All free features</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to premium articles</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Personalized news feed</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Bookmark articles</span>
                </li>
              </ul>
              
              <Link href="/auth/register?plan=individual" className="btn-primary w-full text-center">
                Get Started
              </Link>
            </div>
            
            {/* Organization Tier */}
            <div className="card p-6 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Organization</h3>
                <p className="text-3xl font-bold">$49.99<span className="text-gray-500 text-lg font-normal">/month</span></p>
                <p className="text-gray-600 mt-4">
                  Enterprise-level access for teams with advanced features.
                </p>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All individual features</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to all content</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Team management</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>API access</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Link href="/auth/register?plan=organization" className="btn-outline w-full text-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container mx-auto px-4">
        <NewsletterSignup />
      </section>
    </div>
  )
}

