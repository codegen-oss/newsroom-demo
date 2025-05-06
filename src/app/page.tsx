'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useArticles } from '@/contexts/ArticleContext';
import FeaturedArticles from '@/components/FeaturedArticles';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types/article';
import { fetchCategories } from '@/utils/api';

export default function Home() {
  const { featuredArticles, articles, isLoading } = useArticles();
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Group articles by category for the category sections
  const getArticlesByCategory = (category: string, articles: Article[]): Article[] => {
    return articles.filter(article => article.category === category).slice(0, 3);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to NewsRoom
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted source for the latest news, in-depth analysis, and exclusive content.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link
            href="/news"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Browse All News
          </Link>
        </div>
      </section>
      
      {/* Featured Articles Section */}
      <FeaturedArticles articles={featuredArticles} isLoading={isLoading} />
      
      {/* Category Sections */}
      {!isLoadingCategories && categories.slice(0, 3).map((category) => (
        <section key={category} className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
            <Link
              href={`/news?category=${category}`}
              className="text-blue-600 font-medium hover:text-blue-800 transition"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getArticlesByCategory(category, articles).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ))}
      
      {/* Newsletter Signup */}
      <section className="bg-blue-50 rounded-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-gray-600 mb-6">
            Get the latest news and exclusive content delivered directly to your inbox.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

