import React from 'react';
import { render, screen } from '@testing-library/react';
import ArticleCard from '../../../components/ArticleCard';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// Mock article data
const mockArticle = {
  id: '1',
  title: 'Test Article',
  summary: 'This is a test article summary',
  author: 'Test Author',
  published_at: '2023-10-15T12:00:00Z',
  categories: ['news', 'technology'],
  access_tier: 'free',
  featured_image: '/test-image.jpg',
};

describe('ArticleCard Component', () => {
  it('renders article information correctly', () => {
    render(<ArticleCard article={mockArticle} />);
    
    // Check if title is rendered
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    
    // Check if summary is rendered
    expect(screen.getByText('This is a test article summary')).toBeInTheDocument();
    
    // Check if author is rendered
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    
    // Check if date is rendered (formatted)
    expect(screen.getByText('Oct 15, 2023')).toBeInTheDocument();
    
    // Check if categories are rendered
    expect(screen.getByText('news')).toBeInTheDocument();
    expect(screen.getByText('technology')).toBeInTheDocument();
    
    // Check if access tier badge is rendered
    expect(screen.getByText('Free')).toBeInTheDocument();
    
    // Check if "Read More" link is rendered
    expect(screen.getByText('Read More')).toBeInTheDocument();
    expect(screen.getByText('Read More').closest('a')).toHaveAttribute('href', '/articles/1');
  });
  
  it('renders premium tier badge with correct styling', () => {
    const premiumArticle = {
      ...mockArticle,
      access_tier: 'premium',
    };
    
    render(<ArticleCard article={premiumArticle} />);
    
    const badge = screen.getByText('Premium');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-purple-100');
    expect(badge).toHaveClass('text-purple-800');
  });
  
  it('renders organization tier badge with correct styling', () => {
    const orgArticle = {
      ...mockArticle,
      access_tier: 'organization',
    };
    
    render(<ArticleCard article={orgArticle} />);
    
    const badge = screen.getByText('Organization');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
  });
});

