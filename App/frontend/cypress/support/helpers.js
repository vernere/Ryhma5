export const loginUser = () => {
    cy.visit('/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');

    cy.get('input[type="email"]').type('test.test@notely.com');
    cy.get('input[type="password"]').type('Hello123');
    cy.get('button').contains('Login').click();

     cy.url().should('include', '/notes');
}

export const logoutUser = () => {
    cy.contains('Logout').click();
    cy.url().should('include', '/');
}