/// <reference types="Cypress" />

describe('Notes tests', () => {
    it('Test notes typing', () => {
        cy.visit('/');

        cy.contains('Login').click()
        cy.url().should('include', '/login')

        cy.get('input[type="email"]').type('verner.etola@gmail.com')
        cy.get('input[type="email"]').should('have.value', 'verner.etola@gmail.com')

        cy.get('input[type="password"]').type('Hello123')
        cy.get('input[type="password"]').should('have.value', 'Hello123')

        cy.get('button').contains('Login').click()

        cy.url().should('include', '/notes')

        cy.get('.flex-1 > .px-4').click()

        cy.get('.text-xl').contains('New test note').should('exist')
        cy.get('.gap-4 > .text-xs').contains('verner.etola@gmail.com').should('exist')
        cy.get('.mt-1 > .text-gray-400').should('exist')
        cy.get('.inline-block').should('exist')

        cy.get('.text-gray-800').type(' Hello World version 2 !')
        cy.get('.text-gray-800').contains('Hello World! Hello World version 2 !')

    });
})

describe('Search tests', () => {
    it('Test search input and response', () => {
        cy.visit('/');

        cy.contains('Login').click()
        cy.url().should('include', '/login')

        cy.get('input[type="email"]').type('verner.etola@gmail.com')
        cy.get('input[type="email"]').should('have.value', 'verner.etola@gmail.com')

        cy.get('input[type="password"]').type('Hello123')
        cy.get('input[type="password"]').should('have.value', 'Hello123')

        cy.get('button').contains('Login').click()

        cy.url().should('include', '/notes')

        cy.get('.w-60 > :nth-child(2) > .flex').type('New test ntoe')
        cy.get('.flex-1 > .px-4').should('not.exist')
    });

})

