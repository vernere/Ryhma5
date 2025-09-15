/// <reference types="Cypress" />
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

    cy.contains('Sign up').click()
    cy.url().should('include', '/register')

    cy.get('input[type="password"]').should('have.value', '')
    cy.get('input[type="email"]').should('have.value', '')

    cy.get('button').contains('Register').click()

    cy.get('p').contains('Please enter a valid email address.').should('exist')
    cy.url().should('include', '/register')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Register').click()

    cy.get('p').contains('Please enter a valid email address.').should('exist')
    cy.url().should('include', '/register')

    cy.get('input[type="password"]').clear()
    cy.get('input[type="password"]').should('have.value', '')

    cy.get('input[type="email"]').type('test.test@notely.com')
    cy.get('input[type="email"]').should('have.value', 'test.test@notely.com')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Register').click()

    cy.get('p').contains('User already registered').should('exist')
    cy.url().should('include', '/register')

    cy.get('input[type="password"]').clear()
    cy.get('input[type="email"]').clear()
    cy.get('input[type="password"]').should('have.value', '')
    cy.get('input[type="email"]').should('have.value', '')

    cy.get('input[type="email"]').type('test.testnotely.com')
    cy.get('input[type="email"]').should('have.value', 'test.testnotely.com')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Register').click()

    cy.get('p').contains('Please enter a valid email address.').should('exist')
    cy.url().should('include', '/register')
  });

  it('Password validation', () => {
    cy.visit('/');

    cy.contains('Sign up').click()
    cy.url().should('include', '/register')
    cy.get('input[type="email"]').type('test.test@notely.com')
    cy.get('input[type="email"]').should('have.value', 'test.test@notely.com')

    cy.get('button').contains('Register').click()

    cy.get('p').contains('Password must be at least 7 characters, contain an uppercase letter and a number.').should('exist')
    cy.url().should('include', '/register')

    cy.get('input[type="email"]').clear()
    cy.get('input[type="email"]').should('have.value', '')

    cy.get('input[type="email"]').type('test.test@notely.com')
    cy.get('input[type="email"]').should('have.value', 'test.test@notely.com')

    cy.get('input[type="password"]').type('hello')
    cy.get('input[type="password"]').should('have.value', 'hello')

    cy.get('button').contains('Register').click()

    cy.get('p').contains('Password must be at least 7 characters, contain an uppercase letter and a number.').should('exist')
    cy.url().should('include', '/register')

    cy.get('input[type="password"]').clear()
    cy.get('input[type="password"]').should('have.value', '')

    cy.get('input[type="password"]').type('Hello')
    cy.get('input[type="password"]').should('have.value', 'Hello')

    cy.get('button').contains('Register').click()

    cy.get('p').contains('Password must be at least 7 characters, contain an uppercase letter and a number.').should('exist')
    cy.url().should('include', '/register')

    cy.get('input[type="password"]').clear()
    cy.get('input[type="password"]').should('have.value', '')

    cy.get('input[type="password"]').type('Hello7')
    cy.get('input[type="password"]').should('have.value', 'Hello7')

    cy.get('button').contains('Register').click()

    cy.get('p').contains('Password must be at least 7 characters, contain an uppercase letter and a number.').should('exist')
    cy.url().should('include', '/register')
  });

  // Autenticated routes tests

  // Navigation tests

  // Password reset tests

  // End to end user journey


  it('Navigate to login page and fill in credentials and log in successfully', () => {
    cy.visit('/');

    cy.contains('Login').click()
    cy.url().should('include', '/login')

    cy.get('input[type="email"]').type('test.test@notely.com')
    cy.get('input[type="email"]').should('have.value', 'test.test@notely.com')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Login').click()

    cy.url().should('include', '/notes')

    // Add non accessible login page
  })

  it('Attempt login with invalid credentials', () => {
    cy.visit('/');

    cy.contains('Login').click()
    cy.url().should('include', '/login')

    cy.get('input[type="email"]').type('fakeEmail@fake.com')
    cy.get('input[type="email"]').should('have.value', 'fakeEmail@fake.com')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Login').click()

    cy.get('p').contains('Invalid password or email').should('exist')
    cy.url().should('include', '/login')

    cy.get('input[type="email"]').clear()
    cy.get('input[type="password"]').clear()

    cy.get('input[type="email"]').type('test.test@notely.com')
    cy.get('input[type="email"]').should('have.value', 'test.test@notely.com')

    cy.get('input[type="password"]').type('Hello1234')
    cy.get('input[type="password"]').should('have.value', 'Hello1234')

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

    cy.get('input[type="email"]').type('fakeEmail@fake.com')
    cy.get('input[type="email"]').should('have.value', 'fakeEmail@fake.com')

    cy.get('button').contains('Login').click()

    cy.get('p').contains('Invalid password or email').should('exist')
    cy.url().should('include', '/login')

    cy.get('input[type="email"]').clear()
    cy.get('input[type="email"]').should('have.value', '')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Login').click()

    cy.get('p').contains('Invalid password or email').should('exist')
    cy.url().should('include', '/login')

  });

  it('Logout button test', () => {
    cy.visit('/');

    cy.contains('Login').click()
    cy.url().should('include', '/login')

    cy.get('input[type="email"]').type('test.test@notely.com')
    cy.get('input[type="email"]').should('have.value', 'test.test@notely.com')

    cy.get('input[type="password"]').type('Hello123')
    cy.get('input[type="password"]').should('have.value', 'Hello123')

    cy.get('button').contains('Login').click()

    cy.url().should('include', '/notes')

    cy.contains('Logout').click()

    cy.url().should('include', '/')

  });

  it('UI state tests', () => {

    // Verify loading state during login attempt
    // Test empty password field shows validation error
    // Check password visibility toggle functionality
    // Test form reset after failed attempts
  });

})


