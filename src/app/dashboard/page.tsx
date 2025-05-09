import Navbar from '@/components/layout/Navbar';
import NewsCard from '@/components/article/NewsCard';
import FilterPanel from '@/components/ui/FilterPanel';

// Mock data for demonstration
const mockCategories = [
  { id: 'politics', label: 'Politics' },
  { id: 'economy', label: 'Economy' },
  { id: 'technology', label: 'Technology' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' },
];

const mockRegions = [
  { id: 'north-america', label: 'North America' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia', label: 'Asia' },
  { id: 'africa', label: 'Africa' },
  { id: 'south-america', label: 'South America' },
];

const mockTopics = [
  { id: 'ai', label: 'Artificial Intelligence' },
  { id: 'climate', label: 'Climate Change' },
  { id: 'crypto', label: 'Cryptocurrency' },
  { id: 'elections', label: 'Elections' },
  { id: 'startups', label: 'Startups' },
];

const mockSources = [
  { id: 'nyt', label: 'New York Times' },
  { id: 'bbc', label: 'BBC' },
  { id: 'reuters', label: 'Reuters' },
  { id: 'ap', label: 'Associated Press' },
  { id: 'bloomberg', label: 'Bloomberg' },
];

const mockArticles = [
  {
    id: '1',
    title: 'Global Markets Respond to New Economic Policies',
    subtitle: 'Major indices show positive trends as new fiscal measures take effect',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Economy',
    publishedAt: '2023-12-01T08:30:00Z',
    readTimeMinutes: 5,
    accessTier: 'free' as const,
  },
  {
    id: '2',
    title: 'Breakthrough in Quantum Computing Announced',
    subtitle: 'Scientists achieve quantum supremacy with new 128-qubit processor',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Technology',
    publishedAt: '2023-11-30T14:45:00Z',
    readTimeMinutes: 8,
    accessTier: 'premium' as const,
  },
  {
    id: '3',
    title: 'Climate Summit Reaches Historic Agreement',
    subtitle: 'Nations commit to ambitious carbon reduction targets by 2030',
    imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Politics',
    publishedAt: '2023-11-29T19:15:00Z',
    readTimeMinutes: 6,
    accessTier: 'free' as const,
  },
  {
    id: '4',
    title: 'New AI Model Revolutionizes Natural Language Processing',
    subtitle: 'Open-source model achieves state-of-the-art results on multiple benchmarks',
    imageUrl: 'https://images.unsplash.com/photo-1677442135136-760c813a743d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Technology',
    publishedAt: '2023-11-28T11:20:00Z',
    readTimeMinutes: 7,
    accessTier: 'organization' as const,
  },
  {
    id: '5',
    title: 'Healthcare Innovation: Personalized Medicine Breakthrough',
    subtitle: 'New genetic treatment shows promising results in clinical trials',
    imageUrl: 'https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Health',
    publishedAt: '2023-11-27T09:10:00Z',
    readTimeMinutes: 5,
    accessTier: 'premium' as const,
  },
  {
    id: '6',
    title: 'Space Exploration: New Exoplanet Discovery',
    subtitle: 'Astronomers find potentially habitable planet 40 light-years away',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Science',
    publishedAt: '2023-11-26T16:30:00Z',
    readTimeMinutes: 6,
    accessTier: 'free' as const,
  },
];

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <FilterPanel
              categories={mockCategories}
              regions={mockRegions}
              topics={mockTopics}
              sources={mockSources}
              onFilterChange={(filters) => {
                // In a real app, this would trigger a data fetch with the selected filters
                console.log('Filters changed:', filters);
              }}
            />
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Today's Top Stories</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  subtitle={article.subtitle}
                  imageUrl={article.imageUrl}
                  category={article.category}
                  publishedAt={article.publishedAt}
                  readTimeMinutes={article.readTimeMinutes}
                  accessTier={article.accessTier}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
