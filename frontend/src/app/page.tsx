import Link from 'next/link';
import { FiArrowRight, FiLayout, FiFileText, FiUser } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-dark-100 dark:to-dark-300 -z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-electric-blue opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-electric-purple opacity-10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 text-transparent bg-clip-text">
              Welcome to News Room
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
              A modern news aggregation platform with tiered access focusing on geopolitics, economy, and technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="btn btn-primary">
                  Get Started
                </button>
              </Link>
              <Link href="/article">
                <button className="btn btn-glass">
                  Browse Articles
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover the Future of News
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Personalized content, global coverage, and powerful features designed for modern readers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="glass-card hover-float">
              <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <FiLayout className="h-6 w-6 text-primary-600 dark:text-primary-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get news tailored to your interests with our AI-powered recommendation system.
              </p>
              <Link href="/dashboard" className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
                Explore Dashboard <FiArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Feature Card 2 */}
            <div className="glass-card hover-float">
              <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <FiFileText className="h-6 w-6 text-primary-600 dark:text-primary-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global News Coverage</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Access articles from around the world focusing on geopolitics, economy, and technology.
              </p>
              <Link href="/article" className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
                Browse Articles <FiArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Feature Card 3 */}
            <div className="glass-card hover-float">
              <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <FiUser className="h-6 w-6 text-primary-600 dark:text-primary-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Subscription Tiers</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Choose from free, individual, or organization plans to access premium content and features.
              </p>
              <Link href="/profile" className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
                Manage Profile <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-accent-900 -z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-electric-blue opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-electric-purple opacity-20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Stay Informed?
            </h2>
            <p className="text-lg mb-8 text-gray-200">
              Join thousands of readers who trust News Room for their daily news consumption.
            </p>
            <Link href="/profile">
              <button className="btn bg-white text-primary-700 hover:bg-gray-100 active:bg-gray-200">
                Create Your Account
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
