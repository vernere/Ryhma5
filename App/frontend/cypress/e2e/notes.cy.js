/// <reference types="Cypress" />

describe('Notes tests', () => {
    it('Test notes typing', () => {
        cy.visit('/');

        cy.contains('Login').click()
        cy.url().should('include', '/login')

        cy.get('input[type="email"]').type('test.test@notely.com')
        cy.get('input[type="email"]').should('have.value', 'test.test@notely.com')

        cy.get('input[type="password"]').type('Hello123')
        cy.get('input[type="password"]').should('have.value', 'Hello123')

        cy.get('button').contains('Login').click()

        cy.url().should('include', '/notes')

        cy.get('[data-cy=noteSelect]').click()

        cy.get('[data-cy=noteTitle]').contains('New test note').should('exist')
        cy.get('[data-cy=userEmail]').contains('test.test@notely.com').should('exist')
        cy.get('[data-cy=noteCreatedAt').should('exist')
        cy.get('[data-cy=noteTag').should('exist')

        cy.get('[data-cy=noteContent]').type(' Hello World version 2 !')
        cy.get('[data-cy=noteContent').contains('Hello World! Hello World version 2 !')

    });
})

describe('Search tests', () => {
    it('Test search input and response', () => {
        cy.visit('/');

        cy.contains('Login').click()
        cy.url().should('include', '/login')

        cy.get('input[type="email"]').type('test.test@notely.com')
        cy.get('input[type="email"]').should('have.value', 'test.test@notely.com')

        cy.get('input[type="password"]').type('Hello123')
        cy.get('input[type="password"]').should('have.value', 'Hello123')

        cy.get('button').contains('Login').click()

        cy.url().should('include', '/notes')

        cy.get('[data-cy=searchInput]').type('New test ntoe')
        cy.get('[data-cy=noteSelect]').should('not.exist')
    });

})