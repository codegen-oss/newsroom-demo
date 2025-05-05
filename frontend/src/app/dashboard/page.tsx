'use client';

import { useEffect, useState } from 'react';
import { useGetFeaturedArticlesQuery } from '../../store/services/apiSlice';
import NewsCard from '../../components/ui/NewsCard';
import Card from '../../components/ui/Card';
import { Article } from '../../types';
import { FiTrendingUp, FiClock, FiBookmark } from 'react-icons/fi';

export default function Dashboard() {
  const { data: articles, isLoading, error } = useGetFeaturedArticlesQuery();
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (articles) {
      // Featured articles (first 3)
      setFeaturedArticles(articles.slice(0, 3));
      
      // Trending articles (next 4)
      setTrendingArticles(articles.slice(3, 7));
      
      // Recent articles (next 5)
      setRecentArticles(articles.slice(7, 12));
    }
  }, [articles]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="bordered" className="p-6 text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We encountered an issue while loading the latest articles. Please try again later.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured Articles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <FiBookmark className="mr-2" />
          Featured Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <NewsCard key={article.id} article={article} variant="featured" />
          ))}
        </div>
      </section>

      {/* Trending Articles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <FiTrendingUp className="mr-2" />
          Trending Now
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {trendingArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <FiClock className="mr-2" />
          Recently Published
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {recentArticles.map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  );
}

