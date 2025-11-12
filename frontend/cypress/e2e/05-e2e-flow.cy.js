/// <reference types="cypress" />

describe('Fluxo Completo E2E - Jornada do Usuário', () => {
    beforeEach(() => {
        cy.clearCart();
    });

    it('CENÁRIO COMPLETO: Usuário compra cupcakes com sucesso', () => {
        // 1. Visitar página inicial
        cy.visit('/index.html');
        cy.get('header').should('be.visible');

        // 2. Navegar para o cardápio
        cy.contains('Ver Cardápio').click();
        cy.url().should('include', '/cardapio.html');

        // 3. Filtrar produtos por categoria
        cy.contains('.filter-btn', 'Chocolate').click();
        cy.wait(500);

        // 4. Adicionar primeiro produto ao carrinho
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);
        cy.get('.cart-count').should('contain', '1');

        // 5. Voltar para "Todos" e adicionar mais produtos
        cy.contains('.filter-btn', 'Todos').click();
        cy.wait(300);
        cy.get('.btn-add-cart').eq(1).click();
        cy.wait(300);
        cy.get('.cart-count').should('contain', '2');

        // 6. Ir para o carrinho
        cy.visit('/carrinho.html');
        cy.get('.cart-item').should('have.length', 2);

        // 7. Aumentar quantidade de um produto
        cy.get('.cart-item').first().find('.btn-increase').click();
        cy.wait(500);

        // 8. Aplicar cupom de desconto
        cy.fixture('testData').then((data) => {
            cy.get('#cupom-input').type(data.cupons.valido);
            cy.get('#aplicar-cupom').click();
            cy.wait(500);
        });

        // 9. Prosseguir para checkout
        cy.contains('Finalizar').click();
        cy.url().should('include', '/checkout.html');

        // 10. Preencher dados pessoais
        cy.fixture('testData').then((data) => {
            cy.get('#nome').type(data.usuario.nome);
            cy.get('#email').type(data.usuario.email);
            cy.get('#telefone').type(data.usuario.telefone);
        });

        // 11. Selecionar retirada
        cy.get('#tipo-entrega-retirada').check();
        cy.wait(300);

        // 12. Selecionar método de pagamento
        cy.get('input[value="pix"]').check();
        cy.wait(300);

        // 13. Finalizar pedido
        cy.contains('button', /finalizar|confirmar/i).click();
        cy.wait(1000);

        // 14. Verificar sucesso
        cy.get('body').should('satisfy', ($body) => {
            return $body.text().includes('sucesso') ||
                $body.text().includes('confirmado') ||
                $body.text().includes('obrigado');
        });
    });

    it('CENÁRIO: Compra com entrega e dinheiro', () => {
        // Adicionar produtos
        cy.visit('/cardapio.html');
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);
        cy.get('.btn-add-cart').eq(2).click();
        cy.wait(300);

        // Ir direto para checkout
        cy.visit('/checkout.html');

        // Preencher formulário completo com entrega
        cy.fixture('testData').then((data) => {
            cy.fillCheckoutForm({
                nome: data.usuario.nome,
                email: data.usuario.email,
                telefone: data.usuario.telefone,
                tipoEntrega: 'entrega',
                endereco: data.enderecoEntrega,
                metodoPagamento: 'dinheiro',
                troco: '100.00'
            });
        });

        // Finalizar
        cy.contains('button', /finalizar|confirmar/i).click();
        cy.wait(1000);

        // Verificar sucesso
        cy.get('body').should('satisfy', ($body) => {
            return $body.text().includes('sucesso') || $body.text().includes('confirmado');
        });
    });

    it('CENÁRIO: Navegação completa sem comprar', () => {
        // 1. Home
        cy.visit('/index.html');

        // 2. Cardápio
        cy.contains('Ver Cardápio').click();

        // 3. Testar filtros
        cy.contains('.filter-btn', 'Chocolate').click();
        cy.wait(300);
        cy.contains('.filter-btn', 'Frutas').click();
        cy.wait(300);
        cy.contains('.filter-btn', 'Especiais').click();
        cy.wait(300);

        // 4. Buscar produto
        cy.get('#search-input').type('red');
        cy.wait(500);
        cy.get('.product-card').should('be.visible');

        // 5. Limpar busca
        cy.get('#search-input').clear();
        cy.wait(300);

        // 6. Voltar para home
        cy.visit('/index.html');
        cy.get('.hero-section').should('be.visible');
    });

    it('CENÁRIO: Adicionar e remover produtos do carrinho', () => {
        cy.visit('/cardapio.html');

        // Adicionar 3 produtos
        for (let i = 0; i < 3; i++) {
            cy.get('.btn-add-cart').eq(i).click();
            cy.wait(300);
        }

        cy.get('.cart-count').should('contain', '3');

        // Ir para carrinho
        cy.visit('/carrinho.html');
        cy.get('.cart-item').should('have.length', 3);

        // Remover 1 produto
        cy.get('.btn-remove').first().click();
        cy.wait(500);
        cy.get('.cart-item').should('have.length', 2);

        // Alterar quantidade
        cy.get('.cart-item').first().find('.btn-increase').click();
        cy.wait(300);
        cy.get('.cart-item').first().find('.btn-increase').click();
        cy.wait(300);

        // Remover todos
        cy.get('.btn-remove').each(($btn) => {
            cy.wrap($btn).click();
            cy.wait(300);
        });

        // Verificar carrinho vazio
        cy.get('body').should('satisfy', ($body) => {
            return $body.find('.cart-item').length === 0 ||
                $body.text().includes('vazio');
        });
    });

    it('CENÁRIO: Testar múltiplos cupons', () => {
        // Adicionar produto
        cy.visit('/cardapio.html');
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);

        cy.visit('/carrinho.html');

        cy.fixture('testData').then((data) => {
            // Testar cupom inválido
            cy.get('#cupom-input').type(data.cupons.invalido);
            cy.get('#aplicar-cupom').click();
            cy.wait(500);
            cy.get('body').should('satisfy', ($body) => {
                return $body.text().includes('inválido') || $body.text().includes('erro');
            });

            // Limpar e aplicar cupom válido
            cy.get('#cupom-input').clear();
            cy.get('#cupom-input').type(data.cupons.valido);
            cy.get('#aplicar-cupom').click();
            cy.wait(500);
            cy.get('body').should('satisfy', ($body) => {
                return $body.text().includes('sucesso') || $body.text().includes('aplicado');
            });
        });
    });

    it('CENÁRIO: Responsividade - Mobile', () => {
        cy.viewport(375, 667);

        // Home
        cy.visit('/index.html');
        cy.get('header').should('be.visible');

        // Cardápio
        cy.contains('Ver Cardápio').click();
        cy.get('.product-card').should('be.visible');

        // Adicionar produto
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);

        // Carrinho
        cy.visit('/carrinho.html');
        cy.get('.cart-item').should('be.visible');

        // Checkout
        cy.visit('/checkout.html');
        cy.get('#nome').should('be.visible');
    });

    it('CENÁRIO: Responsividade - Tablet', () => {
        cy.viewport(768, 1024);

        cy.visit('/index.html');
        cy.get('.hero-section').should('be.visible');

        cy.visit('/cardapio.html');
        cy.get('.product-card').should('be.visible');

        cy.visit('/carrinho.html');
        cy.get('.order-summary').should('be.visible');
    });

    it('CENÁRIO: Persistência do carrinho entre sessões', () => {
        // Adicionar produtos
        cy.visit('/cardapio.html');
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);

        // Recarregar página
        cy.reload();
        cy.get('.cart-count').should('exist');

        // Navegar para outra página
        cy.visit('/index.html');
        cy.get('.cart-count').should('exist');

        // Verificar no carrinho
        cy.visit('/carrinho.html');
        cy.get('.cart-item').should('have.length.at.least', 1);
    });
});
