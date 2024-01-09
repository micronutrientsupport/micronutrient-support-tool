export const populateSelectValues = (): void => {
  // cy.get('[name="geographyOfInterest"]', { timeout: 10000 }).first().click({ force: true });
  cy.get('[name="geographyOfInterest"] > .mat-mdc-form-field > .mat-mdc-text-field-wrapper')
    .first()
    .click({ force: true });
  cy.get('#qmSelectNation-panel', { timeout: 10000 }).contains('Malawi').click({ force: true });
  cy.get('[name="micronutrient"]').click({ force: true });
  // wait for previous select to close and this one to open
  cy.wait(500);
  cy.get('#qmSelectMNDMineral-button').click({ force: true });
  cy.get('#qmSelectMND-panel', { timeout: 10000 }).contains('Zinc').click({ force: true });
  // wait for auto select of pop group and mnds data
  cy.wait(3000);
};

describe('Quick Map Tests', () => {
  beforeEach(() => {
    // Dont show the user tour
    window.localStorage.setItem('has-viewed-tour', 'true');
  });

  it('checks page for a11y compliance', () => {
    cy.visit('/quick-maps');
    cy.wait(4000);
    cy.injectAxe();
    cy.checkA11y(null, null, cy.terminalLog);
  });

  it('load leaflet map', () => {
    cy.visit('/quick-maps');
    cy.wait(3000);
    cy.get('#map').should('be.visible');
  });

  it('navigate to the baseline page', () => {
    cy.visit('/quick-maps');
    cy.wait(3000);
    populateSelectValues();
    cy.get('#button-view-results').click({ force: true });
    cy.get('app-baseline-details').should('be.visible');
  });

  it('navigate to the 2050 projection page', () => {
    cy.visit('/quick-maps');
    cy.wait(3000);
    populateSelectValues();
    cy.get('#button-view-results').click({ force: true });
    cy.get('#modeButtonSelectProjection').click();
    cy.get('app-quickmaps-projection').should('be.visible');
  });
});
