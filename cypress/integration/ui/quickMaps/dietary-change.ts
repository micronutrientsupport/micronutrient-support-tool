describe('Quick maps - Dietary Change', () => {
  beforeEach(() => {
    // Dont show the user tour
    window.localStorage.setItem('has-viewed-tour', 'true');
  });

  it('checks page for a11y compliance', () => {
    cy.visit(
      '/quick-maps/food-systems/dietary-change?country-id=MWI&mnd-id=Ca&measure=food systems&data-level=household&age-gender-group=all',
    );
    cy.wait(8000);
    cy.get('.minimize-button').click();
    cy.wait(2000);
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
