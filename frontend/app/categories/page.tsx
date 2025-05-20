'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface CategoryItem {
  name: string
  description: string
  image: string
  count: number
}

export default function Categories() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  const categories: CategoryItem[] = [
    {
      name: 'Economy',
      description: 'Global economic trends, markets, and financial insights',
      image: 'https://placehold.co/600x400/png',
      count: 42
    },
    {
      name: 'Technology',
      description: 'Latest tech innovations, digital transformation, and IT trends',
      image: 'https://placehold.co/600x400/png',
      count: 38
    },
    {
      name: 'Geopolitics',
      description: 'International relations, diplomacy, and global power dynamics',
      image: 'https://placehold.co/600x400/png',
      count: 27
    },
    {
      name: 'Asia',
      description: 'News and analysis from across the Asian continent',
      image: 'https://placehold.co/600x400/png',
      count: 19
    },
    {
      name: 'Europe',
      description: 'European politics, economy, and social developments',
      image: 'https://placehold.co/600x400/png',
      count: 23
    },
    {
      name: 'Americas',
      description: 'News from North and South America',
      image: 'https://placehold.co/600x400/png',
      count: 31
    },
    {
      name: 'Climate',
      description: 'Climate change, environmental policies, and sustainability',
      image: 'https://placehold.co/600x400/png',
      count: 15
    },
    {
      name: 'Science',
      description: 'Scientific breakthroughs, research, and innovations',
      image: 'https://placehold.co/600x400/png',
      count: 22
    }
  ]

  if (loading || !isAuthenticated) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-dark-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">News Categories</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name}
              href={`/?category=${category.name.toLowerCase()}`}
              className="bg-white dark:bg-dark-700 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <span className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 text-xs font-medium px-2 py-1 rounded-full">
                    {category.count} articles
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  )
}

