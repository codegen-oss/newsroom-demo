import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getArticle } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, canAccessContent } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const data = await getArticle(id);
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <div className="mt-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              &larr; Back to News Feed
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading article...</p>
        </div>
      </Layout>
    );
  }

  const isAccessible = canAccessContent(article.access_tier);

  return (
    <Layout>
      <Head>
        <title>{article.title} | News Room</title>
        <meta name="description" content={article.summary} />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            &larr; Back to News Feed
          </Link>
        </div>

        <article>
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.categories.map(category => (
                <Link 
                  href={`/?category=${category.id}`} 
                  key={category.id}
                  className="text-sm bg-gray-200 hover:bg-gray-300 rounded px-3 py-1"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <span>By {article.author}</span>
              <span className="mx-2">&bull;</span>
              <time dateTime={article.published_at}>
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="mx-2">&bull;</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                article.access_tier === 'free' ? 'bg-green-100 text-green-800' :
                article.access_tier === 'premium' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {article.access_tier.charAt(0).toUpperCase() + article.access_tier.slice(1)}
              </span>
            </div>

            {article.summary && (
              <p className="text-xl text-gray-600 italic mb-6">{article.summary}</p>
            )}

            {article.featured_image && (
              <img 
                src={article.featured_image} 
                alt={article.title}
                className="w-full h-auto rounded-lg shadow-md mb-8"
              />
            )}
          </header>

          {isAccessible ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">
                This content requires a {article.access_tier} subscription
              </h3>
              <p className="text-gray-600 mb-6">
                Upgrade your account to access this article and more premium content.
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Upgrade Subscription
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Link 
                  href={`/?tag=${tag.id}`} 
                  key={tag.id}
                  className="text-sm bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
}

