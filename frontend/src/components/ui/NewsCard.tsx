'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiClock, FiBookmark, FiShare2, FiThumbsUp } from 'react-icons/fi';

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  source: string;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  category: string;
  imageUrl: string;
  premium?: boolean;
  saved?: boolean;
}

export default function NewsCard({
  id,
  title,
  summary,
  source,
  author,
  publishedAt,
  readTimeMinutes,
  category,
  imageUrl,
  premium = false,
  saved = false,
}: NewsCardProps) {
  const [isSaved, setIsSaved] = useState(saved);
  const [isLiked, setIsLiked] = useState(false);
  
  // Format date
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Handle save/bookmark
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    // Here you would also call an API to save the article
  };

  // Handle like
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    // Here you would also call an API to like the article
  };

  // Handle share
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Here you would implement share functionality
    if (navigator.share) {
      navigator.share({
        title: title,
        text: summary,
        url: `/article/${id}`,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Share functionality not supported by your browser');
    }
  };

  return (
    <Link href={`/article/${id}`}>
      <article className="news-card group h-full flex flex-col">
        {/* Image container with category badge */}
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
          <Image
            src={imageUrl || '/images/placeholder.jpg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Category badge */}
          <div className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full bg-primary-500 text-white">
            {category}
          </div>
          
          {/* Premium badge */}
          {premium && (
            <div className="absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full bg-accent-500 text-white">
              Premium
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
            {summary}
          </p>
          
          {/* Metadata */}
          <div className="mt-auto">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span className="mr-3">{source}</span>
              <span>By {author}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="mr-3">{formattedDate}</span>
                <span className="flex items-center">
                  <FiClock className="mr-1" />
                  {readTimeMinutes} min read
                </span>
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-2">
                <button 
                  onClick={handleSave}
                  className={`p-1.5 rounded-full transition-colors ${
                    isSaved 
                      ? 'text-accent-500 bg-accent-50 dark:bg-accent-900 dark:bg-opacity-20' 
                      : 'text-gray-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900 dark:hover:bg-opacity-20'
                  }`}
                  aria-label={isSaved ? 'Unsave article' : 'Save article'}
                >
                  <FiBookmark className={isSaved ? 'fill-current' : ''} />
                </button>
                
                <button 
                  onClick={handleLike}
                  className={`p-1.5 rounded-full transition-colors ${
                    isLiked 
                      ? 'text-primary-500 bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20' 
                      : 'text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900 dark:hover:bg-opacity-20'
                  }`}
                  aria-label={isLiked ? 'Unlike article' : 'Like article'}
                >
                  <FiThumbsUp className={isLiked ? 'fill-current' : ''} />
                </button>
                
                <button 
                  onClick={handleShare}
                  className="p-1.5 rounded-full text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900 dark:hover:bg-opacity-20 transition-colors"
                  aria-label="Share article"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

