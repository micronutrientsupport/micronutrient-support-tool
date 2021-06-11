/// <reference types="Cypress" />

declare namespace Cypress {
  interface Chainable {
    terminalLog(violations: any): () => void;
  }
}
