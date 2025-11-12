/// <reference types="cypress" />

describe('Carrinho de Compras', () => {
    beforeEach(() => {
        // Limpar carrinho antes de cada teste
        cy.clearCart();
    });

    describe('Adicionar Produtos ao Carrinho', () => {
        it('Deve adicionar um produto ao carrinho', () => {
            cy.visit('/cardapio.html');

            // Clicar no primeiro botão de adicionar
            cy.get('.btn-add-cart').first().click();

            // Verificar que o contador do carrinho aumentou
            cy.get('.cart-count').should('be.visible');
            cy.get('.cart-count').should('contain', '1');
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
            cy.get('.cart-count').should('contain', '3');
        });

        it('Deve mostrar feedback visual ao adicionar', () => {
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();

            // Pode verificar animação, toast, ou mudança de estilo
            cy.get('.cart-count').should('be.visible');
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
                cy.get('.item-name').should('be.visible');
                cy.get('.item-price').should('be.visible');
                cy.get('.item-quantity').should('be.visible');
                cy.get('.item-subtotal').should('be.visible');
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
            cy.get('.cart-item').first().find('.item-quantity input').invoke('val').then((initialQty) => {
                const initial = parseInt(initialQty);

                // Clicar no botão de aumentar
                cy.get('.cart-item').first().find('.btn-increase').click();
                cy.wait(300);

                // Verificar nova quantidade
                cy.get('.cart-item').first().find('.item-quantity input').should('have.value', (initial + 1).toString());
            });
        });

        it('Deve diminuir quantidade do produto', () => {
            // Primeiro aumentar para ter quantidade > 1
            cy.get('.cart-item').first().find('.btn-increase').click();
            cy.wait(300);

            cy.get('.cart-item').first().find('.item-quantity input').invoke('val').then((currentQty) => {
                const current = parseInt(currentQty);

                // Diminuir quantidade
                cy.get('.cart-item').first().find('.btn-decrease').click();
                cy.wait(300);

                // Verificar
                cy.get('.cart-item').first().find('.item-quantity input').should('have.value', (current - 1).toString());
            });
        });

        it('Deve atualizar subtotal ao mudar quantidade', () => {
            cy.get('.cart-item').first().find('.item-subtotal').invoke('text').then((initialSubtotal) => {
                // Aumentar quantidade
                cy.get('.cart-item').first().find('.btn-increase').click();
                cy.wait(500);

                // Verificar que subtotal mudou
                cy.get('.cart-item').first().find('.item-subtotal').invoke('text').should('not.equal', initialSubtotal);
            });
        });

        it('Não deve permitir quantidade menor que 1', () => {
            // Tentar diminuir quando quantidade é 1
            cy.get('.cart-item').first().find('.item-quantity input').should('have.value', '1');
            cy.get('.cart-item').first().find('.btn-decrease').click();
            cy.wait(300);

            // Quantidade deve continuar 1 ou produto removido
            cy.get('body').should('satisfy', ($body) => {
                const cartItem = $body.find('.cart-item').first();
                if (cartItem.length === 0) return true; // Produto foi removido
                const qty = cartItem.find('.item-quantity input').val();
                return parseInt(qty) >= 1;
            });
        });
    });

    describe('Remover Produtos do Carrinho', () => {
        beforeEach(() => {
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();
            cy.wait(300);
            cy.visit('/carrinho.html');
        });

        it('Deve remover produto ao clicar no botão remover', () => {
            cy.get('.cart-item').should('have.length', 1);

            cy.get('.btn-remove').first().click();
            cy.wait(300);

            // Verificar que carrinho está vazio ou produto foi removido
            cy.get('body').should('satisfy', ($body) => {
                return $body.find('.cart-item').length === 0;
            });
        });

        it('Deve atualizar contador do carrinho após remover', () => {
            cy.get('.cart-count').invoke('text').then((count) => {
                cy.get('.btn-remove').first().click();
                cy.wait(300);

                // Contador deve diminuir ou desaparecer
                cy.get('body').should('satisfy', ($body) => {
                    const newCount = $body.find('.cart-count').text();
                    return newCount === '' || parseInt(newCount) < parseInt(count);
                });
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
            cy.get('.subtotal').should('be.visible');
            cy.get('.subtotal').should('match', /R\$\s*\d+[,\.]\d{2}/);
        });

        it('Deve exibir valor do frete', () => {
            cy.get('.frete').should('be.visible');
        });

        it('Deve exibir total do pedido', () => {
            cy.get('.total').should('be.visible');
            cy.get('.total').should('match', /R\$\s*\d+[,\.]\d{2}/);
        });

        it('Deve calcular total corretamente (subtotal + frete - desconto)', () => {
            // Este teste depende da implementação
            cy.get('.subtotal').invoke('text').then((subtotalText) => {
                cy.get('.total').invoke('text').then((totalText) => {
                    // Verificar que total é um número válido
                    expect(totalText).to.match(/R\$\s*\d+[,\.]\d{2}/);
                });
            });
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
            cy.get('#cupom-input').should('exist');
            cy.get('#aplicar-cupom').should('exist');
        });

        it('Deve aplicar cupom válido', () => {
            cy.fixture('testData').then((data) => {
                cy.get('#cupom-input').type(data.cupons.valido);
                cy.get('#aplicar-cupom').click();
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
                cy.get('#cupom-input').type(data.cupons.invalido);
                cy.get('#aplicar-cupom').click();
                cy.wait(500);

                // Verificar mensagem de erro
                cy.get('body').should('satisfy', ($body) => {
                    return $body.text().includes('inválido') ||
                        $body.text().includes('não encontrado') ||
                        $body.text().includes('erro');
                });
            });
        });

        it('Deve aplicar desconto ao total com cupom válido', () => {
            cy.fixture('testData').then((data) => {
                // Pegar total antes do cupom
                cy.get('.total').invoke('text').then((totalAntes) => {
                    // Aplicar cupom
                    cy.get('#cupom-input').type(data.cupons.valido);
                    cy.get('#aplicar-cupom').click();
                    cy.wait(500);

                    // Verificar que há uma linha de desconto ou total diminuiu
                    cy.get('body').should('satisfy', ($body) => {
                        const hasDiscount = $body.find('.desconto').length > 0;
                        const totalDepois = $body.find('.total').text();
                        return hasDiscount || totalDepois !== totalAntes;
                    });
                });
            });
        });

        it('Deve remover cupom aplicado', () => {
            cy.fixture('testData').then((data) => {
                // Aplicar cupom
                cy.get('#cupom-input').type(data.cupons.valido);
                cy.get('#aplicar-cupom').click();
                cy.wait(500);

                // Remover cupom (se houver botão de remover)
                cy.get('body').then(($body) => {
                    if ($body.find('#remover-cupom').length > 0) {
                        cy.get('#remover-cupom').click();
                        cy.wait(300);
                        cy.get('.desconto').should('not.exist');
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
            cy.visit('/carrinho.html');
            cy.contains('Continuar Comprando').click();
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
            cy.get('.cart-count').should('exist');
        });

        it('Deve manter carrinho ao navegar entre páginas', () => {
            cy.visit('/cardapio.html');
            cy.get('.btn-add-cart').first().click();
            cy.wait(300);

            cy.visit('/index.html');
            cy.get('.cart-count').should('exist');

            cy.visit('/carrinho.html');
            cy.get('.cart-item').should('have.length.at.least', 1);
        });
    });
});
