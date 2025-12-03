/// <reference types="cypress" />
import { maybeClickByText } from "../support/utils"

describe('Processo de login', () => {
  it('Acessar a página inicial do privacy e então realizar o login', () => {
    cy.visit('https://web-hml.privacy.com.br/auth?route=sign-in')
    maybeClickByText(/aceitar|accept|ok|entendi/i);
    cy.get('privacy-web-auth', { timeout: 20000 }).should('exist');
    
    cy.get ('privacy-web-auth').shadow() 
    .within(() => { 
    cy.get('input[type="email"]', {timeout: 10000})
    .filter(':visible').first().click({force: true})
    .type('pedro.neri@privacy.com.br', {log: false});
    cy.get('input[type="password"',{timeout: 10000})
    .filter(':visible').first().click({force:true})
    .type('@123senhaHml'), {log: false}
    cy.contains('button, [role="button"]', /Entrar/i)
    .click({ force: true });
    cy.wait(1000)
  })
  cy.get('.privacy-initial-banner-close', { timeout: 10000 }).should('be.visible').click();

})
})