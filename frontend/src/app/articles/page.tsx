'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { CategoryNav } from '@/components/CategoryNav'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

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
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const category = searchParams.get('category')

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      try {
        let url = '/articles'
        if (category) {
          url += `?category=${category}`
        }
        
        const response = await api.get(url)
        setArticles(response.data)
        setError('')
      } catch (err) {
        console.error('Error fetching articles:', err)
        setError('Failed to load articles. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [category])

  // Function to determine if user can access article
  const canAccessArticle = (accessTier: string) => {
    if (!user) return accessTier === 'free'
    
    switch (user.subscriptionTier) {
      case 'free':
        return accessTier === 'free'
      case 'individual':
        return ['free', 'premium'].includes(accessTier)
      case 'organization':
        return true
      default:
        return false
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} News` : 'Latest News'}
      </h1>
      
      <CategoryNav />
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
          {error}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {articles.map((article) => (
            <div key={article.id} className="card overflow-hidden">
              <div className="relative">
                <img 
                  src={article.featured_image || 'https://via.placeholder.com/400x200?text=News'} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                {article.access_tier !== 'free' && (
                  <div className={`absolute top-0 right-0 px-3 py-1 text-sm text-white ${
                    article.access_tier === 'premium' ? 'bg-primary-500' : 'bg-secondary-500'
                  }`}>
                    {article.access_tier === 'premium' ? 'Premium' : 'Organization'}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {article.categories.map((cat) => (
                    <Link 
                      key={cat} 
                      href={`/articles?category=${cat}`}
                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
                
                <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                <p className="text-gray-600 mb-4">{article.summary}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{article.source} • {article.author}</span>
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
                
                <div className="mt-4">
                  {canAccessArticle(article.access_tier) ? (
                    <Link href={`/articles/${article.id}`} className="btn-primary w-full block text-center">
                      Read Article
                    </Link>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        This content requires a {article.access_tier} subscription
                      </p>
                      <Link href="/auth/register" className="btn-secondary w-full block text-center">
                        Upgrade Now
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No articles found.</p>
          {category && (
            <Link href="/articles" className="text-primary-600 hover:underline mt-2 inline-block">
              View all articles
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

