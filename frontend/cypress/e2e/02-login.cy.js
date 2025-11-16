/// <reference types="cypress" />

describe('Página de Login', () => {
    beforeEach(() => {
        // Limpar sessão antes de cada teste
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.visit('/login.html');
        // Desabilitar validação HTML5 para testar validação JavaScript
        cy.get('#loginForm').invoke('attr', 'novalidate', 'novalidate');
    });

    describe('Carregamento da Página', () => {
        it('Deve carregar a página de login corretamente', () => {
            cy.title().should('include', 'Login');
            cy.get('.auth-container').should('be.visible');
            cy.contains('h1', 'Bem-vindo de volta!').should('be.visible');
        });

        it('Deve exibir todos os campos do formulário', () => {
            cy.get('#email').should('be.visible');
            cy.get('#password').should('be.visible');
            cy.get('#rememberMe').should('exist');
            cy.get('button[type="submit"]').should('be.visible');
        });

        it('Deve ter link para cadastro', () => {
            cy.contains('a', 'Criar conta').should('have.attr', 'href', 'cadastro.html');
        });

        it('Deve ter link para recuperação de senha', () => {
            cy.contains('a', 'Esqueceu a senha?').should('be.visible');
        });
    });

    describe('Validação de Campos', () => {
        it('Deve exibir erro ao tentar enviar formulário vazio', () => {
            cy.get('button[type="submit"]').click();
            cy.get('#emailError').should('be.visible');
        });

        it('Deve validar formato de e-mail inválido', () => {
            cy.get('#email').type('emailinvalido');
            cy.get('#password').type('123456');
            cy.get('button[type="submit"]').click();
            cy.get('#emailError').should('be.visible').and('contain', 'inválido');
        });

        it('Deve validar e-mail válido', () => {
            cy.get('#email').type('usuario@example.com');
            cy.get('#email').should('not.have.class', 'error');
        });

        it('Deve exigir senha com mínimo de caracteres', () => {
            cy.get('#email').type('usuario@example.com');
            cy.get('#password').type('123');
            cy.get('button[type="submit"]').click();
            cy.get('#password').should('have.class', 'error');
        });
    });

    describe('Funcionalidade de Mostrar/Ocultar Senha', () => {
        it('Deve alternar visibilidade da senha', () => {
            cy.get('#password').should('have.attr', 'type', 'password');
            cy.get('#togglePassword').click();
            cy.get('#password').should('have.attr', 'type', 'text');
            cy.get('#togglePassword').click();
            cy.get('#password').should('have.attr', 'type', 'password');
        });
    });

    describe('Login com Credenciais', () => {
        it('Deve fazer login com credenciais válidas', () => {
            cy.get('#email').type('joao@email.com');
            cy.get('#password').type('123456');
            cy.get('button[type="submit"]').click();

            // Verificar sucesso
            cy.url().should('include', 'index.html');
            cy.window().then((win) => {
                const user = win.sessionStorage.getItem('sweetcupcakes_user') ||
                    win.localStorage.getItem('sweetcupcakes_user');
                expect(user).to.not.be.null;
            });
        });

        it('Deve fazer login com admin', () => {
            cy.get('#email').type('admin@sweetcupcakes.com');
            cy.get('#password').type('admin123');
            cy.get('button[type="submit"]').click();

            cy.url().should('include', 'index.html');
            cy.window().then((win) => {
                const userStr = win.sessionStorage.getItem('sweetcupcakes_user') ||
                    win.localStorage.getItem('sweetcupcakes_user');
                const user = JSON.parse(userStr);
                expect(user.isAdmin).to.be.true;
            });
        });

        it('Deve falhar com e-mail incorreto', () => {
            cy.get('#email').type('emailinexistente@test.com');
            cy.get('#password').type('senha123');
            cy.get('button[type="submit"]').click();

            cy.get('#alertMessage').should('be.visible')
                .and('contain', 'E-mail ou senha incorretos');
            cy.url().should('include', 'login.html');
        });

        it('Deve falhar com senha incorreta', () => {
            cy.get('#email').type('joao@email.com');
            cy.get('#password').type('senhaerrada');
            cy.get('button[type="submit"]').click();

            cy.get('#alertMessage').should('be.visible')
                .and('contain', 'E-mail ou senha incorretos');
        });
    });

    describe('Funcionalidade "Lembrar de mim"', () => {
        it('Deve salvar sessão no localStorage quando "lembrar" está marcado', () => {
            cy.get('#email').type('joao@email.com');
            cy.get('#password').type('123456');
            cy.get('#rememberMe').check();
            cy.get('button[type="submit"]').click();

            cy.window().then((win) => {
                const user = win.localStorage.getItem('sweetcupcakes_user');
                expect(user).to.not.be.null;
            });
        });

        it('Deve salvar sessão no sessionStorage quando "lembrar" não está marcado', () => {
            cy.get('#email').type('joao@email.com');
            cy.get('#password').type('123456');
            cy.get('#rememberMe').should('not.be.checked');
            cy.get('button[type="submit"]').click();

            cy.window().then((win) => {
                const sessionUser = win.sessionStorage.getItem('sweetcupcakes_user');
                const localUser = win.localStorage.getItem('sweetcupcakes_user');
                expect(sessionUser).to.not.be.null;
                expect(localUser).to.be.null;
            });
        });
    });

    describe('Redirecionamento', () => {
        it('Deve redirecionar para welcome após login bem-sucedido', () => {
            cy.get('#email').type('joao@email.com');
            cy.get('#password').type('123456');
            cy.get('button[type="submit"]').click();

            cy.url().should('include', 'index.html');
        });

        it('Deve redirecionar usuário já logado', () => {
            // Fazer login primeiro
            cy.login('joao@email.com', '123456');

            // Tentar acessar login novamente
            cy.visit('/login.html');
            cy.url().should('not.include', 'login.html');
        });
    });

    describe('Responsividade', () => {
        const viewports = [
            { name: 'iPhone SE', width: 375, height: 667 },
            { name: 'iPad', width: 768, height: 1024 },
            { name: 'Desktop', width: 1280, height: 720 }
        ];

        viewports.forEach(({ name, width, height }) => {
            it(`Deve funcionar corretamente em ${name}`, () => {
                cy.viewport(width, height);
                cy.get('.auth-container').should('be.visible');
                cy.get('#email').should('be.visible');
                cy.get('#password').should('be.visible');
                cy.get('button[type="submit"]').should('be.visible');
            });
        });
    });

    describe('Acessibilidade', () => {
        it('Deve permitir navegação por teclado', () => {
            cy.get('#email').focus().should('have.focus').type('joao@email.com');
            cy.get('#password').focus().should('have.focus').type('123456');
            cy.get('#rememberMe').focus().should('have.focus');
        });

        it('Deve ter labels associados aos inputs', () => {
            cy.get('label[for="email"]').should('exist');
            cy.get('label[for="password"]').should('exist');
            // rememberMe não tem atributo for, o label envolve o input
            cy.get('label.remember-me').should('exist');
        });
    });
});
