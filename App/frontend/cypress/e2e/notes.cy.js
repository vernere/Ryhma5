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

  it('Test export', () => {
    cy.get('[data-cy=noteSelect]').click()

    /*
    cy.get('[data-cy=exportButton]').click()
    cy.get('[data-cy=exportPdf]').click()
    */
    
    cy.get('[data-cy=exportButton]').click()
    cy.get('[data-cy=exportMd]').click()

    cy.readFile('cypress/downloads/Note.md').should('contain', "Hello World! Hello World version 2 !Hello World!")

    cy.get('[data-cy=exportButton]').click()
    cy.get('[data-cy=exportTxt]').click()

    cy.readFile('cypress/downloads/Note.txt').should('contain', "Hello World! Hello World version 2 !Hello World!")

    cy.get('[data-cy=exportButton]').click()
    cy.get('[data-cy=exportDocx]').click()

    cy.readFile('cypress/downloads/Note.docx').should('exist')

  })
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
