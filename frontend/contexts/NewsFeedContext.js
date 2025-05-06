import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const NewsFeedContext = createContext();

export function useNewsFeed() {
  return useContext(NewsFeedContext);
}

export function NewsFeedProvider({ children }) {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock data for articles
  const mockArticles = [
    {
      id: '1',
      title: 'Global Markets React to New Trade Policies',
      summary: 'Major stock indices showed mixed reactions as new international trade policies were announced affecting key sectors.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      author: 'Jane Smith',
      publishedAt: '2023-11-15T10:30:00Z',
      source: 'Financial Times',
      sourceUrl: 'https://example.com/article1',
      categories: ['Economy', 'Geopolitics'],
      accessTier: 'free',
      featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop',
    },
    {
      id: '2',
      title: 'Tech Giants Announce Breakthrough in Quantum Computing',
      summary: 'Leading technology companies have jointly announced a significant advancement in quantum computing technology that could revolutionize data processing.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      author: 'Alex Johnson',
      publishedAt: '2023-11-14T14:45:00Z',
      source: 'Tech Insider',
      sourceUrl: 'https://example.com/article2',
      categories: ['Technology'],
      accessTier: 'free',
      featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
    },
    {
      id: '3',
      title: 'New Climate Agreement Reached at International Summit',
      summary: 'World leaders have reached a landmark agreement on climate change, setting ambitious targets for carbon reduction over the next decade.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      author: 'Maria Garcia',
      publishedAt: '2023-11-13T09:15:00Z',
      source: 'Global News Network',
      sourceUrl: 'https://example.com/article3',
      categories: ['Geopolitics'],
      accessTier: 'premium',
      featuredImage: 'https://images.unsplash.com/photo-1532408840957-031d8034aeef?w=800&auto=format&fit=crop',
    },
    {
      id: '4',
      title: 'Cryptocurrency Markets Experience Major Volatility',
      summary: 'Major cryptocurrencies saw significant price swings as regulatory announcements and institutional investments created market turbulence.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      author: 'David Kim',
      publishedAt: '2023-11-12T16:20:00Z',
      source: 'Crypto Daily',
      sourceUrl: 'https://example.com/article4',
      categories: ['Economy', 'Technology'],
      accessTier: 'free',
      featuredImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop',
    },
    {
      id: '5',
      title: 'Advances in AI Raise New Ethical Questions',
      summary: 'Recent breakthroughs in artificial intelligence have prompted experts to call for new ethical frameworks and regulatory approaches.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      author: 'Sarah Chen',
      publishedAt: '2023-11-11T11:00:00Z',
      source: 'Tech Ethics Journal',
      sourceUrl: 'https://example.com/article5',
      categories: ['Technology'],
      accessTier: 'premium',
      featuredImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop',
    },
    {
      id: '6',
      title: 'Exclusive Report: Inside the Global Supply Chain Crisis',
      summary: 'An in-depth investigation reveals the complex factors behind ongoing global supply chain disruptions and their economic impact.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      author: 'Robert Williams',
      publishedAt: '2023-11-10T08:30:00Z',
      source: 'Economic Review',
      sourceUrl: 'https://example.com/article6',
      categories: ['Economy', 'Geopolitics'],
      accessTier: 'organization',
      featuredImage: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&auto=format&fit=crop',
    },
  ];

  const fetchArticles = useCallback(async (filters = {}) => {
    setLoading(true);
    setError('');
    
    try {
      // In a real app, this would fetch from an API with filters
      // For demo purposes, we'll use mock data with client-side filtering
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredArticles = [...mockArticles];
      
      // Apply category filter
      if (filters.category) {
        filteredArticles = filteredArticles.filter(article => 
          article.categories.some(cat => cat.toLowerCase() === filters.category.toLowerCase())
        );
      }
      
      // Apply region filter (in a real app)
      if (filters.region) {
        // This would be handled by the backend in a real app
        // For demo, we'll just return the articles as is
      }
      
      // Apply topic filter (in a real app)
      if (filters.topic) {
        // This would be handled by the backend in a real app
        // For demo, we'll just return a subset of articles
        filteredArticles = filteredArticles.slice(0, 3);
      }
      
      setArticles(filteredArticles);
    } catch (error) {
      console.error('Error fetching articles', error);
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getArticleById = useCallback(async (id) => {
    try {
      // In a real app, this would fetch from an API
      // For demo purposes, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const article = mockArticles.find(article => article.id === id);
      
      if (!article) {
        throw new Error('Article not found');
      }
      
      return article;
    } catch (error) {
      console.error('Error fetching article', error);
      throw new Error('Failed to load article');
    }
  }, []);

  const value = {
    articles,
    loading,
    error,
    fetchArticles,
    getArticleById,
  };

  return (
    <NewsFeedContext.Provider value={value}>
      {children}
    </NewsFeedContext.Provider>
  );
}

