'use client'

import { useState, useEffect } from 'react'
import { FaFilter, FaSearch } from 'react-icons/fa'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/articles/ArticleCard'
import api from '@/lib/api/axios'

interface Article {
  id: string
  title: string
  summary: string
  author: string
  published_at: string
  categories: string[]
  access_tier: 'free' | 'premium' | 'organization'
  featured_image: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        let url = '/articles'
        if (selectedCategory) {
          url += `?category=${selectedCategory}`
        }
        const response = await api.get(url)
        setArticles(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching articles:', err)
        setError('Failed to load articles. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [selectedCategory])

  // Get unique categories from articles
  const categories = Array.from(
    new Set(articles.flatMap(article => article.categories))
  ).sort()

  // Filter articles by search query
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Articles</h1>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="input pl-10 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* Category filter */}
              <div className="relative">
                <select
                  className="input pl-10 w-full sm:w-48 appearance-none"
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-900 text-red-200 rounded-lg p-4">
              {error}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No articles found.</p>
              {searchQuery && (
                <button
                  className="mt-4 text-primary-500 hover:text-primary-400"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

