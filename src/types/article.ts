export type AccessTier = 'free' | 'premium' | 'exclusive';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  accessTier: AccessTier;
  featured: boolean;
}

export interface ArticleFilters {
  category?: string;
  tag?: string;
  search?: string;
  accessTier?: AccessTier;
}

export interface PaginatedArticles {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

