describe('Quick maps - Projections', () => {
  beforeEach(() => {
    // Dont show the user tour
    window.localStorage.setItem('has-viewed-tour', 'true');
  });

  it('checks page for a11y compliance', () => {
    cy.visit(
      '/quick-maps/diet/projection?country-id=MWI&mnd-id=Ca&measure=diet&data-level=household&age-gender-group=all',
    );
    cy.wait(4000);
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

  /* ==== Test Created with Cypress Studio ==== */
  it('Projections page displaying content', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('/quick-maps/diet/projection?country-id=MWI&mnd-id=Ca&measure=diet&age-gender-group-id=WRA&sm=0&si=');
    cy.wait(2000);
    cy.get('.mat-expansion-panel-body').should('be.visible');
    cy.get('.content-container > :nth-child(1) > strong').should('be.visible');
    cy.get('app-quick-maps-header.ng-star-inserted').click();
    cy.get('#projection-desc-nation-name').should('contain', 'Malawi');
    cy.get('#projection-desc-mn').should('contain', 'Calcium');
    cy.get('#projection-desc-metric').should('contain', 'diet Data');
    cy.get('#projection-desc-baseline').should('contain', 'SSP2');
    cy.get('app-estimate > .container').should('be.visible');
    cy.get('.chartjs-render-monitor').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });
});
