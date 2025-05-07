'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaUser, FaTag, FaLock } from 'react-icons/fa';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    summary: string;
    author: string;
    published_at: string;
    categories: string[];
    access_tier: string;
    featured_image: string;
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Truncate summary if it's too long
  const truncateSummary = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="card h-full flex flex-col transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Access tier badge */}
      <div className="absolute top-2 right-2 z-10">
        <span 
          className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center ${
            article.access_tier === 'free' 
              ? 'bg-green-100 text-green-800' 
              : article.access_tier === 'premium' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
          }`}
        >
          {article.access_tier !== 'free' && <FaLock className="mr-1" size={10} />}
          {article.access_tier.charAt(0).toUpperCase() + article.access_tier.slice(1)}
        </span>
      </div>

      {/* Featured image */}
      <div className="relative h-48 w-full">
        <Image
          src={article.featured_image || '/images/placeholder.jpg'}
          alt={article.title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-4">
          <div className="flex items-center">
            <FaClock className="mr-1" />
            <span>{formatDate(article.published_at)}</span>
          </div>
          <div className="flex items-center">
            <FaUser className="mr-1" />
            <span>{article.author}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{truncateSummary(article.summary)}</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {article.categories.slice(0, 3).map((category, index) => (
            <span 
              key={index}
              className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
            >
              <FaTag className="mr-1" />
              {category}
            </span>
          ))}
          {article.categories.length > 3 && (
            <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              +{article.categories.length - 3} more
            </span>
          )}
        </div>

        <Link 
          href={`/articles/${article.id}`}
          className="btn-primary text-center"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
