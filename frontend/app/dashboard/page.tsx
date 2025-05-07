'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ArticleCard from '@/components/ArticleCard';
import { articlesApi } from '@/lib/api';
import { FaFilter, FaSearch, FaSpinner, FaGlobe, FaLightbulb, FaFire, FaBookmark } from 'react-icons/fa';

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
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommendedLoading, setIsRecommendedLoading] = useState(true);
  const [isPopularLoading, setIsPopularLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  // Categories, regions, and topics for filters
  const categories = ['politics', 'economy', 'technology', 'science', 'markets', 'diplomacy'];
  const regions = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania', 'Global'];
  const topics = ['elections', 'startups', 'AI', 'space', 'markets', 'trade', 'innovation', 'diplomacy'];

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Fetch articles
    if (isAuthenticated) {
      fetchArticles();
      fetchRecommendedArticles();
      fetchPopularArticles();
    }
  }, [isAuthenticated, authLoading, router, selectedCategory, selectedRegion, selectedTopic, activeTab]);

  const fetchArticles = async () => {
    if (activeTab !== 'all') return;
    
    setIsLoading(true);
    setError('');
    try {
      const params: any = {};
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      if (selectedRegion) {
        params.region = selectedRegion;
      }
      if (selectedTopic) {
        params.topic = selectedTopic;
      }
      if (searchQuery) {
        params.search = searchQuery;
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

  const fetchRecommendedArticles = async () => {
    if (activeTab !== 'recommended') return;
    
    setIsRecommendedLoading(true);
    try {
      const response = await articlesApi.getArticles({ endpoint: 'recommended' });
      setRecommendedArticles(response.data);
    } catch (err) {
      console.error('Error fetching recommended articles:', err);
    } finally {
      setIsRecommendedLoading(false);
    }
  };

  const fetchPopularArticles = async () => {
    if (activeTab !== 'popular') return;
    
    setIsPopularLoading(true);
    try {
      const response = await articlesApi.getArticles({ endpoint: 'popular' });
      setPopularArticles(response.data);
    } catch (err) {
      console.error('Error fetching popular articles:', err);
    } finally {
      setIsPopularLoading(false);
    }
  };

  const handleSearch = () => {
    fetchArticles();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset filters when changing tabs
    setSelectedCategory('');
    setSelectedRegion('');
    setSelectedTopic('');
    setSearchQuery('');
  };

  // Filter articles by search query for client-side filtering
  const getFilteredArticles = () => {
    if (activeTab === 'recommended') return recommendedArticles;
    if (activeTab === 'popular') return popularArticles;
    
    if (!searchQuery) return articles;
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredArticles = getFilteredArticles();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your News Feed</h1>
            <p className="text-gray-600">
              Welcome back, {user?.display_name}! Here's your personalized news feed.
            </p>
          </div>
        </div>

        {/* Subscription tier info */}
        <div className={`mb-8 p-4 rounded-lg ${
          user?.subscription_tier === 'free' 
            ? 'bg-green-50 border border-green-200' 
            : user?.subscription_tier === 'individual' 
              ? 'bg-purple-50 border border-purple-200' 
              : 'bg-blue-50 border border-blue-200'
        }`}>
          <h2 className="text-lg font-semibold mb-2">
            {user?.subscription_tier === 'free' 
              ? 'Free Tier' 
              : user?.subscription_tier === 'individual' 
                ? 'Premium Individual Subscription' 
                : 'Organization Subscription'}
          </h2>
          <p>
            {user?.subscription_tier === 'free' 
              ? 'You have access to all free articles. Upgrade to Premium for more content!' 
              : user?.subscription_tier === 'individual' 
                ? 'You have access to all free and premium articles. Thank you for your subscription!' 
                : 'You have access to all content including organization-exclusive articles.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => handleTabChange('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaBookmark className="inline mr-2" />
              All Articles
            </button>
            <button
              onClick={() => handleTabChange('recommended')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recommended'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaLightbulb className="inline mr-2" />
              Recommended For You
            </button>
            <button
              onClick={() => handleTabChange('popular')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'popular'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaFire className="inline mr-2" />
              Popular
            </button>
          </nav>
        </div>
        
        {/* Filters - Only show for "All Articles" tab */}
        {activeTab === 'all' && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              {/* Category filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGlobe className="text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="">All Regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLightbulb className="text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  <option value="">All Topics</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic.charAt(0).toUpperCase() + topic.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Loading indicator */}
        {(activeTab === 'all' && isLoading) || 
         (activeTab === 'recommended' && isRecommendedLoading) || 
         (activeTab === 'popular' && isPopularLoading) ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-primary-600" />
          </div>
        ) : (
          <>
            {/* Articles grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
