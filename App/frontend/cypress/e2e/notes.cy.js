/// <reference types="cypress" />
import { loginUser } from '../support/helpers';

describe('Notes tests', () => {
    beforeEach(() => {
        loginUser();
    });

    it('Test notes typing', () => {
        cy.get('[data-cy=noteSelect]').click()

        cy.get('[data-cy=noteTitle]').contains('New test note').should('exist')
        cy.get('[data-cy=userEmail]').contains('test.test@notely.com').should('exist')
        cy.get('[data-cy=noteCreatedAt').should('exist')
        cy.get('[data-cy=noteTag').should('exist')

        cy.get('[data-cy=noteContent').type(' Hello World version 2 !')
        cy.get('[data-cy=noteContent').contains('Hello World! Hello World version 2 !')
    });
})

describe('Search tests', () => {
    beforeEach(() => {
        loginUser();
    });

    it('Test search input and response', () => {
        cy.get('[data-cy=searchInput]').type('New test ntoe')
        cy.get('[data-cy=noteSelect]').should('not.exist')
    });  
})