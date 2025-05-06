import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';

/**
 * HomePage component for the application.
 * Displays featured articles and categories.
 */
function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest articles
        const articlesResponse = await axios.get('/articles?limit=5');
        setFeaturedArticles(articlesResponse.data);
        
        // Fetch categories
        const categoriesResponse = await axios.get('/categories');
        setCategories(categoriesResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to News Room</h1>
        <p>Your source for the latest news and articles</p>
      </section>

      <section className="featured-articles">
        <h2>Featured Articles</h2>
        {featuredArticles.length > 0 ? (
          featuredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p>No articles available at the moment.</p>
        )}
        <Link to="/articles" className="btn">View All Articles</Link>
      </section>

      <section className="categories-section">
        <h2>Browse by Category</h2>
        <div className="categories-list">
          {categories.length > 0 ? (
            categories.map(category => (
              <Link 
                key={category.id} 
                to={`/categories/${category.id}`}
                className="category-tag"
              >
                {category.name}
              </Link>
            ))
          ) : (
            <p>No categories available.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;

