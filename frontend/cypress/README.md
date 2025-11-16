# Testes Cypress - Documentação Atualizada

## 📋 Visão Geral

Suite completa de testes E2E para o projeto Sweet Cupcakes, incluindo todas as funcionalidades de autenticação e fluxos de usuário.

## 🧪 Estrutura dos Testes

### Testes de Autenticação (Prioridade)
- **01-cadastro.cy.js** - Cadastro de novos usuários (PRIMEIRO)
- **02-login.cy.js** - Sistema de login
- **03-auth.cy.js** - Gerenciamento de sessão e autenticação

### Testes de Funcionalidades
- **04-home.cy.js** - Página inicial e navegação
- **05-cardapio.cy.js** - Catálogo de produtos e filtros
- **06-carrinho.cy.js** - Carrinho de compras
- **07-checkout.cy.js** - Finalização de pedidos

### Testes E2E Completos
- **08-authenticated-flow.cy.js** - Fluxos com usuário autenticado (NOVO)
- **09-e2e-flow.cy.js** - Fluxos variados de usuário

## 🚀 Como Executar

### Executar todos os testes
```bash
cd frontend
npx cypress open
```

### Executar em modo headless
```bash
npx cypress run
```

### Executar testes específicos
```bash
# Apenas testes de autenticação (ordem correta: cadastro -> login -> auth)
npx cypress run --spec "cypress/e2e/01-cadastro.cy.js,cypress/e2e/02-login.cy.js,cypress/e2e/03-auth.cy.js"

# Apenas fluxos E2E
npx cypress run --spec "cypress/e2e/08-authenticated-flow.cy.js,cypress/e2e/09-e2e-flow.cy.js"

# Testes de funcionalidades básicas
npx cypress run --spec "cypress/e2e/04-home.cy.js,cypress/e2e/05-cardapio.cy.js,cypress/e2e/06-carrinho.cy.js,cypress/e2e/07-checkout.cy.js"
```

## 🔑 Comandos Customizados

### Autenticação

#### `cy.login(email, password, rememberMe)`
Faz login através da interface
```javascript
cy.login('joao@email.com', '123456');
cy.login('admin@sweetcupcakes.com', 'admin123', true); // com "lembrar de mim"
```

#### `cy.loginProgrammatic(email, password, rememberMe)`
Login direto via localStorage (mais rápido)
```javascript
cy.loginProgrammatic('joao@email.com', '123456', true);
```

#### `cy.logout()`
Faz logout e limpa sessão
```javascript
cy.logout();
```

#### `cy.register(userData)`
Registra novo usuário
```javascript
cy.register({
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@email.com',
    phone: '11999999999',
    password: 'Senha@123'
});
```

#### `cy.assertLoggedIn()` / `cy.assertLoggedOut()`
Verifica estado de autenticação
```javascript
cy.assertLoggedIn();
cy.assertLoggedOut();
```

### Carrinho

#### `cy.addToCart(productName, quantity)`
Adiciona produto ao carrinho
```javascript
cy.addToCart('Red Velvet');
```

#### `cy.clearCart()`
Limpa o carrinho
```javascript
cy.clearCart();
```

#### `cy.applyCoupon(couponCode)`
Aplica cupom de desconto
```javascript
cy.applyCoupon('DOCE10');
```

### Checkout

#### `cy.fillCheckoutForm(userData)`
Preenche formulário de checkout
```javascript
cy.fillCheckoutForm({
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '11999999999',
    tipoEntrega: 'entrega',
    endereco: {
        rua: 'Rua Exemplo',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234567'
    },
    metodoPagamento: 'pix'
});
```

### Utilitários

#### `cy.clearAllData()`
Limpa todos os dados (localStorage, sessionStorage, cookies)
```javascript
cy.clearAllData();
```

#### `cy.assertOnPage(pageName)`
Verifica se está na página correta
```javascript
cy.assertOnPage('cardapio');
cy.assertOnPage('login');
```

## 👥 Usuários de Teste

### Usuário Comum
- **Email**: joao@email.com
- **Senha**: 123456
- **Nome**: João Silva

### Administrador
- **Email**: admin@sweetcupcakes.com
- **Senha**: admin123
- **Nome**: Admin Sweet Cupcakes

## 📝 Cenários de Teste

### Cadastro (01-cadastro.cy.js) - PRIMEIRO
- ✅ Validação de campos obrigatórios
- ✅ Validação de formato (email, telefone)
- ✅ Máscara de telefone
- ✅ Validação de senha (força, confirmação)
- ✅ Cadastro de novo usuário
- ✅ Prevenção de email duplicado
- ✅ Indicadores visuais
- ✅ Navegação por teclado

### Login (02-login.cy.js)
- ✅ Carregamento da página
- ✅ Validação de campos (email, senha)
- ✅ Login com credenciais válidas
- ✅ Login com credenciais inválidas
- ✅ Funcionalidade "Lembrar de mim"
- ✅ Toggle de visibilidade de senha
- ✅ Redirecionamentos
- ✅ Responsividade
- ✅ Acessibilidade

### Autenticação (03-auth.cy.js)
- ✅ Gerenciamento de sessão (localStorage/sessionStorage)
- ✅ Proteção de rotas
- ✅ Navegação autenticada
- ✅ Dados do usuário
- ✅ Fluxo de registro + login
- ✅ Segurança (não expor senha)
- ✅ Múltiplas sessões
- ✅ Recuperação de sessão
- ✅ Persistência de dados

### Fluxo Autenticado (08-authenticated-flow.cy.js) - NOVO
- ✅ Jornada completa: cadastro até confirmação de pedido
- ✅ Compra rápida com usuário existente
- ✅ Acesso e gerenciamento como admin
- ✅ Persistência de sessão entre visitas
- ✅ Logout e limpeza de dados

### Fluxo E2E (09-e2e-flow.cy.js)
- ✅ Cadastro + compra completa
- ✅ Login + compra com entrega
- ✅ Compra anônima (sem login)
- ✅ Fluxo de logout
- ✅ Sessão persistente
- ✅ Carrinho persistente após login
- ✅ Admin login
- ✅ Responsividade mobile/tablet

## 🎯 Cobertura de Testes

### Features Testadas
- [x] Autenticação (login/logout)
- [x] Cadastro de usuários
- [x] Gerenciamento de sessão
- [x] Proteção de rotas
- [x] Catálogo de produtos
- [x] Carrinho de compras
- [x] Aplicação de cupons
- [x] Checkout e finalização
- [x] Persistência de dados
- [x] Responsividade
- [x] Acessibilidade

## 🐛 Troubleshooting

### Testes falhando
```bash
# Limpar cache do Cypress
npx cypress cache clear
npm install --save-dev cypress
```

### Problemas com localStorage
Certifique-se de que `cy.clearLocalStorage()` é chamado no `beforeEach`

### Timeouts
Ajuste timeouts nos testes:
```javascript
cy.get('.elemento', { timeout: 10000 })
```

## 📊 Relatórios

### Gerar relatório de cobertura
```bash
npx cypress run --reporter mochawesome
```

### Screenshots e vídeos
Por padrão, Cypress salva:
- Screenshots: `cypress/screenshots/`
- Vídeos: `cypress/videos/`

## 🔄 CI/CD

### Exemplo GitHub Actions
```yaml
- name: Cypress run
  uses: cypress-io/github-action@v5
  with:
    start: npm run dev
    wait-on: 'http://localhost:5173'
```

## 📚 Recursos

- [Documentação Cypress](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)

## ✨ Melhorias Futuras

- [ ] Integração com API backend real
- [ ] Testes de performance
- [ ] Testes de acessibilidade automatizados (cypress-axe)
- [ ] Visual regression testing
- [ ] Testes de carga
