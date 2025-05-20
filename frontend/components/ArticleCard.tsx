import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Format the date
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Determine badge color based on access tier
  const getBadgeColor = (tier: string) => {
    switch (tier) {
      case 'free':
        return 'bg-green-100 text-green-800'
      case 'premium':
        return 'bg-blue-100 text-blue-800'
      case 'organization':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white dark:bg-dark-700 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <div className="relative h-48 w-full">
        {article.featuredImage ? (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-dark-600 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getBadgeColor(article.accessTier)}`}>
            {article.accessTier.charAt(0).toUpperCase() + article.accessTier.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {article.categories.map(category => (
            <span 
              key={category} 
              className="text-xs bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
            >
              {category}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          <Link href={`/article/${article.id}`}>
            {article.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {article.summary}
        </p>
        
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{article.source} • {article.author}</span>
          <span>{formattedDate}</span>
        </div>
        
        <Link 
          href={`/article/${article.id}`}
          className="mt-4 inline-block text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
        >
          Read more →
        </Link>
      </div>
    </div>
  )
}

