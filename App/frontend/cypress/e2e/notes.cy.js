/// <reference types="cypress" />
import { loginUser } from '../support/helpers';

describe('Notes tests', () => {
  beforeEach(() => {
    loginUser();
  });

  it('Test notes typing', () => {
    cy.get('[data-cy=noteSelect]').first().click()

    cy.get('[data-cy=noteTitle]').should('exist')
    cy.get('[data-cy=username]').contains('Test').should('exist')
    cy.get('[data-cy=noteTag]').should('exist')

    cy.get('[data-cy="noteContent"]', { timeout: 10000 })
      .should("exist")
      .and("be.visible");

    cy.get('[data-cy="noteContent"]').click();

    const typedText = "Hello world! This is a test note.";

    cy.get('[data-cy="noteContent"]').type(typedText, { delay: 50 });
    cy.get('[data-cy="noteContent"]').should("contain.text", "Hello world!");

    cy.get('[data-cy="noteContent"]').type('{selectall}{backspace}');
    cy.get('[data-cy="noteContent"]').should("not.contain.text", "Hello world!");
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

      cy.readFile(`cypress/downloads/${noteTitle}.md`).should('exist')

      cy.get('[data-cy=exportButton]').click()
      cy.get('[data-cy=exportTxt]').click()

      cy.readFile(`cypress/downloads/${noteTitle}.txt`).should('exist')

      cy.get('[data-cy=exportButton]').click()
      cy.get('[data-cy=exportDocx]').click()

      cy.readFile(`cypress/downloads/${noteTitle}.docx`).should('exist')
    })

  });


  it('Test note text formatting', () => {
    cy.get('[data-cy=noteSelect]').first().click()

    const typedText = "Hello world! This is a test note.";


    cy.get('[data-cy="noteContent"]').type(typedText, { delay: 50 });
    cy.get('[data-cy="noteContent"]').should("contain.text", "Hello world!");

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
    const firstTag = cy.get('[data-cy=noteTag]').first();
    firstTag.click();
    firstTag.should('have.class', 'bg-green-200')
    firstTag.click();
    firstTag.should('not.have.class', 'bg-green-200');
    firstTag.click();
    cy.get('[data-cy="noteContent"]').type('{selectall}{backspace}');
  });
})

describe('Collaboration invite tests', () => {
  it('Should invite user to collaborate', () => {
    loginUser();

    const noteSelect = cy.get('[data-cy=noteSelect]').contains('Collaboration');

    noteSelect.first().click();
    cy.get('[data-cy=openCollaborationPopup]').click();
    cy.get('[data-cy=addCollaboratorInput]').clear().type('Test2');
    cy.get('[data-cy=addCollaboratorInput]').should('have.value', 'Test2');
    cy.get('[data-cy=sendInvite]').click();
    cy.wait(1000);

    cy.get('[data-cy=invitationItem]').contains('Test2').should('exist');

    cy.get('[data-cy=closeCollaborationPopup]').click();
  });

  it('Should fail to invite an already invited user', () => {
    loginUser();

    const noteSelect = cy.get('[data-cy=noteSelect]').contains('Collaboration');

    noteSelect.first().click();
    cy.get('[data-cy=openCollaborationPopup]').click();
    cy.get('[data-cy=addCollaboratorInput]').clear().type('Test2');
    cy.get('[data-cy=addCollaboratorInput]').should('have.value', 'Test2');
    cy.get('[data-cy=sendInvite]').click();
    cy.wait(1000);

    cy.get('[data-cy=inviteError]').contains('An invitation has already been sent to Test2').should('exist');

    cy.get('[data-cy=closeCollaborationPopup]').click();
  });

  it('Should accept collaboration invite', () => {
    loginUser('test.test2@notely.com', 'Hello123');

    const acceptInvite = () => cy.get('[data-cy=acceptInvite]');

    cy.get('[data-cy=inboxButton]').click();

    const invitationCard = cy.get('[data-cy=invitationCard]').should('exist');
    invitationCard.get('[data-cy=invitationMessage]').contains('Test invited you to a note').should('exist');

    invitationCard.get('[data-cy=acceptInvite]').should('exist');
    invitationCard.get('[data-cy=declineInvite]').should('exist');

    acceptInvite().click();
    cy.wait(500);

    cy.get('[data-cy=closeInvitePopup]').click();
    invitationCard.should('not.exist');


    cy.get('[data-cy=noteSelect]').contains('Collaboration').should('exist');
  });

  it('Should fail to invite an already collaborating user', () => {
    loginUser();

    const noteSelect = cy.get('[data-cy=noteSelect]').contains('Collaboration');

    noteSelect.first().click();
    cy.get('[data-cy=openCollaborationPopup]').click();
    cy.get('[data-cy=addCollaboratorInput]').clear().type('Test2');
    cy.get('[data-cy=addCollaboratorInput]').should('have.value', 'Test2');
    cy.get('[data-cy=sendInvite]').click();
    cy.wait(1000);

    cy.get('[data-cy=inviteError]').contains('Test2 is already a collaborator on this note').should('exist');

    cy.get('[data-cy=closeCollaborationPopup]').click();
  });

  it('Should remove collaborator', () => {
    loginUser();

    const noteSelect = cy.get('[data-cy=noteSelect]').contains('Collaboration');
    noteSelect.first().click();
    cy.get('[data-cy=openCollaborationPopup]').click();

    const collaborator = cy.get('[data-cy=collaboratorUsername]').contains('Test2').parent().parent().parent();
    collaborator.should('exist');
    collaborator.find('[data-cy=removeCollaborator]').click();

    cy.wait(500);
    collaborator.should('not.exist');

    cy.get('[data-cy=closeCollaborationPopup]').click();
  });
});

describe('Delete note test ', () => {
  it('Should test delete confirm dialog', () => {
    loginUser();

    cy.get('[data-cy=noteSelect]').first().trigger('mouseover').find('[data-cy=deleteNote]').click()
    cy.get('[data-cy=confirmDelete]').should('exist')
    cy.get('[data-cy=cancelDelete]').click();
    cy.get('[data-cy=noteSelect]').first().trigger('mouseover').find('[data-cy=deleteNote]').click()
    cy.get('[data-cy=closeDeleteConfirm]').should('exist').click()

  });
})

describe('Language selector tests', () => {
  it('Should change localization', () => {
    loginUser();

    cy.get('[data-cy=languageButton]').click();
    cy.get('[data-cy=languageList]').children().contains("Vietnamese").click();
    cy.contains("Đăng xuất").should('exist');
    cy.get('[data-cy=languageList]').should('not.exist')

    cy.get('[data-cy=languageButton]').click();
    cy.get('[data-cy=languageList]').children().contains("Kurdish").click();
    cy.contains("Darkava").should('exist');
    cy.get('[data-cy=languageList]').should('not.exist')

    cy.get('[data-cy=languageButton]').click();
    cy.get('[data-cy=languageList]').children().contains("Swedish").click();
    cy.contains("Logga ut").should('exist');
    cy.get('[data-cy=languageList]').should('not.exist')

    /*
    cy.get('[data-cy=languageButton]').click();
    cy.get('[data-cy=languageList]').children().contains("Finnish").click();
    cy.contains("Kirjaudu ulos").should('exist');
    cy.get('[data-cy=languageList]').should('not.exist')
     */

    cy.get('[data-cy=languageButton]').click();
    cy.get('[data-cy=languageList]').children().contains("English").click();
    cy.contains("Logout").should('exist');
    cy.get('[data-cy=languageList]').should('not.exist')
  });
});