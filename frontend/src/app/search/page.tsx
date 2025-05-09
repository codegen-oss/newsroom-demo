'use client';

import { useState } from 'react';
import NewsCard from '@/components/ui/NewsCard';
import { FiSearch, FiFilter, FiX, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Mock data for demonstration
const mockArticles = [
  {
    id: '1',
    title: 'Global Economic Summit Addresses Climate Change Initiatives',
    summary: 'World leaders gathered to discuss economic policies that address climate change and sustainable development goals.',
    source: 'Global News',
    author: 'Jane Smith',
    publishedAt: '2025-04-15T10:30:00Z',
    readTimeMinutes: 5,
    category: 'Economy',
    imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    premium: true,
  },
  {
    id: '2',
    title: 'New Technology Breakthrough in Quantum Computing',
    summary: 'Scientists have achieved a significant breakthrough in quantum computing that could revolutionize data processing capabilities.',
    source: 'Tech Insights',
    author: 'Alex Johnson',
    publishedAt: '2025-04-14T14:45:00Z',
    readTimeMinutes: 7,
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Diplomatic Relations Strengthen Between Eastern Nations',
    summary: 'A historic agreement has been signed between two major Eastern powers, signaling improved diplomatic and trade relations.',
    source: 'World Politics',
    author: 'Michael Chen',
    publishedAt: '2025-04-13T09:15:00Z',
    readTimeMinutes: 6,
    category: 'Geopolitics',
    imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    premium: true,
  },
  {
    id: '4',
    title: 'Market Analysis: Tech Stocks Show Resilience Amid Global Uncertainty',
    summary: 'Despite global economic challenges, technology sector stocks continue to demonstrate strong performance and growth potential.',
    source: 'Financial Times',
    author: 'Sarah Williams',
    publishedAt: '2025-04-12T16:20:00Z',
    readTimeMinutes: 4,
    category: 'Economy',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    title: 'Artificial Intelligence Ethics: New Guidelines Proposed',
    summary: 'International committee proposes comprehensive ethical guidelines for the development and deployment of artificial intelligence systems.',
    source: 'Tech Review',
    author: 'David Park',
    publishedAt: '2025-04-11T11:50:00Z',
    readTimeMinutes: 8,
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    title: 'Climate Change Impact on Global Food Security',
    summary: 'New research highlights the growing challenges to food security worldwide as climate change affects agricultural production.',
    source: 'Environmental Journal',
    author: 'Emma Rodriguez',
    publishedAt: '2025-04-10T13:25:00Z',
    readTimeMinutes: 6,
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    premium: true,
  },
];

// Filter options
const categories = ['All', 'Geopolitics', 'Economy', 'Technology', 'Environment'];
const sources = ['All Sources', 'Global News', 'Tech Insights', 'World Politics', 'Financial Times', 'Tech Review', 'Environmental Journal'];
const timeRanges = ['Any Time', 'Today', 'This Week', 'This Month', 'This Year'];
const contentTypes = ['All Content', 'Free', 'Premium'];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All Sources');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Any Time');
  const [selectedContentType, setSelectedContentType] = useState('All Content');
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    categories: true,
    sources: false,
    timeRange: false,
    contentType: false,
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an API call with the search query
    console.log('Searching for:', searchQuery);
  };

  // Toggle filter sections
  const toggleFilterSection = (section: string) => {
    setExpandedFilters({
      ...expandedFilters,
      [section]: !expandedFilters[section],
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSource('All Sources');
    setSelectedTimeRange('Any Time');
    setSelectedContentType('All Content');
  };

  // Filter articles based on selected filters
  const filteredArticles = mockArticles.filter((article) => {
    // Filter by search query
    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !article.summary.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'All' && article.category !== selectedCategory) {
      return false;
    }
    
    // Filter by source
    if (selectedSource !== 'All Sources' && article.source !== selectedSource) {
      return false;
    }
    
    // Filter by content type
    if (selectedContentType === 'Premium' && !article.premium) {
      return false;
    } else if (selectedContentType === 'Free' && article.premium) {
      return false;
    }
    
    // Filter by time range (simplified for demo)
    if (selectedTimeRange !== 'Any Time') {
      const articleDate = new Date(article.publishedAt);
      const now = new Date();
      
      if (selectedTimeRange === 'Today') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (articleDate < today) return false;
      } else if (selectedTimeRange === 'This Week') {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        if (articleDate < weekStart) return false;
      } else if (selectedTimeRange === 'This Month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        if (articleDate < monthStart) return false;
      } else if (selectedTimeRange === 'This Year') {
        const yearStart = new Date(now.getFullYear(), 0, 1);
        if (articleDate < yearStart) return false;
      }
    }
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Articles</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find articles on topics that interest you
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="search"
              className="input w-full pl-10"
              placeholder="Search for articles, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search articles"
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <FiX className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button
            type="button"
            className="btn btn-ghost flex items-center"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <FiFilter className="mr-1.5" />
            Filters
          </button>
        </form>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div id="filter-panel" className="glass-card mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Categories filter */}
            <div>
              <button
                onClick={() => toggleFilterSection('categories')}
                className="flex items-center justify-between w-full text-left font-medium mb-2"
              >
                <span>Categories</span>
                {expandedFilters.categories ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedFilters.categories && (
                <div className="space-y-2 pl-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
            {/* Sources filter */}
            <div>
              <button
                onClick={() => toggleFilterSection('sources')}
                className="flex items-center justify-between w-full text-left font-medium mb-2"
              >
                <span>Sources</span>
                {expandedFilters.sources ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedFilters.sources && (
                <div className="space-y-2 pl-2">
                  {sources.map((source) => (
                    <label key={source} className="flex items-center">
                      <input
                        type="radio"
                        name="source"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        checked={selectedSource === source}
                        onChange={() => setSelectedSource(source)}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{source}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
            {/* Time range filter */}
            <div>
              <button
                onClick={() => toggleFilterSection('timeRange')}
                className="flex items-center justify-between w-full text-left font-medium mb-2"
              >
                <span>Time Range</span>
                {expandedFilters.timeRange ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedFilters.timeRange && (
                <div className="space-y-2 pl-2">
                  {timeRanges.map((range) => (
                    <label key={range} className="flex items-center">
                      <input
                        type="radio"
                        name="timeRange"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        checked={selectedTimeRange === range}
                        onChange={() => setSelectedTimeRange(range)}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{range}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
            {/* Content type filter */}
            <div>
              <button
                onClick={() => toggleFilterSection('contentType')}
                className="flex items-center justify-between w-full text-left font-medium mb-2"
              >
                <span>Content Type</span>
                {expandedFilters.contentType ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedFilters.contentType && (
                <div className="space-y-2 pl-2">
                  {contentTypes.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="contentType"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        checked={selectedContentType === type}
                        onChange={() => setSelectedContentType(type)}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Custom date range (simplified for demo) */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-3 flex items-center">
              <FiCalendar className="mr-2" />
              Custom Date Range
            </h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  From
                </label>
                <input
                  type="date"
                  className="input"
                  aria-label="From date"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  To
                </label>
                <input
                  type="date"
                  className="input"
                  aria-label="To date"
                />
              </div>
              <div className="self-end">
                <button className="btn btn-ghost">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search results */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'Result' : 'Results'}
            {searchQuery && <span> for "{searchQuery}"</span>}
          </h2>
          <div className="flex items-center">
            <label className="text-sm text-gray-600 dark:text-gray-400 mr-2">
              Sort by:
            </label>
            <select className="input bg-white dark:bg-dark-100 py-1">
              <option value="relevance">Relevance</option>
              <option value="date">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
        </div>
        
        {/* Results grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div key={article.id}>
                <NewsCard {...article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-12">
            <h3 className="text-xl font-medium mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
        
        {/* Pagination (simplified for demo) */}
        {filteredArticles.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2" aria-label="Pagination">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 bg-white dark:bg-dark-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-300 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                1
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-300">
                2
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-300">
                3
              </button>
              <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-300">
                8
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-300">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

