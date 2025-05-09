import Image from 'next/image';
import Link from 'next/link';

interface NewsCardProps {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  readTimeMinutes: number;
  accessTier: 'free' | 'premium' | 'organization';
}

export default function NewsCard({
  id,
  title,
  subtitle,
  imageUrl,
  category,
  publishedAt,
  readTimeMinutes,
  accessTier
}: NewsCardProps) {
  // Format the date
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Determine badge color based on access tier
  const getBadgeColor = () => {
    switch (accessTier) {
      case 'premium':
        return 'bg-secondary text-white';
      case 'organization':
        return 'bg-accent text-white';
      default:
        return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor()}`}>
            {accessTier.charAt(0).toUpperCase() + accessTier.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-primary dark:text-primary-300">{category}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
        </div>
        <Link href={`/article/${id}`}>
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-300 transition-colors">
            {title}
          </h3>
        </Link>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{subtitle}</p>
        )}
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">{readTimeMinutes} min read</span>
          <Link 
            href={`/article/${id}`}
            className="text-sm font-medium text-primary dark:text-primary-300 hover:underline"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}

