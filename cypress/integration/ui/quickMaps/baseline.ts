/// <reference path="../../../support/index.d.ts" />

describe('Quick maps - Baseline', () => {
  it('checks page for a11y compliance', () => {
    cy.visit(
      '/quick-maps/diet/baseline?country-id=MWI&mnd-id=Ca&measure=diet&data-level=household&age-gender-group=all',
    );
    cy.wait(3000);
    cy.get('.minimize-button').click();
    cy.injectAxe();
    cy.checkA11y(null, null, cy.terminalLog);
  });
});
