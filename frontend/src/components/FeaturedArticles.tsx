'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

export function FeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles?limit=3')
        setArticles(response.data)
        setError('')
      } catch (err) {
        console.error('Error fetching featured articles:', err)
        setError('Failed to load featured articles')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="bg-gray-200 h-48 w-full"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {articles.map((article) => (
        <div key={article.id} className="card overflow-hidden group">
          <div className="relative">
            <img 
              src={article.featured_image || 'https://via.placeholder.com/400x200?text=News'} 
              alt={article.title}
              className="w-full h-48 object-cover transition-transform group-hover:scale-105"
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
              {article.categories.slice(0, 2).map((cat) => (
                <Link 
                  key={cat} 
                  href={`/articles?category=${cat}`}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {cat}
                </Link>
              ))}
            </div>
            
            <h3 className="text-lg font-bold mb-2 line-clamp-2">
              <Link href={`/articles/${article.id}`} className="hover:text-primary-600 transition-colors">
                {article.title}
              </Link>
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {article.summary}
            </p>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{article.source}</span>
              <span>{new Date(article.published_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

