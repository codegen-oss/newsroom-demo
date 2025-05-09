'use client';

import React from 'react';
import Link from 'next/link';
import { useSubscription } from '@/lib/subscription';

export default function ArticleCounter() {
  const { subscription, loading } = useSubscription();

  if (loading || !subscription || subscription.tier !== 'free') {
    return null;
  }

  const { articleCount = 0, articleLimit = 10 } = subscription;
  const percentage = (articleCount / articleLimit) * 100;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">
          {articleCount} of {articleLimit} free articles today
        </span>
        <Link
          href="/subscription"
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          Upgrade
        </Link>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-primary h-1.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

