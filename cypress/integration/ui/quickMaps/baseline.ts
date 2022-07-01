describe('Quick maps - Baseline', () => {
  beforeEach(() => {
    // Dont show the user tour
    window.localStorage.setItem('has-viewed-tour', 'true');
  });

  it('checks page for a11y compliance', () => {
    cy.visit('/quick-maps/diet/baseline?country-id=MWI&mnd-id=Fe&measure=diet');
    cy.wait(4000);
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
    cy.visit('/quick-maps/diet/baseline?country-id=MWI&mnd-id=Ca&measure=diet&age-gender-group-id=WRA&sm=0&si=');
    cy.get('.mat-expansion-panel-body').should('be.visible');
    cy.get('.mat-expansion-indicator').click();
    cy.get('.mat-expansion-panel-body').should('be.hidden');
    cy.get('.mat-expansion-indicator').click();
    cy.get('.mat-expansion-panel-body').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('baseline estimate panel showing correct data', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('/quick-maps/diet/baseline?country-id=MWI&mnd-id=Ca&measure=diet&age-gender-group-id=WRA&sm=0&si=');
    cy.get('.nation > .estimateValue').should('be.visible');
    cy.get('.nation > .estimateValue').should('have.text', ' 296 ');
    cy.get('.vitamin > .estimateValue').should('be.visible');
    cy.get('.vitamin > .estimateValue').should('have.text', '759');
    cy.get('.baseline > .estimateValue').should('be.visible');
    cy.get('.baseline > .estimateValue').should('have.text', ' -61% ');
    cy.get('.right-text > :nth-child(1) > strong').should('be.visible');
    cy.get('.right-text > :nth-child(1) > strong').should('have.text', 'Beyond 2050');
    /* ==== End Cypress Studio ==== */
  });
});
