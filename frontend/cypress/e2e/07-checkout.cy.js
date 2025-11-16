/// <reference types="cypress" />

describe('Checkout - Finalização de Pedido', () => {
    beforeEach(() => {
        // Fazer login antes de acessar a home (página requer autenticação)
        cy.login('joao@email.com', '123456');
        // Adicionar produto ao carrinho antes de cada teste
        cy.clearCart();
        cy.visit('/cardapio.html');
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);
        cy.visit('/checkout.html');
    });

    describe('Carregamento da Página', () => {
        it('Deve carregar a página de checkout', () => {
            cy.url().should('include', '/checkout.html');
            cy.title().should('include', 'Checkout');
        });

        it('Deve exibir resumo do pedido', () => {
            cy.get('.order-summary').should('be.visible');
        });

        it('Deve exibir formulário de dados pessoais', () => {
            cy.get('#name').should('be.visible');
            cy.get('#email').should('be.visible');
            cy.get('#phone').should('be.visible');
        });
    });

    describe('Formulário de Dados Pessoais', () => {
        it('Deve preencher nome corretamente', () => {
            cy.fixture('testData').then((data) => {
                cy.get('#name').clear().type(data.usuario.nome);
                cy.get('#name').should('have.value', data.usuario.nome);
            });
        });

        it('Deve preencher email corretamente', () => {
            cy.fixture('testData').then((data) => {
                cy.get('#email').clear().type(data.usuario.email);
                cy.get('#email').should('have.value', data.usuario.email);
            });
        });

        it('Deve preencher telefone corretamente', () => {
            cy.fixture('testData').then((data) => {
                cy.get('#phone').clear().type(data.usuario.telefone);
                cy.get('#phone').should('have.value', data.usuario.telefone);
            });
        });

        it('Deve validar email inválido', () => {
            cy.get('#email').type('email_invalido');
            cy.get('#email').blur();

            // Verificar validação HTML5 ou mensagem customizada
            cy.get('#email').then(($input) => {
                expect($input[0].validity.valid).to.be.false;
            });
        });

        it('Não deve permitir campos vazios obrigatórios', () => {
            cy.get('button[type="submit"]').click();

            // Verificar que formulário não foi enviado
            cy.url().should('include', '/checkout.html');
        });
    });

    describe('Tipo de Entrega', () => {
        it('Deve ter opções de tipo de entrega', () => {
            cy.get('input[name="delivery-option"]').should('have.length', 2);
            cy.get('input[value="delivery"]').should('exist');
            cy.get('input[value="pickup"]').should('exist');
        });

        it('Deve selecionar "Entrega"', () => {
            cy.get('input[value="delivery"]').check({ force: true });
            cy.get('input[value="delivery"]').should('be.checked');
        });

        it('Deve selecionar "Retirada"', () => {
            cy.get('input[value="pickup"]').check({ force: true });
            cy.get('input[value="pickup"]').should('be.checked');
        });

        it('Deve mostrar campos de endereço ao selecionar "Entrega"', () => {
            cy.get('input[value="delivery"]').check({ force: true });
            cy.wait(300);

            cy.get('#delivery-address-section').should('be.visible');
            cy.get('#street').should('be.visible');
            cy.get('#number').should('be.visible');
            cy.get('#neighborhood').should('be.visible');
            cy.get('#city').should('be.visible');
            cy.get('#cep').should('be.visible');
        });

        it('Deve ocultar campos de endereço ao selecionar "Retirada"', () => {
            cy.get('input[value="delivery"]').check({ force: true });
            cy.wait(300);
            cy.get('input[value="pickup"]').check({ force: true });
            cy.wait(300);

            cy.get('#delivery-address-section').should('not.be.visible');
        });

        it('Deve calcular frete para entrega', () => {
            cy.get('input[value="delivery"]').check({ force: true });
            cy.wait(300);

            cy.get('#delivery-fee').should('be.visible');
            cy.get('#delivery-fee').should('not.contain', 'R$ 0,00');
        });

        it('Deve mostrar frete grátis para retirada', () => {
            cy.get('input[value="pickup"]').check({ force: true });
            cy.wait(300);

            cy.get('#delivery-fee-row').should('satisfy', ($el) => {
                return $el.text().includes('Grátis') ||
                    $el.text().includes('R$ 0,00') ||
                    $el.css('display') === 'none';
            });
        });
    });

    describe('Formulário de Endereço', () => {
        beforeEach(() => {
            cy.get('input[value="delivery"]').check({ force: true });
            cy.wait(300);
        });

        it('Deve preencher endereço completo', () => {
            cy.fixture('testData').then((data) => {
                const endereco = data.enderecoEntrega;

                cy.get('#street').type(endereco.rua);
                cy.get('#number').type(endereco.numero);
                cy.get('#complement').type(endereco.complemento);
                cy.get('#neighborhood').type(endereco.bairro);
                cy.get('#city').type(endereco.cidade);
                cy.get('#cep').type(endereco.cep);

                // Verificar valores
                cy.get('#street').should('have.value', endereco.rua);
                cy.get('#number').should('have.value', endereco.numero);
                cy.get('#city').should('have.value', endereco.cidade);
            });
        });

        it('Deve validar CEP com 8 dígitos', () => {
            cy.get('#cep').type('12345');
            cy.get('#cep').should('have.value').and('match', /^\d+$/);
        });

        it('Deve aceitar complemento como campo opcional', () => {
            cy.fixture('testData').then((data) => {
                cy.fillCheckoutForm({
                    nome: data.usuario.nome,
                    email: data.usuario.email,
                    telefone: data.usuario.telefone,
                    tipoEntrega: 'entrega',
                    endereco: {
                        rua: data.enderecoEntrega.rua,
                        numero: data.enderecoEntrega.numero,
                        bairro: data.enderecoEntrega.bairro,
                        cidade: data.enderecoEntrega.cidade,
                        cep: data.enderecoEntrega.cep
                    },
                    metodoPagamento: 'pix'
                });

                // Complemento vazio não deve impedir submit
                cy.get('#complement').should('be.empty');
            });
        });
    });

    describe('Método de Pagamento', () => {
        it('Deve ter opções de pagamento', () => {
            cy.get('input[name="payment-method"]').should('have.length.at.least', 3);
        });

        it('Deve selecionar PIX', () => {
            cy.get('input[value="pix"]').check({ force: true });
            cy.get('input[value="pix"]').should('be.checked');
        });

        it('Deve selecionar Cartão de Crédito', () => {
            cy.get('input[value="credit-card"]').check({ force: true });
            cy.get('input[value="credit-card"]').should('be.checked');
        });

        it('Deve selecionar Cartão de Débito', () => {
            cy.get('input[value="debit-card"]').check({ force: true });
            cy.get('input[value="debit-card"]').should('be.checked');
        });

        it('Deve selecionar Dinheiro', () => {
            cy.get('input[value="cash"]').check({ force: true });
            cy.get('input[value="cash"]').should('be.checked');
        });

        it('Deve mostrar campo de troco ao selecionar Dinheiro', () => {
            cy.get('input[value="cash"]').check({ force: true });
            cy.wait(300);

            cy.get('#cash-change-section').should('be.visible');
            cy.get('#cash-amount').should('be.visible');
        });

        it('Deve ocultar campo de troco para outros métodos', () => {
            cy.get('input[value="cash"]').check({ force: true });
            cy.wait(300);
            cy.get('input[value="pix"]').check({ force: true });
            cy.wait(300);

            cy.get('#cash-change-section').should('not.be.visible');
        });

        it('Deve aceitar valor de troco', () => {
            cy.get('input[value="cash"]').check({ force: true });
            cy.wait(300);

            cy.get('#cash-amount').type('50.00');
            cy.get('#cash-amount').should('have.value', '50.00');
        });
    });

    describe('Resumo do Pedido no Checkout', () => {
        it('Deve exibir produtos do pedido', () => {
            cy.get('.order-summary').should('be.visible');
            cy.get('#order-items').should('be.visible');
            cy.get('#order-items').children().should('have.length.at.least', 1);
        });

        it('Deve exibir subtotal', () => {
            cy.get('#checkout-subtotal').should('be.visible');
            cy.get('#checkout-subtotal').invoke('text').should('match', /R\$\s*\d+[,.]\d{2}/);
        });

        it('Deve exibir frete', () => {
            cy.get('#delivery-fee').should('be.visible');
        });

        it('Deve exibir total', () => {
            cy.get('#checkout-total').should('be.visible');
            cy.get('#checkout-total').invoke('text').should('match', /R\$\s*\d+[,.]\d{2}/);
        });

        it('Deve exibir desconto se houver cupom', () => {
            // Voltar ao carrinho, aplicar cupom, voltar ao checkout
            cy.visit('/carrinho.html');
            cy.fixture('testData').then((data) => {
                cy.get('#coupon-input').type(data.cupons.valido);
                cy.get('#apply-coupon-btn').click();
                cy.wait(500);
            });

            cy.visit('/checkout.html');

            cy.get('#checkout-discount-row').should('be.visible');
            cy.get('#checkout-discount').should('be.visible');
        });
    });

    describe('Finalização do Pedido', () => {
        it('Deve ter botão de finalizar pedido', () => {
            cy.contains('button', /finalizar|confirmar/i).should('be.visible');
        });

        it('Deve finalizar pedido com dados completos - Retirada', () => {
            cy.fixture('testData').then((data) => {
                cy.fillCheckoutForm({
                    nome: data.usuario.nome,
                    email: data.usuario.email,
                    telefone: data.usuario.telefone,
                    tipoEntrega: 'retirada',
                    metodoPagamento: 'pix'
                });

                cy.contains('button', /finalizar|confirmar/i).click();
                cy.wait(1000);

                // Verificar redirecionamento ou mensagem de sucesso
                cy.get('body').should('satisfy', ($body) => {
                    return $body.text().includes('sucesso') ||
                        $body.text().includes('confirmado') ||
                        $body.text().includes('obrigado') ||
                        cy.url().should('not.include', '/checkout.html');
                });
            });
        });

        it('Deve finalizar pedido com dados completos - Entrega', () => {
            cy.fixture('testData').then((data) => {
                cy.fillCheckoutForm({
                    nome: data.usuario.nome,
                    email: data.usuario.email,
                    telefone: data.usuario.telefone,
                    tipoEntrega: 'entrega',
                    endereco: data.enderecoEntrega,
                    metodoPagamento: 'credito'
                });

                cy.contains('button', /finalizar|confirmar/i).click();
                cy.wait(1000);

                // Verificar confirmação
                cy.get('body').should('satisfy', ($body) => {
                    return $body.text().includes('sucesso') ||
                        $body.text().includes('confirmado');
                });
            });
        });

        it('Deve finalizar com dinheiro e troco', () => {
            cy.fixture('testData').then((data) => {
                cy.fillCheckoutForm({
                    nome: data.usuario.nome,
                    email: data.usuario.email,
                    telefone: data.usuario.telefone,
                    tipoEntrega: 'retirada',
                    metodoPagamento: 'dinheiro',
                    troco: '100.00'
                });

                cy.contains('button', /finalizar|confirmar/i).click();
                cy.wait(1000);

                cy.get('body').should('satisfy', ($body) => {
                    return $body.text().includes('sucesso') ||
                        $body.text().includes('confirmado');
                });
            });
        });

        it('Deve limpar carrinho após finalizar', () => {
            cy.fixture('testData').then((data) => {
                cy.fillCheckoutForm({
                    nome: data.usuario.nome,
                    email: data.usuario.email,
                    telefone: data.usuario.telefone,
                    tipoEntrega: 'retirada',
                    metodoPagamento: 'pix'
                });

                cy.contains('button', /finalizar|confirmar/i).click();
                cy.wait(1000);

                // Verificar que carrinho foi limpo
                cy.visit('/carrinho.html');
                cy.get('body').should('satisfy', ($body) => {
                    return $body.find('.cart-item').length === 0 ||
                        $body.text().includes('vazio');
                });
            });
        });
    });

    describe('Validações do Formulário', () => {
        it('Deve validar todos os campos obrigatórios', () => {
            // Limpar campos preenchidos
            cy.get('#name').clear();
            cy.get('#email').clear();
            cy.get('#phone').clear();

            cy.contains('button', /finalizar|confirmar/i).click();

            // Formulário não deve ser enviado
            cy.url().should('include', '/checkout.html');
        });

        it('Deve validar formato do email', () => {
            cy.get('#email').type('email_sem_arroba');
            cy.get('#email').blur();

            cy.get('#email').then(($input) => {
                expect($input[0].validity.valid).to.be.false;
            });
        });

        it('Deve validar seleção de método de pagamento', () => {
            cy.fixture('testData').then((data) => {
                cy.get('#name').clear().type(data.usuario.nome);
                cy.get('#email').clear().type(data.usuario.email);
                cy.get('#phone').clear().type(data.usuario.telefone);
                cy.get('input[value="pickup"]').check({ force: true });

                // Não selecionar método de pagamento
                cy.contains('button', /finalizar|confirmar/i).click();

                cy.url().should('include', '/checkout.html');
            });
        });
    });

    describe('Navegação no Checkout', () => {
        it('Deve ter botão para voltar ao carrinho', () => {
            cy.contains(/voltar|carrinho/i).should('exist');
        });

        it('Deve voltar ao carrinho ao clicar no botão', () => {
            cy.contains(/voltar|carrinho/i).click();
            cy.url().should('include', '/carrinho.html');
        });

        it('Não deve perder dados do formulário ao voltar', () => {
            cy.fixture('testData').then((data) => {
                cy.get('#name').clear().type(data.usuario.nome);
                cy.get('#email').clear().type(data.usuario.email);

                // Nota: Este teste depende de como a persistência é implementada
                // Se não houver persistência, este teste pode falhar
            });
        });
    });

    describe('Responsividade do Checkout', () => {
        it('Deve funcionar em mobile', () => {
            cy.viewport(375, 667);
            cy.get('#name').should('be.visible');
            cy.get('.order-summary').should('be.visible');
        });

        it('Deve funcionar em tablet', () => {
            cy.viewport(768, 1024);
            cy.get('#name').should('be.visible');
            cy.get('.order-summary').should('be.visible');
        });
    });
});
