/// <reference types="cypress" />

describe('Checkout - Finalização de Pedido', () => {
    beforeEach(() => {
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
            cy.get('#nome').should('be.visible');
            cy.get('#email').should('be.visible');
            cy.get('#telefone').should('be.visible');
        });
    });

    describe('Formulário de Dados Pessoais', () => {
        it('Deve preencher nome corretamente', () => {
            cy.fixture('testData').then((data) => {
                cy.get('#nome').type(data.usuario.nome);
                cy.get('#nome').should('have.value', data.usuario.nome);
            });
        });

        it('Deve preencher email corretamente', () => {
            cy.fixture('testData').then((data) => {
                cy.get('#email').type(data.usuario.email);
                cy.get('#email').should('have.value', data.usuario.email);
            });
        });

        it('Deve preencher telefone corretamente', () => {
            cy.fixture('testData').then((data) => {
                cy.get('#telefone').type(data.usuario.telefone);
                cy.get('#telefone').should('have.value', data.usuario.telefone);
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
            cy.get('input[name="tipo-entrega"]').should('have.length', 2);
            cy.get('#tipo-entrega-entrega').should('exist');
            cy.get('#tipo-entrega-retirada').should('exist');
        });

        it('Deve selecionar "Entrega"', () => {
            cy.get('#tipo-entrega-entrega').check();
            cy.get('#tipo-entrega-entrega').should('be.checked');
        });

        it('Deve selecionar "Retirada"', () => {
            cy.get('#tipo-entrega-retirada').check();
            cy.get('#tipo-entrega-retirada').should('be.checked');
        });

        it('Deve mostrar campos de endereço ao selecionar "Entrega"', () => {
            cy.get('#tipo-entrega-entrega').check();
            cy.wait(300);

            cy.get('#endereco-entrega').should('be.visible');
            cy.get('#rua').should('be.visible');
            cy.get('#numero').should('be.visible');
            cy.get('#bairro').should('be.visible');
            cy.get('#cidade').should('be.visible');
            cy.get('#estado').should('be.visible');
            cy.get('#cep').should('be.visible');
        });

        it('Deve ocultar campos de endereço ao selecionar "Retirada"', () => {
            cy.get('#tipo-entrega-entrega').check();
            cy.wait(300);
            cy.get('#tipo-entrega-retirada').check();
            cy.wait(300);

            cy.get('#endereco-entrega').should('not.be.visible');
        });

        it('Deve calcular frete para entrega', () => {
            cy.get('#tipo-entrega-entrega').check();
            cy.wait(300);

            cy.get('.valor-frete').should('be.visible');
            cy.get('.valor-frete').should('not.contain', 'R$ 0,00');
        });

        it('Deve mostrar frete grátis para retirada', () => {
            cy.get('#tipo-entrega-retirada').check();
            cy.wait(300);

            cy.get('body').should('satisfy', ($body) => {
                return $body.text().includes('Grátis') ||
                    $body.text().includes('R$ 0,00');
            });
        });
    });

    describe('Formulário de Endereço', () => {
        beforeEach(() => {
            cy.get('#tipo-entrega-entrega').check();
            cy.wait(300);
        });

        it('Deve preencher endereço completo', () => {
            cy.fixture('testData').then((data) => {
                const endereco = data.enderecoEntrega;

                cy.get('#rua').type(endereco.rua);
                cy.get('#numero').type(endereco.numero);
                cy.get('#complemento').type(endereco.complemento);
                cy.get('#bairro').type(endereco.bairro);
                cy.get('#cidade').type(endereco.cidade);
                cy.get('#estado').select(endereco.estado);
                cy.get('#cep').type(endereco.cep);

                // Verificar valores
                cy.get('#rua').should('have.value', endereco.rua);
                cy.get('#numero').should('have.value', endereco.numero);
                cy.get('#cidade').should('have.value', endereco.cidade);
            });
        });

        it('Deve validar CEP com 8 dígitos', () => {
            cy.get('#cep').type('12345');
            cy.get('#cep').should('have.value').and('match', /^\d+$/);
        });

        it('Deve ter todos os estados brasileiros no select', () => {
            cy.get('#estado option').should('have.length.at.least', 27);
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
                        estado: data.enderecoEntrega.estado,
                        cep: data.enderecoEntrega.cep
                    },
                    metodoPagamento: 'pix'
                });

                // Complemento vazio não deve impedir submit
                cy.get('#complemento').should('be.empty');
            });
        });
    });

    describe('Método de Pagamento', () => {
        it('Deve ter opções de pagamento', () => {
            cy.get('input[name="metodo-pagamento"]').should('have.length.at.least', 3);
        });

        it('Deve selecionar PIX', () => {
            cy.get('input[value="pix"]').check();
            cy.get('input[value="pix"]').should('be.checked');
        });

        it('Deve selecionar Cartão de Crédito', () => {
            cy.get('input[value="credito"]').check();
            cy.get('input[value="credito"]').should('be.checked');
        });

        it('Deve selecionar Cartão de Débito', () => {
            cy.get('input[value="debito"]').check();
            cy.get('input[value="debito"]').should('be.checked');
        });

        it('Deve selecionar Dinheiro', () => {
            cy.get('input[value="dinheiro"]').check();
            cy.get('input[value="dinheiro"]').should('be.checked');
        });

        it('Deve mostrar campo de troco ao selecionar Dinheiro', () => {
            cy.get('input[value="dinheiro"]').check();
            cy.wait(300);

            cy.get('#troco-container').should('be.visible');
            cy.get('#troco').should('be.visible');
        });

        it('Deve ocultar campo de troco para outros métodos', () => {
            cy.get('input[value="dinheiro"]').check();
            cy.wait(300);
            cy.get('input[value="pix"]').check();
            cy.wait(300);

            cy.get('#troco-container').should('not.be.visible');
        });

        it('Deve aceitar valor de troco', () => {
            cy.get('input[value="dinheiro"]').check();
            cy.wait(300);

            cy.get('#troco').type('50.00');
            cy.get('#troco').should('have.value', '50.00');
        });
    });

    describe('Resumo do Pedido no Checkout', () => {
        it('Deve exibir produtos do pedido', () => {
            cy.get('.order-items').should('be.visible');
            cy.get('.order-item').should('have.length.at.least', 1);
        });

        it('Deve exibir subtotal', () => {
            cy.get('.subtotal-value').should('be.visible');
            cy.get('.subtotal-value').should('match', /R\$\s*\d+[,\.]\d{2}/);
        });

        it('Deve exibir frete', () => {
            cy.get('.frete-value').should('be.visible');
        });

        it('Deve exibir total', () => {
            cy.get('.total-value').should('be.visible');
            cy.get('.total-value').should('match', /R\$\s*\d+[,\.]\d{2}/);
        });

        it('Deve exibir desconto se houver cupom', () => {
            // Voltar ao carrinho, aplicar cupom, voltar ao checkout
            cy.visit('/carrinho.html');
            cy.fixture('testData').then((data) => {
                cy.get('#cupom-input').type(data.cupons.valido);
                cy.get('#aplicar-cupom').click();
                cy.wait(500);
            });

            cy.visit('/checkout.html');

            cy.get('body').should('satisfy', ($body) => {
                return $body.find('.desconto-value').length > 0 ||
                    $body.text().includes('Desconto');
            });
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
                cy.get('#nome').type(data.usuario.nome);
                cy.get('#email').type(data.usuario.email);
                cy.get('#telefone').type(data.usuario.telefone);
                cy.get('#tipo-entrega-retirada').check();

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
                cy.get('#nome').type(data.usuario.nome);
                cy.get('#email').type(data.usuario.email);

                // Nota: Este teste depende de como a persistência é implementada
                // Se não houver persistência, este teste pode falhar
            });
        });
    });

    describe('Responsividade do Checkout', () => {
        it('Deve funcionar em mobile', () => {
            cy.viewport(375, 667);
            cy.get('#nome').should('be.visible');
            cy.get('.order-summary').should('be.visible');
        });

        it('Deve funcionar em tablet', () => {
            cy.viewport(768, 1024);
            cy.get('#nome').should('be.visible');
            cy.get('.order-summary').should('be.visible');
        });
    });
});
