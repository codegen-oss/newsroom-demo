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

export interface ArticleState {
  articles: Article[];
  featuredArticles: Article[];
  currentArticle: Article | null;
  bookmarkedArticles: string[]; // Array of article IDs
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
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
  pushNotifications: boolean;
  articleViewPreference: 'list' | 'grid';
  fontSize: 'small' | 'medium' | 'large';
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

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  systemPreference: 'light' | 'dark';
}

// API Types
export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

// Notification Types
export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}
