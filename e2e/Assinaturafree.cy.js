import { login } from "../support/utils";

describe('Login e realização de assinatura de perfil grátis', () => {
  it('Ao realizar o login deverá localizar um perfil free ainda não assinado e assina-lo', () => {

    //LOGIN E SENHA QUE SERÃO UTILIZADOS
    const email = 'pedro.neri@privacy.com.br';
    const senha = '@123senhaHml';


    //Visita o site de login
    cy.visit('https://web-hml.privacy.com.br/board')
    

    //Realiza o processo de login
    login(email,senha)

    //Entra na aba de gratuitos dentro da search
    cy.get('#privacy-header--search-button').click()
    cy.get('#privacy-web-omnisearch').shadow()
    .wait(2000)
    .find('#tab-free.el-tabs__item.is-top', { timeout: 40000 })
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
        .find('.el-button.btn-subscription', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });;
        return;
      }

      // Caso o botão exista, retorna para a tela anterior e vai para o próximo perfil
      const texto = btn.text().trim().toLowerCase();

      if (texto.includes('mimo')) {

        cy.go('back', {timeout: 5000});
        cy.get('#privacy-web-omnisearch',{ timeout: 50000 })
        .should('exist')
        .shadow()
        .find('#tab-free.el-tabs__item.is-top', { timeout: 30000 })
        .should('be.visible')
        .click()
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