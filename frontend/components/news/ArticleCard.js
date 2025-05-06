import Link from 'next/link';
import Image from 'next/image';

export default function ArticleCard({ article, userTier = 'free' }) {
  const {
    id,
    title,
    summary,
    author,
    publishedAt,
    categories,
    accessTier,
    featuredImage,
  } = article;

  // Check if user has access to this article
  const hasAccess = 
    accessTier === 'free' || 
    (accessTier === 'premium' && (userTier === 'individual' || userTier === 'organization')) ||
    (accessTier === 'organization' && userTier === 'organization');

  // Format date
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="relative h-48 mb-4 rounded-md overflow-hidden">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        
        {!hasAccess && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="text-white text-center p-4">
              <svg 
                className="w-8 h-8 mx-auto mb-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
              <p className="font-medium">
                {accessTier === 'premium' ? 'Premium' : 'Organization'} Content
              </p>
              <Link href="/profile/subscription" className="text-sm underline">
                Upgrade to access
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <div>
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {categories.map((category) => (
              <Link 
                key={category} 
                href={`/news?category=${category.toLowerCase()}`}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200"
              >
                {category}
              </Link>
            ))}
          </div>
        )}
        
        <h3 className="text-xl font-bold mb-2">
          {hasAccess ? (
            <Link href={`/news/${id}`} className="hover:text-primary-600">
              {title}
            </Link>
          ) : (
            <span className="text-gray-700">{title}</span>
          )}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{summary}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{author}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

