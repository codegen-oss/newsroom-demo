// Article Types
export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  publishedAt: string;
  author: string;
  category: string;
  tags: string[];
  isPremium: boolean;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  subscription: SubscriptionTier;
  preferences: UserPreferences;
}

export interface UserPreferences {
  categories: string[];
  darkMode: boolean;
  emailNotifications: boolean;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

// Subscription Types
export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface Subscription {
  id: string;
  name: SubscriptionTier;
  price: number;
  features: string[];
  articleLimit: number;
}

