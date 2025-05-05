import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '..';
import { Article, LoginCredentials, RegisterData, User } from '../../types';

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
  tagTypes: ['Articles', 'User'],
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
    updateUserPreferences: builder.mutation<User, Partial<User['preferences']>>({
      query: (preferences) => ({
        url: '/user/preferences',
        method: 'PATCH',
        body: preferences,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Article endpoints
    getArticles: builder.query<Article[], void>({
      query: () => '/articles',
      providesTags: ['Articles'],
    }),
    getFeaturedArticles: builder.query<Article[], void>({
      query: () => '/articles/featured',
      providesTags: ['Articles'],
    }),
    getArticleById: builder.query<Article, string>({
      query: (id) => `/articles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Articles', id }],
    }),
    searchArticles: builder.query<Article[], { query: string; category?: string }>({
      query: ({ query, category }) => ({
        url: '/articles/search',
        params: { query, category },
      }),
      providesTags: ['Articles'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useUpdateUserPreferencesMutation,
  useGetArticlesQuery,
  useGetFeaturedArticlesQuery,
  useGetArticleByIdQuery,
  useSearchArticlesQuery,
} = apiSlice;

