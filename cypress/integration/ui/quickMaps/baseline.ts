describe('Quick maps - Baseline', () => {
  it('checks page for a11y compliance', () => {
    cy.visit('/quick-maps/diet/baseline?country-id=MWI&mnd-id=Fe&measure=diet');
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
  it('baseline data visible', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit(
      'http://localhost:8100/quick-maps/diet/baseline?country-id=MWI&mnd-id=Ca&measure=diet&age-gender-group-id=WRA&sm=0&si=',
    );
    cy.get('.content-container > :nth-child(1) > strong').should('have.text', 'Malawi');
    cy.get('.content-container > :nth-child(2) > strong').should('have.text', 'Calcium');
    cy.get(':nth-child(3) > .capitalize-text').should('have.text', 'diet Data');
    cy.get(':nth-child(4) > .capitalize-text').should('have.text', ' country ');
    cy.get('#absolute-map').should('be.visible');
    cy.get('#treemap').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('baseline description panel show/hide', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit(
      'http://localhost:8100/quick-maps/diet/baseline?country-id=MWI&mnd-id=Ca&measure=diet&age-gender-group-id=WRA&sm=0&si=',
    );
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
    cy.visit(
      'http://localhost:8100/quick-maps/diet/baseline?country-id=MWI&mnd-id=Ca&measure=diet&age-gender-group-id=WRA&sm=0&si=',
    );
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
