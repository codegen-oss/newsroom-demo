'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useGetArticleByIdQuery } from '../../../store/services/apiSlice';
import { useAppSelector } from '../../../hooks/reduxHooks';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { FiClock, FiTag, FiLock, FiUser, FiShare2 } from 'react-icons/fi';
import Link from 'next/link';

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: article, isLoading, error } = useGetArticleByIdQuery(id);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  // Check if user has access to premium content
  const hasPremiumAccess = isAuthenticated && user?.subscription !== 'free';
  const isPremiumBlocked = article?.isPremium && !hasPremiumAccess;

  // Format the date
  const formattedDate = article?.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  // Share article function
  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.summary,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="bordered" className="p-6 text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Article Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We couldn't find the article you're looking for. It may have been removed or you might have followed a broken link.
          </p>
          <Link href="/dashboard">
            <Button variant="primary">Return to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full flex items-center">
            <FiTag className="mr-1" size={14} />
            {article.category}
          </span>
          {article.isPremium && (
            <span className="text-sm bg-secondary/10 text-secondary px-2 py-0.5 rounded-full flex items-center">
              <FiLock className="mr-1" size={14} />
              Premium
            </span>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {article.title}
        </h1>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            <FiUser className="mr-1" />
            <span className="mr-4">{article.author}</span>
            <FiClock className="mr-1" />
            <span>{formattedDate}</span>
          </div>
          <button
            onClick={shareArticle}
            className="flex items-center text-gray-500 hover:text-primary"
            aria-label="Share article"
          >
            <FiShare2 className="mr-1" />
            Share
          </button>
        </div>
      </header>

      {/* Featured Image */}
      {article.imageUrl && (
        <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      {isPremiumBlocked ? (
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
      ) : (
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
            {article.summary}
          </p>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Related Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
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
    </div>
  );
}

