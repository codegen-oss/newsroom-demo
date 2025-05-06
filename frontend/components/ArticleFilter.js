import { useState, useEffect } from 'react';
import { getCategories, getTags } from '../utils/api';

export default function ArticleFilter({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    tagId: '',
    accessTier: ''
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags()
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching filters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      categoryId: '',
      tagId: '',
      accessTier: ''
    });
    onFilterChange({
      search: '',
      categoryId: '',
      tagId: '',
      accessTier: ''
    });
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded-lg w-full"></div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Articles</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="Search articles..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={filters.categoryId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="tagId" className="block text-sm font-medium text-gray-700 mb-1">
              Tag
            </label>
            <select
              id="tagId"
              name="tagId"
              value={filters.tagId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="accessTier" className="block text-sm font-medium text-gray-700 mb-1">
              Access Tier
            </label>
            <select
              id="accessTier"
              name="accessTier"
              value={filters.accessTier}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tiers</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="organization">Organization</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
}

