import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * ArticleCard component for displaying article previews.
 * 
 * @param {Object} article - The article data to display
 */
function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <h2>
        <Link to={`/articles/${article.id}`}>{article.title}</Link>
      </h2>
      <div className="article-meta">
        {article.author && <span>By {article.author} | </span>}
        <span>
          {new Date(article.published_date).toLocaleDateString()}
        </span>
      </div>
      {article.summary && (
        <div className="article-summary">{article.summary}</div>
      )}
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
    </div>
  );
}

ArticleCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string,
    author: PropTypes.string,
    published_date: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
      })
    )
  }).isRequired
};

export default ArticleCard;

