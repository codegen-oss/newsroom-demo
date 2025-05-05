import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiTag, FiLock, FiUser, FiShare2, FiBookmark, FiThumbsUp } from 'react-icons/fi';
import Button from './Button';
import Card from './Card';
import { Article } from '../../types';
import { useState } from 'react';

interface ArticleReaderProps {
  article: Article;
  isPremiumBlocked?: boolean;
  onShare?: () => void;
  className?: string;
}

export default function ArticleReader({
  article,
  isPremiumBlocked = false,
  onShare,
  className = '',
}: ArticleReaderProps) {
  const {
    id,
    title,
    summary,
    content,
    imageUrl,
    publishedAt,
    author,
    category,
    tags,
    isPremium,
  } = article;

  const [imageError, setImageError] = useState(false);

  // Format the date
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Default share handler if none provided
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (navigator.share) {
      navigator.share({
        title: title,
        text: summary,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Premium content blocker
  if (isPremiumBlocked) {
    return (
      <div className={`max-w-4xl mx-auto ${className}`}>
        <Card variant="bordered" className="p-6 text-center my-8">
          <FiLock className="mx-auto text-secondary" size={32} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
            Premium Content
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This article is available exclusively to our premium subscribers. Upgrade your subscription to continue reading.
          </p>
          <Link href="/subscription">
            <Button variant="primary">Upgrade Subscription</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <article className={`max-w-4xl mx-auto ${className}`}>
      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full flex items-center">
            <FiTag className="mr-1" size={14} />
            {category}
          </span>
          {isPremium && (
            <span className="text-sm bg-secondary/10 text-secondary px-2 py-0.5 rounded-full flex items-center">
              <FiLock className="mr-1" size={14} />
              Premium
            </span>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            <FiUser className="mr-1" />
            <span className="mr-4">{author}</span>
            <FiClock className="mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center text-gray-500 hover:text-primary"
              aria-label="Share article"
            >
              <FiShare2 className="mr-1" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              className="flex items-center text-gray-500 hover:text-primary"
              aria-label="Save article"
            >
              <FiBookmark className="mr-1" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {!imageError && imageUrl && (
        <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
            onError={handleImageError}
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {summary}
        </p>
        <div 
          dangerouslySetInnerHTML={{ __html: content }} 
          className="article-content text-gray-800 dark:text-gray-200 leading-relaxed"
        />
      </div>

      {/* Article Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Related Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?tag=${tag}`}
                  className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Article Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-500 hover:text-primary">
              <FiThumbsUp className="mr-2" size={18} />
              <span>Like</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-primary">
              <FiShare2 className="mr-2" size={18} />
              <span>Share</span>
            </button>
          </div>
          <button className="flex items-center text-gray-500 hover:text-primary">
            <FiBookmark className="mr-2" size={18} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Article Styling */}
      <style jsx global>{`
        .article-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: var(--tw-prose-headings);
        }
        
        .article-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--tw-prose-headings);
        }
        
        .article-content p {
          margin-bottom: 1.25rem;
          line-height: 1.7;
        }
        
        .article-content a {
          color: #3B82F6;
          text-decoration: underline;
        }
        
        .article-content a:hover {
          text-decoration: none;
        }
        
        .article-content ul, .article-content ol {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        
        .article-content ul {
          list-style-type: disc;
        }
        
        .article-content ol {
          list-style-type: decimal;
        }
        
        .article-content li {
          margin-bottom: 0.5rem;
        }
        
        .article-content blockquote {
          border-left: 4px solid #E5E7EB;
          padding-left: 1rem;
          font-style: italic;
          margin: 1.5rem 0;
          color: #6B7280;
        }
        
        .article-content img {
          border-radius: 0.375rem;
          margin: 1.5rem 0;
        }
        
        .dark .article-content blockquote {
          border-left-color: #4B5563;
          color: #9CA3AF;
        }
      `}</style>
    </article>
  );
}

