import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { getArticles, deleteArticle } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';

export default function ArticleAdmin() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login');
      return;
    }

    fetchArticles();
  }, [user, router]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles({ limit: 100 });
      setArticles(data.items);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (articleId) => {
    setDeleteConfirm(articleId);
  };

  const handleDeleteConfirm = async (articleId) => {
    try {
      await deleteArticle(articleId);
      setArticles(articles.filter(article => article.id !== articleId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('Failed to delete article. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const getAccessTierBadge = (tier) => {
    const colors = {
      free: 'bg-green-100 text-green-800',
      premium: 'bg-purple-100 text-purple-800',
      organization: 'bg-blue-100 text-blue-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[tier]}`}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </span>
    );
  };

  return (
    <Layout>
      <Head>
        <title>Article Management | News Room</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Articles</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all articles in the News Room application.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Article
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {loading ? (
                  <div className="p-4 text-center">Loading articles...</div>
                ) : articles.length === 0 ? (
                  <div className="p-4 text-center">No articles found.</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Title
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Author
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Access Tier
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Published
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {articles.map((article) => (
                        <tr key={article.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {article.title}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {article.author}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {getAccessTierBadge(article.access_tier)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(article.published_at).toLocaleDateString()}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end space-x-2">
                              <Link
                                href={`/articles/${article.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </Link>
                              <Link
                                href={`/admin/articles/edit/${article.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(article.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                            
                            {deleteConfirm === article.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="p-2 text-sm">
                                  <p className="mb-2">Delete this article?</p>
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      onClick={handleDeleteCancel}
                                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleDeleteConfirm(article.id)}
                                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

