'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSearchArticlesQuery } from '../../store/services/apiSlice';
import NewsCard from '../../components/ui/NewsCard';
import Card from '../../components/ui/Card';
import SearchBar from '../../components/ui/SearchBar';
import FilterPanel from '../../components/ui/FilterPanel';

const categories = [
  'Politics',
  'Economy',
  'Technology',
  'Science',
  'Health',
  'Sports',
  'Entertainment',
  'World',
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get('query') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialTag = searchParams.get('tag') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery || initialTag);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | string[]>>({
    category: initialCategory,
  });
  const [mobileView, setMobileView] = useState(false);
  
  // Check if we're on mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  // Prepare query parameters for API
  const queryParams = {
    query: searchQuery,
    category: selectedFilters.category as string || undefined,
  };
  
  const { data: articles, isLoading, error } = useSearchArticlesQuery(queryParams);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Update URL with search parameters
    updateUrlParams(query, selectedFilters.category as string);
  };

  const handleFilterChange = (groupId: string, value: string | string[]) => {
    const newFilters = { ...selectedFilters, [groupId]: value };
    setSelectedFilters(newFilters);
    
    // Update URL with search parameters
    updateUrlParams(searchQuery, value as string);
  };

  const clearFilters = () => {
    setSelectedFilters({});
    
    // Update URL without category parameter
    updateUrlParams(searchQuery, '');
  };

  const updateUrlParams = (query: string, category: string) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (category) params.set('category', category);
    
    router.push(`/search?${params.toString()}`);
  };

  // Create filter groups for the FilterPanel
  const filterGroups = [
    {
      id: 'category',
      title: 'Categories',
      type: 'radio' as const,
      options: categories.map(category => ({
        id: category.toLowerCase(),
        label: category,
        value: category,
      })),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Search Articles
        </h1>
        <SearchBar
          initialQuery={searchQuery}
          onSearch={handleSearch}
          placeholder="Search for articles, topics, or keywords..."
          autoFocus
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Filters Panel */}
        <FilterPanel
          groups={filterGroups}
          selectedFilters={selectedFilters}
          onChange={handleFilterChange}
          onClear={clearFilters}
          className="md:w-64 flex-shrink-0"
          mobileView={mobileView}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Results */}
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : error ? (
            <Card variant="bordered" className="p-6 text-center">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Error Loading Results</h2>
              <p className="text-gray-600 dark:text-gray-300">
                We encountered an issue while searching for articles. Please try again later.
              </p>
            </Card>
          ) : articles && articles.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {articles.length} {articles.length === 1 ? 'Result' : 'Results'} Found
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          ) : (
            <Card variant="bordered" className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Results Found
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {searchQuery
                  ? `We couldn't find any articles matching "${searchQuery}"`
                  : 'Enter a search term to find articles'}
                {selectedFilters.category && ` in the ${selectedFilters.category} category`}.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
