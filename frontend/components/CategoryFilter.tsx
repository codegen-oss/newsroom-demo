'use client'

import { useState } from 'react'

interface CategoryFilterProps {
  categories: string[]
  selectedCategories: string[]
  onChange: (categories: string[]) => void
}

export default function CategoryFilter({ 
  categories, 
  selectedCategories, 
  onChange 
}: CategoryFilterProps) {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter(c => c !== category))
    } else {
      onChange([...selectedCategories, category])
    }
  }

  const clearFilters = () => {
    onChange([])
  }

  return (
    <div className="bg-white dark:bg-dark-700 p-4 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Filter by Category</h3>
        {selectedCategories.length > 0 && (
          <button 
            onClick={clearFilters}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
          >
            Clear filters
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedCategories.includes(category)
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-500'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

