/// <reference types="cypress" />
/*
import { MailSlurp } from "mailslurp-client";

const mailKey = import.meta.env.MAIL_KEY;
*/

describe('Authentication Tests', () => {
  it('Succesfull registration', () => {
    /*
    const mailslurp = new MailSlurp({ apiKey: mailKey });

    const email = mailslurp.getEmail();

    cy.visit('/');

    cy.contains('Sign up').click()
    cy.url().should('include', '/register')

    cy.get('input[type="email"]').type(email)
    cy.get('input[type="email"]').should('have.value', email)

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Register').click()

    cy.url().should('include', '/notes')
  */
  });

  it('Email validation', () => {
    cy.visit('/');
    cy.contains('Sign up').click();
    cy.url().should('include', '/register');
  
    // Test 1: Empty email shows validation error
    cy.get('button').contains('Create account').click();
    cy.get('p').contains('Please enter a valid email address.').should('exist');
  
    // Test 2: Valid email with existing user
    cy.get('[data-cy="register-email"]').type('test.test@notely.com');
    cy.get('[data-cy="register-password"]').type('Hello123');
    cy.get('[data-cy="register-confirm-password"]').type('Hello123');
    cy.get('button').contains('Create account').click();
    cy.get('p').contains('User already registered').should('exist');
  
    // Test 3: Invalid email format shows validation error
    cy.get('[data-cy="register-email"]').clear().type('test.testnotely.com');
    cy.get('button').contains('Create account').click();
    cy.get('p').contains('Please enter a valid email address.').should('exist');
  });

  it('Password validation', () => {
    cy.visit('/');
    cy.contains('Sign up').click();
    cy.url().should('include', '/register');
  
    const passwordError = 'Password must be at least 7 characters, contain an uppercase letter and a number.';
    
    cy.get('[data-cy="register-email"]').type('test.test@notely.com');
  
    // Test 1: Empty password
    cy.get('button').contains('Create account').click();
    cy.get('p').contains(passwordError).should('exist');
  
    // Test 2: Too short password
    cy.get('[data-cy="register-password"]').type('hello');
    cy.get('button').contains('Create account').click();
    cy.get('p').contains(passwordError).should('exist');
  
    // Test 3: Missing number
    cy.get('[data-cy="register-password"]').clear().type('Hello');
    cy.get('button').contains('Create account').click();
    cy.get('p').contains(passwordError).should('exist');
  
    // Test 4: Missing length (6 characters)
    cy.get('[data-cy="register-password"]').clear().type('Hello7');
    cy.get('button').contains('Create account').click();
    cy.get('p').contains(passwordError).should('exist');
  });

  // Autenticated routes tests

  // Navigation tests

  // Password reset tests

  // End to end user journey


  it('Navigate to login page and fill in credentials and log in successfully', () => {
    cy.visit('/');

    cy.contains('Login').click()
    cy.url().should('include', '/login')

    cy.get('[data-cy="login-email"]').type('test.test@notely.com')
    cy.get('[data-cy="login-email"]').should('have.value', 'test.test@notely.com')

    cy.get('[data-cy="login-password"]').type('Hello123')
    cy.get('[data-cy="login-password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Login').click()

    cy.url().should('include', '/notes')

    // Add non accessible login page
  })

  it('Attempt login with invalid credentials', () => {
    cy.visit('/');

    cy.contains('Login').click()
    cy.url().should('include', '/login')

    cy.get('[data-cy="login-email"]').type('fakeEmail@notely.com')
    cy.get('[data-cy="login-email"]').should('have.value', 'fakeEmail@notely.com')

    cy.get('[data-cy="login-password"]').type('Hello123')
    cy.get('[data-cy="login-password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Login').click()

    cy.get('p').contains('Invalid password or email').should('exist')
    cy.url().should('include', '/login')

    cy.get('[data-cy="login-email"]').clear()
    cy.get('[data-cy="login-password"]').clear()

    cy.get('[data-cy="login-email"]').type('test.test@notely.com')
    cy.get('[data-cy="login-email"]').should('have.value', 'test.test@notely.com')

    cy.get('[data-cy="login-password"]').type('Hello1234')
    cy.get('[data-cy="login-password"]').should('have.value', 'Hello1234')

    cy.get('button').contains('Login').click()

    cy.get('p').contains('Invalid password or email').should('exist')
    cy.url().should('include', '/login')

  });

  it('Test form validation errors', () => {
    cy.visit('/');

    cy.contains('Login').click()
    cy.url().should('include', '/login')

    cy.get('button').contains('Login').click()

    cy.get('p').contains('Invalid password or email').should('exist')
    cy.url().should('include', '/login')

    cy.get('[data-cy="login-email"]').type('fakeEmail@notely.com')
    cy.get('[data-cy="login-email"]').should('have.value', 'fakeEmail@notely.com')

    cy.get('button').contains('Login').click()

    cy.get('p').contains('Invalid password or email').should('exist')
    cy.url().should('include', '/login')

    cy.get('[data-cy="login-email"]').clear()
    cy.get('[data-cy="login-email"]').should('have.value', '')

    cy.get('[data-cy="login-password"]').type('Hello123')
    cy.get('[data-cy="login-password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Login').click()

    cy.get('p').contains('Invalid password or email').should('exist')
    cy.url().should('include', '/login')
  });

  it('Logout button test', () => {
    cy.visit('/');

    cy.contains('Login').click()
    cy.url().should('include', '/login')

    cy.get('[data-cy="login-email"]').type('test.test@notely.com')
    cy.get('[data-cy="login-email"]').should('have.value', 'test.test@notely.com')

    cy.get('[data-cy="login-password"]').type('Hello123')
    cy.get('[data-cy="login-password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Login').click()

    cy.url().should('include', '/notes')

    cy.contains('Logout').click()

    cy.url().should('include', '/')

  });
})