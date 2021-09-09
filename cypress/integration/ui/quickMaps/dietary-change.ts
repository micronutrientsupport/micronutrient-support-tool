/// <reference path="../../../support/index.d.ts" />

describe('Quick maps - Dietary Change', () => {
  it('checks page for a11y compliance', () => {
    cy.visit(
      '/quick-maps/diet/dietary-change?country-id=MWI&mnd-id=Ca&measure=diet&data-level=household&age-gender-group=all',
    );
    cy.wait(3000);
    cy.get('.minimize-button').click();
    cy.wait(1000);
    cy.injectAxe();
    cy.checkA11y(
      {
        /*
        @angular-material-extensions/fab-menu does not contain aria-label tags
        so it fails the a11y tests. Until the directive can be updated we need to
        ignore this element
        */
        exclude: ['.mat-fab'],
      },
      null,
      cy.terminalLog,
    );
  });
});
