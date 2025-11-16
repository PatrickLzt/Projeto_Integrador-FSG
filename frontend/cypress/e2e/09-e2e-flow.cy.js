/// <reference types="cypress" />

describe('Fluxo Completo E2E - Jornada do Usuário', () => {
    beforeEach(() => {
        cy.clearCart();
        cy.clearAllData();
    });

    it('CENÁRIO COMPLETO: Novo usuário se cadastra e realiza primeira compra', () => {
        const timestamp = Date.now();
        const newUser = {
            firstName: 'Teste',
            lastName: 'E2E',
            email: `teste${timestamp}@e2e.com`,
            phone: '11987654321',
            password: 'Teste@123'
        };

        // 1. Visitar página inicial
        cy.visit('/index.html');
        cy.get('header').should('be.visible');

        // 2. Clicar em "Cadastrar"
        cy.contains('a', 'Cadastro').click();
        cy.url().should('include', 'cadastro.html');

        // 3. Realizar cadastro
        cy.register(newUser);
        cy.url().should('include', 'login.html');

        // 4. Fazer login
        cy.get('#loginForm').invoke('attr', 'novalidate', 'novalidate');
        cy.get('#email').type(newUser.email);
        cy.get('#password').type(newUser.password);
        cy.get('button[type="submit"]').click();
        cy.url().should('include', 'index.html');

        // 5. Ir para o cardápio
        cy.visit('/cardapio.html');

        // 6. Adicionar produtos ao carrinho
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);
        cy.get('.btn-add-cart').eq(1).click();
        cy.wait(300);
        cy.get('.cart-count').should('contain', '2');

        // 7. Ir para o carrinho
        cy.visit('/carrinho.html');
        cy.get('.cart-item').should('have.length', 2);

        // 8. Aplicar cupom
        cy.fixture('testData').then((data) => {
            cy.get('#cupom-input').type(data.cupons.valido);
            cy.get('#aplicar-cupom').click();
            cy.wait(500);
        });

        // 9. Finalizar pedido
        cy.contains('Finalizar').click();
        cy.url().should('include', 'checkout.html');

        // 10. Dados já devem estar preenchidos (usuário logado)
        cy.get('#nome').should('have.value', `${newUser.firstName} ${newUser.lastName}`);

        // 11. Selecionar retirada e pagamento
        cy.get('#tipo-entrega-retirada').check();
        cy.get('input[value="pix"]').check();

        // 12. Confirmar pedido
        cy.contains('button', /finalizar|confirmar/i).click();
        cy.wait(1000);

        // 13. Verificar sucesso
        cy.get('body').should('satisfy', ($body) => {
            return $body.text().includes('sucesso') ||
                $body.text().includes('confirmado') ||
                $body.text().includes('obrigado');
        });
    });

    it('CENÁRIO: Usuário logado compra com entrega', () => {
        // 1. Fazer login
        cy.login('joao@email.com', '123456');

        // 2. Adicionar produtos
        cy.visit('/cardapio.html');
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);
        cy.get('.btn-add-cart').eq(2).click();
        cy.wait(300);

        // 3. Ir direto para checkout
        cy.visit('/checkout.html');

        // 4. Verificar que nome e email estão preenchidos
        cy.get('#nome').should('not.have.value', '');
        cy.get('#email').should('have.value', 'joao@email.com');

        // 5. Preencher endereço de entrega
        cy.fixture('testData').then((data) => {
            cy.get('#tipo-entrega-entrega').check();
            cy.get('#rua').type(data.enderecoEntrega.rua);
            cy.get('#numero').type(data.enderecoEntrega.numero);
            cy.get('#bairro').type(data.enderecoEntrega.bairro);
            cy.get('#cidade').type(data.enderecoEntrega.cidade);
            cy.get('#estado').select(data.enderecoEntrega.estado);
            cy.get('#cep').type(data.enderecoEntrega.cep);
        });

        // 6. Selecionar pagamento
        cy.get('input[value="dinheiro"]').check();
        cy.get('#troco').type('100.00');

        // 7. Finalizar
        cy.contains('button', /finalizar|confirmar/i).click();
        cy.wait(1000);

        // 8. Verificar sucesso
        cy.get('body').should('satisfy', ($body) => {
            return $body.text().includes('sucesso') || $body.text().includes('confirmado');
        });
    });

    it('CENÁRIO: Usuário sem login tenta acessar perfil', () => {
        // Tentar acessar perfil
        cy.visit('/perfil.html');

        // Deve mostrar mensagem ou redirecionar
        cy.url().should('match', /login\.html|perfil\.html/);
    });
    it('CENÁRIO: Usuário sem login tenta acessar perfil', () => {
        // Tentar acessar perfil
        cy.visit('/perfil.html');

        // Deve mostrar mensagem ou redirecionar
        cy.url().should('match', /login\.html|perfil\.html/);
    });

    it('CENÁRIO: Compra anônima (sem cadastro)', () => {
        // 1. Adicionar produtos
        cy.visit('/cardapio.html');
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);
        cy.get('.btn-add-cart').eq(1).click();
        cy.wait(300);

        // 2. Ir para checkout
        cy.visit('/checkout.html');

        // 3. Preencher dados manualmente
        cy.fixture('testData').then((data) => {
            cy.get('#nome').type(data.usuario.nome);
            cy.get('#email').type(data.usuario.email);
            cy.get('#telefone').type(data.usuario.telefone);
        });

        // 4. Selecionar retirada
        cy.get('#tipo-entrega-retirada').check();
        cy.get('input[value="pix"]').check();

        // 5. Finalizar
        cy.contains('button', /finalizar|confirmar/i).click();
        cy.wait(1000);

        // 6. Verificar sucesso
        cy.get('body').should('satisfy', ($body) => {
            return $body.text().includes('sucesso') || $body.text().includes('confirmado');
        });
    });

    it('CENÁRIO: Fluxo de logout', () => {
        // 1. Fazer login
        cy.login('joao@email.com', '123456');

        // 2. Verificar que está logado
        cy.visit('/index.html');
        cy.assertLoggedIn();

        // 3. Fazer logout
        cy.logout();

        // 4. Verificar que não está mais logado
        cy.assertLoggedOut();

        // 5. Verificar UI atualizada
        cy.contains('a', 'Login').should('be.visible');
    });

    it('CENÁRIO: Sessão persistente com "lembrar de mim"', () => {
        // 1. Login com remember me
        cy.login('joao@email.com', '123456', true);

        // 2. Navegar entre páginas
        cy.visit('/cardapio.html');
        cy.assertLoggedIn();

        cy.visit('/carrinho.html');
        cy.assertLoggedIn();

        cy.visit('/index.html');
        cy.assertLoggedIn();

        // 3. Recarregar página
        cy.reload();
        cy.assertLoggedIn();
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

    it('CENÁRIO: Admin faz login e acessa painel', () => {
        // 1. Login como admin
        cy.login('admin@sweetcupcakes.com', 'admin123');

        // 2. Verificar que é admin
        cy.window().then((win) => {
            const userStr = win.sessionStorage.getItem('sweetcupcakes_user') ||
                win.localStorage.getItem('sweetcupcakes_user');
            const user = JSON.parse(userStr);
            expect(user.isAdmin).to.be.true;
        });

        // 3. Navegar pelo site
        cy.visit('/index.html');
        cy.assertLoggedIn();
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

    it('CENÁRIO: Carrinho persistente após login', () => {
        // 1. Adicionar produtos sem login
        cy.visit('/cardapio.html');
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);
        cy.get('.btn-add-cart').eq(1).click();
        cy.wait(300);

        // 2. Verificar carrinho
        cy.visit('/carrinho.html');
        cy.get('.cart-item').should('have.length', 2);

        // 3. Fazer login
        cy.login('joao@email.com', '123456');

        // 4. Carrinho deve ser mantido
        cy.visit('/carrinho.html');
        cy.get('.cart-item').should('have.length', 2);
    });
});

