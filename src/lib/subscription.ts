import { useEffect, useState } from 'react';

export type SubscriptionTier = 'free' | 'individual' | 'organization';
export type SubscriptionStatus = 'active' | 'expired' | 'trial' | 'canceled';

export interface UserSubscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  articleCount?: number;
  articleLimit?: number;
  expiresAt: string;
}

// In a real app, this would be fetched from the API
export const getUserSubscription = async (): Promise<UserSubscription> => {
  // Mock implementation
  return {
    tier: 'free',
    status: 'active',
    articleCount: 5,
    articleLimit: 10,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getUserSubscription();
        setSubscription(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch subscription'));
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return { subscription, loading, error };
};

export const canAccessArticle = (
  articleTier: 'free' | 'premium' | 'organization',
  userSubscription: UserSubscription | null
): boolean => {
  if (!userSubscription) return false;

  // Check subscription status
  if (userSubscription.status !== 'active' && userSubscription.status !== 'trial') {
    return false;
  }

  // Free articles are accessible to all active subscriptions
  if (articleTier === 'free') {
    // For free tier users, check article limit
    if (userSubscription.tier === 'free') {
      return (userSubscription.articleCount || 0) < (userSubscription.articleLimit || 0);
    }
    return true;
  }

  // Premium articles require individual or organization tier
  if (articleTier === 'premium') {
    return userSubscription.tier === 'individual' || userSubscription.tier === 'organization';
  }

  // Organization articles require organization tier
  if (articleTier === 'organization') {
    return userSubscription.tier === 'organization';
  }

  return false;
};

export const canAccessFeature = (
  featureName: string,
  userSubscription: UserSubscription | null
): boolean => {
  if (!userSubscription) return false;

  // Check subscription status
  if (userSubscription.status !== 'active' && userSubscription.status !== 'trial') {
    return false;
  }

  // Define feature access by tier
  const featureAccess: Record<string, SubscriptionTier[]> = {
    basic_personalization: ['free', 'individual', 'organization'],
    standard_news_updates: ['free', 'individual', 'organization'],
    advanced_personalization: ['individual', 'organization'],
    ad_free: ['individual', 'organization'],
    premium_content: ['individual', 'organization'],
    early_access: ['individual', 'organization'],
    offline_reading: ['individual', 'organization'],
    newsletter: ['individual', 'organization'],
    team_sharing: ['organization'],
    collaborative_workspaces: ['organization'],
    custom_dashboards: ['organization'],
    api_access: ['organization'],
    usage_analytics: ['organization'],
    dedicated_support: ['organization'],
  };

  // Check if feature exists
  if (!(featureName in featureAccess)) {
    return false;
  }

  // Check if user's tier has access to the feature
  return featureAccess[featureName].includes(userSubscription.tier);
};

export const incrementArticleCount = async (): Promise<number> => {
  // In a real app, this would call the API to increment the article count
  // and return the updated count
  
  // Mock implementation
  return 6; // Updated count
};

