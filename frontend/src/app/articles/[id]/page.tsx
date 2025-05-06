'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

type Article = {
  id: string
  title: string
  content: string
  summary: string
  source: string
  source_url: string
  author: string
  published_at: string
  categories: string[]
  access_tier: string
  featured_image: string
}

export default function ArticleDetailPage() {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/articles/${id}`)
        setArticle(response.data)
        setError('')
      } catch (err: any) {
        console.error('Error fetching article:', err)
        if (err.response && err.response.status === 403) {
          setError('You do not have access to this article. Please upgrade your subscription.')
        } else {
          setError('Failed to load article. Please try again later.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArticle()
    }
  }, [id])

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div className="text-center mt-6">
          <Link href="/articles" className="btn-primary">
            Back to Articles
          </Link>
          {!user && (
            <Link href="/auth/login" className="btn-secondary ml-4">
              Login
            </Link>
          )}
          {user && user.subscriptionTier !== 'organization' && (
            <Link href="/profile" className="btn-secondary ml-4">
              Upgrade Subscription
            </Link>
          )}
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link href="/articles" className="btn-primary">
            Back to Articles
          </Link>
        </div>
      </div>
    )
  }

  // Check if user can access this article
  if (!canAccessArticle(article.access_tier)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Premium Content</p>
            <p>This article requires a {article.access_tier} subscription to read.</p>
          </div>
          <div className="mb-6">
            <p className="text-xl text-gray-700">{article.summary}</p>
          </div>
          <div className="text-center">
            <Link href="/profile" className="btn-primary">
              Upgrade Subscription
            </Link>
            <Link href="/articles" className="btn-outline ml-4">
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/articles" className="text-primary-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Articles
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {article.categories.map((cat) => (
            <Link 
              key={cat} 
              href={`/articles?category=${cat}`}
              className="text-xs bg-gray-100 px-2 py-1 rounded"
            >
              {cat}
            </Link>
          ))}
          <span className={`text-xs px-2 py-1 rounded text-white ${
            article.access_tier === 'free' ? 'bg-gray-500' : 
            article.access_tier === 'premium' ? 'bg-primary-500' : 'bg-secondary-500'
          }`}>
            {article.access_tier.charAt(0).toUpperCase() + article.access_tier.slice(1)}
          </span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          <span>By {article.author}</span>
          <span className="mx-2">•</span>
          <span>{new Date(article.published_at).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
            {article.source}
          </a>
        </div>
        
        {article.featured_image && (
          <div className="mb-6">
            <img 
              src={article.featured_image} 
              alt={article.title}
              className="w-full h-auto rounded"
            />
          </div>
        )}
        
        <div className="prose max-w-none">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xl font-bold mb-4">Share this article</h3>
          <div className="flex space-x-4">
            <button className="btn-outline">
              Twitter
            </button>
            <button className="btn-outline">
              Facebook
            </button>
            <button className="btn-outline">
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

