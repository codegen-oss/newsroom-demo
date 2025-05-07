describe('Articles Flow', () => {
  beforeEach(() => {
    // Set up a logged-in state
    cy.clearLocalStorage();
    localStorage.setItem('token', 'fake-cypress-token');
    
    // Intercept API calls
    cy.intercept('GET', 'http://localhost:8000/users/me', {
      statusCode: 200,
      body: {
        id: '1',
        email: 'cypress@example.com',
        display_name: 'Cypress User',
        subscription_tier: 'premium',
      },
    }).as('getUserRequest');
    
    cy.intercept('GET', 'http://localhost:8000/articles/*', {
      statusCode: 200,
      body: {
        id: '1',
        title: 'Test Article',
        content: 'This is the full content of the test article.',
        summary: 'This is a summary of the test article.',
        author: 'Cypress Author',
        published_at: new Date().toISOString(),
        categories: ['news', 'technology'],
        access_tier: 'free',
        featured_image: '/test-image.jpg',
      },
    }).as('getArticleRequest');
    
    cy.intercept('GET', 'http://localhost:8000/articles/', {
      statusCode: 200,
      body: [
        {
          id: '1',
          title: 'Test Article 1',
          summary: 'This is a summary of test article 1.',
          author: 'Cypress Author',
          published_at: new Date().toISOString(),
          categories: ['news'],
          access_tier: 'free',
          featured_image: '/test-image-1.jpg',
        },
        {
          id: '2',
          title: 'Test Article 2',
          summary: 'This is a summary of test article 2.',
          author: 'Cypress Author',
          published_at: new Date().toISOString(),
          categories: ['technology'],
          access_tier: 'premium',
          featured_image: '/test-image-2.jpg',
        },
        {
          id: '3',
          title: 'Test Article 3',
          summary: 'This is a summary of test article 3.',
          author: 'Cypress Author',
          published_at: new Date().toISOString(),
          categories: ['business'],
          access_tier: 'organization',
          featured_image: '/test-image-3.jpg',
        },
      ],
    }).as('getArticlesRequest');
  });
  
  it('should display articles on the dashboard', () => {
    cy.visit('/dashboard');
    
    // Wait for API requests to complete
    cy.wait('@getUserRequest');
    cy.wait('@getArticlesRequest');
    
    // Check if articles are displayed
    cy.contains('Test Article 1');
    cy.contains('Test Article 2');
    cy.contains('Test Article 3');
    
    // Check if article cards have the correct content
    cy.get('.card').should('have.length', 3);
    cy.get('.card').first().within(() => {
      cy.contains('Test Article 1');
      cy.contains('This is a summary of test article 1.');
      cy.contains('Cypress Author');
      cy.contains('news');
      cy.contains('Free');
      cy.contains('Read More');
    });
  });
  
  it('should filter articles by category', () => {
    // Override the articles intercept for this test
    cy.intercept('GET', 'http://localhost:8000/articles/?category=technology', {
      statusCode: 200,
      body: [
        {
          id: '2',
          title: 'Test Article 2',
          summary: 'This is a summary of test article 2.',
          author: 'Cypress Author',
          published_at: new Date().toISOString(),
          categories: ['technology'],
          access_tier: 'premium',
          featured_image: '/test-image-2.jpg',
        },
      ],
    }).as('getFilteredArticlesRequest');
    
    cy.visit('/dashboard');
    cy.wait('@getUserRequest');
    cy.wait('@getArticlesRequest');
    
    // Click on the technology category filter
    cy.contains('Technology').click();
    
    // Wait for the filtered request to complete
    cy.wait('@getFilteredArticlesRequest');
    
    // Check if only the technology article is displayed
    cy.get('.card').should('have.length', 1);
    cy.contains('Test Article 2');
    cy.contains('Test Article 1').should('not.exist');
    cy.contains('Test Article 3').should('not.exist');
  });
  
  it('should navigate to article detail page', () => {
    cy.visit('/dashboard');
    cy.wait('@getUserRequest');
    cy.wait('@getArticlesRequest');
    
    // Click on the first article's "Read More" button
    cy.contains('Read More').first().click();
    
    // Wait for the article detail request to complete
    cy.wait('@getArticleRequest');
    
    // Check if we're on the article detail page
    cy.url().should('include', '/articles/');
    cy.contains('Test Article');
    cy.contains('This is the full content of the test article.');
    cy.contains('Cypress Author');
  });
  
  it('should handle premium content access based on subscription', () => {
    // Override the getUserRequest to return a free user
    cy.intercept('GET', 'http://localhost:8000/users/me', {
      statusCode: 200,
      body: {
        id: '1',
        email: 'cypress@example.com',
        display_name: 'Cypress User',
        subscription_tier: 'free',
      },
    }).as('getFreeUserRequest');
    
    // Override the article detail request for premium content
    cy.intercept('GET', 'http://localhost:8000/articles/2', {
      statusCode: 403,
      body: {
        detail: 'Premium content requires a paid subscription',
      },
    }).as('getPremiumArticleRequest');
    
    cy.visit('/dashboard');
    cy.wait('@getFreeUserRequest');
    cy.wait('@getArticlesRequest');
    
    // Try to access premium content
    cy.contains('Test Article 2').parent().contains('Read More').click();
    
    // Wait for the premium article request to complete
    cy.wait('@getPremiumArticleRequest');
    
    // Should show access denied message
    cy.contains('Access Denied');
    cy.contains('Premium content requires a paid subscription');
  });
});

