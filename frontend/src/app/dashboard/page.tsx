'use client';

import { useState } from 'react';
import NewsCard from '@/components/ui/NewsCard';
import { FiFilter, FiTrendingUp, FiClock, FiStar, FiGrid, FiList } from 'react-icons/fi';

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
const sortOptions = [
  { id: 'trending', label: 'Trending', icon: <FiTrendingUp /> },
  { id: 'latest', label: 'Latest', icon: <FiClock /> },
  { id: 'recommended', label: 'For You', icon: <FiStar /> },
];

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter articles based on selected category
  const filteredArticles = activeCategory === 'All'
    ? mockArticles
    : mockArticles.filter(article => article.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with the latest news tailored to your interests
        </p>
      </div>

      {/* Filters and controls */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          {/* Sort options */}
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveSort(option.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSort === option.id
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200'
                }`}
              >
                {option.icon}
                <span className="ml-1.5">{option.label}</span>
              </button>
            ))}
          </div>

          {/* View mode and filter toggles */}
          <div className="flex space-x-2">
            <div className="bg-gray-100 dark:bg-dark-200 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-dark-300 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                aria-label="Grid view"
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-dark-300 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                aria-label="List view"
              >
                <FiList />
              </button>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 bg-gray-100 dark:bg-dark-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
            >
              <FiFilter className="mr-1.5" />
              Filters
            </button>
          </div>
        </div>

        {/* Category filters - show when filters are toggled or on larger screens */}
        <div className={`${showFilters ? 'block' : 'hidden sm:block'} mt-4`}>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles grid/list */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-6'
        }
      `}>
        {filteredArticles.map((article) => (
          <div key={article.id} className={viewMode === 'list' ? 'glass-card' : ''}>
            <NewsCard {...article} />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No articles found for this category.</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="btn btn-primary"
          >
            View All Articles
          </button>
        </div>
      )}
    </div>
  );
}

