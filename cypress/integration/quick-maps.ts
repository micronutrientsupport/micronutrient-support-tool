/// <reference types="Cypress" />


export const populateSelectValues = (): void => {

  cy.get('[name="nation"]').click({ force: true });
  cy.get('mat-option > .mat-option-text').first().click({ force: true });

  cy.get('[name="micronutrients"]').click({ force: true });
  cy.get('mat-option > .mat-option-text').first().click({ force: true });

  cy.get('[name="popGroup"]').click({ force: true });
  cy.get('mat-option > .mat-option-text').first().click({ force: true });

  cy.get('[name="mndsData"]').click({ force: true });
  cy.get('mat-option > .mat-option-text').first().click({ force: true });
};

describe('`Quick Map Tests`', () => {
  it('load leaflet map', () => {
    cy.visit('/quick-maps');
    cy.get('#map').should('be.visible');
  });

  it('navigate to the baseline page', () => {
    cy.visit('/quick-maps');

    populateSelectValues();

    cy.get('.footer-row > .mat-focus-indicator > .mat-button-wrapper').click({ force: true });

    cy.wait(500);
    cy.get('app-baseline-details').should('be.visible');
  });

  it('navigate to the 2050 projection page', () => {
    cy.visit('/quick-maps');

    populateSelectValues();

    cy.get('.footer-row > .mat-focus-indicator > .mat-button-wrapper').click({ force: true });

    cy.get('[ng-reflect-router-link="/quick-maps/projection"]').click({ force: true });

    cy.wait(500);
    cy.get('app-quickmaps-projection').should('be.visible');
  });
});
