// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// Custom command to login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/auth/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Custom command to simulate authenticated state
Cypress.Commands.add('setupAuthenticatedUser', (userType = 'free') => {
  // Set token in localStorage
  localStorage.setItem('token', 'fake-cypress-token');
  
  // Define user data based on type
  let userData = {
    id: '1',
    email: 'cypress@example.com',
    display_name: 'Cypress User',
    subscription_tier: userType,
  };
  
  // Intercept user data request
  cy.intercept('GET', 'http://localhost:8000/users/me', {
    statusCode: 200,
    body: userData,
  }).as('getUserRequest');
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      setupAuthenticatedUser(userType?: 'free' | 'premium' | 'organization'): Chainable<void>;
    }
  }
}

