import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { createArticle, getCategories, getTags } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

export default function NewArticle() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    author: '',
    source: '',
    source_url: '',
    featured_image: '',
    access_tier: 'free',
    category_ids: [],
    tag_ids: []
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          getCategories(),
          getTags()
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load categories and tags. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      category_ids: selectedValues
    }));
  };

  const handleTagChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      tag_ids: selectedValues
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createArticle(formData);
      router.push('/admin/articles');
    } catch (err) {
      console.error('Error creating article:', err);
      setError('Failed to create article. Please check your inputs and try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Create New Article | News Room</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
          <Link
            href="/admin/articles"
            className="text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Articles
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">
                HTML formatting is supported.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="access_tier" className="block text-sm font-medium text-gray-700 mb-1">
                  Access Tier *
                </label>
                <select
                  id="access_tier"
                  name="access_tier"
                  value={formData.access_tier}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="organization">Organization</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <input
                  type="text"
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="source_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Source URL
                </label>
                <input
                  type="url"
                  id="source_url"
                  name="source_url"
                  value={formData.source_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-1">
                Featured Image URL
              </label>
              <input
                type="url"
                id="featured_image"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category_ids" className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <select
                  id="category_ids"
                  name="category_ids"
                  multiple
                  value={formData.category_ids}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  size="5"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Hold Ctrl/Cmd to select multiple categories.
                </p>
              </div>

              <div>
                <label htmlFor="tag_ids" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <select
                  id="tag_ids"
                  name="tag_ids"
                  multiple
                  value={formData.tag_ids}
                  onChange={handleTagChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  size="5"
                >
                  {tags.map(tag => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Hold Ctrl/Cmd to select multiple tags.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Link
                href="/admin/articles"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Creating...' : 'Create Article'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

