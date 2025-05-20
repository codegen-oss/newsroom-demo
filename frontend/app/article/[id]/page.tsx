'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Article } from '@/types'

export default function ArticleDetail({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, this would fetch from the API
      // For now, we'll use mock data
      const mockArticles: Article[] = [
        {
          id: '1',
          title: 'Global Economic Outlook 2025',
          summary: 'A comprehensive look at what to expect in the global economy in 2025.',
          content: 'Detailed analysis of global economic trends for the coming year. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
          source: 'Economic Times',
          sourceUrl: 'https://example.com/economic-outlook-2025',
          author: 'Jane Smith',
          publishedAt: new Date().toISOString(),
          categories: ['economy', 'global'],
          accessTier: 'free',
          featuredImage: 'https://placehold.co/1200x600/png'
        },
        {
          id: '2',
          title: 'New Technological Breakthroughs in AI',
          summary: 'How the latest AI technologies are transforming business and society.',
          content: 'Recent advancements in artificial intelligence are reshaping industries. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
          source: 'Tech Insider',
          sourceUrl: 'https://example.com/ai-breakthroughs',
          author: 'John Doe',
          publishedAt: new Date().toISOString(),
          categories: ['technology', 'ai'],
          accessTier: 'premium',
          featuredImage: 'https://placehold.co/1200x600/png'
        },
        {
          id: '3',
          title: 'Geopolitical Tensions in Southeast Asia',
          summary: 'Understanding the complex geopolitical landscape in Southeast Asia.',
          content: 'Analysis of the growing tensions between major powers in Southeast Asia. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
          source: 'World Politics Review',
          sourceUrl: 'https://example.com/southeast-asia-tensions',
          author: 'Robert Chen',
          publishedAt: new Date().toISOString(),
          categories: ['geopolitics', 'asia'],
          accessTier: 'organization',
          featuredImage: 'https://placehold.co/1200x600/png'
        }
      ]
      
      const foundArticle = mockArticles.find(a => a.id === params.id)
      setArticle(foundArticle || null)
      setIsLoading(false)
    }
  }, [isAuthenticated, params.id])

  // Format the date
  const formattedDate = article ? new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : ''

  if (loading || !isAuthenticated) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-dark-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">Loading article...</div>
        ) : article ? (
          <div className="bg-white dark:bg-dark-700 rounded-lg shadow-md overflow-hidden">
            {article.featuredImage && (
              <div className="w-full h-96 relative">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.categories.map(category => (
                  <span 
                    key={category} 
                    className="text-xs bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {article.title}
              </h1>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
                <span className="mr-4">{article.author}</span>
                <span className="mr-4">•</span>
                <span>{formattedDate}</span>
                <span className="mr-4 ml-4">•</span>
                <span>{article.source}</span>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg font-medium mb-6 text-gray-700 dark:text-gray-300">
                  {article.summary}
                </p>
                
                <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {article.content.split('. ').map((sentence, index) => (
                    <p key={index} className="mb-4">{sentence}.</p>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-600">
                <div className="flex justify-between items-center">
                  <a 
                    href={article.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Read original article
                  </a>
                  
                  <div className="flex space-x-4">
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                      Share
                    </button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-700 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Article not found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The article you're looking for doesn't exist or you don't have access to it.
            </p>
            <a 
              href="/"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Back to Home
            </a>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  )
}

