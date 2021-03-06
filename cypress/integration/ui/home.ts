/// <reference path="../../support/index.d.ts" />

describe('Page: Home Tests', () => {
  it('wakes up', () => {
    cy.visit('/');
    cy.title().should('include', 'Micronutrient Action Policy Support (MAPS)');
  });

  it('checks page for a11y compliance', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y(null, null, cy.terminalLog);
  });

  it('loads the home page sharing dialog', () => {
    cy.visit('/');
    cy.get('#sharePageButton').click();
    cy.get('#shareContentPanel').should('be.visible');
    cy.get('#shareContentPanel > h2').contains('Share this page');
  });

  it('loads the home page sharing dialog and tries to close by pressing esc key', () => {
    cy.visit('/');
    cy.get('#sharePageButton').click();
    cy.get('#sharingDialog').should('be.visible');
    cy.get('#shareContentPanel > h2').contains('Share this page');
    cy.get('body').type('{esc}', { force: true });
    cy.get('#sharingDialog').should('not.exist');
  });

  it('loads the home page sharing dialog and tries to close by clicking in surrounding page', () => {
    cy.visit('/');
    cy.get('#sharePageButton').click();
    cy.get('#sharingDialog').should('be.visible');
    cy.get('#shareContentPanel > h2').contains('Share this page');
    cy.get('.cdk-overlay-backdrop').click(-50, -50, { force: true });
    cy.get('#sharingDialog').should('not.exist');
  });
});
