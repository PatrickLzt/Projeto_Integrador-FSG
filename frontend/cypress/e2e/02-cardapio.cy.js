/// <reference types="cypress" />

describe('Cardápio - Catálogo de Produtos', () => {
    beforeEach(() => {
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
        cy.get('.filter-buttons').should('be.visible');
        cy.get('.filter-btn').should('have.length.at.least', 2);
    });

    it('Deve filtrar produtos por categoria "Chocolate"', () => {
        cy.contains('.filter-btn', 'Chocolate').click();

        // Verificar se apenas produtos de chocolate são exibidos
        cy.get('.product-card').should('be.visible');
        cy.get('.product-card').each(($el) => {
            cy.wrap($el).should('have.attr', 'data-category').and('match', /chocolate|todos/i);
        });
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

    it('Deve buscar produtos por nome', () => {
        const searchTerm = 'chocolate';

        cy.get('#search-input').type(searchTerm);
        cy.get('.product-card').each(($el) => {
            cy.wrap($el).find('.product-name').invoke('text').should('match', new RegExp(searchTerm, 'i'));
        });
    });

    it('Deve limpar busca quando campo estiver vazio', () => {
        cy.get('#search-input').type('chocolate');
        cy.wait(300);
        cy.get('#search-input').clear();
        cy.wait(300);
        cy.get('.product-card').should('have.length.at.least', 5);
    });

    it('Deve exibir mensagem quando nenhum produto for encontrado', () => {
        cy.get('#search-input').type('produto_inexistente_xyz');
        cy.wait(500);

        // Verifica se não há produtos ou se há mensagem de "não encontrado"
        cy.get('body').should('satisfy', ($body) => {
            const hasNoProducts = $body.find('.product-card:visible').length === 0;
            const hasNoResultsMsg = $body.text().includes('Nenhum produto encontrado') ||
                $body.text().includes('não encontrado');
            return hasNoProducts || hasNoResultsMsg;
        });
    });

    // Testes de preços
    describe('Preços dos Produtos', () => {
        it('Deve exibir preços formatados corretamente', () => {
            cy.get('.product-price').first().should('match', /R\$\s*\d+[,\.]\d{2}/);
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
