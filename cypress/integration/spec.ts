/// <reference types="Cypress" />

describe('Smoke Test', () => {
    it('renders MAPS without crashing', () => {
        cy.visit('/');
        cy.get('span').contains('app is running');
    });
});
