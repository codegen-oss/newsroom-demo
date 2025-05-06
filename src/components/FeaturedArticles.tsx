import { Article } from '@/types/article';
import ArticleCard from './ArticleCard';

interface FeaturedArticlesProps {
  articles: Article[];
  isLoading: boolean;
}

const FeaturedArticles = ({ articles, isLoading }: FeaturedArticlesProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  // Get the first article for the main feature
  const mainFeature = articles[0];
  
  // Get the rest of the articles for the secondary features
  const secondaryFeatures = articles.slice(1);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main featured article */}
        <div className="lg:col-span-2">
          <ArticleCard article={mainFeature} featured={true} />
        </div>
        
        {/* Secondary featured articles */}
        <div className="lg:col-span-1 space-y-6">
          {secondaryFeatures.slice(0, 2).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
      
      {/* Additional featured articles in a grid */}
      {secondaryFeatures.length > 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {secondaryFeatures.slice(2).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedArticles;

