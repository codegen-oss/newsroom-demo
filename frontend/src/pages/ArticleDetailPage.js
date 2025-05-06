import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

/**
 * ArticleDetailPage component for displaying a single article.
 */
function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/articles/${id}`);
        setArticle(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Article not found.');
        } else {
          setError('Failed to fetch article. Please try again later.');
        }
        setLoading(false);
        console.error('Error fetching article:', err);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div>Loading article...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!article) {
    return <div>Article not found.</div>;
  }

  return (
    <div className="article-detail">
      <h1>{article.title}</h1>
      
      <div className="article-meta">
        {article.author && <span>By {article.author} | </span>}
        <span>
          Published: {new Date(article.published_date).toLocaleDateString()}
        </span>
        {article.updated_date && (
          <span>
            {' | '}
            Updated: {new Date(article.updated_date).toLocaleDateString()}
          </span>
        )}
      </div>
      
      {article.categories && article.categories.length > 0 && (
        <div className="article-categories">
          {article.categories.map(category => (
            <Link 
              key={category.id} 
              to={`/categories/${category.id}`}
              className="category-tag"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}
      
      <div className="article-content">
        {article.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      <div className="article-actions">
        <Link to="/articles" className="btn btn-secondary">
          Back to Articles
        </Link>
      </div>
    </div>
  );
}

export default ArticleDetailPage;

