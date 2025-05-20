import Link from 'next/link'
import { FaNewspaper, FaGlobe, FaChartLine, FaMicrochip } from 'react-icons/fa'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-dark-900 to-dark-800">
          <div className="max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-6">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                  Stay Informed on Global Affairs
                </h1>
                <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                  A news aggregation platform focusing on geopolitics, economy, and technology with tiered access levels.
                </p>
                <div className="mt-10 flex gap-4">
                  <Link href="/articles" className="btn btn-primary">
                    Browse Articles
                  </Link>
                  <Link href="/auth/register" className="btn btn-outline">
                    Sign Up
                  </Link>
                </div>
              </div>
              <div className="mt-12 lg:mt-0 lg:col-span-6">
                <div className="relative h-64 sm:h-72 md:h-96 lg:h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl border border-dark-700 backdrop-blur-sm flex items-center justify-center">
                    <FaNewspaper className="w-24 h-24 text-primary-300/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Focus Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary-900 flex items-center justify-center mb-4">
                  <FaGlobe className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Geopolitics</h3>
                <p className="text-gray-400">
                  Stay informed about international relations, conflicts, diplomacy, and global power dynamics.
                </p>
              </div>
              
              <div className="card p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary-900 flex items-center justify-center mb-4">
                  <FaChartLine className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Economy</h3>
                <p className="text-gray-400">
                  Track global economic trends, financial markets, trade policies, and business developments.
                </p>
              </div>
              
              <div className="card p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary-900 flex items-center justify-center mb-4">
                  <FaMicrochip className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Technology</h3>
                <p className="text-gray-400">
                  Discover the latest innovations, digital transformations, and technological breakthroughs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Tiers */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-950">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Subscription Tiers</h2>
            <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
              Choose the plan that best fits your needs and get access to premium content.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-6 border border-dark-700 flex flex-col">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <div className="text-3xl font-bold mb-4">$0<span className="text-lg text-gray-400">/month</span></div>
                <ul className="mb-6 flex-grow space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Access to basic news articles
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Limited category filtering
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Basic user profile
                  </li>
                </ul>
                <Link href="/auth/register" className="btn btn-outline w-full text-center">
                  Sign Up
                </Link>
              </div>
              
              <div className="card p-6 border border-primary-700 flex flex-col relative">
                <div className="absolute top-0 right-0 bg-primary-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                  Popular
                </div>
                <h3 className="text-xl font-bold mb-2">Individual</h3>
                <div className="text-3xl font-bold mb-4">$9.99<span className="text-lg text-gray-400">/month</span></div>
                <ul className="mb-6 flex-grow space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    All free features
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Premium articles and analysis
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced filtering options
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Personalized news feed
                  </li>
                </ul>
                <Link href="/auth/register" className="btn btn-primary w-full text-center">
                  Subscribe
                </Link>
              </div>
              
              <div className="card p-6 border border-secondary-700 flex flex-col">
                <h3 className="text-xl font-bold mb-2">Organization</h3>
                <div className="text-3xl font-bold mb-4">$49.99<span className="text-lg text-gray-400">/month</span></div>
                <ul className="mb-6 flex-grow space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    All individual features
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Organization-exclusive content
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Multiple user accounts
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Team collaboration tools
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Priority customer support
                  </li>
                </ul>
                <Link href="/auth/register" className="btn btn-secondary w-full text-center">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  )
}

