import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './reduxHooks';
import { 
  bookmarkArticle, 
  removeBookmark, 
  setArticles, 
  setCurrentArticle, 
  setFeaturedArticles, 
  setPagination 
} from '../store/slices/articleSlice';
import { Article } from '../types';
import { 
  useGetArticleByIdQuery, 
  useGetArticlesQuery, 
  useGetBookmarkedArticlesQuery, 
  useGetFeaturedArticlesQuery 
} from '../store/services/apiSlice';

export const useArticleManager = () => {
  const dispatch = useAppDispatch();
  const { 
    articles, 
    featuredArticles, 
    currentArticle, 
    bookmarkedArticles, 
    pagination, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.article);
  
  // Load articles with RTK Query
  const { 
    data: articlesData, 
    isLoading: isLoadingArticles, 
    refetch: refetchArticles 
  } = useGetArticlesQuery({ 
    page: pagination.page, 
    limit: pagination.limit 
  });
  
  // Load featured articles
  const { 
    data: featuredArticlesData, 
    isLoading: isLoadingFeatured 
  } = useGetFeaturedArticlesQuery();
  
  // Load bookmarked articles
  const { 
    data: bookmarkedArticlesData, 
    isLoading: isLoadingBookmarked 
  } = useGetBookmarkedArticlesQuery(bookmarkedArticles, {
    // Only fetch if there are bookmarked articles
    skip: bookmarkedArticles.length === 0,
  });
  
  // Update articles in store when data changes
  if (articlesData && !isLoadingArticles) {
    dispatch(setArticles(articlesData.articles));
    dispatch(setPagination({ total: articlesData.total }));
  }
  
  if (featuredArticlesData && !isLoadingFeatured) {
    dispatch(setFeaturedArticles(featuredArticlesData));
  }
  
  // Actions
  const handleSetCurrentArticle = useCallback((article: Article | null) => {
    dispatch(setCurrentArticle(article));
  }, [dispatch]);
  
  const handleBookmarkArticle = useCallback((articleId: string) => {
    dispatch(bookmarkArticle(articleId));
  }, [dispatch]);
  
  const handleRemoveBookmark = useCallback((articleId: string) => {
    dispatch(removeBookmark(articleId));
  }, [dispatch]);
  
  const handleChangePage = useCallback((page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);
  
  const handleChangePageSize = useCallback((limit: number) => {
    dispatch(setPagination({ limit, page: 1 })); // Reset to first page when changing page size
  }, [dispatch]);
  
  const isArticleBookmarked = useCallback((articleId: string) => {
    return bookmarkedArticles.includes(articleId);
  }, [bookmarkedArticles]);
  
  // Load a specific article by ID
  const getArticleById = useCallback((articleId: string) => {
    return useGetArticleByIdQuery(articleId);
  }, []);
  
  return {
    articles,
    featuredArticles,
    currentArticle,
    bookmarkedArticles,
    bookmarkedArticlesData,
    pagination,
    isLoading: isLoading || isLoadingArticles || isLoadingFeatured,
    isLoadingBookmarked,
    error,
    setCurrentArticle: handleSetCurrentArticle,
    bookmarkArticle: handleBookmarkArticle,
    removeBookmark: handleRemoveBookmark,
    changePage: handleChangePage,
    changePageSize: handleChangePageSize,
    isArticleBookmarked,
    getArticleById,
    refetchArticles,
  };
};

