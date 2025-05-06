import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const AccessBadge = ({ tier }) => {
  const badgeColors = {
    free: 'bg-green-100 text-green-800',
    premium: 'bg-purple-100 text-purple-800',
    organization: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${badgeColors[tier]}`}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
};

export default function ArticleCard({ article }) {
  const { canAccessContent } = useAuth();
  const isAccessible = canAccessContent(article.access_tier);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <img 
          src={article.featured_image || 'https://via.placeholder.com/800x400'} 
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <AccessBadge tier={article.access_tier} />
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex flex-wrap gap-1 mb-2">
          {article.categories.map(category => (
            <Link 
              href={`/?category=${category.id}`} 
              key={category.id}
              className="text-xs bg-gray-200 hover:bg-gray-300 rounded px-2 py-1"
            >
              {category.name}
            </Link>
          ))}
        </div>
        
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{article.summary}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            By {article.author} • {new Date(article.published_at).toLocaleDateString()}
          </span>
          
          <Link 
            href={`/articles/${article.id}`}
            className={`px-4 py-2 rounded text-sm font-medium ${
              isAccessible 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-700 cursor-not-allowed'
            }`}
          >
            {isAccessible ? 'Read More' : 'Upgrade to Read'}
          </Link>
        </div>
      </div>
    </div>
  );
}

