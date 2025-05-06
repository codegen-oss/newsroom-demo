import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/article';
import AccessBadge from './AccessBadge';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const {
    id,
    title,
    slug,
    excerpt,
    coverImage,
    author,
    category,
    publishedAt,
    accessTier,
  } = article;

  // Format date
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${featured ? 'lg:flex' : ''}`}>
      <div className={`relative ${featured ? 'lg:w-1/2' : 'w-full'}`}>
        <Link href={`/article/${id}`}>
          <div className="relative h-48 md:h-64 w-full">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        <div className="absolute top-4 left-4">
          <Link 
            href={`/news?category=${category}`}
            className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-700 transition"
          >
            {category}
          </Link>
        </div>
        <div className="absolute top-4 right-4">
          <AccessBadge tier={accessTier} />
        </div>
      </div>
      
      <div className={`p-5 ${featured ? 'lg:w-1/2' : ''}`}>
        <Link href={`/article/${id}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition">
            {title}
          </h2>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full overflow-hidden relative mr-2">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="text-sm text-gray-700">{author.name}</span>
          </div>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        
        <div className="mt-4">
          <Link 
            href={`/article/${id}`}
            className="text-blue-600 font-medium hover:text-blue-800 transition"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;

