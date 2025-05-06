import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ArticleCard from '../ArticleCard';

/**
 * Test suite for the ArticleCard component.
 */
describe('ArticleCard Component', () => {
  const mockArticle = {
    id: 1,
    title: 'Test Article',
    summary: 'This is a test article summary',
    author: 'Test Author',
    published_date: '2023-01-01T00:00:00Z',
    categories: [
      { id: 1, name: 'Technology' },
      { id: 2, name: 'Science' }
    ]
  };

  test('renders article title as a link', () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>
    );
    
    const titleElement = screen.getByText('Test Article');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.closest('a')).toHaveAttribute('href', '/articles/1');
  });

  test('renders article summary', () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>
    );
    
    const summaryElement = screen.getByText('This is a test article summary');
    expect(summaryElement).toBeInTheDocument();
  });

  test('renders author name', () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>
    );
    
    const authorElement = screen.getByText(/Test Author/i);
    expect(authorElement).toBeInTheDocument();
  });

  test('renders published date', () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>
    );
    
    // The exact format may vary based on locale, so we just check for the presence of the date
    const dateElement = screen.getByText(/1\/1\/2023/i);
    expect(dateElement).toBeInTheDocument();
  });

  test('renders category tags as links', () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>
    );
    
    const technologyTag = screen.getByText('Technology');
    const scienceTag = screen.getByText('Science');
    
    expect(technologyTag).toBeInTheDocument();
    expect(scienceTag).toBeInTheDocument();
    
    expect(technologyTag.closest('a')).toHaveAttribute('href', '/categories/1');
    expect(scienceTag.closest('a')).toHaveAttribute('href', '/categories/2');
  });

  test('handles article without optional fields', () => {
    const minimalArticle = {
      id: 2,
      title: 'Minimal Article',
      published_date: '2023-01-02T00:00:00Z',
      categories: []
    };

    render(
      <BrowserRouter>
        <ArticleCard article={minimalArticle} />
      </BrowserRouter>
    );
    
    const titleElement = screen.getByText('Minimal Article');
    expect(titleElement).toBeInTheDocument();
    
    // Should not render author or summary
    expect(screen.queryByText(/By/i)).not.toBeInTheDocument();
    
    // Should not render categories section
    expect(screen.queryByText('Technology')).not.toBeInTheDocument();
    expect(screen.queryByText('Science')).not.toBeInTheDocument();
  });
});

