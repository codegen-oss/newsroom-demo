import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Article, ArticleFilters, PaginatedArticles } from '@/types/article';
import { fetchArticles, fetchCategories, fetchFeaturedArticles } from '@/utils/api';

interface ArticleContextType {
  articles: Article[];
  featuredArticles: Article[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  filters: ArticleFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  setFilters: (filters: ArticleFilters) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refreshArticles: () => Promise<void>;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<ArticleFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load categories
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Load featured articles
        const featuredData = await fetchFeaturedArticles();
        setFeaturedArticles(featuredData);
        
        // Load articles with current filters and pagination
        await refreshArticles();
      } catch (err) {
        setError('Failed to load initial data');
        console.error('Error loading initial data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Refresh articles when filters or pagination changes
  const refreshArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result: PaginatedArticles = await fetchArticles(
        pagination.page,
        pagination.pageSize,
        filters
      );
      
      setArticles(result.articles);
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (err) {
      setError('Failed to load articles');
      console.error('Error loading articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update filters and reset to page 1
  const handleSetFilters = (newFilters: ArticleFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Update page
  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Update page size
  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  };

  // Refresh articles when filters or pagination changes
  useEffect(() => {
    refreshArticles();
  }, [filters, pagination.page, pagination.pageSize]);

  return (
    <ArticleContext.Provider
      value={{
        articles,
        featuredArticles,
        categories,
        isLoading,
        error,
        filters,
        pagination,
        setFilters: handleSetFilters,
        setPage,
        setPageSize,
        refreshArticles,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};

