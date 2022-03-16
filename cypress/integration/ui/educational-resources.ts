describe('Page: Educational resources Tests', () => {
  it('wakes up', () => {
    cy.visit('/educational-resources');
    cy.title().should('include', 'Micronutrient Action Policy Support (MAPS)');
  });

  it('checks page for a11y compliance', () => {
    cy.visit('/educational-resources');
    cy.wait(1000);
    cy.injectAxe();
    cy.checkA11y(null, null, cy.terminalLog);
  });
});
