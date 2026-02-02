/// <reference types="cypress" />
import { maybeClickByText } from "../support/utils"

describe('Processo de login', () => {

  beforeEach(() => {
   cy.intercept({ url: 'https://service*.privacy.com.br/auth/*' }, (req) => {
    if (["OPTIONS", "HEAD"].includes(req.method)) return

     req.headers['x-captcha-bypass-token'] = 'dev-bypass-token';
    }).as('bypassConfig');
  })

  it('Acessar a página inicial do privacy e então realizar o login', () => {
    
    cy.visit('https://web-dev.privacy.com.br/')
    maybeClickByText(/aceitar|accept|ok|entendi/i);
    cy.get('privacy-web-auth', { timeout: 20000 }).should('exist');
    
    cy.get ('privacy-web-auth').shadow() 
    .within(async() => { 
    cy.get('input[type="email"]', {timeout: 10000})
    .filter(':visible').first().click({force: true})
    .type('pedro.neri@privacy.com.br', {log: false});
    cy.get('input[type="password"',{timeout: 10000})
    .filter(':visible').first().click({force:true})
    .type('@123senhaDev'), {log: false}

    await cy.wait('@bypassConfig');

    cy.contains('button, [role="button"]', /Entrar|Sign In/i)

    
    .click({ force: true });
    cy.wait(1000)
  })
  // cy.get('.privacy-initial-banner-close', { timeout: 10000 }).should('be.visible').click();

})
})