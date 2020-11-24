/// <reference types="Cypress" />

describe('`Quick Map Tests`', () => {
  it('load leaflet map', () => {
    cy.visit('/quick-maps');
    cy.get('#map').should('be.visible');
  });

  it('navigate to the baseline page', () => {
    cy.visit('/quick-maps');
    cy.get('[ng-reflect-router-link="/quick-maps/baseline"]').click();
    cy.get('app-map-view').should('be.visible');
  });

  it('navigate to the 2050 projection page', () => {
    cy.visit('/quick-maps');
    cy.get('[ng-reflect-router-link="/quick-maps/projection"]').click();
    // cy.get('app-map-view').should('be.visible');
  });
});
