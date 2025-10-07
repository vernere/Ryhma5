/// <reference types="cypress" />
import { loginUser } from '../support/helpers';

describe('Notes tests', () => {
  beforeEach(() => {
    loginUser();
  });

  it('Test notes typing', () => {
    cy.get('[data-cy=noteSelect]').first().click()

    cy.get('[data-cy=noteTitle]').should('exist')
    cy.get('[data-cy=userEmail]').contains('test.test@notely.com').should('exist')
    cy.get('[data-cy=noteCreatedAt').should('exist')
    cy.get('[data-cy=noteTag').should('exist')

    cy.get('[data-cy=noteContent').type(' Hello World version 2 !')
    cy.get('[data-cy=noteContent').contains('Hello World! Hello World version 2 !')

  });

  it('Test export', () => {
    cy.get('[data-cy=noteSelect]').first().click()

    let noteTitle;
    cy.get('[data-cy=noteTitle]').invoke('val').then((value) => {
      noteTitle = value;

      /*
      cy.get('[data-cy=exportButton]').click()
      cy.get('[data-cy=exportPdf]').click()
      */

      cy.get('[data-cy=exportButton]').click()
      cy.get('[data-cy=boldButton]').click()

      cy.get('[data-cy=dropdownMenu]').should('not.exist')

      cy.get('[data-cy=exportButton]').click()
      cy.get('[data-cy=exportMd]').click()

      cy.readFile(`cypress/downloads/${noteTitle}.md`).should('contain', "Hello World! Hello World version 2 !")

      cy.get('[data-cy=exportButton]').click()
      cy.get('[data-cy=exportTxt]').click()

      cy.readFile(`cypress/downloads/${noteTitle}.txt`).should('contain', "Hello World! Hello World version 2 !")

      cy.get('[data-cy=exportButton]').click()
      cy.get('[data-cy=exportDocx]').click()

      cy.readFile(`cypress/downloads/${noteTitle}.docx`).should('exist')
    })

  });


  it('Test note text formatting', () => {
    cy.get('[data-cy=noteSelect]').first().click()

    cy.get('[data-cy=noteContent]').type('{selectall}')

    cy.get('[data-cy=boldButton]').click()
    cy.get('[data-cy=noteContent]').find('strong').should('exist')

    cy.get('[data-cy=noteContent]').type('{selectall}')

    cy.get('[data-cy=italicButton]').click()
    cy.get('[data-cy=noteContent]').find('em').should('exist')

    cy.get('[data-cy=noteContent]').type('{selectall}')

    cy.get('[data-cy=underlineButton]').click()
    cy.get('[data-cy=noteContent]').find('u').should('exist')

    cy.get('[data-cy=noteContent]').type('{selectall}')

    cy.get('[data-cy=listButton]').click()
    cy.get('[data-cy=noteContent]').find('ul').should('exist')

    cy.get('[data-cy=codeButton]').click()
    cy.get('pre').should('exist')
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

  it('Test note search for name', () => {
    cy.get('[data-cy=searchInput]').type('New test note')
    cy.get('[data-cy=noteSelect]').first().should('exist')
  });

  it('Test note search by tag', () => {
    cy.get('[data-cy=searchInput]').type('Coding')
    cy.get('[data-cy=noteSelect]').first().should('exist')
  });

  it('Test note add tag and remove tag', () => {
    cy.get('[data-cy=noteSelect]').first().click();
    cy.get('[data-cy=noteTag]').first().should('have.class', 'bg-green-200')
    cy.get('[data-cy=noteTag]').first().click();
    cy.get('[data-cy=noteTag]').first().should('not.have.class', 'bg-green-200')
    cy.get('[data-cy=noteTag]').first().click();
  });

})
