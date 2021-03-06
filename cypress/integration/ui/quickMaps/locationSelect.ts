/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/// <reference path="../../../support/index.d.ts" />

import * as L from 'leaflet';
let leafletObject: L.Map;

describe('Quick Map - Location Select', () => {
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
      .then((win: any) => {
        leafletObject = win['testing'].leafletObject;
        // check map object available
        assert.isNotNull(leafletObject);
      });
  });
});
