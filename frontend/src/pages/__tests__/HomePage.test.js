import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import HomePage from '../HomePage';

// Mock axios
jest.mock('axios');

/**
 * Test suite for the HomePage component.
 */
describe('HomePage Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    // Mock axios to return a promise that doesn't resolve immediately
    axios.get.mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('renders featured articles and categories when data is loaded', async () => {
    // Mock successful API responses
    const mockArticles = [
      {
        id: 1,
        title: 'Featured Article 1',
        summary: 'Summary 1',
        author: 'Author 1',
        published_date: '2023-01-01T00:00:00Z',
        categories: []
      },
      {
        id: 2,
        title: 'Featured Article 2',
        summary: 'Summary 2',
        author: 'Author 2',
        published_date: '2023-01-02T00:00:00Z',
        categories: []
      }
    ];
    
    const mockCategories = [
      { id: 1, name: 'Technology' },
      { id: 2, name: 'Science' }
    ];
    
    axios.get.mockImplementation((url) => {
      if (url.includes('/articles')) {
        return Promise.resolve({ data: mockArticles });
      }
      if (url.includes('/categories')) {
        return Promise.resolve({ data: mockCategories });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
    
    // Check if featured articles are rendered
    expect(screen.getByText('Featured Articles')).toBeInTheDocument();
    expect(screen.getByText('Featured Article 1')).toBeInTheDocument();
    expect(screen.getByText('Featured Article 2')).toBeInTheDocument();
    
    // Check if categories are rendered
    expect(screen.getByText('Browse by Category')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
    
    // Check if "View All Articles" button is rendered
    const viewAllButton = screen.getByText('View All Articles');
    expect(viewAllButton).toBeInTheDocument();
    expect(viewAllButton.closest('a')).toHaveAttribute('href', '/articles');
  });

  test('renders error message when API request fails', async () => {
    // Mock failed API response
    axios.get.mockRejectedValue(new Error('API error'));
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/Failed to fetch data/i)).toBeInTheDocument();
  });

  test('renders empty state when no articles or categories are available', async () => {
    // Mock empty API responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/articles')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/categories')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('No articles available at the moment.')).toBeInTheDocument();
    expect(screen.getByText('No categories available.')).toBeInTheDocument();
  });
});

