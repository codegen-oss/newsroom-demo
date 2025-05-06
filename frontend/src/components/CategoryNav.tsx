'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function CategoryNav() {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'
  
  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'politics', name: 'Politics' },
    { id: 'economy', name: 'Economy' },
    { id: 'technology', name: 'Technology' },
    { id: 'science', name: 'Science' },
    { id: 'geopolitics', name: 'Geopolitics' }
  ]
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.id === 'all' ? '/articles' : `/articles?category=${category.id}`}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              currentCategory === category.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

