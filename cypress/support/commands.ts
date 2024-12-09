/// <reference types="cypress" />
declare namespace Cypress {
    interface Chainable {
        getByData(dataTestAttr: string): Chainable<JQuery<HTMLElement>>,
        login(email: string, password: string): Chainable<void>
    }
}

Cypress.Commands.add("getByData", (selector) => {
    return cy.get(`[data-testid=${selector}]`)
});

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('http://localhost:3000/auth');
    cy.getByData("email-input").type(email);
    cy.getByData("password-input").type(password);
    cy.getByData("submit-button").click();
    
  });
  