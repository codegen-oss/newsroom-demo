'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaArrowRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Button from '@/components/ui/Button'
import { useArticles, Article } from '@/lib/articles/ArticlesContext'

interface RelatedArticlesProps {
  articleId: string
  categories: string[]
  limit?: number
}

export default function RelatedArticles({ 
  articleId, 
  categories,
  limit = 3
}: RelatedArticlesProps) {
  const { fetchArticles } = useArticles()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getRelatedArticles = async () => {
      try {
        setLoading(true)
        if (categories.length === 0) {
          setArticles([])
          return
        }
        
        // In a real app, you would have an API endpoint for related articles
        // For now, we'll simulate it by fetching articles by category
        const category = categories[0]
        await fetchArticles(category, limit + 1)
          .then((response) => {
            // Filter out the current article
            const filteredArticles = response
              .filter((article: Article) => article.id !== articleId)
              .slice(0, limit)
            
            setArticles(filteredArticles)
            setError(null)
          })
      } catch (err) {
        console.error('Error fetching related articles:', err)
        setError('Failed to load related articles.')
      } finally {
        setLoading(false)
      }
    }

    getRelatedArticles()
  }, [articleId, categories, limit, fetchArticles])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="small" text="Loading related articles..." />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} type="info" />
  }

  if (articles.length === 0) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-dark-700">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {articles.map((article) => (
          <motion.div key={article.id} variants={itemVariants}>
            <Link href={`/articles/${article.id}`} className="group block">
              <div className="relative h-40 mb-3 overflow-hidden rounded-lg">
                {article.featured_image ? (
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-secondary-900" />
                )}
              </div>
              <h3 className="font-bold mb-1 group-hover:text-primary-400 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{article.author || 'Unknown Author'}</span>
                <span>{formatDate(article.published_at)}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-6 text-center">
        <Button 
          variant="ghost"
          href="/articles" 
          icon={<FaArrowRight className="ml-2" />}
          iconPosition="right"
        >
          View all articles
        </Button>
      </div>
    </div>
  )
}
