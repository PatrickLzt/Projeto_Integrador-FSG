// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// ===== COMANDOS DE AUTENTICAÇÃO =====

// Comando customizado para fazer login
Cypress.Commands.add('login', (email, password, rememberMe = false) => {
    cy.visit('/login.html');
    cy.get('#loginForm').invoke('attr', 'novalidate', 'novalidate');
    cy.get('#email').clear().type(email);
    cy.get('#password').clear().type(password);

    if (rememberMe) {
        cy.get('#rememberMe').check();
    }

    cy.get('button[type="submit"]').click();
    cy.url().should('include', 'index.html');
});

// Comando customizado para fazer login programaticamente (mais rápido)
Cypress.Commands.add('loginProgrammatic', (email, password, rememberMe = false) => {
    cy.window().then((win) => {
        // Inicializar sistema de autenticação
        if (!win.localStorage.getItem('sweetcupcakes_users')) {
            const demoUsers = [
                {
                    id: '1',
                    firstName: 'Admin',
                    lastName: 'Sweet Cupcakes',
                    email: 'admin@sweetcupcakes.com',
                    phone: '(11) 99999-9999',
                    password: btoa('admin123' + 'sweetcupcakes_salt'),
                    createdAt: new Date().toISOString(),
                    isAdmin: true
                },
                {
                    id: '2',
                    firstName: 'João',
                    lastName: 'Silva',
                    email: 'joao@email.com',
                    phone: '(11) 98888-8888',
                    password: btoa('123456' + 'sweetcupcakes_salt'),
                    createdAt: new Date().toISOString(),
                    isAdmin: false
                }
            ];
            win.localStorage.setItem('sweetcupcakes_users', JSON.stringify(demoUsers));
        }

        // Buscar usuário
        const users = JSON.parse(win.localStorage.getItem('sweetcupcakes_users'));
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (user) {
            const session = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                loginAt: new Date().toISOString(),
                rememberMe: rememberMe
            };

            if (rememberMe) {
                win.localStorage.setItem('sweetcupcakes_user', JSON.stringify(session));
            } else {
                win.sessionStorage.setItem('sweetcupcakes_user', JSON.stringify(session));
            }
        }
    });
});

// Comando customizado para fazer logout
Cypress.Commands.add('logout', () => {
    cy.window().then((win) => {
        win.localStorage.removeItem('sweetcupcakes_user');
        win.sessionStorage.removeItem('sweetcupcakes_user');
    });
    cy.visit('/index.html');
});

// Comando para verificar se está logado
Cypress.Commands.add('assertLoggedIn', () => {
    cy.window().then((win) => {
        const session = win.localStorage.getItem('sweetcupcakes_user') ||
            win.sessionStorage.getItem('sweetcupcakes_user');
        expect(session).to.not.be.null;
    });
});

// Comando para verificar se não está logado
Cypress.Commands.add('assertLoggedOut', () => {
    cy.window().then((win) => {
        const localSession = win.localStorage.getItem('sweetcupcakes_user');
        const sessionSession = win.sessionStorage.getItem('sweetcupcakes_user');
        expect(localSession).to.be.null;
        expect(sessionSession).to.be.null;
    });
});

// Comando para cadastrar novo usuário
Cypress.Commands.add('register', (userData) => {
    cy.visit('/cadastro.html');
    cy.get('#firstName').type(userData.firstName);
    cy.get('#lastName').type(userData.lastName);
    cy.get('#email').type(userData.email);
    cy.get('#phone').type(userData.phone);
    cy.get('#password').type(userData.password);
    cy.get('#confirmPassword').type(userData.confirmPassword || userData.password);
    cy.get('#terms').check();
    cy.get('button[type="submit"]').click();
});

// ===== COMANDOS DE CARRINHO =====

// Comando customizado para adicionar produto ao carrinho
Cypress.Commands.add('addToCart', (productName, quantity = 1) => {
    cy.visit('/cardapio.html');
    cy.contains('.product-card', productName).within(() => {
        cy.get('.btn-add-cart').click();
    });

    // Verificar se foi adicionado
    cy.get('.cart-count', { timeout: 5000 }).should('exist');
});

// Comando customizado para limpar carrinho
Cypress.Commands.add('clearCart', () => {
    cy.window().then((win) => {
        win.localStorage.removeItem('cart');
        win.localStorage.removeItem('cupom');
    });
});

// Comando customizado para verificar item no carrinho
Cypress.Commands.add('checkCartItem', (productName) => {
    cy.visit('/carrinho.html');
    cy.contains('.cart-item', productName).should('exist');
});

// Comando customizado para aplicar cupom
Cypress.Commands.add('applyCoupon', (couponCode) => {
    cy.visit('/carrinho.html');
    cy.get('#cupom-input').clear().type(couponCode);
    cy.get('#aplicar-cupom').click();
});

// ===== COMANDOS DE CHECKOUT =====

// Comando customizado para preencher checkout
Cypress.Commands.add('fillCheckoutForm', (userData) => {
    cy.visit('/checkout.html');

    if (userData.nome) cy.get('#name').clear().type(userData.nome);
    if (userData.email) cy.get('#email').clear().type(userData.email);
    if (userData.telefone) cy.get('#phone').clear().type(userData.telefone);

    if (userData.tipoEntrega === 'entrega') {
        cy.get('input[value="delivery"]').check({ force: true });

        if (userData.endereco) {
            cy.get('#street').type(userData.endereco.rua);
            cy.get('#number').type(userData.endereco.numero);
            cy.get('#neighborhood').type(userData.endereco.bairro);
            cy.get('#city').type(userData.endereco.cidade);
            cy.get('#cep').type(userData.endereco.cep);
            if (userData.endereco.complemento) {
                cy.get('#complement').type(userData.endereco.complemento);
            }
        }
    } else {
        cy.get('input[value="pickup"]').check({ force: true });
    }

    if (userData.metodoPagamento) {
        const paymentValueMap = {
            'pix': 'pix',
            'credito': 'credit-card',
            'debito': 'debit-card',
            'dinheiro': 'cash',
            'credit-card': 'credit-card',
            'debit-card': 'debit-card',
            'cash': 'cash'
        };
        const paymentValue = paymentValueMap[userData.metodoPagamento] || userData.metodoPagamento;
        cy.get(`input[name="payment-method"][value="${paymentValue}"]`).check({ force: true });
    }

    if ((userData.metodoPagamento === 'dinheiro' || userData.metodoPagamento === 'cash') && userData.troco) {
        cy.get('#cash-amount').type(userData.troco);
    }
});

// ===== COMANDOS UTILITÁRIOS =====

// Comando para verificar se está na página correta
Cypress.Commands.add('assertOnPage', (pageName) => {
    const pageUrls = {
        'home': '/index.html',
        'cardapio': '/cardapio.html',
        'carrinho': '/carrinho.html',
        'checkout': '/checkout.html',
        'login': '/login.html',
        'cadastro': '/cadastro.html',
        'perfil': '/perfil.html',
        'pedidos': '/pedidos.html',
        'welcome': '/welcome.html'
    };

    cy.url().should('include', pageUrls[pageName]);
});

// Comando para limpar todos os dados
Cypress.Commands.add('clearAllData', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => {
        win.sessionStorage.clear();
    });
});

