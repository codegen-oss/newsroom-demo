import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useNewsFeed } from '../../contexts/NewsFeedContext';
import { useAuth } from '../../contexts/AuthContext';
import ArticleCard from './ArticleCard';
import ArticleSkeleton from './ArticleSkeleton';

export default function NewsFeed() {
  const { articles, loading, error, fetchArticles } = useNewsFeed();
  const { user } = useAuth();
  const router = useRouter();
  
  const { category, region, topic } = router.query;

  useEffect(() => {
    fetchArticles({ category, region, topic });
  }, [fetchArticles, category, region, topic]);

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>Error loading articles: {error}</p>
        <button 
          onClick={() => fetchArticles({ category, region, topic })}
          className="mt-2 text-sm underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} News` : 
           region ? `News from ${region.charAt(0).toUpperCase() + region.slice(1)}` : 
           topic ? `${topic} News` : 
           'Latest News'}
        </h2>
        
        <div className="flex space-x-2">
          <select 
            className="input py-1 px-2 text-sm"
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                router.push(`/news?category=${value}`);
              } else {
                router.push('/news');
              }
            }}
            value={category || ''}
          >
            <option value="">All Categories</option>
            <option value="geopolitics">Geopolitics</option>
            <option value="economy">Economy</option>
            <option value="technology">Technology</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Show skeletons while loading
          Array(6).fill().map((_, index) => (
            <ArticleSkeleton key={index} />
          ))
        ) : articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              userTier={user?.subscriptionTier || 'free'} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

