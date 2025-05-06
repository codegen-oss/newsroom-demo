import axios from 'axios';
import { Article, ArticleFilters, PaginatedArticles } from '@/types/article';

// Base API URL - would be replaced with actual API URL in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.newsroom-demo.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For demo purposes, we'll simulate API responses with mock data
// In a real application, these would make actual API calls
export const fetchArticles = async (
  page = 1,
  pageSize = 10,
  filters?: ArticleFilters
): Promise<PaginatedArticles> => {
  try {
    // In a real app, this would be an actual API call:
    // const response = await api.get('/articles', { params: { page, pageSize, ...filters } });
    // return response.data;
    
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter mock articles based on provided filters
    let filteredArticles = [...mockArticles];
    
    if (filters) {
      if (filters.category) {
        filteredArticles = filteredArticles.filter(article => 
          article.category.toLowerCase() === filters.category?.toLowerCase()
        );
      }
      
      if (filters.tag) {
        filteredArticles = filteredArticles.filter(article => 
          article.tags.some(tag => tag.toLowerCase() === filters.tag?.toLowerCase())
        );
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredArticles = filteredArticles.filter(article => 
          article.title.toLowerCase().includes(searchTerm) || 
          article.excerpt.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.accessTier) {
        filteredArticles = filteredArticles.filter(article => 
          article.accessTier === filters.accessTier
        );
      }
    }
    
    // Calculate pagination
    const total = filteredArticles.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    return {
      articles: paginatedArticles,
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const fetchArticleById = async (id: string): Promise<Article | null> => {
  try {
    // In a real app, this would be an actual API call:
    // const response = await api.get(`/articles/${id}`);
    // return response.data;
    
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const article = mockArticles.find(article => article.id === id);
    return article || null;
  } catch (error) {
    console.error(`Error fetching article with ID ${id}:`, error);
    throw error;
  }
};

export const fetchArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    // In a real app, this would be an actual API call:
    // const response = await api.get(`/articles/slug/${slug}`);
    // return response.data;
    
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const article = mockArticles.find(article => article.slug === slug);
    return article || null;
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    throw error;
  }
};

export const fetchFeaturedArticles = async (): Promise<Article[]> => {
  try {
    // In a real app, this would be an actual API call:
    // const response = await api.get('/articles/featured');
    // return response.data;
    
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockArticles.filter(article => article.featured);
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    // In a real app, this would be an actual API call:
    // const response = await api.get('/categories');
    // return response.data;
    
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Extract unique categories from mock articles
    const categories = [...new Set(mockArticles.map(article => article.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Mock data for demo purposes
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence',
    slug: 'future-of-artificial-intelligence',
    excerpt: 'Exploring how AI will shape our world in the coming decades.',
    content: `
      <p>Artificial Intelligence (AI) is rapidly transforming our world. From self-driving cars to virtual assistants, AI technologies are becoming increasingly integrated into our daily lives.</p>
      
      <p>In the coming decades, experts predict that AI will continue to evolve and impact various sectors, including healthcare, finance, education, and transportation. The potential benefits are enormous, from more accurate medical diagnoses to more efficient energy consumption.</p>
      
      <p>However, the rise of AI also raises important ethical questions. How do we ensure that AI systems are fair and unbiased? How do we protect privacy in an age of intelligent surveillance? These are challenges that society will need to address as AI becomes more powerful and pervasive.</p>
      
      <p>Despite these concerns, the future of AI looks promising. With responsible development and thoughtful regulation, AI has the potential to solve some of humanity's most pressing problems and create a more prosperous and equitable world.</p>
    `,
    coverImage: 'https://source.unsplash.com/random/800x600/?ai',
    author: {
      name: 'Dr. Sarah Chen',
      avatar: 'https://source.unsplash.com/random/100x100/?portrait',
    },
    category: 'Technology',
    tags: ['AI', 'Future', 'Technology', 'Ethics'],
    publishedAt: '2025-04-15T10:30:00Z',
    accessTier: 'free',
    featured: true,
  },
  {
    id: '2',
    title: 'Climate Change: The Path Forward',
    slug: 'climate-change-path-forward',
    excerpt: 'Examining sustainable solutions to address global climate challenges.',
    content: `
      <p>Climate change represents one of the greatest challenges of our time. Rising temperatures, extreme weather events, and sea level rise threaten communities around the world.</p>
      
      <p>However, there is reason for hope. Renewable energy technologies like solar and wind power are becoming increasingly affordable and widespread. Electric vehicles are gaining market share, reducing emissions from transportation. And innovative approaches to agriculture and forestry are helping to sequester carbon and protect biodiversity.</p>
      
      <p>Governments, businesses, and individuals all have important roles to play in addressing climate change. Policy measures like carbon pricing can create incentives for emissions reductions. Companies can adopt sustainable practices and develop clean technologies. And individuals can make choices in their daily lives that reduce their environmental footprint.</p>
      
      <p>The path forward will not be easy, but with collective action and determination, we can build a more sustainable and resilient future for generations to come.</p>
    `,
    coverImage: 'https://source.unsplash.com/random/800x600/?climate',
    author: {
      name: 'James Rodriguez',
      avatar: 'https://source.unsplash.com/random/100x100/?man',
    },
    category: 'Environment',
    tags: ['Climate', 'Sustainability', 'Environment', 'Policy'],
    publishedAt: '2025-04-10T14:45:00Z',
    accessTier: 'free',
    featured: true,
  },
  {
    id: '3',
    title: 'The Rise of Decentralized Finance',
    slug: 'rise-of-decentralized-finance',
    excerpt: 'How DeFi is revolutionizing the financial industry.',
    content: `
      <p>Decentralized Finance, or DeFi, is an emerging financial technology based on secure distributed ledgers similar to those used by cryptocurrencies. The system removes the control banks and institutions have on money, financial products, and financial services.</p>
      
      <p>DeFi platforms allow people to lend or borrow funds from others, speculate on price movements on a range of assets using derivatives, trade cryptocurrencies, insure against risks, and earn interest in savings-like accounts. Some DeFi applications promote high interest rates but are subject to high risk.</p>
      
      <p>The appeal of DeFi is clear: it eliminates the fees that banks and other financial companies charge for using their services. DeFi applications are designed to be open to anyone with an internet connection, regardless of their location or social status.</p>
      
      <p>However, DeFi also comes with risks, including smart contract vulnerabilities, regulatory uncertainty, and market volatility. As the sector continues to evolve, finding the right balance between innovation and protection will be crucial for its long-term success.</p>
    `,
    coverImage: 'https://source.unsplash.com/random/800x600/?finance',
    author: {
      name: 'Elena Petrova',
      avatar: 'https://source.unsplash.com/random/100x100/?woman',
    },
    category: 'Finance',
    tags: ['DeFi', 'Cryptocurrency', 'Blockchain', 'Finance'],
    publishedAt: '2025-04-05T09:15:00Z',
    accessTier: 'premium',
    featured: false,
  },
  {
    id: '4',
    title: 'The Science of Sleep',
    slug: 'science-of-sleep',
    excerpt: 'Understanding the crucial role of sleep in health and wellbeing.',
    content: `
      <p>Sleep is a fundamental biological process that is essential for our physical and mental health. Despite spending roughly one-third of our lives asleep, many aspects of sleep remain mysterious to scientists.</p>
      
      <p>Research has shown that sleep plays a crucial role in a variety of bodily functions, including immune system regulation, metabolism, memory consolidation, and emotional processing. Chronic sleep deprivation has been linked to a range of health problems, including obesity, diabetes, cardiovascular disease, and depression.</p>
      
      <p>The sleep cycle consists of several stages, including light sleep, deep sleep, and REM (rapid eye movement) sleep. Each stage serves different purposes and contributes to overall sleep quality. Understanding these stages can help individuals optimize their sleep habits and improve their health.</p>
      
      <p>In our fast-paced modern world, prioritizing sleep can be challenging. However, the benefits of good sleep hygiene are clear. By making sleep a priority and adopting healthy sleep habits, individuals can enhance their wellbeing and quality of life.</p>
    `,
    coverImage: 'https://source.unsplash.com/random/800x600/?sleep',
    author: {
      name: 'Dr. Michael Thompson',
      avatar: 'https://source.unsplash.com/random/100x100/?doctor',
    },
    category: 'Health',
    tags: ['Sleep', 'Health', 'Wellness', 'Science'],
    publishedAt: '2025-03-28T11:20:00Z',
    accessTier: 'free',
    featured: false,
  },
  {
    id: '5',
    title: 'The Evolution of Remote Work',
    slug: 'evolution-of-remote-work',
    excerpt: 'How the pandemic transformed the way we work.',
    content: `
      <p>The COVID-19 pandemic accelerated a trend that was already underway: the shift toward remote work. As offices closed and social distancing measures were implemented, millions of workers around the world adapted to working from home.</p>
      
      <p>This sudden transition revealed both the possibilities and challenges of remote work. On one hand, many workers appreciated the flexibility, autonomy, and lack of commute that came with working from home. On the other hand, issues like isolation, work-life balance, and digital communication fatigue emerged as significant concerns.</p>
      
      <p>As we move beyond the pandemic, a hybrid model of work is emerging, combining elements of remote and in-person work. Companies are reimagining their office spaces, work policies, and team dynamics to accommodate this new reality.</p>
      
      <p>The evolution of remote work has profound implications for urban planning, real estate, transportation, and social structures. It also raises important questions about equity and access, as not all jobs can be performed remotely and not all workers have suitable home environments for remote work.</p>
    `,
    coverImage: 'https://source.unsplash.com/random/800x600/?work',
    author: {
      name: 'Sophia Williams',
      avatar: 'https://source.unsplash.com/random/100x100/?woman',
    },
    category: 'Work',
    tags: ['Remote Work', 'Future of Work', 'Pandemic', 'Workplace'],
    publishedAt: '2025-03-20T13:40:00Z',
    accessTier: 'free',
    featured: true,
  },
  {
    id: '6',
    title: 'The Art of Mindfulness',
    slug: 'art-of-mindfulness',
    excerpt: 'Cultivating presence and awareness in everyday life.',
    content: `
      <p>Mindfulness, the practice of bringing one's attention to the present moment, has gained significant popularity in recent years. Rooted in ancient Buddhist traditions, mindfulness has been adapted for secular contexts and integrated into various therapeutic approaches.</p>
      
      <p>Research has shown that mindfulness practices can have numerous benefits for mental and physical health. These include reduced stress, anxiety, and depression; improved focus and cognitive function; enhanced emotional regulation; and better immune function.</p>
      
      <p>Mindfulness can be cultivated through formal meditation practices as well as informal exercises integrated into daily activities. The key is to develop a non-judgmental awareness of one's thoughts, feelings, bodily sensations, and surrounding environment.</p>
      
      <p>In our distraction-filled digital age, the practice of mindfulness offers a valuable antidote to constant stimulation and multitasking. By learning to be fully present, individuals can enhance their wellbeing and develop a deeper appreciation for the richness of everyday experience.</p>
    `,
    coverImage: 'https://source.unsplash.com/random/800x600/?meditation',
    author: {
      name: 'David Chen',
      avatar: 'https://source.unsplash.com/random/100x100/?man',
    },
    category: 'Wellness',
    tags: ['Mindfulness', 'Meditation', 'Mental Health', 'Wellness'],
    publishedAt: '2025-03-15T16:55:00Z',
    accessTier: 'premium',
    featured: false,
  },
  {
    id: '7',
    title: 'The Future of Space Exploration',
    slug: 'future-of-space-exploration',
    excerpt: 'New frontiers in humanity\'s journey to the stars.',
    content: `
      <p>Space exploration is entering an exciting new era. After decades of being primarily the domain of government agencies, space is now being opened up by private companies like SpaceX, Blue Origin, and Virgin Galactic.</p>
      
      <p>These developments are making space more accessible and are accelerating innovation in the field. Reusable rockets are dramatically reducing the cost of reaching orbit. Plans for lunar bases, Mars missions, and space tourism are moving from science fiction to concrete projects.</p>
      
      <p>Beyond human spaceflight, robotic missions continue to expand our understanding of the solar system and beyond. Telescopes like the James Webb Space Telescope are revealing the universe in unprecedented detail, while rovers and probes are exploring the surfaces and atmospheres of other planets and moons.</p>
      
      <p>The future of space exploration holds immense potential for scientific discovery, technological advancement, and perhaps even the expansion of human civilization beyond Earth. As we look to the stars, we are embarking on a journey that will continue to inspire and challenge us for generations to come.</p>
    `,
    coverImage: 'https://source.unsplash.com/random/800x600/?space',
    author: {
      name: 'Dr. Robert Martinez',
      avatar: 'https://source.unsplash.com/random/100x100/?scientist',
    },
    category: 'Science',
    tags: ['Space', 'Astronomy', 'Exploration', 'Technology'],
    publishedAt: '2025-03-10T08:30:00Z',
    accessTier: 'exclusive',
    featured: true,
  },
  {
    id: '8',
    title: 'The Psychology of Decision Making',
    slug: 'psychology-of-decision-making',
    excerpt: 'Understanding how we make choices and how to make better ones.',
    content: `
      <p>Decision making is a complex cognitive process that involves evaluating options, weighing preferences, and choosing a course of action. While we often think of ourselves as rational decision makers, psychological research has revealed that our choices are influenced by a variety of biases and heuristics.</p>
      
      <p>Cognitive biases like confirmation bias, anchoring, and the availability heuristic can lead us to make suboptimal decisions. Emotional factors also play a significant role, sometimes overriding logical considerations. And social influences, such as conformity and authority, can shape our choices in powerful ways.</p>
      
      <p>Understanding these psychological factors can help us make better decisions. Techniques like considering the opposite, using decision matrices, and engaging in deliberate reflection can counteract biases and lead to more rational choices.</p>
      
      <p>In an increasingly complex world with an abundance of options, the psychology of decision making offers valuable insights for navigating choices in both personal and professional contexts.</p>
    `,
    coverImage: 'https://source.unsplash.com/random/800x600/?psychology',
    author: {
      name: 'Dr. Lisa Johnson',
      avatar: 'https://source.unsplash.com/random/100x100/?psychologist',
    },
    category: 'Psychology',
    tags: ['Psychology', 'Decision Making', 'Cognitive Bias', 'Behavior'],
    publishedAt: '2025-03-05T15:10:00Z',
    accessTier: 'premium',
    featured: false,
  },
  {
    id: '9',
    title: 'The Renaissance of Vinyl Records',
    slug: 'renaissance-of-vinyl-records',
    excerpt: 'How analog music formats are thriving in a digital world.',
    content: `
      <p>In an age of digital streaming and unlimited access to music, vinyl records have made a remarkable comeback. What was once considered an obsolete format has experienced a renaissance, with vinyl sales reaching levels not seen since the 1980s.</p>
      
      <p>This resurgence can be attributed to several factors. Many listeners appreciate the warm, rich sound quality of vinyl, which some argue captures nuances that digital formats miss. The physical nature of records also provides a tangible connection to music that streaming lacks, from the large-format album art to the ritual of placing a record on a turntable.</p>
      
      <p>Vinyl has also become a symbol of authenticity and connoisseurship in music culture. In a world where algorithms often dictate listening habits, the deliberate act of selecting and purchasing a record represents a more intentional approach to music consumption.</p>
      
      <p>Record stores, once endangered by digital disruption, have found new life as community spaces where music lovers gather to browse, discover, and discuss. The vinyl revival demonstrates that even in our increasingly digital world, there remains a place for analog experiences that engage our senses and connect us to cultural traditions.</p>
    `,
    coverImage: 'https://source.unsplash.com/random/800x600/?vinyl',
    author: {
      name: 'Marcus Lee',
      avatar: 'https://source.unsplash.com/random/100x100/?musician',
    },
    category: 'Culture',
    tags: ['Music', 'Vinyl', 'Culture', 'Analog'],
    publishedAt: '2025-02-28T12:25:00Z',
    accessTier: 'free',
    featured: false,
  },
  {
    id: '10',
    title: 'The Ethics of Genetic Engineering',
    slug: 'ethics-of-genetic-engineering',
    excerpt: 'Navigating the moral complexities of modifying the code of life.',
    content: `
      <p>Genetic engineering technologies like CRISPR-Cas9 have revolutionized our ability to modify the genetic code of living organisms. These tools offer unprecedented possibilities for treating diseases, enhancing crop yields, and even altering the traits of future generations.</p>
      
      <p>However, these capabilities also raise profound ethical questions. When it comes to human genetic modification, where should we draw the line between treating diseases and enhancing traits? Who should have access to these technologies, and how can we ensure they don't exacerbate social inequalities? What are the potential ecological consequences of releasing genetically modified organisms into the environment?</p>
      
      <p>Different cultural, religious, and philosophical perspectives offer varying answers to these questions. Some emphasize the potential benefits of genetic engineering for alleviating suffering and improving human welfare. Others caution against "playing god" and disrupting natural processes that have evolved over millions of years.</p>
      
      <p>As genetic engineering continues to advance, society will need to engage in thoughtful dialogue about these ethical dimensions. Developing robust governance frameworks that balance innovation with precaution will be essential for ensuring that genetic technologies are developed and applied in ways that align with our shared values and promote the common good.</p>
    `,
    coverImage: 'https://source.unsplash.com/random/800x600/?dna',
    author: {
      name: 'Dr. Emily Nguyen',
      avatar: 'https://source.unsplash.com/random/100x100/?scientist',
    },
    category: 'Ethics',
    tags: ['Genetics', 'Ethics', 'Biotechnology', 'Science'],
    publishedAt: '2025-02-20T10:05:00Z',
    accessTier: 'exclusive',
    featured: false,
  },
];

export default api;

