'use client';

import React from 'react';
import Link from 'next/link';
import { useSubscription, canAccessArticle } from '@/lib/subscription';

interface ArticleAccessControlProps {
  articleTier: 'free' | 'premium' | 'organization';
  children: React.ReactNode;
}

export default function ArticleAccessControl({
  articleTier,
  children,
}: ArticleAccessControlProps) {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const hasAccess = canAccessArticle(articleTier, subscription);

  if (!hasAccess) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {subscription?.tier === 'free'
              ? 'Upgrade to Access Premium Content'
              : 'Subscription Required'}
          </h2>
          
          {subscription?.tier === 'free' && subscription.articleCount !== undefined && (
            <div className="mb-6">
              <p className="text-lg mb-2">
                You've read {subscription.articleCount} of {subscription.articleLimit} free articles today.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(subscription.articleCount / (subscription.articleLimit || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            {articleTier === 'premium' ? (
              <>
                This article is available to Individual and Organization subscribers.
                Upgrade your subscription to access this and all premium content.
              </>
            ) : articleTier === 'organization' ? (
              <>
                This article is exclusive to Organization subscribers.
                Upgrade to our Organization plan to access this content.
              </>
            ) : (
              <>
                You've reached your daily article limit.
                Upgrade to an Individual or Organization subscription for unlimited access.
              </>
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/subscription"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              View Subscription Plans
            </Link>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

