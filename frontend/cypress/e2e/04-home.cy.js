/// <reference types="cypress" />

describe('Página Inicial - Home', () => {
    beforeEach(() => {
        // Fazer login antes de acessar a home (página requer autenticação)
        cy.login('joao@email.com', '123456');
        // Visitar a página inicial antes de cada teste
        cy.visit('/index.html');
    });

    it('Deve carregar a página inicial corretamente', () => {
        // Verificar título
        cy.title().should('include', 'Sweet Cupcakes');

        // Verificar header
        cy.get('header').should('be.visible');
        cy.get('.logo').should('be.visible');

        // Verificar navegação
        cy.get('nav').should('be.visible');
        cy.get('nav a').should('have.length.at.least', 3);
    });

    it('Deve mostrar a seção hero', () => {
        cy.get('.hero').should('be.visible');
        cy.contains('Sweet Cupcakes').should('be.visible');
    });

    it('Deve navegar para o cardápio ao clicar no botão', () => {
        cy.contains('Ver Cardápio').click();
        cy.url().should('include', '/cardapio.html');
    });

    it('Deve mostrar produtos em destaque', () => {
        cy.get('.featured-section').should('be.visible');
        // Produtos são carregados dinamicamente, verificar container
        cy.get('#featured-products').should('exist');
    });

    it('Deve exibir informações "Sobre Nós"', () => {
        cy.get('.about-section').should('be.visible');
        cy.contains('Sobre Nós').should('be.visible');
    });

    it('Deve ter footer com informações de contato', () => {
        cy.get('footer').should('be.visible');
        cy.get('footer').should('contain', 'Sweet Cupcakes');
    });

    // Testes de responsividade
    describe('Responsividade', () => {
        it('Deve funcionar em mobile', () => {
            cy.viewport(375, 667); // iPhone SE
            cy.get('header').should('be.visible');
            cy.get('.hero').should('be.visible');
        });

        it('Deve funcionar em tablet', () => {
            cy.viewport(768, 1024); // iPad
            cy.get('header').should('be.visible');
            cy.get('.featured-section').should('be.visible');
        });

        it('Deve funcionar em desktop', () => {
            cy.viewport(1920, 1080); // Full HD
            cy.get('header').should('be.visible');
            cy.get('.featured-section').should('be.visible');
        });
    });
});
