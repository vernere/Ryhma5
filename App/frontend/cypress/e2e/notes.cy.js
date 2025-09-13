/// <reference types="Cypress" />

describe('Sidebar tests', () => {
    it('Search test', () => {
        cy.visit('/');

        cy.contains('Login').click()
        cy.url().should('include', '/login')

        cy.get('input[type="email"]').type('verner.etola@gmail.com')
        cy.get('input[type="email"]').should('have.value', 'verner.etola@gmail.com')

        cy.get('input[type="password"]').type('Hello123')
        cy.get('input[type="password"]').should('have.value', 'Hello123')

        cy.get('button').contains('Login').click()

        cy.url().should('include', '/notes')

        cy.get('.relative > .w-full').type('HelloWorld')
        cy.get('.relative > .w-full').should('have.value', 'HelloWorld')

        cy.get('.z-10 > :nth-child(1)').contains('HelloWorld').should('exist')
        cy.get('.z-10 > :nth-child(1)').click()

        cy.get('.flex-1.flex > .border-b').should('exist')
        cy.get('.space-x-4').should('exist')
        cy.get('.justify-between > div > .text-lg').contains('HelloWorld').should('exist')

    });

    it('Note list', () => {
        cy.visit('/');

        cy.contains('Login').click()
        cy.url().should('include', '/login')

        cy.get('input[type="email"]').type('verner.etola@gmail.com')
        cy.get('input[type="email"]').should('have.value', 'verner.etola@gmail.com')

        cy.get('input[type="password"]').type('Hello123')
        cy.get('input[type="password"]').should('have.value', 'Hello123')

        cy.get('button').contains('Login').click()

        cy.url().should('include', '/notes')

        cy.get('.w-80 > .overflow-y-auto > :nth-child(1)').click()

        cy.get('.flex-1.flex > .border-b').should('exist')
        cy.get('.space-x-4').should('exist')
        cy.get('.justify-between > div > .text-lg').contains('HelloWorld').should('exist')

        cy.get('.w-80 > .overflow-y-auto > :nth-child(2)').click()

        cy.get('.flex-1.flex > .border-b').should('exist')
        cy.get('.space-x-4').should('exist')
        cy.get('.justify-between > div > .text-lg').contains('HelloWorld').should('exist')
    });

})
