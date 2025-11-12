// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

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

// Comando customizado para preencher checkout
Cypress.Commands.add('fillCheckoutForm', (userData) => {
    cy.visit('/checkout.html');

    if (userData.nome) cy.get('#nome').type(userData.nome);
    if (userData.email) cy.get('#email').type(userData.email);
    if (userData.telefone) cy.get('#telefone').type(userData.telefone);

    if (userData.tipoEntrega === 'entrega') {
        cy.get('#tipo-entrega-entrega').check();

        if (userData.endereco) {
            cy.get('#rua').type(userData.endereco.rua);
            cy.get('#numero').type(userData.endereco.numero);
            cy.get('#bairro').type(userData.endereco.bairro);
            cy.get('#cidade').type(userData.endereco.cidade);
            cy.get('#estado').select(userData.endereco.estado);
            cy.get('#cep').type(userData.endereco.cep);
        }
    } else {
        cy.get('#tipo-entrega-retirada').check();
    }

    if (userData.metodoPagamento) {
        cy.get(`input[name="metodo-pagamento"][value="${userData.metodoPagamento}"]`).check();
    }

    if (userData.metodoPagamento === 'dinheiro' && userData.troco) {
        cy.get('#troco').type(userData.troco);
    }
});

// Comando para verificar se está na página correta
Cypress.Commands.add('assertOnPage', (pageName) => {
    const pageUrls = {
        'home': '/index.html',
        'cardapio': '/cardapio.html',
        'carrinho': '/carrinho.html',
        'checkout': '/checkout.html'
    };

    cy.url().should('include', pageUrls[pageName]);
});

// Comando para simular delay (útil para testes)
Cypress.Commands.add('waitFor', (milliseconds) => {
    cy.wait(milliseconds);
});
