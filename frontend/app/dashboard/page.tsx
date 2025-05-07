'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ArticleCard from '@/components/ArticleCard';
import ArticleCardSkeleton from '@/components/ArticleCardSkeleton';
import Spinner from '@/components/ui/Spinner';
import { articlesApi } from '@/lib/api';
import { FaFilter, FaSearch, FaSpinner, FaSortAmountDown, FaSortAmountUp, FaTimes } from 'react-icons/fa';
import { fadeIn, slideUp, staggerContainer, subscriptionTierStyles } from '@/lib/theme';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

interface Article {
  id: string;
  title: string;
  summary: string;
  author: string;
  published_at: string;
  categories: string[];
  access_tier: string;
  featured_image: string;
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAccessTier, setSelectedAccessTier] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const router = useRouter();

  // Categories for filter
  const categories = ['politics', 'economy', 'technology', 'science', 'markets', 'diplomacy'];
  
  // Access tiers based on user's subscription
  const accessTiers = user?.subscription_tier === 'free' 
    ? [{ value: 'free', label: 'Free' }] 
    : user?.subscription_tier === 'individual'
      ? [{ value: 'free', label: 'Free' }, { value: 'premium', label: 'Premium' }]
      : [{ value: 'free', label: 'Free' }, { value: 'premium', label: 'Premium' }, { value: 'organization', label: 'Organization' }];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title (A-Z)' },
    { value: 'title_desc', label: 'Title (Z-A)' },
  ];

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Fetch articles
    if (isAuthenticated) {
      fetchArticles();
    }
  }, [isAuthenticated, authLoading, router]);

  // Update active filters when filters change
  useEffect(() => {
    const filters = [];
    if (selectedCategory) filters.push(`Category: ${selectedCategory}`);
    if (selectedAccessTier) filters.push(`Access: ${selectedAccessTier}`);
    if (searchQuery) filters.push(`Search: ${searchQuery}`);
    setActiveFilters(filters);
  }, [selectedCategory, selectedAccessTier, searchQuery]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: any = {};
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      if (selectedAccessTier) {
        params.access_tier = selectedAccessTier;
      }
      
      const response = await articlesApi.getArticles(params);
      setArticles(response.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Apply all filters and sorting
  const getFilteredAndSortedArticles = () => {
    // First filter by search query
    let filtered = articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    // Then sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        case 'oldest':
          return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAccessTier('');
    setSearchQuery('');
    setSortBy('newest');
    fetchArticles();
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith('Category:')) {
      setSelectedCategory('');
    } else if (filter.startsWith('Access:')) {
      setSelectedAccessTier('');
    } else if (filter.startsWith('Search:')) {
      setSearchQuery('');
    }
    fetchArticles();
  };

  // Get filtered and sorted articles
  const filteredArticles = getFilteredAndSortedArticles();

  // Get subscription tier styles
  const tierStyle = user?.subscription_tier 
    ? subscriptionTierStyles[user.subscription_tier as keyof typeof subscriptionTierStyles] 
    : subscriptionTierStyles.free;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Your News Feed
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, {user?.display_name}! Here's your personalized news feed.
            </p>
          </div>
        </motion.div>
        
        {/* Subscription tier info */}
        <motion.div 
          className={`mb-8 p-4 rounded-lg ${tierStyle.bg} ${tierStyle.border}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={`text-lg font-semibold mb-2 ${tierStyle.text}`}>
            {user?.subscription_tier === 'free' 
              ? 'Free Tier' 
              : user?.subscription_tier === 'individual' 
                ? 'Premium Individual Subscription' 
                : 'Organization Subscription'}
          </h2>
          <p className={tierStyle.text}>
            {user?.subscription_tier === 'free' 
              ? 'You have access to all free articles. Upgrade to Premium for more content!' 
              : user?.subscription_tier === 'individual' 
                ? 'You have access to all free and premium articles. Thank you for your subscription!' 
                : 'You have access to all content including organization-exclusive articles.'}
          </p>
        </motion.div>

        {/* Filters and search */}
        <Card className="mb-8 p-4">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search bar */}
            <div className="flex-grow">
              <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="ml-2"
                >
                  Search
                </Button>
              </form>
            </div>
            
            {/* Category filter */}
            <div className="w-full lg:w-48">
              <Select
                options={[
                  { value: '', label: 'All Categories' },
                  ...categories.map(cat => ({ 
                    value: cat, 
                    label: cat.charAt(0).toUpperCase() + cat.slice(1) 
                  }))
                ]}
                value={selectedCategory}
                onChange={(value) => {
                  setSelectedCategory(value);
                  fetchArticles();
                }}
                icon={<FaFilter />}
                placeholder="All Categories"
              />
            </div>
            
            {/* Access tier filter */}
            <div className="w-full lg:w-48">
              <Select
                options={[
                  { value: '', label: 'All Access Tiers' },
                  ...accessTiers
                ]}
                value={selectedAccessTier}
                onChange={(value) => {
                  setSelectedAccessTier(value);
                  fetchArticles();
                }}
                placeholder="All Access Tiers"
              />
            </div>
            
            {/* Sort options */}
            <div className="w-full lg:w-48">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                icon={sortBy.includes('desc') ? <FaSortAmountDown /> : <FaSortAmountUp />}
              />
            </div>
          </div>
          
          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="primary"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {filter}
                  <button 
                    onClick={() => removeFilter(filter)}
                    className="ml-1 hover:text-red-500"
                    aria-label={`Remove ${filter} filter`}
                  >
                    <FaTimes size={10} />
                  </button>
                </Badge>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>
          )}
        </Card>

        {/* Error message */}
        {error && (
          <motion.div 
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" 
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="block sm:inline">{error}</span>
          </motion.div>
        )}

        {/* Loading indicator */}
        {isLoading ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(6)].map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </motion.div>
        ) : (
          <>
            {/* Articles grid */}
            {filteredArticles.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {filteredArticles.map((article) => (
                  <motion.div key={article.id} variants={slideUp}>
                    <ArticleCard article={article} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-600 dark:text-gray-300 text-lg">No articles found matching your criteria.</p>
                <Button 
                  variant="primary" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
