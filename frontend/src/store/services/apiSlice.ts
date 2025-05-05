import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '..';
import { 
  ApiError, 
  Article, 
  LoginCredentials, 
  Notification, 
  RegisterData, 
  Subscription, 
  User, 
  UserPreferences 
} from '../../types';

// Define the base URL for the API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = (getState() as RootState).auth.token;
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Articles', 'User', 'Bookmarks', 'Notifications'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<{ user: User; token: string }, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<{ user: User; token: string }, RegisterData>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // User endpoints
    getUser: builder.query<User, void>({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
    updateUserPreferences: builder.mutation<User, Partial<UserPreferences>>({
      query: (preferences) => ({
        url: '/user/preferences',
        method: 'PATCH',
        body: preferences,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: '/user/profile',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Article endpoints
    getArticles: builder.query<
      { articles: Article[]; total: number }, 
      { page?: number; limit?: number; category?: string }
    >({
      query: ({ page = 1, limit = 10, category }) => ({
        url: '/articles',
        params: { page, limit, category },
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.articles.map(({ id }) => ({ type: 'Articles' as const, id })),
              { type: 'Articles', id: 'LIST' },
            ]
          : [{ type: 'Articles', id: 'LIST' }],
      transformResponse: (response: { articles: Article[]; total: number }) => response,
    }),
    getFeaturedArticles: builder.query<Article[], void>({
      query: () => '/articles/featured',
      providesTags: ['Articles'],
    }),
    getArticleById: builder.query<Article, string>({
      query: (id) => `/articles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Articles', id }],
    }),
    searchArticles: builder.query<
      { articles: Article[]; total: number }, 
      { query: string; category?: string; page?: number; limit?: number }
    >({
      query: ({ query, category, page = 1, limit = 10 }) => ({
        url: '/articles/search',
        params: { query, category, page, limit },
      }),
      providesTags: ['Articles'],
    }),
    
    // Bookmarks endpoints
    getBookmarkedArticles: builder.query<Article[], string[]>({
      query: (ids) => ({
        url: '/articles/bookmarked',
        method: 'POST',
        body: { ids },
      }),
      providesTags: ['Bookmarks'],
    }),
    
    // Subscription endpoints
    getSubscriptionPlans: builder.query<Subscription[], void>({
      query: () => '/subscriptions/plans',
    }),
    updateSubscription: builder.mutation<User, { planId: string }>({
      query: (data) => ({
        url: '/subscriptions/update',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Notifications endpoints
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: ['Notifications'],
    }),
    markNotificationAsRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
    markAllNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useUpdateUserPreferencesMutation,
  useUpdateUserProfileMutation,
  useGetArticlesQuery,
  useGetFeaturedArticlesQuery,
  useGetArticleByIdQuery,
  useSearchArticlesQuery,
  useGetBookmarkedArticlesQuery,
  useGetSubscriptionPlansQuery,
  useUpdateSubscriptionMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = apiSlice;
