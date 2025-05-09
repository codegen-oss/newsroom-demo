'use client';

import React from 'react';
import Link from 'next/link';
import { useSubscription, canAccessFeature } from '@/lib/subscription';

interface FeatureAccessProps {
  featureName: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export default function FeatureAccess({
  featureName,
  fallback,
  children,
}: FeatureAccessProps) {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return null;
  }

  const hasAccess = canAccessFeature(featureName, subscription);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-gray-600 mb-3">
          This feature requires a higher subscription tier.
        </p>
        <Link
          href="/subscription"
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          Upgrade Subscription
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

