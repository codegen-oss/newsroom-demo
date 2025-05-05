import Image from 'next/image';
import Link from 'next/link';
import { Article } from '../../types';
import { FiClock, FiTag, FiLock, FiUser, FiCalendar, FiStar } from 'react-icons/fi';
import Card from './Card';
import { useState } from 'react';

interface NewsCardProps {
  article: Article;
  variant?: 'compact' | 'featured' | 'default';
  className?: string;
}

export default function NewsCard({ article, variant = 'default', className = '' }: NewsCardProps) {
  const {
    id,
    title,
    summary,
    imageUrl,
    publishedAt,
    author,
    category,
    isPremium,
  } = article;

  const [imageError, setImageError] = useState(false);

  // Format the date
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Placeholder image when no image is available or there's an error
  const renderPlaceholderImage = (height: string) => (
    <div className={`bg-gray-200 dark:bg-gray-700 ${height} w-full flex flex-col items-center justify-center`}>
      <FiStar className="text-gray-400 dark:text-gray-500 mb-2" size={24} />
      <span className="text-xs text-gray-500 dark:text-gray-400">No image available</span>
    </div>
  );

  // Premium badge component
  const PremiumBadge = ({ size = 'default', className = '' }: { size?: 'small' | 'default' | 'large', className?: string }) => {
    const sizeClasses = {
      small: 'text-xs px-1.5 py-0.5',
      default: 'text-xs px-2 py-1',
      large: 'text-sm px-2.5 py-1.5',
    };
    
    return (
      <div className={`bg-secondary/80 text-white ${sizeClasses[size]} rounded-full flex items-center backdrop-blur-sm ${className}`}>
        <FiLock className="mr-1" size={size === 'small' ? 10 : size === 'large' ? 14 : 12} />
        Premium
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <Card 
        variant="bordered" 
        className={`hover:shadow-md transition-shadow ${className}`}
      >
        <Link href={`/article/${id}`} className="block">
          <div className="flex items-start space-x-3 p-3">
            <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
              {!imageError && imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  onError={handleImageError}
                />
              ) : (
                renderPlaceholderImage('h-16')
              )}
              {isPremium && (
                <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/60 to-transparent p-1">
                  <FiLock className="text-white" size={12} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {title}
              </h3>
              <div className="flex items-center mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <FiCalendar className="mr-1" size={10} />
                  {formattedDate}
                </p>
                {isPremium && (
                  <span className="ml-2 text-xs text-secondary flex items-center">
                    <FiLock className="mr-0.5" size={10} />
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card 
        variant="elevated" 
        className={`overflow-hidden h-full hover:shadow-lg transition-shadow ${className}`}
      >
        <Link href={`/article/${id}`} className="block h-full">
          <div className="relative h-48 md:h-64 w-full">
            {!imageError && imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                onError={handleImageError}
                priority
              />
            ) : (
              renderPlaceholderImage('h-48 md:h-64')
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              {category}
            </div>
            {isPremium && (
              <div className="absolute top-2 left-2">
                <PremiumBadge />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">
                {title}
              </h2>
              <p className="text-sm text-white/90 mb-3 line-clamp-2">
                {summary}
              </p>
              <div className="flex items-center justify-between text-xs text-white/80">
                <span className="flex items-center">
                  <FiUser className="mr-1" size={12} />
                  {author}
                </span>
                <span className="flex items-center">
                  <FiClock className="mr-1" size={12} />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      variant="bordered" 
      className={`hover:shadow-md transition-shadow h-full ${className}`}
    >
      <Link href={`/article/${id}`} className="block h-full">
        <div className="relative">
          {!imageError && imageUrl ? (
            <div className="relative h-40 w-full rounded-t-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                onError={handleImageError}
              />
              {isPremium && (
                <div className="absolute top-2 left-2">
                  <PremiumBadge />
                </div>
              )}
            </div>
          ) : (
            <div className="relative rounded-t-lg overflow-hidden">
              {renderPlaceholderImage('h-40')}
              {isPremium && (
                <div className="absolute top-2 left-2">
                  <PremiumBadge />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full flex items-center">
              <FiTag className="mr-1" size={12} />
              {category}
            </span>
            {isPremium && (
              <span className="text-xs text-secondary flex items-center">
                <FiLock className="mr-0.5" size={12} />
                Premium
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {summary}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <FiUser className="mr-1" size={12} />
              {author}
            </span>
            <span className="flex items-center">
              <FiClock className="mr-1" size={12} />
              {formattedDate}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
