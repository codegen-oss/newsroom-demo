'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaLock } from 'react-icons/fa'

interface ArticleCardProps {
  article: {
    id: string
    title: string
    summary: string
    author: string
    published_at: string
    categories: string[]
    access_tier: 'free' | 'premium' | 'organization'
    featured_image: string
  }
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  // Get access tier badge color
  const getAccessTierBadge = () => {
    switch (article.access_tier) {
      case 'free':
        return null // No badge for free articles
      case 'premium':
        return (
          <span className="badge badge-primary flex items-center">
            <FaLock className="mr-1 h-3 w-3" />
            Premium
          </span>
        )
      case 'organization':
        return (
          <span className="badge badge-secondary flex items-center">
            <FaLock className="mr-1 h-3 w-3" />
            Organization
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="card h-full flex flex-col">
      <div className="relative h-48 w-full">
        {article.featured_image ? (
          <Image
            src={article.featured_image}
            alt={article.title}
            fill
            className="object-cover rounded-t-lg"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-secondary-900 rounded-t-lg" />
        )}
        {/* Categories */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {article.categories.slice(0, 2).map((category, index) => (
            <span key={index} className="badge bg-dark-800/80 text-white">
              {category}
            </span>
          ))}
        </div>
        {/* Access tier badge */}
        <div className="absolute top-2 right-2">
          {getAccessTierBadge()}
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">
          <Link href={`/articles/${article.id}`} className="hover:text-primary-400">
            {article.title}
          </Link>
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {article.summary}
        </p>
        
        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
          <span>{article.author || 'Unknown Author'}</span>
          <span>{formatDate(article.published_at)}</span>
        </div>
      </div>
    </div>
  )
}

