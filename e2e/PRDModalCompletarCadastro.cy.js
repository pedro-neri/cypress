import { PRDlogin } from "../support/utils";


     //LOGIN E SENHA QUE SERÃO UTILIZADOS
    const email = 'neripedro.h@gmail.com';
    const senha = '@123senhaProd';
    

describe('Login e realização de assinatura de perfil pago', () => {
  it('Ao realizar o login deverá localizar um perfil pago ainda não assinado e verificar o modal de completar cadastro', () => {

   
    //Visita o site de login
    cy.visit('https://privacy.com.br/board')

    //Realiza o processo de login e clica na search
    PRDlogin(email, senha)

   //Entra na sessão "todos" da search
    cy.get('#privacy-web-floatmenu').shadow()
    .find('.svg-inline--fa.fa-search.pwt-icon.pwt-tab-bar__icon').click()
    cy.get('#privacy-web-omnisearch').shadow()
    .find('#tab-all.el-tabs__item.is-top.is-active', { timeout: 40000 })
    .should('be.visible').click({force:true})
    .wait(3000)

    //Faz a leitura dos perfis exibidos, entra em cada um e tenta realizar a assinatura do primeiro perfil ainda não assinado   
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

// Se o botão "mimo" NÃO existe, é um perfil ainda não assinado
if (!btn.length) {

  const startTime = Date.now();

  cy.get('#privacy-web-user-info')
    .shadow()
    .find('.el-button.btn-subscription.row.d-flex', { timeout: 10000 })
    .should('be.visible')
    .click({ multiple: true });

  cy.get('#privacy-web-payment', { timeout: 15000 })
    .shadow()
    .find('.el-dialog__body')
    .should('exist')
    .then(
      // SUCESSO — modal carregou
      () => {
        const endTime = Date.now();
        const loadTime = endTime - startTime;

        cy.log('Modal de completar os dados carregado com sucesso');
        cy.log(`Tempo de carregamento: ${loadTime} ms`);
      },

      // FALHA — modal não carregou
      (error) => {
        cy.log('Modal de completar dados não exibido, erro identificado');

        cy.screenshot('modal-complete-dados-nao-exibido');

    
        console.error('Erro ao carregar modal de completar dados:', error);

      }
    );

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