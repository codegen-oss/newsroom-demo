'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'

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
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true)
      try {
        const response = await api.get(`/articles/${params.id}`)
        setArticle(response.data)
        
        // Fetch related articles based on categories
        if (response.data.categories && response.data.categories.length > 0) {
          const category = response.data.categories[0]
          const relatedResponse = await api.get(`/articles?category=${category}&limit=3`)
          // Filter out the current article
          setRelatedArticles(
            relatedResponse.data.filter((a: Article) => a.id !== params.id).slice(0, 3)
          )
        }
        
        setError(null)
      } catch (err: any) {
        console.error('Error fetching article:', err)
        if (err.response && err.response.status === 401) {
          setError('You need to be logged in to view this article.')
        } else if (err.response && err.response.status === 403) {
          setError('You need a higher subscription tier to access this content.')
        } else {
          setError('Failed to load article. Please try again later.')
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    if (params.id) {
      fetchArticle()
    }
  }, [params.id, user])
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return (
    <>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
            <p className="text-red-500 dark:text-red-400 mb-6">{error}</p>
            {error.includes('logged in') ? (
              <Link href="/auth/login" className="btn-primary">
                Sign In
              </Link>
            ) : error.includes('subscription') ? (
              <Link href="/pricing" className="btn-primary">
                Upgrade Subscription
              </Link>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
            )}
          </div>
        ) : article ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link href="/articles" className="text-primary-600 dark:text-primary-400 hover:underline">
                ← Back to Articles
              </Link>
            </div>
            
            <article>
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
                <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 mb-4">
                  <span className="mr-4">{article.author}</span>
                  <span className="mr-4">•</span>
                  <span className="mr-4">{formatDate(article.published_at)}</span>
                  <span className="mr-4">•</span>
                  <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400">
                    {article.source}
                  </a>
                  
                  {article.access_tier !== 'free' && (
                    <>
                      <span className="mr-4">•</span>
                      <span className="px-2 py-1 bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200 text-xs rounded-full">
                        {article.access_tier.charAt(0).toUpperCase() + article.access_tier.slice(1)} Content
                      </span>
                    </>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.categories.map((category) => (
                    <Link
                      key={category}
                      href={`/articles?category=${category}`}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </header>
              
              {article.featured_image && (
                <div className="mb-8">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}
              
              <div className="prose dark:prose-invert max-w-none">
                {/* In a real app, you might want to use a rich text renderer here */}
                <p className="text-lg font-semibold mb-6">{article.summary}</p>
                <div className="whitespace-pre-line">{article.content}</div>
              </div>
            </article>
            
            {relatedArticles.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link href={`/articles/${relatedArticle.id}`} key={relatedArticle.id} className="card hover:shadow-lg transition-shadow">
                      <div className="h-40 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                        {relatedArticle.featured_image ? (
                          <img
                            src={relatedArticle.featured_image}
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400">No Image</span>
                          </div>
                        )}
                        {relatedArticle.access_tier !== 'free' && (
                          <div className="absolute top-2 right-2 bg-secondary-500 text-white text-xs px-2 py-1 rounded-full">
                            {relatedArticle.access_tier.charAt(0).toUpperCase() + relatedArticle.access_tier.slice(1)}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-2 line-clamp-2">{relatedArticle.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {relatedArticle.author} • {formatDate(relatedArticle.published_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/articles" className="btn-primary">
              Browse Articles
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </>
  )
}

