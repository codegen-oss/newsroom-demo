'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaTag } from 'react-icons/fa';
import { accessTierStyles, getCategoryColor } from '@/lib/theme';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

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

  // Get access tier styles
  const tierStyle = accessTierStyles[article.access_tier as keyof typeof accessTierStyles] || 
                    accessTierStyles.free;

  return (
    <Card className="h-full flex flex-col">
      {/* Access tier badge */}
      <div className="absolute top-2 right-2 z-10">
        <Badge 
          variant={
            article.access_tier === 'free' 
              ? 'success' 
              : article.access_tier === 'premium' 
                ? 'secondary' 
                : 'info'
          }
          size="sm"
        >
          {article.access_tier.charAt(0).toUpperCase() + article.access_tier.slice(1)}
        </Badge>
      </div>

      {/* Featured image with hover zoom effect */}
      <div className="relative h-48 w-full overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          <Image
            src={article.featured_image || '/images/placeholder.jpg'}
            alt={article.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-all duration-300"
          />
        </motion.div>
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

        <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
          {article.summary}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {article.categories.map((category, index) => (
            <Badge
              key={index}
              className={getCategoryColor(category)}
              size="sm"
              icon={<FaTag />}
            >
              {category}
            </Badge>
          ))}
        </div>

        <Link 
          href={`/articles/${article.id}`}
          className="btn-primary text-center py-2 px-4 rounded-md bg-primary-600 hover:bg-primary-700 text-white transition-colors"
        >
          Read More
        </Link>
      </div>
    </Card>
  );
}
