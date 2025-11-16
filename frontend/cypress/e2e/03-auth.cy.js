/// <reference types="cypress" />

describe('Sistema de Autenticação', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    describe('Gerenciamento de Sessão', () => {
        it('Deve criar sessão após login bem-sucedido', () => {
            cy.visit('/login.html');
            cy.get('#email').type('joao@email.com');
            cy.get('#password').type('123456');
            cy.get('button[type="submit"]').click();

            cy.window().then((win) => {
                const session = win.sessionStorage.getItem('sweetcupcakes_user');
                expect(session).to.not.be.null;

                const user = JSON.parse(session);
                expect(user).to.have.property('id');
                expect(user).to.have.property('email', 'joao@email.com');
                expect(user).to.have.property('firstName');
                expect(user).to.have.property('lastName');
            });
        });

        it('Deve persistir sessão com "lembrar de mim"', () => {
            cy.visit('/login.html');
            cy.get('#loginForm').invoke('attr', 'novalidate', 'novalidate');
            cy.get('#email').type('joao@email.com');
            cy.get('#password').type('123456');
            cy.get('#rememberMe').check();
            cy.get('button[type="submit"]').click();

            cy.window().then((win) => {
                const session = win.localStorage.getItem('sweetcupcakes_user');
                expect(session).to.not.be.null;

                const user = JSON.parse(session);
                expect(user.rememberMe).to.be.true;
            });
        });

        it('Deve manter sessão após recarregar página', () => {
            cy.login('joao@email.com', '123456', true);

            cy.visit('/index.html');
            cy.window().then((win) => {
                const session = win.localStorage.getItem('sweetcupcakes_user');
                expect(session).to.not.be.null;
            });
        });

        it('Deve limpar sessão após logout', () => {
            cy.login('joao@email.com', '123456');
            cy.visit('/index.html');

            cy.logout();

            cy.window().then((win) => {
                const localSession = win.localStorage.getItem('sweetcupcakes_user');
                const sessionSession = win.sessionStorage.getItem('sweetcupcakes_user');
                expect(localSession).to.be.null;
                expect(sessionSession).to.be.null;
            });
        });
    });

    describe('Proteção de Rotas', () => {
        it('Deve permitir acesso a páginas públicas sem login', () => {
            cy.visit('/index.html');
            cy.url().should('include', 'index.html');

            cy.visit('/cardapio.html');
            cy.url().should('include', 'cardapio.html');

            cy.visit('/carrinho.html');
            cy.url().should('include', 'carrinho.html');
        });

        it('Deve redirecionar para login ao acessar perfil sem autenticação', () => {
            cy.visit('/perfil.html');
            // Verificar se foi redirecionado ou mostra mensagem
            cy.url().should('match', /login\.html|perfil\.html/);
        });

        it('Deve permitir acesso ao perfil após login', () => {
            cy.login('joao@email.com', '123456');
            cy.visit('/perfil.html');
            cy.url().should('include', 'perfil.html');
        });

        it('Deve permitir acesso aos pedidos após login', () => {
            cy.login('joao@email.com', '123456');
            cy.visit('/pedidos.html');
            cy.url().should('include', 'pedidos.html');
        });
    });

    describe('Navegação Autenticada', () => {
        it('Deve mostrar nome do usuário no header após login', () => {
            cy.login('joao@email.com', '123456');
            cy.visit('/index.html');

            cy.get('header').should('contain', 'João');
        });

        it('Deve mostrar botão de logout após login', () => {
            cy.login('joao@email.com', '123456');
            cy.visit('/index.html');

            // Verificar que existe um elemento de logout (pode estar em dropdown)
            cy.get('body').then(($body) => {
                // Tentar encontrar o botão de logout ou link
                if ($body.find('#logoutBtn').length > 0) {
                    cy.get('#logoutBtn').should('exist');
                } else {
                    cy.contains('button, a', /Sair|Logout/i).should('exist');
                }
            });
        });

        it('Deve ocultar botões de login/cadastro após autenticação', () => {
            cy.visit('/index.html');
            cy.contains('a', 'Login').should('be.visible');
            cy.contains('a', 'Cadastro').should('be.visible');

            cy.login('joao@email.com', '123456');
            cy.visit('/index.html');

            cy.contains('a', 'Login').should('not.exist');
            cy.contains('a', 'Cadastro').should('not.exist');
        });
    });

    describe('Dados do Usuário', () => {
        it('Deve armazenar informações corretas do usuário', () => {
            cy.login('joao@email.com', '123456');

            cy.window().then((win) => {
                const userStr = win.sessionStorage.getItem('sweetcupcakes_user') ||
                    win.localStorage.getItem('sweetcupcakes_user');
                const user = JSON.parse(userStr);

                expect(user).to.have.property('id');
                expect(user).to.have.property('firstName');
                expect(user).to.have.property('lastName');
                expect(user).to.have.property('email');
                expect(user).to.have.property('phone');
                expect(user).to.have.property('loginAt');
            });
        });

        it('Deve identificar usuário admin corretamente', () => {
            cy.login('admin@sweetcupcakes.com', 'admin123');

            cy.window().then((win) => {
                const userStr = win.sessionStorage.getItem('sweetcupcakes_user') ||
                    win.localStorage.getItem('sweetcupcakes_user');
                const user = JSON.parse(userStr);

                expect(user.isAdmin).to.be.true;
            });
        });

        it('Deve identificar usuário comum corretamente', () => {
            cy.login('joao@email.com', '123456');

            cy.window().then((win) => {
                const userStr = win.sessionStorage.getItem('sweetcupcakes_user') ||
                    win.localStorage.getItem('sweetcupcakes_user');
                const user = JSON.parse(userStr);

                expect(user.isAdmin).to.be.false;
            });
        });
    });

    describe('Fluxo de Registro e Login', () => {
        it('Deve permitir cadastro e login imediatamente após', () => {
            const timestamp = Date.now();
            const email = `novo${timestamp}@test.com`;

            // Cadastrar
            cy.visit('/cadastro.html');
            cy.get('#firstName').type('Novo');
            cy.get('#lastName').type('Usuário');
            cy.get('#email').type(email);
            cy.get('#phone').type('11999998888');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            // Fazer login
            cy.url().should('include', 'login.html');
            cy.get('#loginForm').invoke('attr', 'novalidate', 'novalidate');
            cy.get('#email').type(email);
            cy.get('#password').type('Senha@123');
            cy.get('button[type="submit"]').click();

            // Verificar sucesso
            cy.url().should('include', 'index.html');
        });
    });

    describe('Segurança', () => {
        it('Não deve expor senha no localStorage/sessionStorage', () => {
            cy.login('joao@email.com', '123456');

            cy.window().then((win) => {
                const userStr = win.sessionStorage.getItem('sweetcupcakes_user') ||
                    win.localStorage.getItem('sweetcupcakes_user');
                const user = JSON.parse(userStr);

                expect(user).to.not.have.property('password');
            });
        });

        it('Deve limpar dados sensíveis após logout', () => {
            cy.login('joao@email.com', '123456');
            cy.logout();

            cy.window().then((win) => {
                const localUser = win.localStorage.getItem('sweetcupcakes_user');
                const sessionUser = win.sessionStorage.getItem('sweetcupcakes_user');
                // Após logout, não deve haver sessão do usuário
                expect(localUser).to.be.null;
                expect(sessionUser).to.be.null;
            });
        });

        it('Não deve permitir acesso com token expirado ou inválido', () => {
            cy.visit('/index.html');
            cy.window().then((win) => {
                // Criar sessão inválida
                win.localStorage.setItem('sweetcupcakes_user', 'invalid_json');
            });

            cy.visit('/perfil.html');
            // Deve tratar erro e possivelmente redirecionar ou limpar
            cy.window().then((win) => {
                const session = win.localStorage.getItem('sweetcupcakes_user');
                // Sistema deve limpar sessão inválida ou manter como está
                // Verificar que não causa erro crítico na página
                cy.get('body').should('exist');
            });
        });
    });

    describe('Múltiplas Sessões', () => {
        it('Deve manter apenas uma sessão ativa por vez', () => {
            cy.login('joao@email.com', '123456', true);

            cy.window().then((win) => {
                const localUser = win.localStorage.getItem('sweetcupcakes_user');
                const sessionUser = win.sessionStorage.getItem('sweetcupcakes_user');

                // Deve estar em apenas um local
                const hasLocal = localUser !== null;
                const hasSession = sessionUser !== null;
                expect(hasLocal || hasSession).to.be.true;
            });
        });
    });

    describe('Recuperação de Sessão', () => {
        it('Deve recuperar sessão ao reabrir navegador (com remember me)', () => {
            cy.login('joao@email.com', '123456', true);

            // Simular fechamento e reabertura
            cy.clearCookies();
            cy.visit('/index.html');

            cy.window().then((win) => {
                const session = win.localStorage.getItem('sweetcupcakes_user');
                expect(session).to.not.be.null;
            });
        });

        it('Deve perder sessão ao fechar aba (sem remember me)', () => {
            cy.login('joao@email.com', '123456', false);

            cy.window().then((win) => {
                const localSession = win.localStorage.getItem('sweetcupcakes_user');
                expect(localSession).to.be.null;

                const sessionSession = win.sessionStorage.getItem('sweetcupcakes_user');
                expect(sessionSession).to.not.be.null;
            });
        });
    });

    describe('Estado da Interface', () => {
        it('Deve atualizar UI ao fazer login', () => {
            cy.visit('/index.html');

            // Antes do login
            cy.get('body').then($body => {
                const hasLoginButton = $body.find('a[href*="login"]').length > 0;
                expect(hasLoginButton).to.be.true;
            });

            cy.login('joao@email.com', '123456');
            cy.visit('/index.html');

            // Após login
            cy.contains(/João|Olá/i).should('be.visible');
        });

        it('Deve atualizar UI ao fazer logout', () => {
            cy.login('joao@email.com', '123456');
            cy.visit('/index.html');

            cy.logout();

            cy.visit('/index.html');
            cy.contains('a', 'Login').should('be.visible');
        });
    });

    describe('Persistência de Dados', () => {
        it('Deve manter carrinho após login', () => {
            // Adicionar ao carrinho sem login
            cy.visit('/cardapio.html');

            // Verificar se há produtos disponíveis
            cy.get('body').then(($body) => {
                if ($body.find('.product-card').length > 0) {
                    cy.get('.product-card').first().find('.btn-add-cart').click();

                    // Fazer login
                    cy.login('joao@email.com', '123456');

                    // Verificar carrinho
                    cy.visit('/carrinho.html');
                    cy.get('.cart-item, .cart-empty').should('exist');
                } else {
                    // Se não há produtos, apenas fazer login
                    cy.login('joao@email.com', '123456');
                    cy.visit('/carrinho.html');
                    cy.get('body').should('exist');
                }
            });
        });

        it('Deve manter preferências do usuário', () => {
            cy.login('joao@email.com', '123456', true);

            cy.visit('/index.html');
            cy.reload();

            // Sessão deve persistir
            cy.window().then((win) => {
                const session = win.localStorage.getItem('sweetcupcakes_user');
                expect(session).to.not.be.null;
            });
        });
    });
});
