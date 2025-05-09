import Navbar from '@/components/layout/Navbar';
import ArticleReader from '@/components/article/ArticleReader';

// Mock article data for demonstration
const mockArticle = {
  id: '1',
  title: 'Global Markets Respond to New Economic Policies',
  subtitle: 'Major indices show positive trends as new fiscal measures take effect',
  content: `
    <p>Financial markets around the world have responded positively to the new set of economic policies announced by major central banks this week. The coordinated approach to monetary policy has been welcomed by investors, leading to significant gains across global indices.</p>
    
    <h2>Policy Changes</h2>
    <p>The Federal Reserve, European Central Bank, and Bank of Japan announced a series of measures aimed at stimulating economic growth while managing inflation concerns. These include:</p>
    <ul>
      <li>Targeted interest rate adjustments</li>
      <li>Enhanced liquidity provisions for financial institutions</li>
      <li>Extended asset purchase programs</li>
      <li>New lending facilities for small and medium enterprises</li>
    </ul>
    
    <p>Economists have largely praised the approach, noting that it represents a more nuanced understanding of the current economic landscape compared to previous policy frameworks.</p>
    
    <h2>Market Reaction</h2>
    <p>Stock markets in the United States, Europe, and Asia all posted significant gains following the announcements. The S&P 500 rose by 2.3%, while the FTSE 100 and Nikkei 225 gained 1.8% and 2.5% respectively.</p>
    
    <p>Bond markets also reacted positively, with yields on 10-year government bonds falling across major economies, indicating increased investor confidence in the long-term economic outlook.</p>
    
    <h2>Expert Analysis</h2>
    <p>According to Dr. Sarah Chen, Chief Economist at Global Financial Research, "These policy changes represent a significant shift in how central banks are approaching the current economic challenges. The focus on targeted support rather than broad-based stimulus suggests a more sophisticated understanding of the structural issues facing the global economy."</p>
    
    <p>Industry leaders have also welcomed the announcements, with many citing the potential for increased business investment as a result of the improved economic outlook.</p>
    
    <h2>Long-term Implications</h2>
    <p>While the immediate market reaction has been positive, analysts caution that the long-term effectiveness of these policies will depend on a range of factors, including:</p>
    <ul>
      <li>The pace of technological innovation</li>
      <li>Developments in international trade relations</li>
      <li>The evolution of consumer behavior post-pandemic</li>
      <li>Progress on climate change mitigation efforts</li>
    </ul>
    
    <p>Nevertheless, the coordinated approach taken by major central banks has been seen as a positive step towards addressing the complex economic challenges facing the global economy.</p>
  `,
  imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  author: 'Michael Johnson',
  publishedAt: '2023-12-01T08:30:00Z',
  source: 'Financial Times',
  sourceUrl: 'https://www.ft.com',
  categories: ['Economy', 'Global Markets', 'Policy'],
  readTimeMinutes: 5,
  relatedArticles: [
    {
      id: '2',
      title: 'Central Banks Coordinate Policy Response',
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      id: '3',
      title: 'Investors Respond to New Economic Framework',
      imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      id: '4',
      title: 'Analysis: The Future of Monetary Policy',
      imageUrl: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
  ],
};

// In a real app, this would fetch data based on the article ID
export default function ArticlePage({ params }: { params: { id: string } }) {
  // Here you would fetch the article data based on params.id
  // For now, we'll just use our mock data
  
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleReader
          id={mockArticle.id}
          title={mockArticle.title}
          subtitle={mockArticle.subtitle}
          content={mockArticle.content}
          imageUrl={mockArticle.imageUrl}
          author={mockArticle.author}
          publishedAt={mockArticle.publishedAt}
          source={mockArticle.source}
          sourceUrl={mockArticle.sourceUrl}
          categories={mockArticle.categories}
          readTimeMinutes={mockArticle.readTimeMinutes}
          relatedArticles={mockArticle.relatedArticles}
        />
      </div>
    </>
  );
}
