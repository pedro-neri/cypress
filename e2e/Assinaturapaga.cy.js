import { login } from "../support/utils";

     //LOGIN E SENHA QUE SERÃO UTILIZADOS
    const email = 'pedro.neri@privacy.com.br';
    const senha = '@123senhaHml';
    

describe('Login e realização de assinatura de perfil grátis', () => {
  it('Ao realizar o login deverá localizar um perfil free ainda não assinado e assina-lo', () => {

   
    //Visita o site de login
    cy.visit('https://web-hml.privacy.com.br/board')
    //Realiza o processo de login
    login(email, senha)

    //Entra na sessão "todos" da search
    cy.get('#privacy-header--search-button').click()
    cy.get('#privacy-web-omnisearch').shadow()
    .find('#tab-all.el-tabs__item.is-top.is-active', { timeout: 40000 })
    .should('be.visible').click({force:true})
    .wait(3000)


//Faz a leitura dos perfis exibidos, entra em cada um e realiza a assinatura do primeiro perfil ainda não assinado   
cy.get('#privacy-web-omnisearch').shadow()
  .within(() => { 
    cy.get('.profile-card').as('cards');
  });
let index = 0;

// Função interna para processar o perfil e validar se é ou não assinante
function verificarPerfil() {

  cy.get('@cards').eq(index).click({ force: true });

  cy.get('#privacy-web-user-info', { timeout: 20000})
    .shadow()
    .then(($shadow) => {

      const btn = $shadow.find('.btn-interactions .text-sm.font-medium');

      // Se o botão "mimo" NÃO existe, é um perfil ainda não assinado e será assinado
      if (!btn.length) {
        cy.get('#privacy-web-user-info')
        .shadow()
        .find('.el-button.btn-subscription.row.d-flex', { timeout: 10000 })
        .should('be.visible')
        .click({ multiple: true });;
        cy.get('#privacy-web-payment', { timeout: 15000 })
        .should('exist')
        .shadow()
        .find('.d-flex.payment-method-item-content.payment-method-wallet-card', { timeout: 10000 })
        .click({ force: true })
        cy.get('#privacy-web-payment').shadow()
        .find('.el-button.el-button--outline.is-plain', {timeout: 20000})
        .should('be.visible')
        .click()
        
        return;
      }

      // Caso o botão exista, retorna para a tela anterior e vai para o próximo perfil
      const texto = btn.text().trim().toLowerCase();

      if (texto.includes('mimo')) {

        cy.go('back', {timeout: 1000});
        cy.get('#privacy-web-omnisearch',{ timeout: 50000 })
        .should('exist')
        .shadow()
        .find('#tab-all.el-tabs__item.is-top.is-active', { timeout: 30000 })
        .should('be.visible').click()
        cy.wait(2000);

        index++;

        cy.get('@cards').its('length').then((total) => {
          if (index < total) {
            verificarPerfil();
          } else {
            cy.log('Nenhum perfil válido encontrado');
          }
        });

      } 

    });
}

verificarPerfil();

    })
})