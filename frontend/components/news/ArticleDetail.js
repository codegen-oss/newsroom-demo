import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

export default function ArticleDetail({ article }) {
  const { user } = useAuth();
  const router = useRouter();
  
  if (!article) {
    return (
      <div className="card animate-pulse">
        <div className="h-64 bg-gray-200 rounded-md mb-6"></div>
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-6 w-1/3"></div>
        <div className="space-y-4 mb-8">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const {
    title,
    content,
    author,
    publishedAt,
    source,
    sourceUrl,
    categories,
    accessTier,
    featuredImage,
  } = article;

  // Check if user has access to this article
  const userTier = user?.subscriptionTier || 'free';
  const hasAccess = 
    accessTier === 'free' || 
    (accessTier === 'premium' && (userTier === 'individual' || userTier === 'organization')) ||
    (accessTier === 'organization' && userTier === 'organization');

  // Format date
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!hasAccess) {
    return (
      <div className="card text-center py-12">
        <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
          <svg 
            className="w-full h-full" 
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
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">
          This content is only available to {accessTier === 'premium' ? 'premium' : 'organization'} subscribers.
        </p>
        <Link href="/profile/subscription" className="btn btn-primary">
          Upgrade Your Subscription
        </Link>
      </div>
    );
  }

  return (
    <article className="card">
      {featuredImage && (
        <div className="relative h-64 md:h-96 -mx-6 -mt-6 mb-6 md:rounded-t-lg overflow-hidden">
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        
        <div className="flex flex-wrap items-center text-gray-600 gap-x-4 gap-y-2">
          <span>By {author}</span>
          <span>•</span>
          <span>{formattedDate}</span>
          {source && (
            <>
              <span>•</span>
              <span>
                Source:{' '}
                {sourceUrl ? (
                  <a 
                    href={sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800"
                  >
                    {source}
                  </a>
                ) : (
                  source
                )}
              </span>
            </>
          )}
        </div>
      </div>
      
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Link 
              key={category} 
              href={`/news?category=${category.toLowerCase()}`}
              className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
            >
              {category}
            </Link>
          ))}
        </div>
      )}
      
      <div className="prose prose-lg max-w-none">
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

