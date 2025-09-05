/// <reference types="Cypress" />

describe('Login Tests', () => {
  it('Navigate to login page and fill in credentials and log in successfully', () => {
    cy.visit('http://localhost:5173/');

    cy.contains('Login').click()
    cy.url().should('include', '/login')

    cy.get('input[type="email"]').type('verner.etola@gmail.com')
    cy.get('input[type="email"]').should('have.value', 'verner.etola@gmail.com')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Login').click()


    // Needs to be changed when notesPage is implemented

    cy.contains('Notes').should('exist')
    cy.contains('Logout').should('exist')

    // Session checking not working


    // Add non accessible login page
  })

  it('Attempt login with invalid credentials', () => {
    cy.visit('http://localhost:5173/');

    cy.contains('Login').click()
    cy.url().should('include', '/login')

    cy.get('input[type="email"]').type('fakeEmail@fake.com')
    cy.get('input[type="email"]').should('have.value', 'fakeEmail@fake.com')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Login').click()

    cy.get('p.text-black.mt-2').should('exist')
    cy.url().should('include', '/login')

    // check that no session started
  });

  it('Test form validation errors', () => {
    cy.visit('http://localhost:5173/');

    cy.contains('Login').click()
    cy.url().should('include', '/login')
    // Testing for empty inputs
    cy.get('button').contains('Login').click()

    cy.get('p.text-black.mt-2').should('exist')
    cy.url().should('include', '/login')
    // Testing for no password
    cy.get('input[type="email"]').type('fakeEmail@fake.com')
    cy.get('input[type="email"]').should('have.value', 'fakeEmail@fake.com')

    cy.get('button').contains('Login').click()

    cy.get('p.text-black.mt-2').should('exist')
    cy.url().should('include', '/login')
    // Testing for no email

    cy.get('input[type="email"]').clear()
    cy.get('input[type="email"]').should('have.value', '')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Login').click()

    cy.get('p.text-black.mt-2').should('exist')
    cy.url().should('include', '/login')

    // Minimum password requirements ?
  });

  it('UI state tests', () => {

    // Verify loading state during login attempt
    // Test empty password field shows validation error
    // Check password visibility toggle functionality
    // Test form reset after failed attemptsl
  });

})

describe('Registration tests', () => {
  it('Succesfull registration', () => {
    cy.visit('http://localhost:5173/');

    cy.contains('Sign up').click()
    cy.url().should('include', '/register')

  });

  it('Email validation', () => {
    cy.visit('http://localhost:5173/');

    cy.contains('Sign up').click()
    cy.url().should('include', '/register')

    // Testing for duplicate email

    /*
    cy.get('input[type="email"]').type('verner.etola@gmail.com')
    cy.get('input[type="email"]').should('have.value', 'verner.etola@gmail.com')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('p.text-black.mt-2').should('exists')l
    cy.url().should('include', '/register')
    */

    // Testing for invalid email formats
    cy.get('input[type="email"]').type('verner.etolagmail.com')
    cy.get('input[type="email"]').should('have.value', 'verner.etolagmail.com')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Register').click()

    cy.get('p.text-black.mt-2').should('exist')
    cy.url().should('include', '/register')


  });

})
