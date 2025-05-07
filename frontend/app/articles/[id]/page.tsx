'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { articlesApi } from '@/lib/api';
import { FaClock, FaUser, FaTag, FaArrowLeft, FaSpinner, FaLock } from 'react-icons/fa';

interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  source: string;
  source_url: string;
  published_at: string;
  categories: string[];
  access_tier: string;
  featured_image: string;
}

export default function ArticleDetail({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Fetch article
    if (isAuthenticated && params.id) {
      fetchArticle(params.id);
    }
  }, [isAuthenticated, authLoading, router, params.id]);

  const fetchArticle = async (id: string) => {
    setIsLoading(true);
    setError('');
    setAccessDenied(false);
    
    try {
      const response = await articlesApi.getArticle(id);
      setArticle(response.data);
    } catch (err: any) {
      console.error('Error fetching article:', err);
      if (err.response && err.response.status === 403) {
        setAccessDenied(true);
      } else {
        setError('Failed to load article. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <FaSpinner className="animate-spin text-4xl text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Articles
        </Link>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {accessDenied && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6" role="alert">
            <div className="flex items-center">
              <FaLock className="mr-2" />
              <span className="font-bold">Access Restricted</span>
            </div>
            <p className="mt-2">
              This content requires a {article?.access_tier === 'premium' ? 'Premium' : 'Organization'} subscription.
              {user?.subscription_tier === 'free' && (
                <span className="block mt-2">
                  You currently have a Free subscription. Please upgrade to access this content.
                </span>
              )}
            </p>
          </div>
        )}

        {article && !accessDenied && (
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured image */}
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={article.featured_image || '/images/placeholder.jpg'}
                alt={article.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className="absolute top-4 right-4">
                <span 
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${ 
                    article.access_tier === 'free' 
                      ? 'bg-green-100 text-green-800' 
                      : article.access_tier === 'premium' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {article.access_tier.charAt(0).toUpperCase() + article.access_tier.slice(1)}
                </span>
              </div>
            </div>

            {/* Article content */}
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
              
              <div className="flex flex-wrap items-center text-gray-600 mb-6 gap-4">
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
                <div className="flex items-center">
                  <FaUser className="mr-1" />
                  <span>{article.author}</span>
                </div>
                <div>
                  <span className="text-gray-500">Source: </span>
                  <a 
                    href={article.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {article.source}
                  </a>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                {article.categories.map((category, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
                  >
                    <FaTag className="mr-1" />
                    {category}
                  </span>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 border-l-4 border-primary-500 p-4 mb-6">
                <p className="text-lg italic">{article.summary}</p>
              </div>

              {/* Main content */}
              <div className="prose prose-lg max-w-none">
                {article.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

