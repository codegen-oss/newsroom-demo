'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSearchArticlesQuery } from '../../store/services/apiSlice';
import NewsCard from '../../components/ui/NewsCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

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
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // If tag is provided in URL, use it as search query
  useEffect(() => {
    if (initialTag) {
      setSearchQuery(initialTag);
    }
  }, [initialTag]);

  // Prepare query parameters for API
  const queryParams = {
    query: searchQuery,
    category: selectedCategory || undefined,
  };
  
  const { data: articles, isLoading, error } = useSearchArticlesQuery(queryParams);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    
    // Update URL without category parameter
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    
    router.push(`/search?${params.toString()}`);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Filters - Mobile Toggle */}
        <div className="md:hidden mb-4">
          <Button
            onClick={toggleFilter}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <FiFilter className="mr-2" />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {/* Filters Panel */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}>
          <Card variant="bordered" className="sticky top-20">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h2>
                {selectedCategory && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary-dark"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category}`}
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search for articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  className="h-full"
                />
              </div>
              <Button type="submit" className="flex items-center justify-center">
                <FiSearch className="mr-2" />
                Search
              </Button>
            </div>
          </form>

          {/* Selected Filters */}
          {selectedCategory && (
            <div className="flex items-center mb-6">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                Filters:
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light/20 text-primary">
                {selectedCategory}
                <button
                  onClick={clearFilters}
                  className="ml-1 text-primary hover:text-primary-dark"
                >
                  <FiX size={14} />
                </button>
              </span>
            </div>
          )}

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
                {selectedCategory && ` in the ${selectedCategory} category`}.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

