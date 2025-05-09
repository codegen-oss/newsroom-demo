'use client';

import { useState } from 'react';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterPanelProps {
  categories: FilterOption[];
  regions: FilterOption[];
  topics: FilterOption[];
  sources: FilterOption[];
  onFilterChange: (filters: {
    categories: string[];
    regions: string[];
    topics: string[];
    sources: string[];
  }) => void;
}

export default function FilterPanel({
  categories,
  regions,
  topics,
  sources,
  onFilterChange
}: FilterPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryChange = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelectedCategories);
    updateFilters(newSelectedCategories, selectedRegions, selectedTopics, selectedSources);
  };

  const handleRegionChange = (regionId: string) => {
    const newSelectedRegions = selectedRegions.includes(regionId)
      ? selectedRegions.filter(id => id !== regionId)
      : [...selectedRegions, regionId];
    
    setSelectedRegions(newSelectedRegions);
    updateFilters(selectedCategories, newSelectedRegions, selectedTopics, selectedSources);
  };

  const handleTopicChange = (topicId: string) => {
    const newSelectedTopics = selectedTopics.includes(topicId)
      ? selectedTopics.filter(id => id !== topicId)
      : [...selectedTopics, topicId];
    
    setSelectedTopics(newSelectedTopics);
    updateFilters(selectedCategories, selectedRegions, newSelectedTopics, selectedSources);
  };

  const handleSourceChange = (sourceId: string) => {
    const newSelectedSources = selectedSources.includes(sourceId)
      ? selectedSources.filter(id => id !== sourceId)
      : [...selectedSources, sourceId];
    
    setSelectedSources(newSelectedSources);
    updateFilters(selectedCategories, selectedRegions, selectedTopics, newSelectedSources);
  };

  const updateFilters = (
    categories: string[],
    regions: string[],
    topics: string[],
    sources: string[]
  ) => {
    onFilterChange({
      categories,
      regions,
      topics,
      sources
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedRegions([]);
    setSelectedTopics([]);
    setSelectedSources([]);
    
    onFilterChange({
      categories: [],
      regions: [],
      topics: [],
      sources: []
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
        <div className="flex space-x-2">
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-300"
          >
            Clear all
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-300 md:hidden"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Categories */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Regions */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Regions</h4>
          <div className="space-y-2">
            {regions.map((region) => (
              <label key={region.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(region.id)}
                  onChange={() => handleRegionChange(region.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{region.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Topics</h4>
          <div className="space-y-2">
            {topics.map((topic) => (
              <label key={topic.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic.id)}
                  onChange={() => handleTopicChange(topic.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{topic.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Sources</h4>
          <div className="space-y-2">
            {sources.map((source) => (
              <label key={source.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSources.includes(source.id)}
                  onChange={() => handleSourceChange(source.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{source.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

