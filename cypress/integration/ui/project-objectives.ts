/// <reference path="../../support/index.d.ts" />

describe('Page: project objectives Tests', () => {
  it('wakes up', () => {
    cy.visit('/project-objectives');
    cy.title().should('include', 'Micronutrient Action Policy Support (MAPS)');
  });

  it('checks page for a11y compliance', () => {
    cy.visit('/project-objectives');
    cy.injectAxe();
    cy.checkA11y(null, null, cy.terminalLog);
  });
});
