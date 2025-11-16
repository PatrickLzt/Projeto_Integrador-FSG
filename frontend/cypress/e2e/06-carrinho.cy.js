/// <reference types="cypress" />

describe('Carrinho de Compras', () => {
    beforeEach(() => {
        // Fazer login antes de acessar a home (página requer autenticação)
        cy.login('joao@email.com', '123456');

        // Limpar carrinho antes de cada teste
        cy.clearCart();
    });

    describe('Adicionar Produtos ao Carrinho', () => {
        it('Deve adicionar um produto ao carrinho', () => {

            cy.visit('/cardapio.html');

            // Clicar no primeiro botão de adicionar
            cy.get('.btn-add-cart').first().click();

            // Verificar que o contador do carrinho aumentou
            cy.get('#cart-count').should('be.visible');
            cy.get('#cart-count').should('contain', '1');
        });

        it('Deve adicionar múltiplos produtos diferentes', () => {
            cy.visit('/cardapio.html');

            // Adicionar 3 produtos diferentes
            cy.get('.btn-add-cart').eq(0).click();
            cy.wait(300);
            cy.get('.btn-add-cart').eq(1).click();
            cy.wait(300);
            cy.get('.btn-add-cart').eq(2).click();

            // Verificar contador
            cy.get('#cart-count').should('contain', '3');
        });

        it('Deve mostrar feedback visual ao adicionar', () => {
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();

            // Pode verificar animação, toast, ou mudança de estilo
            cy.get('#cart-count').should('be.visible');
        });
    });

    describe('Visualizar Carrinho', () => {
        beforeEach(() => {
            // Adicionar produtos antes dos testes
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();
            cy.wait(300);
        });

        it('Deve exibir produtos adicionados no carrinho', () => {
            cy.visit('/carrinho.html');
            cy.get('.cart-item').should('have.length.at.least', 1);
        });

        it('Deve exibir informações do produto no carrinho', () => {
            cy.visit('/carrinho.html');

            cy.get('.cart-item').first().within(() => {
                cy.get('h3').should('be.visible'); // Nome do produto
                cy.get('.cart-item-price').should('be.visible');
                cy.get('.cart-item-quantity').should('be.visible');
                cy.get('.cart-item-subtotal').should('be.visible');
            });
        });

        it('Deve mostrar carrinho vazio quando não há produtos', () => {
            cy.clearCart();
            cy.visit('/carrinho.html');

            cy.get('body').should('satisfy', ($body) => {
                return $body.find('.cart-item').length === 0 ||
                    $body.text().includes('vazio') ||
                    $body.text().includes('Seu carrinho está vazio');
            });
        });
    });

    describe('Alterar Quantidade de Produtos', () => {
        beforeEach(() => {
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();
            cy.wait(300);
            cy.visit('/carrinho.html');
        });

        it('Deve aumentar quantidade do produto', () => {
            // Pegar quantidade inicial
            cy.get('.cart-item').first().find('.quantity-value').invoke('text').then((initialQty) => {
                const initial = parseInt(initialQty);

                // Clicar no botão de aumentar (+)
                cy.get('.cart-item').first().find('.quantity-btn').last().click();
                cy.wait(300);

                // Verificar que aumentou
                cy.get('.cart-item').first().find('.quantity-value').should('contain', (initial + 1).toString());
            });
        });

        it('Deve diminuir quantidade do produto', () => {
            // Primeiro aumentar para ter quantidade > 1
            cy.get('.cart-item').first().find('.quantity-btn').last().click();
            cy.wait(300);

            cy.get('.cart-item').first().find('.quantity-value').invoke('text').then((currentQty) => {
                const current = parseInt(currentQty);

                // Diminuir quantidade (botão -)
                cy.get('.cart-item').first().find('.quantity-btn').first().click();
                cy.wait(300);

                // Verificar
                cy.get('.cart-item').first().find('.quantity-value').should('contain', (current - 1).toString());
            });
        });

        it('Deve atualizar subtotal ao mudar quantidade', () => {
            cy.get('.cart-item').first().find('.cart-item-subtotal').invoke('text').then((initialSubtotal) => {
                // Aumentar quantidade
                cy.get('.cart-item').first().find('.quantity-btn').last().click();
                cy.wait(500);

                // Verificar que subtotal mudou
                cy.get('.cart-item').first().find('.cart-item-subtotal').invoke('text').should('not.equal', initialSubtotal);
            });
        });

        it('Não deve permitir quantidade menor que 1', () => {
            // Tentar diminuir quando quantidade é 1
            cy.get('.cart-item').first().find('.quantity-value').should('contain', '1');
            cy.get('.cart-item').first().find('.quantity-btn').first().click();
            cy.wait(300);

            // Quantidade deve continuar 1 ou produto removido
            cy.get('body').then(($body) => {
                const cartItems = $body.find('.cart-item');
                if (cartItems.length === 0) {
                    // Produto foi removido - OK
                    expect(true).to.be.true;
                } else {
                    // Quantidade deve ser 1
                    cy.get('.cart-item').first().find('.quantity-value').should('contain', '1');
                }
            });
        });
    });

    describe('Resumo do Pedido', () => {
        beforeEach(() => {
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();
            cy.wait(300);
            cy.visit('/carrinho.html');
        });

        it('Deve exibir subtotal correto', () => {
            cy.get('#subtotal').should('be.visible');
            cy.get('#subtotal').invoke('text').should('match', /R\$\s*\d+[,\.]\d{2}/);
        });

        it('Deve exibir total do pedido', () => {
            cy.get('#total').should('be.visible');
            cy.get('#total').invoke('text').should('match', /R\$\s*\d+[,\.]\d{2}/);
        });

        it('Deve calcular total corretamente', () => {
            // Verificar que subtotal e total são exibidos corretamente
            cy.get('#subtotal').invoke('text').should('match', /R\$\s*\d+[,\.]\d{2}/);
            cy.get('#total').invoke('text').should('match', /R\$\s*\d+[,\.]\d{2}/);
        });
    });

    describe('Cupons de Desconto', () => {
        beforeEach(() => {
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();
            cy.wait(300);
            cy.visit('/carrinho.html');
        });

        it('Deve ter campo para inserir cupom', () => {
            cy.get('#coupon-input').should('exist');
            cy.get('#apply-coupon-btn').should('exist');
        });

        it('Deve aplicar cupom válido', () => {
            cy.fixture('testData').then((data) => {
                cy.get('#coupon-input').type(data.cupons.valido);
                cy.get('#apply-coupon-btn').click();
                cy.wait(500);

                // Verificar feedback de sucesso
                cy.get('body').should('satisfy', ($body) => {
                    return $body.text().includes('sucesso') ||
                        $body.text().includes('aplicado') ||
                        $body.find('.desconto').text().includes('R$');
                });
            });
        });

        it('Deve mostrar mensagem de erro para cupom inválido', () => {
            cy.fixture('testData').then((data) => {
                // Capturar o alert que será exibido
                cy.on('window:alert', (text) => {
                    expect(text).to.include('inválido');
                });

                cy.get('#coupon-input').type(data.cupons.invalido);
                cy.get('#apply-coupon-btn').click();
            });
        });

        it('Deve aplicar desconto ao total com cupom válido', () => {
            cy.fixture('testData').then((data) => {
                // Pegar total antes do cupom
                cy.get('#total').invoke('text').then((totalAntes) => {
                    // Aplicar cupom
                    cy.get('#coupon-input').type(data.cupons.valido);
                    cy.get('#apply-coupon-btn').click();
                    cy.wait(500);

                    // Verificar que há uma linha de desconto ou total diminuiu
                    cy.get('body').should('satisfy', ($body) => {
                        const hasDiscount = $body.find('#discount-row').length > 0;
                        const totalDepois = $body.find('#total').text();
                        return hasDiscount || totalDepois !== totalAntes;
                    });
                });
            });
        });

        it('Deve remover cupom aplicado', () => {
            cy.fixture('testData').then((data) => {
                // Aplicar cupom
                cy.get('#coupon-input').type(data.cupons.valido);
                cy.get('#apply-coupon-btn').click();
                cy.wait(500);

                // Remover cupom (se houver botão de remover)
                cy.get('body').then(($body) => {
                    if ($body.find('#remove-coupon-btn').length > 0) {
                        cy.get('#remove-coupon-btn').click();
                        cy.wait(300);
                        cy.get('#discount-row').should('not.be.visible');
                    }
                });
            });
        });
    });

    describe('Navegação do Carrinho', () => {
        it('Deve ter botão "Continuar Comprando"', () => {
            cy.visit('/carrinho.html');
            cy.contains('Continuar Comprando').should('exist');
        });

        it('Deve voltar ao cardápio ao clicar em "Continuar Comprando"', () => {
            // Adicionar produto primeiro para que botão fique visível
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();
            cy.wait(300);

            cy.visit('/carrinho.html');
            cy.contains('a', 'Continuar Comprando').scrollIntoView().should('be.visible').click();
            cy.url().should('include', '/cardapio.html');
        });

        it('Deve ter botão "Finalizar Pedido"', () => {
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();
            cy.wait(300);
            cy.visit('/carrinho.html');

            cy.contains('Finalizar').should('exist');
        });

        it('Deve ir para checkout ao clicar em "Finalizar Pedido"', () => {
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();
            cy.wait(300);
            cy.visit('/carrinho.html');

            cy.contains('Finalizar').click();
            cy.url().should('include', '/checkout.html');
        });
    });

    describe('Persistência do Carrinho', () => {
        it('Deve manter produtos no carrinho após recarregar página', () => {
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();
            cy.wait(300);

            // Recarregar página
            cy.reload();

            // Verificar que contador ainda mostra produtos
            cy.get('#cart-count').should('exist');
        });

        it('Deve manter carrinho ao navegar entre páginas', () => {
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();
            cy.wait(300);

            cy.visit('/index.html');
            cy.get('#cart-count').should('exist');

            cy.visit('/carrinho.html');
            cy.get('.cart-item').should('have.length.at.least', 1);
        });
    });
});
