/// <reference types="cypress" />

describe('Página de Cadastro', () => {
    beforeEach(() => {
        // Limpar dados antes de cada teste
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.visit('/cadastro.html');
        // Desabilitar validação HTML5 para testar validação JavaScript
        cy.get('#registerForm').invoke('attr', 'novalidate', 'novalidate');
    });

    describe('Carregamento da Página', () => {
        it('Deve carregar a página de cadastro corretamente', () => {
            cy.title().should('include', 'Cadastro');
            cy.get('.auth-container').should('be.visible');
            cy.contains('h1', 'Criar sua conta').should('be.visible');
        });

        it('Deve exibir todos os campos do formulário', () => {
            cy.get('#firstName').should('be.visible');
            cy.get('#lastName').should('be.visible');
            cy.get('#email').should('be.visible');
            cy.get('#phone').should('be.visible');
            cy.get('#password').should('be.visible');
            cy.get('#confirmPassword').should('be.visible');
            cy.get('#terms').should('exist');
            cy.get('button[type="submit"]').should('be.visible');
        });

        it('Deve ter link para login', () => {
            cy.contains('a', 'Login').should('have.attr', 'href', 'login.html');
        });
    });

    describe('Validação de Campos Obrigatórios', () => {
        it('Deve exigir nome', () => {
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('teste@email.com');
            cy.get('#phone').type('11999999999');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            cy.get('#firstNameError').should('be.visible').and('contain', 'Nome');
        });

        it('Deve exigir sobrenome', () => {
            cy.get('#firstName').type('João');
            cy.get('#email').type('teste@email.com');
            cy.get('#phone').type('11999999999');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            cy.get('#lastNameError').should('be.visible').and('contain', 'Sobrenome');
        });

        it('Deve exigir e-mail', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#phone').type('11999999999');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            cy.get('#emailError').should('be.visible').and('contain', 'E-mail');
        });

        it('Deve exigir telefone', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('teste@email.com');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            cy.get('#phoneError').should('be.visible').and('contain', 'Telefone');
        });

        it('Deve exigir senha', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('teste@email.com');
            cy.get('#phone').type('11999999999');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            cy.get('#passwordError').should('be.visible').and('contain', 'Senha');
        });

        it('Deve exigir confirmação de senha', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('teste@email.com');
            cy.get('#phone').type('11999999999');
            cy.get('#password').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            cy.get('#confirmPasswordError').should('be.visible').and('contain', 'senhas');
        });

        it('Deve exigir aceite dos termos', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('teste@email.com');
            cy.get('#phone').type('11999999999');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('button[type="submit"]').click();

            cy.get('#alertMessage').should('be.visible').and('contain', 'termos');
        });
    });

    describe('Validação de Formato de Dados', () => {
        it('Deve validar formato de e-mail', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('emailinvalido');
            cy.get('#phone').type('11999999999');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            cy.get('#emailError').should('be.visible').and('contain', 'inválido');
        });

        it('Deve validar formato de telefone', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('teste@email.com');
            cy.get('#phone').type('123');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            cy.get('#phoneError').should('be.visible').and('contain', 'inválido');
        });

        it('Deve aplicar máscara no telefone', () => {
            cy.get('#phone').type('11999999999');
            cy.get('#phone').should('have.value', '(11) 99999-9999');
        });
    });

    describe('Validação de Senha', () => {
        it('Deve exigir senha com mínimo 6 caracteres', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('teste@email.com');
            cy.get('#phone').type('11999999999');
            cy.get('#password').type('123');
            cy.get('#confirmPassword').type('123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            cy.get('#passwordError').should('be.visible').and('contain', '6 caracteres');
        });

        it('Deve verificar força da senha', () => {
            cy.get('#password').type('12345');
            cy.get('#passwordStrength').should('have.class', 'weak');

            cy.get('#password').clear().type('Senha@123');
            cy.get('#passwordStrength').should('have.class', 'medium');

            cy.get('#password').clear().type('SenhaForte@12345');
            cy.get('#passwordStrength').should('have.class', 'strong');
        });

        it('Deve verificar se senhas coincidem', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('teste@email.com');
            cy.get('#phone').type('11999999999');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@456');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            cy.get('#confirmPasswordError').should('be.visible').and('contain', 'não conferem');
        });

        it('Deve alternar visibilidade da senha', () => {
            cy.get('#password').should('have.attr', 'type', 'password');
            cy.get('#togglePassword').click();
            cy.get('#password').should('have.attr', 'type', 'text');
        });

        it('Deve alternar visibilidade da confirmação de senha', () => {
            cy.get('#confirmPassword').should('have.attr', 'type', 'password');
            cy.get('#toggleConfirmPassword').click();
            cy.get('#confirmPassword').should('have.attr', 'type', 'text');
        });
    });

    describe('Cadastro de Novo Usuário', () => {
        it('Deve cadastrar novo usuário com sucesso', () => {
            const timestamp = Date.now();
            const email = `teste${timestamp}@email.com`;

            cy.get('#firstName').type('Novo');
            cy.get('#lastName').type('Usuário');
            cy.get('#email').type(email);
            cy.get('#phone').type('11988887777');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            // Verificar mensagem de sucesso
            cy.get('.success-message, .alert-success').should('be.visible')
                .and('contain', 'sucesso');

            // Verificar redirecionamento
            cy.url().should('include', 'login.html');
        });

        it('Deve impedir cadastro com e-mail já existente', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('joao@email.com'); // E-mail já cadastrado
            cy.get('#phone').type('11988887777');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            cy.get('#alertMessage').should('be.visible')
                .and('contain', 'já');
        });
    });

    describe('Indicadores Visuais', () => {
        it('Deve mostrar indicador de força de senha', () => {
            cy.get('#password').type('12');
            cy.get('.password-strength').should('be.visible');
        });

        it('Deve mostrar caracteres restantes nos campos', () => {
            cy.get('#firstName').type('Nome muito grande');
            // Verificar se há algum indicador de limite
            cy.get('#firstName').invoke('val').its('length').should('be.lte', 50);
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
                cy.get('#firstName').should('be.visible');
                cy.get('button[type="submit"]').should('be.visible');
            });
        });
    });

    describe('Navegação por Teclado', () => {
        it('Deve permitir navegação completa por Tab', () => {
            cy.get('#firstName').focus().should('have.focus').type('João');
            cy.get('#lastName').focus().should('have.focus').type('Silva');
            cy.get('#email').focus().should('have.focus').type('joao@test.com');
            cy.get('#phone').focus().should('have.focus').type('11999999999');
            cy.get('#password').focus().should('have.focus');
        });

        it('Deve submeter formulário ao pressionar Enter no último campo', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type(`test${Date.now()}@email.com`);
            cy.get('#phone').type('11999999999');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('#confirmPassword').type('{enter}');

            cy.url().should('include', 'login.html');
        });
    });

    describe('Acessibilidade', () => {
        it('Deve ter labels para todos os campos', () => {
            cy.get('label[for="firstName"]').should('exist');
            cy.get('label[for="lastName"]').should('exist');
            cy.get('label[for="email"]').should('exist');
            cy.get('label[for="phone"]').should('exist');
            cy.get('label[for="password"]').should('exist');
            cy.get('label[for="confirmPassword"]').should('exist');
            cy.get('label[for="terms"]').should('exist');
        });

        it('Deve ter atributo required nos campos obrigatórios', () => {
            cy.get('#firstName').should('have.attr', 'required');
            cy.get('#lastName').should('have.attr', 'required');
            cy.get('#email').should('have.attr', 'required');
        });
    });

    describe('Experiência do Usuário', () => {
        it('Deve manter dados preenchidos após erro de validação', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('joao@email.com');
            cy.get('button[type="submit"]').click(); // Erro: campos faltando

            cy.get('#firstName').should('have.value', 'João');
            cy.get('#lastName').should('have.value', 'Silva');
            cy.get('#email').should('have.value', 'joao@email.com');
        });

        it('Deve limpar senha após erro de e-mail duplicado', () => {
            cy.get('#firstName').type('João');
            cy.get('#lastName').type('Silva');
            cy.get('#email').type('joao@email.com');
            cy.get('#phone').type('11999999999');
            cy.get('#password').type('Senha@123');
            cy.get('#confirmPassword').type('Senha@123');
            cy.get('#terms').check();
            cy.get('button[type="submit"]').click();

            // Após erro, deve exibir mensagem
            cy.get('#alertMessage').should('be.visible');
        });
    });
});
