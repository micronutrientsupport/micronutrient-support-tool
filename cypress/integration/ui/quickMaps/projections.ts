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
    cy.get('.mat-expansion-panel-body').should('be.visible');
    cy.get('.content-container > :nth-child(1) > strong').should('be.visible');
    cy.get('app-quick-maps-header.ng-star-inserted').click();
    cy.get('.content-container > :nth-child(1) > strong').should('have.text', 'Malawi');
    cy.get(':nth-child(2) > strong').should('be.visible');
    cy.get(':nth-child(2) > strong').should('have.text', 'Calcium');
    cy.get('.capitalize-text').should('be.visible');
    cy.get('.capitalize-text').should('have.text', 'diet Data');
    cy.get(':nth-child(4) > strong').should('be.visible');
    cy.get(':nth-child(4) > strong').should('have.text', 'SSP2');
    cy.get('app-estimate > .container').should('be.visible');
    cy.get(
      '#mat-tab-content-0-0 > .mat-tab-body-content > .ng-star-inserted > :nth-child(1) > .chartjs-render-monitor',
    ).should('be.visible');
    /* ==== End Cypress Studio ==== */
  });
});
