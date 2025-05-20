'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaArrowLeft, FaLock, FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import RelatedArticles from '@/components/articles/RelatedArticles'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import api from '@/lib/api/axios'
import { useAuth } from '@/lib/auth/AuthContext'
import { useArticles, Article } from '@/lib/articles/ArticlesContext'

interface Article {
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

export default function ArticleDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { fetchArticleById } = useArticles()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true)
        const articleData = await fetchArticleById(id as string)
        
        if (!articleData) {
          setError('Article not found.')
          return
        }
        
        setArticle(articleData)
        
        // Check if user has access to this article
        const userTier = user?.subscription_tier || 'free'
        if (
          (articleData.access_tier === 'premium' && userTier === 'free') ||
          (articleData.access_tier === 'organization' && userTier !== 'organization')
        ) {
          setAccessDenied(true)
        } else {
          setAccessDenied(false)
        }
        
        setError(null)
      } catch (err: any) {
        console.error('Error fetching article:', err)
        if (err.response?.status === 404) {
          setError('Article not found.')
        } else if (err.response?.status === 403) {
          setAccessDenied(true)
        } else {
          setError('Failed to load article. Please try again later.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadArticle()
    }
  }, [id, user, fetchArticleById])

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  // Get access tier badge
  const getAccessTierBadge = () => {
    if (!article) return null
    
    switch (article.access_tier) {
      case 'free':
        return (
          <Badge variant="success">Free</Badge>
        )
      case 'premium':
        return (
          <Badge variant="primary" icon={<FaLock className="mr-1 h-3 w-3" />}>Premium</Badge>
        )
      case 'organization':
        return (
          <Badge variant="secondary" icon={<FaLock className="mr-1 h-3 w-3" />}>Organization</Badge>
        )
      default:
        return null
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner text="Loading article..." />
            </div>
          ) : error ? (
            <ErrorMessage 
              message={error} 
              onRetry={() => router.back()}
            />
          ) : accessDenied ? (
            <motion.div 
              className="bg-dark-800 rounded-lg p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaLock className="mx-auto h-16 w-16 text-primary-500 mb-4" />
              <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
              <p className="text-gray-400 mb-6">
                This article is only available to {article?.access_tier === 'premium' ? 'Premium' : 'Organization'} subscribers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary"
                  href="/auth/login"
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline"
                  href="/"
                >
                  View Subscription Plans
                </Button>
              </div>
            </motion.div>
          ) : article ? (
            <motion.article
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Back button */}
              <motion.div variants={itemVariants}>
                <Button 
                  variant="ghost"
                  onClick={() => router.back()}
                  icon={<FaArrowLeft />}
                  className="mb-6 p-0 hover:bg-transparent"
                >
                  Back to Articles
                </Button>
              </motion.div>
              
              {/* Article header */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.categories.map((category, index) => (
                    <Badge key={index} variant="default">{category}</Badge>
                  ))}
                  {getAccessTierBadge()}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                  {article.author && (
                    <div className="flex items-center">
                      <FaUser className="mr-2 text-primary-500" />
                      {article.author}
                    </div>
                  )}
                  {article.published_at && (
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-primary-500" />
                      {formatDate(article.published_at)}
                    </div>
                  )}
                  {article.source && (
                    <div className="flex items-center">
                      <FaTag className="mr-2 text-primary-500" />
                      {article.source_url ? (
                        <a 
                          href={article.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary-400"
                        >
                          {article.source}
                        </a>
                      ) : (
                        article.source
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Featured image */}
              {article.featured_image && (
                <motion.div 
                  variants={itemVariants}
                  className="relative h-64 sm:h-96 mb-8 rounded-lg overflow-hidden"
                >
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              )}
              
              {/* Article summary */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="bg-dark-800 rounded-lg p-6 border-l-4 border-primary-500">
                  <h2 className="text-xl font-bold mb-2">Summary</h2>
                  <p className="text-gray-300">{article.summary}</p>
                </div>
              </motion.div>
              
              {/* Article content */}
              <motion.div variants={itemVariants}>
                <div className="prose prose-invert prose-lg max-w-none">
                  {/* Render article content - in a real app, you might use a rich text renderer here */}
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
              </motion.div>
              
              {/* Related articles */}
              <motion.div variants={itemVariants}>
                <RelatedArticles 
                  articleId={article.id} 
                  categories={article.categories} 
                />
              </motion.div>
            </motion.article>
          ) : null}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
