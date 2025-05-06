import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';

/**
 * CategoryPage component for displaying articles in a specific category.
 */
function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category details
        const categoryResponse = await axios.get(`/categories/${id}`);
        setCategory(categoryResponse.data);
        
        // Fetch articles in this category
        const articlesResponse = await axios.get(`/categories/${id}/articles`);
        setArticles(articlesResponse.data);
        
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Category not found.');
        } else {
          setError('Failed to fetch data. Please try again later.');
        }
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!category) {
    return <div>Category not found.</div>;
  }

  return (
    <div className="category-page">
      <h1>{category.name}</h1>
      
      {category.description && (
        <p className="category-description">{category.description}</p>
      )}
      
      <h2>Articles in this category</h2>
      
      {articles.length > 0 ? (
        articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))
      ) : (
        <p>No articles in this category yet.</p>
      )}
      
      <div className="category-actions">
        <Link to="/articles" className="btn btn-secondary">
          Back to All Articles
        </Link>
      </div>
    </div>
  );
}

export default CategoryPage;

