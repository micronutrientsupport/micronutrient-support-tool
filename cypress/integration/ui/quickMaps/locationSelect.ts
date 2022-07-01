import * as L from 'leaflet';
let leafletObject: L.Map;

describe('Quick Map - Location Select', () => {
  beforeEach(() => {
    // Dont show the user tour
    window.localStorage.setItem('has-viewed-tour', 'true');
  });
  // it('checks page for a11y compliance', () => {
  //   cy.visit('/quick-maps');
  //   cy.injectAxe();
  //   cy.checkA11y(null, null, cy.terminalLog);
  // });

  it('accesses leafet map', () => {
    cy.visit('/quick-maps');
    cy.wait(5000);
    cy.get('.leaflet-container').should('be.visible');
    cy.get('.leaflet-container > .leaflet-map-pane').should('exist');
    cy.window()
      // set leaflet map instance reference
      .then((win: unknown) => {
        leafletObject = win['testing'].leafletObject;
        // check map object available
        assert.isNotNull(leafletObject);
      });
  });
});
