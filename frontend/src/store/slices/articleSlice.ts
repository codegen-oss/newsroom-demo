import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article, ArticleState } from '../../types';

const initialState: ArticleState = {
  articles: [],
  featuredArticles: [],
  currentArticle: null,
  bookmarkedArticles: typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]') 
    : [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setFeaturedArticles: (state, action: PayloadAction<Article[]>) => {
      state.featuredArticles = action.payload;
    },
    setCurrentArticle: (state, action: PayloadAction<Article | null>) => {
      state.currentArticle = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setPagination: (state, action: PayloadAction<Partial<ArticleState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    bookmarkArticle: (state, action: PayloadAction<string>) => {
      const articleId = action.payload;
      if (!state.bookmarkedArticles.includes(articleId)) {
        state.bookmarkedArticles.push(articleId);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('bookmarkedArticles', JSON.stringify(state.bookmarkedArticles));
        }
      }
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      const articleId = action.payload;
      state.bookmarkedArticles = state.bookmarkedArticles.filter(id => id !== articleId);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookmarkedArticles', JSON.stringify(state.bookmarkedArticles));
      }
    },
    clearArticles: (state) => {
      state.articles = [];
      state.currentArticle = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setArticles,
  setFeaturedArticles,
  setCurrentArticle,
  setLoading,
  setError,
  setPagination,
  bookmarkArticle,
  removeBookmark,
  clearArticles,
} = articleSlice.actions;

export default articleSlice.reducer;

