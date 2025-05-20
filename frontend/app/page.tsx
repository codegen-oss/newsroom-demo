'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import CategoryFilter from '@/components/CategoryFilter'
import { Article } from '@/types'

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
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
          content: 'Detailed analysis of global economic trends for the coming year...',
          source: 'Economic Times',
          sourceUrl: 'https://example.com/economic-outlook-2025',
          author: 'Jane Smith',
          publishedAt: new Date().toISOString(),
          categories: ['economy', 'global'],
          accessTier: 'free',
          featuredImage: 'https://placehold.co/600x400/png'
        },
        {
          id: '2',
          title: 'New Technological Breakthroughs in AI',
          summary: 'How the latest AI technologies are transforming business and society.',
          content: 'Recent advancements in artificial intelligence are reshaping industries...',
          source: 'Tech Insider',
          sourceUrl: 'https://example.com/ai-breakthroughs',
          author: 'John Doe',
          publishedAt: new Date().toISOString(),
          categories: ['technology', 'ai'],
          accessTier: 'premium',
          featuredImage: 'https://placehold.co/600x400/png'
        },
        {
          id: '3',
          title: 'Geopolitical Tensions in Southeast Asia',
          summary: 'Understanding the complex geopolitical landscape in Southeast Asia.',
          content: 'Analysis of the growing tensions between major powers in Southeast Asia...',
          source: 'World Politics Review',
          sourceUrl: 'https://example.com/southeast-asia-tensions',
          author: 'Robert Chen',
          publishedAt: new Date().toISOString(),
          categories: ['geopolitics', 'asia'],
          accessTier: 'organization',
          featuredImage: 'https://placehold.co/600x400/png'
        }
      ]
      
      setArticles(mockArticles)
      setFilteredArticles(mockArticles)
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredArticles(articles)
    } else {
      const filtered = articles.filter(article => 
        article.categories.some(category => selectedCategories.includes(category))
      )
      setFilteredArticles(filtered)
    }
  }, [selectedCategories, articles])

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories)
  }

  if (loading || !isAuthenticated) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-dark-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Latest News</h1>
        
        <CategoryFilter 
          categories={['economy', 'global', 'technology', 'ai', 'geopolitics', 'asia']}
          selectedCategories={selectedCategories}
          onChange={handleCategoryChange}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">Loading articles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  )
}

