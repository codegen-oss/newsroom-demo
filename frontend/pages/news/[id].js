import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useNewsFeed } from '../../contexts/NewsFeedContext';
import ArticleDetail from '../../components/news/ArticleDetail';

export default function ArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const { getArticleById } = useNewsFeed();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      setLoading(true);
      setError('');
      
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (err) {
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, getArticleById]);

  if (error) {
    return (
      <>
        <Head>
          <title>Article Not Found - News Room</title>
        </Head>
        
        <div className="container mx-auto px-4 py-8">
          <div className="card text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/news" className="btn btn-primary">
              Browse All News
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>
          {loading ? 'Loading Article...' : article?.title} - News Room
        </title>
        {article && (
          <meta name="description" content={article.summary} />
        )}
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/news" className="text-primary-600 hover:text-primary-800 flex items-center">
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to News
          </Link>
        </div>
        
        <ArticleDetail article={article} />
      </div>
    </>
  );
}

