/// <reference types="cypress" />
import { maybeClickByText } from "../support/utils"

     //LOGIN E SENHA QUE SERÃO UTILIZADOS
    const email = 'pedro.neri@privacy.com.br';
    const senha = '@123senhaProd';

describe('Processo de login', () => {

  beforeEach(() => {
   cy.intercept({ url: 'https://service*.privacy.com.br/auth/*' }, (req) => {
    if (["OPTIONS", "HEAD"].includes(req.method)) return

     req.headers['x-captcha-bypass-token'] = '0mD8SJZSaW3xeIFDCunTRjrLSUZY5pRZKCJ1WCr3L3To8JvFYesO0aKQdHhhV7GS';
    }).as('bypassConfig');
  })

  it('Acessar a página inicial do privacy e então realizar o login', () => {
    
    cy.visit('https://privacy.com.br/')
    maybeClickByText(/aceitar|accept|ok|entendi/i);
    cy.get('privacy-web-auth', { timeout: 20000 }).should('exist');
    
    cy.get ('privacy-web-auth').shadow() 
    .within(async() => { 
    cy.get('input[type="email"]', {timeout: 10000})
    .filter(':visible').first().click({force: true})
    .type(email, {log: false});
    cy.get('input[type="password"',{timeout: 10000})
    .filter(':visible').first().click({force:true})
    .type(senha), {log: false}

    await cy.wait('@bypassConfig');

    cy.contains('button, [role="button"]', /Entrar|Sign In/i)

    
    .click({ force: true });
    cy.wait(1000)
    
  })
  
  // cy.get('.privacy-initial-banner-close', { timeout: 10000 }).should('be.visible').click();

})
})