import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';

/**
 * ArticleListPage component for displaying a list of all articles.
 */
function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('/articles');
        setArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch articles. Please try again later.');
        setLoading(false);
        console.error('Error fetching articles:', err);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div>Loading articles...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="article-list-page">
      <h1>All Articles</h1>
      
      {articles.length > 0 ? (
        articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))
      ) : (
        <p>No articles available at the moment.</p>
      )}
    </div>
  );
}

export default ArticleListPage;

