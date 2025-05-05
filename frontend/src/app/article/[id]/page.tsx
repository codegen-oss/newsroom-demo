'use client';

import { useParams } from 'next/navigation';
import { useGetArticleByIdQuery } from '../../../store/services/apiSlice';
import { useAppSelector } from '../../../hooks/reduxHooks';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ArticleReader from '../../../components/ui/ArticleReader';
import Link from 'next/link';

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: article, isLoading, error } = useGetArticleByIdQuery(id);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  // Check if user has access to premium content
  const hasPremiumAccess = isAuthenticated && user?.subscription !== 'free';
  const isPremiumBlocked = article?.isPremium && !hasPremiumAccess;

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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <ArticleReader 
        article={article} 
        isPremiumBlocked={isPremiumBlocked}
        onShare={shareArticle}
      />
    </div>
  );
}
