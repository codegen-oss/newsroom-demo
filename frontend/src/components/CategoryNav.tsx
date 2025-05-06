'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function CategoryNav() {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')
  
  const categories = [
    { id: 'politics', name: 'Politics' },
    { id: 'technology', name: 'Technology' },
    { id: 'business', name: 'Business' },
    { id: 'economy', name: 'Economy' },
    { id: 'geopolitics', name: 'Geopolitics' },
    { id: 'science', name: 'Science' },
    { id: 'health', name: 'Health' }
  ]

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-2 py-4 min-w-max">
        <Link
          href="/articles"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !currentCategory
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </Link>
        
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/articles?category=${category.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

