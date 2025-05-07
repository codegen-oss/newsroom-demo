import Link from 'next/link'
import { FaNewspaper, FaUser, FaLock, FaGlobe, FaFilter, FaBell } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function Home() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-800 to-secondary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Stay Informed with News Room
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Your trusted source for geopolitics, economy, and technology news
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={cardVariants}>
                <Link href="/auth/login" className="btn-primary flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-primary-600 hover:bg-primary-700 text-white transition-all duration-300 transform hover:scale-105">
                  <FaUser /> Login
                </Link>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Link href="/auth/register" className="btn-secondary flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-secondary-600 hover:bg-secondary-700 text-white transition-all duration-300 transform hover:scale-105">
                  <FaLock /> Register
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Key Features
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="card p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              variants={cardVariants}
            >
              <div className="text-primary-600 text-4xl mb-4">
                <FaNewspaper />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated News Feed</h3>
              <p className="text-gray-600">
                Personalized news feed based on your interests and preferences. Discover content that matters to you.
              </p>
            </motion.div>
            <motion.div 
              className="card p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              variants={cardVariants}
            >
              <div className="text-primary-600 text-4xl mb-4">
                <FaFilter />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Filtering</h3>
              <p className="text-gray-600">
                Filter and sort articles by categories, regions, and topics to find exactly what you're looking for.
              </p>
            </motion.div>
            <motion.div 
              className="card p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              variants={cardVariants}
            >
              <div className="text-primary-600 text-4xl mb-4">
                <FaBell />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
              <p className="text-gray-600">
                Get notified about important news and updates based on your preferences and reading habits.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Subscription Tiers
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Choose the plan that fits your needs. From free access to premium content for individuals and organizations.
          </motion.p>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="card p-6 border-t-4 border-green-500 hover:shadow-lg transition-all duration-300"
              variants={cardVariants}
            >
              <h3 className="text-xl font-semibold mb-2 text-green-700">Free Tier</h3>
              <p className="text-3xl font-bold mb-4">$0<span className="text-sm text-gray-500">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Access to free articles
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Basic filtering options
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Personalized feed
                </li>
              </ul>
              <Link href="/auth/register" className="block text-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Get Started
              </Link>
            </motion.div>
            
            <motion.div 
              className="card p-6 border-t-4 border-purple-500 hover:shadow-lg transition-all duration-300 transform scale-105 z-10"
              variants={cardVariants}
            >
              <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-700">Premium</h3>
              <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm text-gray-500">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  All free tier features
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Access to premium articles
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Advanced filtering
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Weekly email digest
                </li>
              </ul>
              <Link href="/auth/register" className="block text-center py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors">
                Subscribe Now
              </Link>
            </motion.div>
            
            <motion.div 
              className="card p-6 border-t-4 border-blue-500 hover:shadow-lg transition-all duration-300"
              variants={cardVariants}
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Organization</h3>
              <p className="text-3xl font-bold mb-4">$49.99<span className="text-sm text-gray-500">/month</span></p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  All premium features
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Organization-exclusive content
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Multiple user accounts
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Team collaboration tools
                </li>
              </ul>
              <Link href="/auth/register" className="block text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Contact Sales
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-secondary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of readers who trust News Room for their daily news updates.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/auth/register" className="inline-block py-3 px-8 bg-white text-primary-700 font-bold rounded-md hover:bg-gray-100 transition-colors transform hover:scale-105">
              Create Your Free Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold flex items-center">
                <FaNewspaper className="mr-2" />
                News Room
              </h2>
              <p className="text-gray-400">Stay informed, stay ahead</p>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/auth/register" className="text-gray-300 hover:text-white transition-colors">
                Register
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} News Room. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
