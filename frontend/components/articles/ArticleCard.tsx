'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaLock } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { Article } from '@/lib/articles/ArticlesContext'

interface ArticleCardProps {
  article: Article
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

  // Get access tier badge
  const getAccessTierBadge = () => {
    switch (article.access_tier) {
      case 'free':
        return null // No badge for free articles
      case 'premium':
        return (
          <Badge 
            variant="primary" 
            icon={<FaLock className="mr-1 h-3 w-3" />}
          >
            Premium
          </Badge>
        )
      case 'organization':
        return (
          <Badge 
            variant="secondary" 
            icon={<FaLock className="mr-1 h-3 w-3" />}
          >
            Organization
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card variant="bordered" isHoverable className="h-full flex flex-col">
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
            <Badge key={index} variant="default" size="sm">
              {category}
            </Badge>
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
    </Card>
  )
}
