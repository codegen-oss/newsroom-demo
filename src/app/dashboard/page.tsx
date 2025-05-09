'use client';

import React from 'react';
import Link from 'next/link';
import ArticleCounter from '@/components/article/ArticleCounter';
import FeatureAccess from '@/components/ui/FeatureAccess';
import { useSubscription } from '@/lib/subscription';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  accessTier: 'free' | 'premium' | 'organization';
  category: string;
  featuredImage?: string;
}

// Mock article data
const articles: Article[] = [
  {
    id: '1',
    title: 'Understanding Global Economic Trends',
    subtitle: 'How recent developments are shaping the future of finance',
    author: 'Jane Smith',
    publishedAt: '2023-01-15T12:00:00Z',
    readTimeMinutes: 5,
    accessTier: 'free',
    category: 'Economy',
    featuredImage: 'https://via.placeholder.com/600x400',
  },
  {
    id: '2',
    title: 'The Future of Artificial Intelligence in Healthcare',
    subtitle: 'How AI is revolutionizing medical diagnostics and treatment',
    author: 'John Doe',
    publishedAt: '2023-01-20T14:30:00Z',
    readTimeMinutes: 8,
    accessTier: 'premium',
    category: 'Technology',
    featuredImage: 'https://via.placeholder.com/600x400',
  },
  {
    id: '3',
    title: 'Exclusive: Inside the Next Generation of Quantum Computing',
    subtitle: 'A deep dive into the technology that will redefine computing',
    author: 'Alex Johnson',
    publishedAt: '2023-01-25T09:15:00Z',
    readTimeMinutes: 12,
    accessTier: 'organization',
    category: 'Technology',
    featuredImage: 'https://via.placeholder.com/600x400',
  },
  {
    id: '4',
    title: 'Climate Change: New Research Reveals Unexpected Patterns',
    subtitle: 'Scientists discover surprising climate trends in recent data',
    author: 'Maria Garcia',
    publishedAt: '2023-01-18T10:45:00Z',
    readTimeMinutes: 6,
    accessTier: 'free',
    category: 'Environment',
    featuredImage: 'https://via.placeholder.com/600x400',
  },
  {
    id: '5',
    title: 'The Changing Landscape of International Diplomacy',
    subtitle: 'How geopolitical shifts are affecting global relations',
    author: 'Robert Chen',
    publishedAt: '2023-01-22T16:20:00Z',
    readTimeMinutes: 10,
    accessTier: 'premium',
    category: 'Politics',
    featuredImage: 'https://via.placeholder.com/600x400',
  },
  {
    id: '6',
    title: 'Organization Exclusive: The Future of Work in 2030',
    subtitle: 'A comprehensive analysis of workplace trends and predictions',
    author: 'Sarah Williams',
    publishedAt: '2023-01-27T11:30:00Z',
    readTimeMinutes: 15,
    accessTier: 'organization',
    category: 'Business',
    featuredImage: 'https://via.placeholder.com/600x400',
  },
];

export default function DashboardPage() {
  const { subscription } = useSubscription();
  
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
      <h1 className="text-3xl font-bold mb-8">Your News Dashboard</h1>
      
      {subscription?.tier === 'free' && <ArticleCounter />}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Latest News</h2>
          
          <div className="space-y-8">
            {articles.map((article) => (
              <div key={article.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {article.featuredImage && (
                  <div className="relative">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    {article.accessTier === 'premium' && (
                      <span className="absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
                        PREMIUM
                      </span>
                    )}
                    {article.accessTier === 'organization' && (
                      <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                        ORGANIZATION
                      </span>
                    )}
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-primary bg-primary-light bg-opacity-10 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {article.readTimeMinutes} min read
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">
                    <Link href={`/article/${article.id}`} className="hover:text-primary transition-colors">
                      {article.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {article.subtitle}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      By {article.author} • {formatDate(article.publishedAt)}
                    </div>
                    
                    <Link
                      href={`/article/${article.id}`}
                      className="text-primary hover:text-primary-dark font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Subscription</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg mb-2">
              {subscription?.tier === 'free'
                ? 'Free Plan'
                : subscription?.tier === 'individual'
                ? 'Individual Plan'
                : 'Organization Plan'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {subscription?.tier === 'free'
                ? 'You have limited access to articles and features.'
                : subscription?.tier === 'individual'
                ? 'You have access to premium content and features.'
                : 'You have access to all content and organization features.'}
            </p>
            
            {subscription?.tier === 'free' && (
              <Link
                href="/subscription"
                className="block w-full bg-primary hover:bg-primary-dark text-white text-center font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Upgrade Now
              </Link>
            )}
            
            {(subscription?.tier === 'individual' || subscription?.tier === 'organization') && (
              <Link
                href="/profile/subscription"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-center font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Manage Subscription
              </Link>
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Personalized For You</h2>
          
          <FeatureAccess
            featureName={subscription?.tier === 'free' ? 'basic_personalization' : 'advanced_personalization'}
            fallback={
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-3">
                  Upgrade to access advanced personalization features.
                </p>
                <Link
                  href="/subscription"
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Upgrade Now
                </Link>
              </div>
            }
          >
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4">Topics You Follow</h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Technology
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Economy
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    Politics
                  </span>
                  {subscription?.tier !== 'free' && (
                    <>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        Healthcare
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        Environment
                      </span>
                    </>
                  )}
                </div>
                
                <Link
                  href="/profile/preferences"
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  Edit Preferences
                </Link>
              </div>
            </div>
          </FeatureAccess>
        </div>
      </div>
      
      <FeatureAccess
        featureName="newsletter"
        fallback={
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Premium Newsletters</h2>
            <p className="text-gray-600 mb-6">
              Upgrade to an Individual or Organization subscription to access our premium newsletters.
            </p>
            <Link
              href="/subscription"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Upgrade Now
            </Link>
          </div>
        }
      >
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Newsletter Subscriptions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Daily Briefing</h3>
              <p className="text-gray-600 mb-4">
                Get the top stories delivered to your inbox every morning.
              </p>
              <button className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Subscribed
              </button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Tech Insider</h3>
              <p className="text-gray-600 mb-4">
                Weekly updates on the latest technology trends and news.
              </p>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Economic Analysis</h3>
              <p className="text-gray-600 mb-4">
                In-depth analysis of economic trends and market insights.
              </p>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </FeatureAccess>
      
      <FeatureAccess
        featureName="team_sharing"
      >
        <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Organization Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Team Sharing</h3>
              <p className="text-gray-600 mb-4">
                Share articles and insights with your team members.
              </p>
              <Link
                href="/organization/sharing"
                className="block w-full bg-primary hover:bg-primary-dark text-white text-center font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Manage Sharing
              </Link>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Collaborative Workspaces</h3>
              <p className="text-gray-600 mb-4">
                Create and manage workspaces for different teams or projects.
              </p>
              <Link
                href="/organization/workspaces"
                className="block w-full bg-primary hover:bg-primary-dark text-white text-center font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View Workspaces
              </Link>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">Usage Analytics</h3>
              <p className="text-gray-600 mb-4">
                Track your organization's usage and engagement metrics.
              </p>
              <Link
                href="/organization/analytics"
                className="block w-full bg-primary hover:bg-primary-dark text-white text-center font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </FeatureAccess>
    </div>
  );
}

