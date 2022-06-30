import { Interception } from 'cypress/types/net-stubbing';
import { ApiResponse } from '../../../../src/app/apiAndObjects/api/apiResponse.interface';

describe('Quick Map - Side Nav Tests', () => {
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

  it('side navigation loads all elements', () => {
    cy.visit('/quick-maps');
    cy.get('#qmSideNavTitle').contains('Quick MAPS');
  });

  it('hides and reopens the side navigation', () => {
    cy.visit('/quick-maps');
    cy.get('#quickMapsForm').should('exist');
    cy.get('.minimize-button').click();
    cy.get('#quickMapsForm').should('not.exist');
    cy.get('.minimize-button').click();
    cy.get('#quickMapsForm').should('exist');
  });

  it('sidebar lock disables side bar from being minimised', () => {
    cy.visit('/quick-maps');
    cy.get('.minimize-button').should('not.be.disabled');
    cy.get('.mat-slide-toggle-label').click();
    cy.get('.minimize-button').should('be.disabled');
    cy.get('.mat-slide-toggle-label').click();
    cy.get('.minimize-button').should('not.be.disabled');
  });

  it('loads a list of single nations and populates the drop down with all api response', () => {
    cy.intercept('GET', 'countries').as('getCountries');
    cy.visit('/quick-maps');
    cy.wait('@getCountries').then((interception: Interception) => {
      assert.isNotNull(interception.response.body, 'API call has data');
      expect(interception.response.statusCode).to.eq(200);
      const responseBody: ApiResponse = interception.response.body;
      cy.get('#mat-select-value-1').click();
      cy.get('#qmSelectNation-panel').find('mat-option').should('have.length', responseBody.data['length']);
    });
  });

  it('loads Vitamin list and populates the drop down with all api response', () => {
    cy.intercept('GET', 'micronutrients').as('getMicronutrients');
    cy.visit('/quick-maps');
    cy.wait('@getMicronutrients').then((interception: Interception) => {
      assert.isNotNull(interception.response.body, 'API call has data');
      expect(interception.response.statusCode).to.eq(200);
      const responseBody: ApiResponse = interception.response.body;
      const countVitamins: Array<unknown> = responseBody.data.filter((item) => item['category'] === 'vitamin');
      cy.get('#qmSelectMNDVitamin-button').click();
      cy.get('#mat-select-value-3').click();
      cy.get('#qmSelectMND-panel').find('mat-option').should('have.length', countVitamins.length);
    });
  });

  it('loads Mineral list and populates the drop down with all api response', () => {
    cy.intercept('GET', 'micronutrients').as('getMicronutrients');
    cy.visit('/quick-maps');
    cy.wait('@getMicronutrients').then((interception: Interception) => {
      assert.isNotNull(interception.response.body, 'API call has data');
      expect(interception.response.statusCode).to.eq(200);
      const responseBody: ApiResponse = interception.response.body;
      const countMinerals: Array<unknown> = responseBody.data.filter((item) => item['category'] === 'mineral');
      cy.get('#qmSelectMNDMineral-button').click();
      cy.get('#mat-select-value-3').click();
      cy.get('#qmSelectMND-panel').find('mat-option').should('have.length', countMinerals.length);
    });
  });

  it('loads Other list and populates the drop down with all api response', () => {
    cy.intercept('GET', 'micronutrients').as('getMicronutrients');
    cy.visit('/quick-maps');
    cy.wait('@getMicronutrients').then((interception: Interception) => {
      assert.isNotNull(interception.response.body, 'API call has data');
      expect(interception.response.statusCode).to.eq(200);
      const responseBody: ApiResponse = interception.response.body;
      const countOther: Array<unknown> = responseBody.data.filter((item) => item['category'] === 'other');
      cy.get('#qmSelectMNDOther-button').click();
      cy.get('#mat-select-value-3').click();
      cy.get('#qmSelectMND-panel').find('mat-option').should('have.length', countOther.length);
    });
  });
});
