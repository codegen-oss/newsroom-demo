'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaUser, FaTag, FaBuilding } from 'react-icons/fa';

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
    organization_id?: string;
    organization_name?: string;
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

  return (
    <div className="card h-full flex flex-col">
      {/* Access tier badge */}
      <div className="absolute top-2 right-2 z-10">
        <span 
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            article.access_tier === 'free' 
              ? 'bg-green-100 text-green-800' 
              : article.access_tier === 'premium' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
          }`}
        >
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

        {/* Organization badge if applicable */}
        {article.organization_id && (
          <div className="mb-2">
            <Link 
              href={`/organizations/${article.organization_id}`}
              className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              <FaBuilding className="mr-1" />
              {article.organization_name || 'Organization Content'}
            </Link>
          </div>
        )}

        <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{article.summary}</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {article.categories.map((category, index) => (
            <span 
              key={index}
              className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
            >
              <FaTag className="mr-1" />
              {category}
            </span>
          ))}
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
