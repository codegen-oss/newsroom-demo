'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiBookmark, FiShare2, FiThumbsUp, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';

// Mock article data
const mockArticle = {
  id: '1',
  title: 'Global Economic Summit Addresses Climate Change Initiatives',
  content: `
    <p class="lead">World leaders gathered this week at the Global Economic Summit to discuss comprehensive policies that address climate change while ensuring sustainable economic growth.</p>
    
    <p>The three-day summit, held in Geneva, Switzerland, brought together representatives from over 120 countries to tackle what many are calling the most pressing challenge of our time: balancing economic development with environmental sustainability.</p>
    
    <h2>Key Agreements</h2>
    
    <p>The summit resulted in several groundbreaking agreements:</p>
    
    <ul>
      <li>A commitment to reduce carbon emissions by 50% by 2035</li>
      <li>Establishment of a $100 billion climate innovation fund</li>
      <li>Creation of an international carbon pricing framework</li>
      <li>Development of green technology transfer programs for developing nations</li>
    </ul>
    
    <p>"This represents a fundamental shift in how we approach economic policy," said UN Secretary-General Maria Rodriguez. "For too long, we've treated climate action and economic growth as opposing forces. This summit proves they can and must work together."</p>
    
    <h2>Market Reactions</h2>
    
    <p>Financial markets responded positively to the announcements, with renewable energy stocks seeing significant gains. The Global Clean Energy Index rose 4.2% following the summit's conclusion.</p>
    
    <p>Analysts suggest this indicates growing investor confidence in the long-term profitability of sustainable business models and green technologies.</p>
    
    <blockquote>
      <p>"We're witnessing a historic realignment of capital toward sustainable enterprises," noted financial analyst James Chen. "The markets are clearly signaling that the future belongs to companies that can thrive in a low-carbon economy."</p>
    </blockquote>
    
    <h2>Implementation Challenges</h2>
    
    <p>Despite the optimism, significant challenges remain in implementing these ambitious agreements. Developing nations have expressed concerns about the pace of transition and the need for financial support.</p>
    
    <p>India's climate envoy, Dr. Priya Sharma, emphasized the importance of equity in the global response: "While we fully support climate action, we must ensure that the path to a green economy doesn't leave vulnerable populations behind."</p>
    
    <p>The summit established a working group to address these concerns, with quarterly meetings scheduled to monitor progress and adjust strategies as needed.</p>
    
    <h2>Looking Ahead</h2>
    
    <p>The agreements reached at the summit will now move to implementation phases, with countries expected to incorporate the frameworks into their national policies within the next 12 months.</p>
    
    <p>A follow-up summit is scheduled for next year in Singapore, where leaders will assess progress and potentially expand commitments based on technological developments and economic conditions.</p>
    
    <p>As the world watches these policies unfold, the true test will be whether this new approach can deliver on its promise: a future where economic prosperity and environmental sustainability go hand in hand.</p>
  `,
  summary: 'World leaders gathered to discuss economic policies that address climate change and sustainable development goals.',
  source: 'Global News',
  author: 'Jane Smith',
  publishedAt: '2025-04-15T10:30:00Z',
  readTimeMinutes: 5,
  category: 'Economy',
  imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
  premium: true,
  tags: ['Climate Change', 'Economy', 'Global Summit', 'Sustainability'],
  relatedArticles: [
    {
      id: '2',
      title: 'New Technology Breakthrough in Quantum Computing',
      summary: 'Scientists have achieved a significant breakthrough in quantum computing that could revolutionize data processing capabilities.',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      category: 'Technology',
    },
    {
      id: '3',
      title: 'Diplomatic Relations Strengthen Between Eastern Nations',
      summary: 'A historic agreement has been signed between two major Eastern powers, signaling improved diplomatic and trade relations.',
      imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      category: 'Geopolitics',
    },
  ],
};

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  
  // Format date
  const formattedDate = new Date(mockArticle.publishedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Handle save/bookmark
  const handleSave = () => {
    setIsSaved(!isSaved);
    // Here you would also call an API to save the article
  };

  // Handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would also call an API to like the article
  };

  // Handle share
  const handleShare = () => {
    // Here you would implement share functionality
    if (navigator.share) {
      navigator.share({
        title: mockArticle.title,
        text: mockArticle.summary,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Share functionality not supported by your browser');
    }
  };

  // Font size classes
  const fontSizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline">
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - article */}
        <article className="lg:col-span-2 glass-card">
          {/* Article header */}
          <header className="mb-8">
            {/* Category */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
                {mockArticle.category}
              </span>
              {mockArticle.premium && (
                <span className="ml-2 px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-800 dark:text-accent-200 rounded-full text-sm font-medium">
                  Premium
                </span>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {mockArticle.title}
            </h1>
            
            {/* Meta information */}
            <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span className="mr-4">{mockArticle.source}</span>
              <span className="mr-4">By {mockArticle.author}</span>
              <span className="mr-4">{formattedDate}</span>
              <span className="flex items-center">
                <FiClock className="mr-1" />
                {mockArticle.readTimeMinutes} min read
              </span>
            </div>
            
            {/* Featured image */}
            <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
              <Image
                src={mockArticle.imageUrl}
                alt={mockArticle.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </header>
          
          {/* Reading controls */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            {/* Font size controls */}
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Text:</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setFontSize('small')}
                  className={`px-2 py-1 text-xs rounded ${
                    fontSize === 'small' 
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200'
                  }`}
                  aria-label="Small text"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('medium')}
                  className={`px-2 py-1 text-sm rounded ${
                    fontSize === 'medium' 
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200'
                  }`}
                  aria-label="Medium text"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-1 text-base rounded ${
                    fontSize === 'large' 
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200'
                  }`}
                  aria-label="Large text"
                >
                  A
                </button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-2">
              <button 
                onClick={handleSave}
                className={`p-2 rounded-full transition-colors ${
                  isSaved 
                    ? 'text-accent-500 bg-accent-50 dark:bg-accent-900 dark:bg-opacity-20' 
                    : 'text-gray-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900 dark:hover:bg-opacity-20'
                }`}
                aria-label={isSaved ? 'Unsave article' : 'Save article'}
              >
                <FiBookmark className={isSaved ? 'fill-current' : ''} />
              </button>
              
              <button 
                onClick={handleLike}
                className={`p-2 rounded-full transition-colors ${
                  isLiked 
                    ? 'text-primary-500 bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20' 
                    : 'text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900 dark:hover:bg-opacity-20'
                }`}
                aria-label={isLiked ? 'Unlike article' : 'Like article'}
              >
                <FiThumbsUp className={isLiked ? 'fill-current' : ''} />
              </button>
              
              <button 
                onClick={handleShare}
                className="p-2 rounded-full text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900 dark:hover:bg-opacity-20 transition-colors"
                aria-label="Share article"
              >
                <FiShare2 />
              </button>
            </div>
          </div>
          
          {/* Article content */}
          <div 
            className={`prose prose-lg dark:prose-invert max-w-none ${fontSizeClasses[fontSize as keyof typeof fontSizeClasses]}`}
            dangerouslySetInnerHTML={{ __html: mockArticle.content }}
          />
          
          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Related Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockArticle.tags.map((tag) => (
                <Link 
                  key={tag} 
                  href={`/search?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-gray-100 dark:bg-dark-200 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Comments section teaser */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Comments (24)</h3>
              <button className="btn btn-ghost flex items-center">
                <FiMessageSquare className="mr-1.5" />
                Add Comment
              </button>
            </div>
            
            {/* Comment preview - would be expanded in a real implementation */}
            <div className="glass-card mb-4">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-medium mr-3">
                  MR
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <h4 className="font-medium">Michael Rodriguez</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">2 hours ago</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    This is a significant step forward. I'm particularly impressed by the carbon pricing framework, which economists have long advocated for.
                  </p>
                </div>
              </div>
            </div>
            
            <button className="w-full py-2 text-center text-primary-600 dark:text-primary-400 hover:underline">
              View All Comments
            </button>
          </div>
        </article>
        
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Author info */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4">About the Author</h3>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-medium mr-3">
                JS
              </div>
              <div>
                <h4 className="font-medium">{mockArticle.author}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Senior Economics Correspondent
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Jane Smith is an award-winning journalist specializing in global economic trends and environmental policy. She has covered major economic summits for over a decade.
            </p>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View all articles by this author
            </button>
          </div>
          
          {/* Related articles */}
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
            <div className="space-y-4">
              {mockArticle.relatedArticles.map((article) => (
                <Link key={article.id} href={`/article/${article.id}`} className="block group">
                  <div className="flex items-start">
                    <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0 mr-3">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {article.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link href="/search" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                View more articles
              </Link>
            </div>
          </div>
          
          {/* Newsletter signup */}
          <div className="glass-card bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30">
            <h3 className="text-lg font-semibold mb-2">Stay Informed</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Get the latest news and analysis delivered to your inbox weekly.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="input w-full"
                aria-label="Email address"
              />
              <button type="submit" className="btn btn-primary w-full">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

