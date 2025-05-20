'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api/axios'

// Types
export interface Article {
  id: string
  title: string
  content: string
  summary: string
  author: string
  source: string
  source_url: string
  published_at: string
  categories: string[]
  access_tier: 'free' | 'premium' | 'organization'
  featured_image: string
}

interface ArticlesContextType {
  articles: Article[]
  featuredArticles: Article[]
  categories: string[]
  loading: boolean
  error: string | null
  fetchArticles: (category?: string, limit?: number) => Promise<Article[]>
  fetchArticleById: (id: string) => Promise<Article | null>
  searchArticles: (query: string) => Promise<Article[]>
}

// Create context
const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined)

// Provider component
export function ArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch articles on mount
  useEffect(() => {
    fetchArticles()
  }, [])

  // Fetch articles
  const fetchArticles = async (category?: string, limit?: number): Promise<Article[]> => {
    try {
      setLoading(true)
      let url = '/articles'
      const params = new URLSearchParams()
      
      if (category) {
        params.append('category', category)
      }
      
      if (limit) {
        params.append('limit', limit.toString())
      }
      
      const queryString = params.toString()
      if (queryString) {
        url += `?${queryString}`
      }
      
      const response = await api.get(url)
      const fetchedArticles = response.data
      
      // Only update state if not fetching for a specific purpose (like related articles)
      if (!category && !limit) {
        setArticles(fetchedArticles)
        
        // Extract unique categories
        const allCategories = Array.from(
          new Set(fetchedArticles.flatMap((article: Article) => article.categories))
        ).sort()
        
        setCategories(allCategories)
        
        // Set featured articles (premium or organization tier)
        const featured = fetchedArticles
          .filter((article: Article) => 
            article.access_tier === 'premium' || article.access_tier === 'organization'
          )
          .slice(0, 3)
        
        setFeaturedArticles(featured)
      }
      
      setError(null)
      return fetchedArticles
    } catch (err) {
      console.error('Error fetching articles:', err)
      setError('Failed to load articles. Please try again later.')
      return []
    } finally {
      setLoading(false)
    }
  }

  // Fetch article by ID
  const fetchArticleById = async (id: string): Promise<Article | null> => {
    try {
      const response = await api.get(`/articles/${id}`)
      return response.data
    } catch (err) {
      console.error('Error fetching article:', err)
      return null
    }
  }

  // Search articles
  const searchArticles = async (query: string): Promise<Article[]> => {
    try {
      const response = await api.get(`/articles/search?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (err) {
      console.error('Error searching articles:', err)
      return []
    }
  }

  const value = {
    articles,
    featuredArticles,
    categories,
    loading,
    error,
    fetchArticles,
    fetchArticleById,
    searchArticles
  }

  return <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>
}

// Custom hook to use the articles context
export function useArticles() {
  const context = useContext(ArticlesContext)
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticlesProvider')
  }
  return context
}
