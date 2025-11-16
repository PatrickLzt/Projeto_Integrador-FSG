/// <reference types="cypress" />

describe('Cardápio - Catálogo de Produtos', () => {
    beforeEach(() => {
        // Fazer login antes de acessar a home (página requer autenticação)
        cy.login('joao@email.com', '123456');

        cy.visit('/cardapio.html');
    });

    it('Deve carregar a página do cardápio', () => {
        cy.url().should('include', '/cardapio.html');
        cy.title().should('include', 'Cardápio');
    });

    it('Deve exibir lista de produtos', () => {
        cy.get('.product-card').should('have.length.at.least', 1);
    });

    it('Deve exibir informações dos produtos', () => {
        cy.get('.product-card').first().within(() => {
            cy.get('.product-name').should('be.visible');
            cy.get('.product-price').should('be.visible');
            cy.get('.btn-add-cart').should('be.visible');
        });
    });

    it('Deve ter filtros de categoria', () => {
        cy.get('.filter-container').should('be.visible');
        cy.get('.filter-btn').should('have.length.at.least', 2);
    });

    it('Deve filtrar produtos por categoria "Chocolate"', () => {
        cy.contains('.filter-btn', 'Chocolate').click();

        // Verificar se produtos são exibidos após filtro
        cy.get('.product-card').should('be.visible');
        // Verificar se a categoria chocolate aparece nos produtos
        cy.get('.product-category').first().should('contain', 'chocolate');
    });

    it('Deve filtrar produtos por categoria "Frutas"', () => {
        cy.contains('.filter-btn', 'Frutas').click();
        cy.get('.product-card').should('be.visible');
    });

    it('Deve filtrar produtos por categoria "Especiais"', () => {
        cy.contains('.filter-btn', 'Especiais').click();
        cy.get('.product-card').should('be.visible');
    });

    it('Deve mostrar todos os produtos ao clicar em "Todos"', () => {
        // Primeiro aplica um filtro
        cy.contains('.filter-btn', 'Chocolate').click();
        cy.wait(500);

        // Depois volta para todos
        cy.contains('.filter-btn', 'Todos').click();
        cy.get('.product-card').should('have.length.at.least', 5);
    });

    it('Deve adicionar produto ao carrinho a partir do cardápio', () => {
        // Verificar contador inicial
        cy.get('#cart-count').invoke('text').then(parseInt).as('initialCount');

        // Adicionar produto
        cy.get('.btn-add-cart').first().click();

        // Verificar que o contador aumentou
        cy.get('@initialCount').then(initialCount => {
            cy.get('#cart-count').should('not.have.text', initialCount.toString());
        });
    });

    it('Deve marcar filtro ativo visualmente', () => {
        // Filtro "Todos" deve estar ativo inicialmente
        cy.contains('.filter-btn', 'Todos').should('have.class', 'active');

        // Clicar em outro filtro
        cy.contains('.filter-btn', 'Chocolate').click();

        // Verificar que mudou o ativo
        cy.contains('.filter-btn', 'Chocolate').should('have.class', 'active');
        cy.contains('.filter-btn', 'Todos').should('not.have.class', 'active');
    });

    it('Deve exibir categoria do produto', () => {
        cy.get('.product-card').first().within(() => {
            cy.get('.product-category').should('be.visible');
            cy.get('.product-category').invoke('text').should('not.be.empty');
        });
    });

    // Testes de preços
    describe('Preços dos Produtos', () => {
        it('Deve exibir preços formatados corretamente', () => {
            cy.get('.product-price').first().invoke('text').should('match', /R\$\s*\d+[,\.]\d{2}/);
        });

        it('Todos os produtos devem ter preço visível', () => {
            cy.get('.product-card').each(($card) => {
                cy.wrap($card).find('.product-price').should('be.visible');
            });
        });
    });

    // Testes de imagens
    describe('Imagens dos Produtos', () => {
        it('Deve exibir imagem em cada produto', () => {
            cy.get('.product-card').first().within(() => {
                cy.get('img').should('be.visible');
            });
        });

        it('Imagens devem ter alt text', () => {
            cy.get('.product-card img').first().should('have.attr', 'alt');
        });
    });

    // Testes de navegação
    describe('Navegação', () => {
        it('Deve ter link para voltar à home', () => {
            cy.get('nav a[href*="index.html"]').should('exist');
        });

        it('Deve ter link para o carrinho', () => {
            cy.get('nav a[href*="carrinho.html"]').should('exist');
        });
    });
});
