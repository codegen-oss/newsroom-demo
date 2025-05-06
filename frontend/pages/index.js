import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import ArticleCard from '../components/ArticleCard';
import ArticleFilter from '../components/ArticleFilter';
import Pagination from '../components/Pagination';
import { getArticles } from '../utils/api';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 9,
    total: 0,
    pages: 1
  });
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    tagId: '',
    accessTier: ''
  });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = {
        skip: (pagination.page - 1) * pagination.size,
        limit: pagination.size,
        ...filters
      };
      
      const data = await getArticles(params);
      setArticles(data.items);
      setPagination({
        page: data.page,
        size: data.size,
        total: data.total,
        pages: data.pages
      });
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [pagination.page, filters]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo(0, 0);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  return (
    <Layout>
      <Head>
        <title>News Room - Latest Articles</title>
        <meta name="description" content="Stay updated with the latest news and articles" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Latest News</h1>
          <p className="mt-2 text-lg text-gray-600">
            Stay informed with the latest articles and updates
          </p>
        </div>

        <ArticleFilter onFilterChange={handleFilterChange} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow-md h-80"></div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your filters or check back later for new content.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            <Pagination 
              currentPage={pagination.page} 
              totalPages={pagination.pages} 
              onPageChange={handlePageChange} 
            />
          </>
        )}
      </div>
    </Layout>
  );
}

