describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    
    // Intercept API calls
    cy.intercept('POST', 'http://localhost:8000/token', {
      statusCode: 200,
      body: {
        access_token: 'fake-cypress-token',
        token_type: 'bearer',
      },
    }).as('loginRequest');
    
    cy.intercept('GET', 'http://localhost:8000/users/me', {
      statusCode: 200,
      body: {
        id: '1',
        email: 'cypress@example.com',
        display_name: 'Cypress User',
        subscription_tier: 'free',
      },
    }).as('getUserRequest');
    
    cy.intercept('POST', 'http://localhost:8000/register', {
      statusCode: 201,
      body: {
        id: '2',
        email: 'new-cypress@example.com',
        display_name: 'New Cypress User',
        subscription_tier: 'free',
      },
    }).as('registerRequest');
  });
  
  it('should navigate to login page', () => {
    cy.visit('/');
    cy.contains('Login').click();
    cy.url().should('include', '/auth/login');
    cy.contains('h1', 'Login to News Room');
  });
  
  it('should login successfully', () => {
    cy.visit('/auth/login');
    
    // Fill in the login form
    cy.get('input[name="email"]').type('cypress@example.com');
    cy.get('input[name="password"]').type('password123');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Wait for the login request to complete
    cy.wait('@loginRequest');
    cy.wait('@getUserRequest');
    
    // Should be redirected to dashboard
    cy.url().should('include', '/dashboard');
    
    // Navbar should show user info
    cy.contains('Cypress User');
    cy.contains('Logout');
  });
  
  it('should show error message with invalid credentials', () => {
    // Override the login intercept for this test
    cy.intercept('POST', 'http://localhost:8000/token', {
      statusCode: 401,
      body: {
        detail: 'Incorrect email or password',
      },
    }).as('failedLoginRequest');
    
    cy.visit('/auth/login');
    
    // Fill in the login form with invalid credentials
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Wait for the login request to complete
    cy.wait('@failedLoginRequest');
    
    // Should show error message
    cy.contains('Invalid email or password');
    
    // Should still be on the login page
    cy.url().should('include', '/auth/login');
  });
  
  it('should navigate to register page', () => {
    cy.visit('/auth/login');
    cy.contains('Register').click();
    cy.url().should('include', '/auth/register');
    cy.contains('h1', 'Create an Account');
  });
  
  it('should register successfully', () => {
    cy.visit('/auth/register');
    
    // Fill in the registration form
    cy.get('input[name="email"]').type('new-cypress@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('input[name="displayName"]').type('New Cypress User');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Wait for the register request to complete
    cy.wait('@registerRequest');
    cy.wait('@loginRequest');
    cy.wait('@getUserRequest');
    
    // Should be redirected to dashboard
    cy.url().should('include', '/dashboard');
    
    // Navbar should show user info
    cy.contains('New Cypress User');
    cy.contains('Logout');
  });
  
  it('should logout successfully', () => {
    // Login first
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type('cypress@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    cy.wait('@getUserRequest');
    
    // Now logout
    cy.contains('Logout').click();
    
    // Should be redirected to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // Navbar should show login/register links
    cy.contains('Login');
    cy.contains('Register');
  });
});

