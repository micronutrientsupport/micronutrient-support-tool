describe('Page: Maps Tool Tests', () => {
  it('wakes up', () => {
    cy.visit('/maps-tool');
    cy.title().should('include', 'Micronutrient Action Policy Support (MAPS)');
  });

  it('checks page for a11y compliance', () => {
    cy.visit('/maps-tool');
    cy.injectAxe();
    cy.checkA11y(null, null, cy.terminalLog);
  });
});
