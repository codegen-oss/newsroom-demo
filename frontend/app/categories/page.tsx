'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaGlobe, FaChartLine, FaMicrochip, FaFlask, FaTheaterMasks, FaFutbol } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import api from '@/lib/api/axios'

interface Category {
  id: string
  name: string
  description: string
  article_count: number
  icon: React.ReactNode
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await api.get('/categories')
        
        // Map icons to categories
        const categoriesWithIcons = response.data.map((category: any) => ({
          ...category,
          icon: getCategoryIcon(category.name)
        }))
        
        setCategories(categoriesWithIcons)
        setError(null)
      } catch (err) {
        console.error('Error fetching categories:', err)
        
        // Fallback to mock data if API fails
        const mockCategories = [
          {
            id: '1',
            name: 'Geopolitics',
            description: 'International relations, conflicts, diplomacy, and global power dynamics.',
            article_count: 42,
            icon: <FaGlobe className="h-8 w-8 text-primary-400" />
          },
          {
            id: '2',
            name: 'Economy',
            description: 'Global economic trends, financial markets, trade policies, and business developments.',
            article_count: 38,
            icon: <FaChartLine className="h-8 w-8 text-primary-400" />
          },
          {
            id: '3',
            name: 'Technology',
            description: 'Latest innovations, digital transformations, and technological breakthroughs.',
            article_count: 56,
            icon: <FaMicrochip className="h-8 w-8 text-primary-400" />
          },
          {
            id: '4',
            name: 'Science',
            description: 'Scientific discoveries, research breakthroughs, and academic advancements.',
            article_count: 29,
            icon: <FaFlask className="h-8 w-8 text-primary-400" />
          },
          {
            id: '5',
            name: 'Culture',
            description: 'Arts, entertainment, cultural trends, and societal developments.',
            article_count: 34,
            icon: <FaTheaterMasks className="h-8 w-8 text-primary-400" />
          },
          {
            id: '6',
            name: 'Sports',
            description: 'Sports events, athlete achievements, and industry developments.',
            article_count: 27,
            icon: <FaFutbol className="h-8 w-8 text-primary-400" />
          }
        ]
        
        setCategories(mockCategories)
        setError('Using demo categories. Could not connect to the server.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Get icon for category
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'geopolitics':
        return <FaGlobe className="h-8 w-8 text-primary-400" />
      case 'economy':
        return <FaChartLine className="h-8 w-8 text-primary-400" />
      case 'technology':
        return <FaMicrochip className="h-8 w-8 text-primary-400" />
      case 'science':
        return <FaFlask className="h-8 w-8 text-primary-400" />
      case 'culture':
        return <FaTheaterMasks className="h-8 w-8 text-primary-400" />
      case 'sports':
        return <FaFutbol className="h-8 w-8 text-primary-400" />
      default:
        return <FaGlobe className="h-8 w-8 text-primary-400" />
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-dark-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Categories</h1>
            <p className="text-gray-400">Browse articles by category</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner text="Loading categories..." />
            </div>
          ) : error ? (
            <ErrorMessage message={error} type="warning" />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                >
                  <Card 
                    variant={activeCategory === category.id ? "elevated" : "bordered"}
                    isHoverable
                    isClickable
                    className={activeCategory === category.id ? "border-2 border-primary-500" : ""}
                    onClick={() => setActiveCategory(
                      activeCategory === category.id ? null : category.id
                    )}
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="w-16 h-16 rounded-full bg-primary-900/50 flex items-center justify-center mr-4 flex-shrink-0">
                          {category.icon}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold mb-1">{category.name}</h2>
                          <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                          <div className="flex justify-between items-center">
                            <Badge variant="default" size="sm">{category.article_count} articles</Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              href={`/articles?category=${encodeURIComponent(category.name)}`}
                            >
                              Browse Articles
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded content when active */}
                      {activeCategory === category.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-dark-700"
                        >
                          <h3 className="text-lg font-medium mb-2">Popular Topics</h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {/* Mock topics for demo */}
                            {['Global Affairs', 'Diplomacy', 'Conflicts', 'Treaties', 'UN'].slice(0, Math.floor(Math.random() * 3) + 3).map((topic, index) => (
                              <Badge key={index} variant="default">{topic}</Badge>
                            ))}
                          </div>
                          <Button 
                            variant="primary" 
                            fullWidth
                            href={`/articles?category=${encodeURIComponent(category.name)}`}
                          >
                            View All {category.name} Articles
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
