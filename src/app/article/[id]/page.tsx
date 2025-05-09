'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ArticleAccessControl from '@/components/article/ArticleAccessControl';
import ArticleCounter from '@/components/article/ArticleCounter';
import { incrementArticleCount } from '@/lib/subscription';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  accessTier: 'free' | 'premium' | 'organization';
  featuredImage?: string;
}

// Mock article data - in a real app, this would be fetched from the API
const articles: Record<string, Article> = {
  '1': {
    id: '1',
    title: 'Understanding Global Economic Trends',
    subtitle: 'How recent developments are shaping the future of finance',
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
      <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
      <h2>Key Insights</h2>
      <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
      <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
    `,
    author: 'Jane Smith',
    publishedAt: '2023-01-15T12:00:00Z',
    readTimeMinutes: 5,
    accessTier: 'free',
    featuredImage: 'https://via.placeholder.com/1200x600',
  },
  '2': {
    id: '2',
    title: 'The Future of Artificial Intelligence in Healthcare',
    subtitle: 'How AI is revolutionizing medical diagnostics and treatment',
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
      <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
      <h2>Key Insights</h2>
      <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
      <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
    `,
    author: 'John Doe',
    publishedAt: '2023-01-20T14:30:00Z',
    readTimeMinutes: 8,
    accessTier: 'premium',
    featuredImage: 'https://via.placeholder.com/1200x600',
  },
  '3': {
    id: '3',
    title: 'Exclusive: Inside the Next Generation of Quantum Computing',
    subtitle: 'A deep dive into the technology that will redefine computing',
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
      <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
      <h2>Key Insights</h2>
      <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
      <p>Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
    `,
    author: 'Alex Johnson',
    publishedAt: '2023-01-25T09:15:00Z',
    readTimeMinutes: 12,
    accessTier: 'organization',
    featuredImage: 'https://via.placeholder.com/1200x600',
  },
};

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  
  const article = articles[articleId];
  
  useEffect(() => {
    // If the article is free, increment the article count
    if (article && article.accessTier === 'free') {
      incrementArticleCount();
    }
  }, [article]);
  
  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ArticleAccessControl articleTier={article.accessTier}>
        <div className="max-w-3xl mx-auto">
          {article.accessTier === 'free' && <ArticleCounter />}
          
          {article.accessTier === 'premium' && (
            <div className="bg-secondary bg-opacity-10 border border-secondary border-opacity-20 rounded-lg p-3 mb-6 flex items-center">
              <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded mr-2">PREMIUM</span>
              <span className="text-sm">This is premium content available to Individual and Organization subscribers.</span>
            </div>
          )}
          
          {article.accessTier === 'organization' && (
            <div className="bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg p-3 mb-6 flex items-center">
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded mr-2">ORGANIZATION</span>
              <span className="text-sm">This is exclusive content available only to Organization subscribers.</span>
            </div>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{article.title}</h1>
          
          <h2 className="text-xl text-gray-600 mb-6">{article.subtitle}</h2>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
              <div>
                <div className="font-medium">{article.author}</div>
                <div className="text-sm text-gray-500">{formatDate(article.publishedAt)}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">{article.readTimeMinutes} min read</div>
          </div>
          
          {article.featuredImage && (
            <div className="mb-8">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </ArticleAccessControl>
    </div>
  );
}

