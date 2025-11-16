/// <reference types="cypress" />

describe('Fluxo Completo Autenticado - Compra do Início ao Fim', () => {
    beforeEach(() => {
        cy.clearAllData();
    });

    it('CENÁRIO: Usuário completa jornada completa - cadastro até recebimento do pedido', () => {
        const timestamp = Date.now();
        const newUser = {
            firstName: 'Cliente',
            lastName: 'Teste',
            email: `cliente${timestamp}@test.com`,
            phone: '11987654321',
            password: 'Teste@123'
        };

        // === FASE 1: DESCOBERTA ===
        // 1. Visitar página inicial (sem login)
        cy.visit('/index.html');
        cy.get('.hero-section').should('be.visible');

        // 2. Explorar produtos em destaque
        cy.get('.featured-products').should('be.visible');

        // === FASE 2: CADASTRO ===
        // 3. Decidir criar conta
        cy.contains('a', 'Cadastro').click();
        cy.url().should('include', 'cadastro.html');

        // 4. Preencher cadastro
        cy.register(newUser);
        cy.url().should('include', 'login.html');

        // === FASE 3: AUTENTICAÇÃO ===
        // 5. Fazer login com a conta criada
        cy.get('#loginForm').invoke('attr', 'novalidate', 'novalidate');
        cy.get('#email').type(newUser.email);
        cy.get('#password').type(newUser.password);
        cy.get('#rememberMe').check(); // Manter conectado
        cy.get('button[type="submit"]').click();
        cy.url().should('include', 'index.html');

        // 6. Verificar que está logado
        cy.assertLoggedIn();

        // === FASE 4: EXPLORAÇÃO DO CARDÁPIO ===
        // 7. Ir para o cardápio
        cy.visit('/cardapio.html');

        // 8. Explorar categorias
        cy.contains('.filter-btn', 'Chocolate').click();
        cy.wait(500);
        cy.get('.product-card').should('be.visible');

        // 9. Buscar produto específico
        cy.get('#search-input').type('red');
        cy.wait(500);

        // 10. Limpar busca e ver todos
        cy.get('#search-input').clear();
        cy.contains('.filter-btn', 'Todos').click();
        cy.wait(300);

        // === FASE 5: MONTAR PEDIDO ===
        // 11. Adicionar primeiro produto
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);
        cy.get('.cart-count').should('contain', '1');

        // 12. Adicionar mais produtos
        cy.get('.btn-add-cart').eq(1).click();
        cy.wait(300);
        cy.get('.btn-add-cart').eq(3).click();
        cy.wait(300);
        cy.get('.cart-count').should('contain', '3');

        // === FASE 6: REVISAR CARRINHO ===
        // 13. Ir para o carrinho
        cy.visit('/carrinho.html');
        cy.get('.cart-item').should('have.length', 3);

        // 14. Ajustar quantidades
        cy.get('.cart-item').first().find('.btn-increase').click();
        cy.wait(300);

        // 15. Remover um item que mudou de ideia
        cy.get('.cart-item').last().find('.btn-remove').click();
        cy.wait(500);
        cy.get('.cart-item').should('have.length', 2);

        // 16. Tentar aplicar cupom inválido
        cy.fixture('testData').then((data) => {
            cy.get('#cupom-input').type(data.cupons.invalido);
            cy.get('#aplicar-cupom').click();
            cy.wait(500);

            // 17. Aplicar cupom válido
            cy.get('#cupom-input').clear();
            cy.get('#cupom-input').type(data.cupons.valido);
            cy.get('#aplicar-cupom').click();
            cy.wait(500);
        });

        // === FASE 7: FINALIZAÇÃO ===
        // 18. Prosseguir para checkout
        cy.contains('Finalizar').click();
        cy.url().should('include', 'checkout.html');

        // 19. Verificar dados preenchidos automaticamente (usuário logado)
        cy.get('#nome').should('have.value', `${newUser.firstName} ${newUser.lastName}`);
        cy.get('#email').should('have.value', newUser.email);
        cy.get('#telefone').should('have.value', newUser.phone);

        // 20. Escolher entrega
        cy.fixture('testData').then((data) => {
            cy.get('#tipo-entrega-entrega').check();
            cy.wait(300);

            // 21. Preencher endereço
            cy.get('#rua').type(data.enderecoEntrega.rua);
            cy.get('#numero').type(data.enderecoEntrega.numero);
            cy.get('#bairro').type(data.enderecoEntrega.bairro);
            cy.get('#cidade').type(data.enderecoEntrega.cidade);
            cy.get('#estado').select(data.enderecoEntrega.estado);
            cy.get('#cep').type(data.enderecoEntrega.cep);
        });

        // 22. Escolher método de pagamento
        cy.get('input[value="cartao"]').check();
        cy.wait(300);

        // 23. Revisar resumo do pedido
        cy.get('.order-summary').should('be.visible');

        // 24. Confirmar pedido
        cy.contains('button', /finalizar|confirmar/i).click();
        cy.wait(1000);

        // === FASE 8: CONFIRMAÇÃO ===
        // 25. Verificar sucesso
        cy.get('body').should('satisfy', ($body) => {
            return $body.text().includes('sucesso') ||
                $body.text().includes('confirmado') ||
                $body.text().includes('obrigado');
        });

        // 26. Verificar que ainda está logado
        cy.assertLoggedIn();

        // === FASE 9: VERIFICAÇÃO PÓS-COMPRA ===
        // 27. Navegar para ver pedidos (se existir a página)
        cy.visit('/pedidos.html', { failOnStatusCode: false });

        // 28. Voltar para home
        cy.visit('/index.html');
        cy.assertLoggedIn();

        // 29. Verificar que pode fazer novo pedido
        cy.get('header').should('contain', newUser.firstName);
    });

    it('CENÁRIO: Usuário existente faz nova compra rápida', () => {
        // === LOGIN DIRETO ===
        cy.login('joao@email.com', '123456', true);

        // === COMPRA RÁPIDA ===
        cy.visit('/cardapio.html');

        // Adicionar produtos rapidamente
        for (let i = 0; i < 2; i++) {
            cy.get('.btn-add-cart').eq(i).click();
            cy.wait(200);
        }

        // Checkout direto (pular revisão do carrinho)
        cy.visit('/checkout.html');

        // Dados já preenchidos
        cy.get('#nome').should('not.have.value', '');

        // Retirada (mais rápido)
        cy.get('#tipo-entrega-retirada').check();
        cy.get('input[value="pix"]').check();

        // Finalizar
        cy.contains('button', /finalizar|confirmar/i).click();
        cy.wait(1000);

        cy.get('body').should('satisfy', ($body) => {
            return $body.text().includes('sucesso') || $body.text().includes('confirmado');
        });
    });

    it('CENÁRIO: Admin acessa e gerencia sistema', () => {
        // Login como admin
        cy.login('admin@sweetcupcakes.com', 'admin123');

        // Verificar privilégios de admin
        cy.window().then((win) => {
            const userStr = win.sessionStorage.getItem('sweetcupcakes_user') ||
                win.localStorage.getItem('sweetcupcakes_user');
            const user = JSON.parse(userStr);
            expect(user.isAdmin).to.be.true;
            expect(user.firstName).to.equal('Admin');
        });

        // Navegar pela aplicação
        cy.visit('/index.html');
        cy.get('header').should('contain', 'Admin');

        cy.visit('/cardapio.html');
        cy.assertLoggedIn();

        // Admin pode fazer logout
        cy.logout();
        cy.assertLoggedOut();
    });

    it('CENÁRIO: Persistência de sessão entre visitas', () => {
        // Primeira visita - fazer login
        cy.login('joao@email.com', '123456', true);

        // Adicionar produtos ao carrinho
        cy.visit('/cardapio.html');
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);

        // Simular fechamento do navegador (limpar cookies mas manter localStorage)
        cy.clearCookies();

        // Nova visita - simular reabertura
        cy.visit('/index.html');

        // Deve continuar logado
        cy.assertLoggedIn();

        // Carrinho deve ser mantido
        cy.get('.cart-count').should('exist');

        // Verificar carrinho
        cy.visit('/carrinho.html');
        cy.get('.cart-item').should('have.length.at.least', 1);
    });

    it('CENÁRIO: Logout limpa dados corretamente', () => {
        // Login
        cy.login('joao@email.com', '123456');

        // Adicionar produtos
        cy.visit('/cardapio.html');
        cy.get('.btn-add-cart').first().click();
        cy.wait(300);

        // Verificar carrinho
        cy.visit('/carrinho.html');
        cy.get('.cart-item').should('exist');

        // Logout
        cy.logout();

        // Verificar que está deslogado
        cy.assertLoggedOut();

        // Verificar que UI foi atualizada
        cy.visit('/index.html');
        cy.contains('a', 'Login').should('be.visible');

        // Carrinho deve ser mantido (compra anônima continua)
        cy.visit('/carrinho.html');
        cy.get('.cart-item').should('exist');
    });
});
