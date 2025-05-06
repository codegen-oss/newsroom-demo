'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useArticles } from '@/contexts/ArticleContext';
import ArticleList from '@/components/ArticleList';
import CategoryNav from '@/components/CategoryNav';
import SearchBar from '@/components/SearchBar';
import { ArticleFilters, AccessTier } from '@/types/article';

export default function NewsPage() {
  const searchParams = useSearchParams();
  const { 
    articles, 
    categories, 
    isLoading, 
    error, 
    filters, 
    pagination, 
    setFilters, 
    setPage 
  } = useArticles();

  // Initialize filters from URL parameters
  useEffect(() => {
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const accessTier = searchParams.get('accessTier') as AccessTier | null;
    
    const newFilters: ArticleFilters = {};
    if (category) newFilters.category = category;
    if (tag) newFilters.tag = tag;
    if (search) newFilters.search = search;
    if (accessTier) newFilters.accessTier = accessTier;
    
    setFilters(newFilters);
  }, [searchParams, setFilters]);

  // Handle search
  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query });
  };

  // Handle access tier filter
  const handleAccessTierFilter = (tier: AccessTier | 'all') => {
    if (tier === 'all') {
      const { accessTier, ...restFilters } = filters;
      setFilters(restFilters);
    } else {
      setFilters({ ...filters, accessTier: tier });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">News</h1>
        <p className="text-gray-600">
          Browse the latest articles and stay informed with our comprehensive coverage.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar with filters */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white shadow-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Search</h3>
              <SearchBar 
                initialValue={filters.search || ''} 
                onSearch={handleSearch} 
              />
            </div>
            
            {/* Categories */}
            <CategoryNav 
              categories={categories} 
              activeCategory={filters.category} 
            />
            
            {/* Access Tier Filter */}
            <div className="bg-white shadow-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Access Level</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleAccessTierFilter('all')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    !filters.accessTier
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Content
                </button>
                <button
                  onClick={() => handleAccessTierFilter('free')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    filters.accessTier === 'free'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Free
                </button>
                <button
                  onClick={() => handleAccessTierFilter('premium')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    filters.accessTier === 'premium'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Premium
                </button>
                <button
                  onClick={() => handleAccessTierFilter('exclusive')}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    filters.accessTier === 'exclusive'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Exclusive
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Active filters */}
          {(filters.category || filters.tag || filters.search || filters.accessTier) && (
            <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-gray-700 font-medium">Active Filters:</span>
                
                {filters.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Category: {filters.category}
                    <button
                      onClick={() => {
                        const { category, ...restFilters } = filters;
                        setFilters(restFilters);
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      &times;
                    </button>
                  </span>
                )}
                
                {filters.tag && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Tag: {filters.tag}
                    <button
                      onClick={() => {
                        const { tag, ...restFilters } = filters;
                        setFilters(restFilters);
                      }}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      &times;
                    </button>
                  </span>
                )}
                
                {filters.search && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Search: {filters.search}
                    <button
                      onClick={() => {
                        const { search, ...restFilters } = filters;
                        setFilters(restFilters);
                      }}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      &times;
                    </button>
                  </span>
                )}
                
                {filters.accessTier && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                    Access: {filters.accessTier}
                    <button
                      onClick={() => {
                        const { accessTier, ...restFilters } = filters;
                        setFilters(restFilters);
                      }}
                      className="ml-1 text-amber-600 hover:text-amber-800"
                    >
                      &times;
                    </button>
                  </span>
                )}
                
                <button
                  onClick={() => setFilters({})}
                  className="text-sm text-gray-600 hover:text-gray-900 ml-auto"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
          
          {/* Article list */}
          <ArticleList
            articles={articles}
            isLoading={isLoading}
            error={error}
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

