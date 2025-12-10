export const maybeClickByText = (re) => {
  cy.get('body', { log: false }).then($body => {
    const $btn = Cypress.$('button, [role="button"]', $body)
      .filter((_, el) => re.test(Cypress.$(el).text().trim()));
    if ($btn.length) cy.wrap($btn[0]).click({ force: true, log: false });
  });
};

////////////////////////////////////////////////////////////////////////////////////


export function login(email, senha) {

//   cy.visit('https://web-hml.privacy.com.br/');

  // Aceitar cookies/popups se houver
  maybeClickByText(/aceitar|accept|ok|entendi/i);

  cy.get('privacy-web-auth', { timeout: 20000 }).should('exist');

  cy.get('privacy-web-auth')
    .shadow()
    .within(() => {

      cy.get('input[type="email"]', { timeout: 10000 })
        .filter(':visible').first().click({ force: true })
        .type(email, { log: false });

      cy.get('input[type="password"]', { timeout: 10000 })
        .filter(':visible').first()
        .click({ force: true })
        .type(senha, { log: false });

      cy.contains('button', /Entrar/i).click({ force: true });
    });

  cy.wait(1000);

  cy.get('.privacy-initial-banner-close', { timeout: 10000 })
    .should('be.visible').click({ force: true });

}