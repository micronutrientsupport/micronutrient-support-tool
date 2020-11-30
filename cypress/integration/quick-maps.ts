/// <reference types="Cypress" />


export const populateSelectValues = (): void => {

  cy.get('[name="nation"]').click({ force: true });
  cy.get('mat-option > .mat-option-text',  { timeout: 1000 }).first().click({ force: true });


  cy.get('[name="micronutrients"]').click({ force: true });
  // wait for previous select to close and this one to open
  cy.wait(500);
  cy.get('mat-option > .mat-option-text',  { timeout: 1000 }).first().click({ force: true });

  // wait for auto select of pop group and mnds data
  cy.wait(2000);
};

describe('Quick Map Tests', () => {
  it('load leaflet map', () => {
    cy.visit('/quick-maps');
    cy.get('#map').should('be.visible');
  });

  it('navigate to the baseline page', () => {
    cy.visit('/quick-maps');

    populateSelectValues();

    cy.get('.footer-row > .mat-focus-indicator > .mat-button-wrapper').click({ force: true });

    cy.get('app-baseline-details').should('be.visible');
  });

  it('navigate to the 2050 projection page', () => {
    cy.visit('/quick-maps');

    populateSelectValues();

    cy.get('.footer-row > .mat-focus-indicator > .mat-button-wrapper').click({ force: true });

    cy.get('[ng-reflect-router-link="/quick-maps/projection"]').click({ force: true });

    cy.get('app-quickmaps-projection').should('be.visible');
  });
});
