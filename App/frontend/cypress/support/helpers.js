export const loginUser = (email = 'test.test@notely.com', password = 'Hello123') => {
    cy.visit('/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');

    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button').contains('Login').click();

     cy.url().should('include', '/notes');
}

export const logoutUser = () => {
    cy.contains('Logout').click();
    cy.url().should('include', '/');
}