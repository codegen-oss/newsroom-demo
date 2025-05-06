import Link from 'next/link'
import { FeaturedArticles } from '@/components/FeaturedArticles'
import { CategoryNav } from '@/components/CategoryNav'
import { NewsletterSignup } from '@/components/NewsletterSignup'

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-primary-700 to-secondary-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Stay Informed on Global Affairs
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Your trusted source for geopolitics, economy, and technology news with a focus on what matters.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/articles" className="btn-primary">
              Browse Articles
            </Link>
            <Link href="/auth/register" className="btn-outline bg-white/10">
              Create Account
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <CategoryNav />
        
        <div className="my-12">
          <h2 className="text-3xl font-bold mb-6">Featured Stories</h2>
          <FeaturedArticles />
        </div>
        
        <div className="my-12">
          <h2 className="text-3xl font-bold mb-6">Subscription Tiers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Free</h3>
              <p className="mb-4">Access to basic news and limited articles.</p>
              <ul className="mb-6 space-y-2">
                <li>• Basic news feed</li>
                <li>• Limited article access</li>
                <li>• Save preferences</li>
              </ul>
              <Link href="/auth/register" className="btn-outline block text-center">
                Sign Up Free
              </Link>
            </div>
            
            <div className="card p-6 border-2 border-primary-500 relative">
              <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 text-sm">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-4">Individual</h3>
              <p className="mb-4">Full access to premium content and features.</p>
              <ul className="mb-6 space-y-2">
                <li>• All free features</li>
                <li>• Premium article access</li>
                <li>• Advanced filtering</li>
                <li>• Personalized feed</li>
              </ul>
              <Link href="/auth/register?plan=individual" className="btn-primary block text-center">
                Get Premium
              </Link>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Organization</h3>
              <p className="mb-4">Enterprise solutions for teams and companies.</p>
              <ul className="mb-6 space-y-2">
                <li>• All premium features</li>
                <li>• Organization-exclusive content</li>
                <li>• Team management</li>
                <li>• API access</li>
              </ul>
              <Link href="/auth/register?plan=organization" className="btn-secondary block text-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
        
        <NewsletterSignup />
      </div>
    </main>
  )
}

