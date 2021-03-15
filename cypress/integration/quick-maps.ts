/// <reference types="Cypress" />

export const populateSelectValues = (): void => {
  cy.get('[name="nation"]', { timeout: 10000 }).first().click({ force: true });
  cy.get('mat-option > .mat-option-text', { timeout: 10000 }).first().click({ force: true });

  cy.get('[name="micronutrient"]').click({ force: true });
  // wait for previous select to close and this one to open
  cy.wait(500);
  cy.get('mat-option > .mat-option-text', { timeout: 10000 }).eq(1).click({ force: true });

  // wait for auto select of pop group and mnds data
  cy.wait(3000);
};

describe('Quick Map Tests', () => {
  it('load leaflet map', () => {
    cy.visit('/quick-maps');
    cy.get('#map').should('be.visible');
  });

  it('navigate to the baseline page', () => {
    cy.visit('/quick-maps');
    cy.wait(3000);
    populateSelectValues();

    cy.get('.footer-row > .mat-focus-indicator > .mat-button-wrapper').click({ force: true });

    cy.get('app-baseline-details').should('be.visible');
  });

  it('navigate to the 2050 projection page', () => {
    cy.visit('/quick-maps');
    cy.wait(3000);
    populateSelectValues();

    cy.get('.footer-row > .mat-focus-indicator > .mat-button-wrapper').click({ force: true });

    cy.get('.mode-select a.quickmaps-projection-link').click({ force: true });

    cy.get('app-quickmaps-projection').should('be.visible');
  });
});
