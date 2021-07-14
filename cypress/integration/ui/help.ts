/// <reference path="../../support/index.d.ts" />

describe('Page: Help Tests', () => {
  it('wakes up', () => {
    cy.visit('/help');
    cy.title().should('include', 'Micronutrient Action Policy Support (MAPS)');
  });

  it('checks page for a11y compliance', () => {
    cy.visit('/help');
    cy.injectAxe();
    cy.checkA11y(null, null, cy.terminalLog);
  });
});
