import Image from 'next/image';
import Link from 'next/link';

interface ArticleReaderProps {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  source: string;
  sourceUrl: string;
  categories: string[];
  readTimeMinutes: number;
  relatedArticles?: Array<{
    id: string;
    title: string;
    imageUrl: string;
  }>;
}

export default function ArticleReader({
  id,
  title,
  subtitle,
  content,
  imageUrl,
  author,
  publishedAt,
  source,
  sourceUrl,
  categories,
  readTimeMinutes,
  relatedArticles
}: ArticleReaderProps) {
  // Format the date
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative h-96 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              href={`/category/${category.toLowerCase()}`}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
        
        {subtitle && (
          <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-6">{subtitle}</h2>
        )}
        
        <div className="flex items-center justify-between mb-8 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center">
            <span className="mr-4">By {author}</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <span>{readTimeMinutes} min read</span>
          </div>
        </div>
        
        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-8 text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            Source: <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{source}</a>
          </p>
        </div>
        
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/article/${article.id}`}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="relative h-16 w-16 flex-shrink-0">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{article.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

