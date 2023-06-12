describe('Quick maps - Baseline', () => {
  beforeEach(() => {
    // Dont show the user tour
    window.localStorage.setItem('has-viewed-tour', 'true');
  });

  it('checks page for a11y compliance', () => {
    cy.visit('/quick-maps/food-systems/baseline?country-id=MWI&mnd-id=Fe&measure=food systems');
    cy.wait(8000);
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
  it('baseline description panel show/hide', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit(
      '/quick-maps/food-systems/baseline?country-id=MWI&mnd-id=Ca&measure=food systems&age-gender-group-id=WRA&sm=0&si=',
    );
    cy.get('.head-panel .mat-expansion-panel-body').should('be.visible');
    cy.get('.head-panel .mat-expansion-indicator').click();
    cy.get('.head-panel .mat-expansion-panel-body').should('be.hidden');
    cy.get('.head-panel .mat-expansion-indicator').click();
    cy.get('.head-panel .mat-expansion-panel-body').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('baseline estimate panel showing correct data', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit(
      '/quick-maps/food-systems/baseline?country-id=MWI&mnd-id=Ca&measure=food systems&age-gender-group-id=WRA&sm=0&si=',
    );
    cy.wait(3000);
    cy.get('.median > .estimateValue').should('be.visible');
    cy.get('.median > .estimateValue').should('have.text', ' 88.2 ');
    cy.get('.adequacy > .estimateValue').should('be.visible');
    cy.get('.adequacy > .estimateValue').should('have.text', '814');
    cy.get('.prevalence > .wrap-15').should('be.visible');
    cy.get('.prevalence > .wrap-15').should('have.text', '99.87% of sampled households (12396/12412)');
    cy.get('.right-text > :nth-child(1) > strong').should('be.visible');
    cy.get('.right-text > :nth-child(1) > strong').should('have.text', 'Beyond 2050');
    /* ==== End Cypress Studio ==== */
  });
});
