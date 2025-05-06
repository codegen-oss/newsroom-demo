'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CategoryNav } from '@/components/CategoryNav'
import { api } from '@/lib/api'

type Article = {
  id: string
  title: string
  summary: string
  source: string
  author: string
  published_at: string
  categories: string[]
  access_tier: string
  featured_image: string
}

export default function ArticlesPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true)
      try {
        const url = categoryParam 
          ? `/articles?category=${categoryParam}` 
          : '/articles'
        
        const response = await api.get(url)
        setArticles(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching articles:', err)
        setError('Failed to load articles. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchArticles()
  }, [categoryParam])
  
  return (
    <>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {categoryParam 
            ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} News` 
            : 'Latest News'}
        </h1>
        
        <CategoryNav />
        
        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link href={`/articles/${article.id}`} key={article.id} className="card hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    {article.featured_image ? (
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">No Image</span>
                      </div>
                    )}
                    {article.access_tier !== 'free' && (
                      <div className="absolute top-2 right-2 bg-secondary-500 text-white text-xs px-2 py-1 rounded-full">
                        {article.access_tier.charAt(0).toUpperCase() + article.access_tier.slice(1)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {article.author} • {article.source} • {new Date(article.published_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {article.categories.slice(0, 3).map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  )
}

