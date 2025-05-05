import Image from 'next/image';
import Link from 'next/link';
import { Article } from '../../types';
import { FiClock, FiTag, FiLock } from 'react-icons/fi';
import Card from './Card';

interface NewsCardProps {
  article: Article;
  variant?: 'compact' | 'featured' | 'default';
}

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
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

  // Format the date
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (variant === 'compact') {
    return (
      <Card variant="bordered" className="hover:shadow-md transition-shadow">
        <Link href={`/article/${id}`} className="block">
          <div className="flex items-start space-x-3">
            {imageUrl && (
              <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {isPremium && (
                  <FiLock className="inline-block mr-1 text-primary" size={14} />
                )}
                {title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formattedDate}
              </p>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card variant="elevated" className="overflow-hidden h-full">
        <Link href={`/article/${id}`} className="block h-full">
          <div className="relative h-48 w-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-200 dark:bg-gray-700 h-full w-full flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">No image</span>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
              {category}
            </div>
            {isPremium && (
              <div className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded flex items-center">
                <FiLock className="mr-1" size={12} />
                Premium
              </div>
            )}
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
              {summary}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{author}</span>
              <div className="flex items-center">
                <FiClock className="mr-1" />
                {formattedDate}
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  // Default variant
  return (
    <Card variant="bordered" className="hover:shadow-md transition-shadow h-full">
      <Link href={`/article/${id}`} className="block h-full">
        {imageUrl && (
          <div className="relative h-40 w-full rounded-t-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
            {isPremium && (
              <div className="absolute top-2 left-2 bg-secondary/80 text-white text-xs px-2 py-1 rounded-full flex items-center backdrop-blur-sm">
                <FiLock className="mr-1" size={12} />
                Premium
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center mb-2">
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full flex items-center">
              <FiTag className="mr-1" size={12} />
              {category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {summary}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{author}</span>
            <div className="flex items-center">
              <FiClock className="mr-1" />
              {formattedDate}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

