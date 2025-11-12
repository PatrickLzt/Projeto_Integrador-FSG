# 🧪 Guia de Testes com Cypress - Sweet Cupcakes

![Cypress](https://img.shields.io/badge/Cypress-15.6.0-green)
![Tests](https://img.shields.io/badge/tests-100%2B-brightgreen)

Documentação completa dos testes end-to-end (E2E) implementados para o projeto Sweet Cupcakes usando Cypress.

---

## 📋 Índice

1. [Introdução](#-introdução)
2. [Pré-requisitos](#-pré-requisitos)
3. [Instalação](#-instalação)
4. [Executando os Testes](#-executando-os-testes)
5. [Estrutura dos Testes](#-estrutura-dos-testes)
6. [Cenários de Teste](#-cenários-de-teste)
7. [Comandos Customizados](#-comandos-customizados)
8. [Fixtures (Dados de Teste)](#-fixtures-dados-de-teste)
9. [Boas Práticas](#-boas-práticas)
10. [Interpretando Resultados](#-interpretando-resultados)
11. [Troubleshooting](#-troubleshooting)

---

## 🎯 Introdução

Este projeto utiliza **Cypress** para realizar testes automatizados end-to-end que simulam interações reais de usuários com a aplicação Sweet Cupcakes.

### O que é testado?

✅ **Navegação** entre páginas  
✅ **Catálogo de produtos** (listagem, filtros, busca)  
✅ **Carrinho de compras** (adicionar, remover, atualizar)  
✅ **Cupons de desconto** (validação e aplicação)  
✅ **Checkout** (formulários, validações, finalização)  
✅ **Responsividade** (mobile, tablet, desktop)  
✅ **Fluxos completos** E2E (jornada do usuário)  

### Benefícios

- 🚀 **Automação**: Testes executam rapidamente
- 🔍 **Cobertura**: Mais de 100 cenários testados
- 📸 **Screenshots**: Capturas automáticas em falhas
- 🎥 **Vídeos**: Gravação de execução dos testes
- 🐛 **Debug**: Time-travel e inspeção detalhada

---

## ✅ Pré-requisitos

```bash
- Node.js 16+ instalado
- NPM ou Yarn
- Navegador Chrome, Firefox ou Edge
- Servidor local rodando na porta 3000
```

---

## 📦 Instalação

### 1. Verificar se já está instalado

```bash
cd frontend
npm list cypress
```

### 2. Se não estiver instalado

```bash
cd frontend
npm install --save-dev cypress
```

### 3. Verificar instalação

```bash
npx cypress --version
```

---

## 🚀 Executando os Testes

### Passo 1: Iniciar o servidor local

Antes de executar os testes, você precisa ter a aplicação rodando:

```powershell
# Opção 1: Python HTTP Server
cd frontend
python -m http.server 3000

# Opção 2: Live Server (VS Code)
# Clique com botão direito em index.html > "Open with Live Server"

# Opção 3: Node.js http-server
npx http-server -p 3000
```

### Passo 2: Executar testes

#### 🎭 Modo Interativo (Recomendado para desenvolvimento)

```bash
cd frontend
npm run test:open
```

Isso abrirá a interface gráfica do Cypress onde você pode:
- Selecionar qual teste executar
- Ver execução em tempo real
- Debug interativo
- Time-travel entre comandos

#### ⚡ Modo Headless (Recomendado para CI/CD)

```bash
# Executar todos os testes
npm test

# Ou
npm run test:headless
```

#### 🌐 Executar em navegadores específicos

```bash
# Chrome
npm run test:chrome

# Firefox
npm run test:firefox

# Edge
npx cypress run --browser edge
```

#### 📝 Executar teste específico

```bash
# Executar apenas testes do carrinho
npx cypress run --spec "cypress/e2e/03-carrinho.cy.js"

# Executar apenas testes de checkout
npx cypress run --spec "cypress/e2e/04-checkout.cy.js"
```

---

## 📁 Estrutura dos Testes

```
frontend/
├── cypress/
│   ├── e2e/                          # Testes E2E
│   │   ├── 01-home.cy.js            # Testes da página inicial
│   │   ├── 02-cardapio.cy.js        # Testes do catálogo
│   │   ├── 03-carrinho.cy.js        # Testes do carrinho
│   │   ├── 04-checkout.cy.js        # Testes de checkout
│   │   └── 05-e2e-flow.cy.js        # Fluxos completos
│   │
│   ├── fixtures/                     # Dados de teste
│   │   └── testData.json            # Dados reutilizáveis
│   │
│   ├── support/                      # Configurações
│   │   ├── commands.js              # Comandos customizados
│   │   └── e2e.js                   # Setup global
│   │
│   ├── screenshots/                  # Capturas de tela
│   ├── videos/                       # Vídeos das execuções
│   └── downloads/                    # Downloads dos testes
│
├── cypress.config.js                 # Configuração do Cypress
└── package.json                      # Scripts e dependências
```

---

## 🧪 Cenários de Teste

### 1️⃣ Página Inicial (01-home.cy.js)

**Total**: ~15 testes

#### Cenários principais:
- ✅ Carregamento da página
- ✅ Exibição do header e navegação
- ✅ Seção hero visível
- ✅ Produtos em destaque
- ✅ Seção "Sobre Nós"
- ✅ Footer com informações
- ✅ Responsividade (mobile, tablet, desktop)

```bash
# Executar apenas estes testes
npx cypress run --spec "cypress/e2e/01-home.cy.js"
```

---

### 2️⃣ Cardápio (02-cardapio.cy.js)

**Total**: ~25 testes

#### Cenários principais:
- ✅ Listagem de produtos
- ✅ Informações dos produtos (nome, preço, imagem)
- ✅ Filtros por categoria (Chocolate, Frutas, Especiais)
- ✅ Busca por nome de produto
- ✅ Exibição de preços formatados
- ✅ Imagens com alt text
- ✅ Navegação entre páginas

#### Exemplo de teste:

```javascript
it('Deve filtrar produtos por categoria "Chocolate"', () => {
  cy.contains('.filter-btn', 'Chocolate').click();
  cy.get('.product-card').should('be.visible');
});
```

```bash
# Executar apenas estes testes
npx cypress run --spec "cypress/e2e/02-cardapio.cy.js"
```

---

### 3️⃣ Carrinho (03-carrinho.cy.js)

**Total**: ~40 testes

#### Cenários principais:
- ✅ Adicionar produtos ao carrinho
- ✅ Visualizar produtos adicionados
- ✅ Aumentar/diminuir quantidade
- ✅ Remover produtos
- ✅ Atualizar subtotais
- ✅ Aplicar cupons de desconto
- ✅ Validar cupons inválidos
- ✅ Calcular frete
- ✅ Resumo do pedido (subtotal, frete, desconto, total)
- ✅ Persistência do carrinho (localStorage)
- ✅ Navegação para checkout

#### Exemplo de teste:

```javascript
it('Deve aplicar cupom válido', () => {
  cy.get('#cupom-input').type('DOCURA10');
  cy.get('#aplicar-cupom').click();
  cy.get('.desconto').should('be.visible');
});
```

```bash
# Executar apenas estes testes
npx cypress run --spec "cypress/e2e/03-carrinho.cy.js"
```

---

### 4️⃣ Checkout (04-checkout.cy.js)

**Total**: ~35 testes

#### Cenários principais:
- ✅ Formulário de dados pessoais (nome, email, telefone)
- ✅ Validação de campos obrigatórios
- ✅ Validação de formato de email
- ✅ Tipo de entrega (Entrega/Retirada)
- ✅ Formulário de endereço (rua, número, bairro, cidade, estado, CEP)
- ✅ Cálculo de frete para entrega
- ✅ Frete grátis para retirada
- ✅ Métodos de pagamento (PIX, Crédito, Débito, Dinheiro)
- ✅ Campo de troco para dinheiro
- ✅ Resumo do pedido
- ✅ Finalização do pedido
- ✅ Limpeza do carrinho após finalizar

#### Exemplo de teste:

```javascript
it('Deve finalizar pedido com dados completos', () => {
  cy.fillCheckoutForm({
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '11999999999',
    tipoEntrega: 'retirada',
    metodoPagamento: 'pix'
  });
  
  cy.contains('button', /finalizar/i).click();
  cy.get('body').should('contain', 'sucesso');
});
```

```bash
# Executar apenas estes testes
npx cypress run --spec "cypress/e2e/04-checkout.cy.js"
```

---

### 5️⃣ Fluxos Completos E2E (05-e2e-flow.cy.js)

**Total**: ~10 cenários complexos

#### Cenários principais:
- ✅ Jornada completa do usuário (home → cardápio → carrinho → checkout → sucesso)
- ✅ Compra com entrega e diferentes métodos de pagamento
- ✅ Navegação completa sem comprar
- ✅ Adicionar e remover múltiplos produtos
- ✅ Testar múltiplos cupons
- ✅ Responsividade completa (mobile e tablet)
- ✅ Persistência do carrinho entre sessões

#### Exemplo de cenário completo:

```javascript
it('CENÁRIO COMPLETO: Usuário compra cupcakes com sucesso', () => {
  // 1. Visitar página inicial
  cy.visit('/index.html');
  
  // 2. Navegar para cardápio
  cy.contains('Ver Cardápio').click();
  
  // 3. Filtrar por categoria
  cy.contains('.filter-btn', 'Chocolate').click();
  
  // 4. Adicionar produtos
  cy.get('.btn-add-cart').first().click();
  
  // 5. Aplicar cupom
  cy.visit('/carrinho.html');
  cy.applyCoupon('DOCURA10');
  
  // 6. Finalizar pedido
  cy.visit('/checkout.html');
  cy.fillCheckoutForm(userData);
  cy.contains('Finalizar').click();
  
  // 7. Verificar sucesso
  cy.get('body').should('contain', 'sucesso');
});
```

```bash
# Executar apenas estes testes
npx cypress run --spec "cypress/e2e/05-e2e-flow.cy.js"
```

---

## 🛠️ Comandos Customizados

Comandos criados para simplificar os testes (definidos em `cypress/support/commands.js`):

### `cy.clearCart()`
Limpa o carrinho (remove dados do localStorage).

```javascript
cy.clearCart();
```

### `cy.addToCart(productName, quantity)`
Adiciona produto ao carrinho pelo nome.

```javascript
cy.addToCart('Red Velvet', 2);
```

### `cy.checkCartItem(productName)`
Verifica se produto está no carrinho.

```javascript
cy.checkCartItem('Chocolate Belga');
```

### `cy.applyCoupon(couponCode)`
Aplica cupom de desconto.

```javascript
cy.applyCoupon('DOCURA10');
```

### `cy.fillCheckoutForm(userData)`
Preenche formulário de checkout completo.

```javascript
cy.fillCheckoutForm({
  nome: 'João Silva',
  email: 'joao@email.com',
  telefone: '11999999999',
  tipoEntrega: 'entrega',
  endereco: {
    rua: 'Rua das Flores',
    numero: '123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234567'
  },
  metodoPagamento: 'pix'
});
```

### `cy.assertOnPage(pageName)`
Verifica se está na página correta.

```javascript
cy.assertOnPage('cardapio'); // Verifica se está em /cardapio.html
```

---

## 📊 Fixtures (Dados de Teste)

Os dados de teste estão centralizados em `cypress/fixtures/testData.json`:

```json
{
  "usuario": {
    "nome": "João da Silva",
    "email": "joao.teste@email.com",
    "telefone": "11999887766"
  },
  "enderecoEntrega": {
    "rua": "Rua das Flores",
    "numero": "123",
    "complemento": "Apto 45",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234567"
  },
  "cupons": {
    "valido": "DOCURA10",
    "percentual": "PRIMEIRA",
    "fixo": "CUPOM20",
    "invalido": "INVALIDO123"
  },
  "produtos": [
    {
      "nome": "Red Velvet",
      "preco": 8.50
    }
  ]
}
```

### Usando fixtures nos testes:

```javascript
cy.fixture('testData').then((data) => {
  cy.get('#nome').type(data.usuario.nome);
  cy.get('#email').type(data.usuario.email);
  cy.applyCoupon(data.cupons.valido);
});
```

---

## ✨ Boas Práticas

### 1. **Nomenclatura de testes**
```javascript
// ✅ Bom - Claro e descritivo
it('Deve adicionar produto ao carrinho quando clicar no botão', () => {});

// ❌ Ruim - Vago
it('Teste do carrinho', () => {});
```

### 2. **Usar seletores estáveis**
```javascript
// ✅ Bom - Seletores por classe ou ID
cy.get('.btn-add-cart').click();
cy.get('#cupom-input').type('DOCURA10');

// ❌ Ruim - Seletores frágeis
cy.get('button:nth-child(3)').click();
```

### 3. **Aguardar ações assíncronas**
```javascript
// ✅ Bom
cy.get('.btn-add-cart').click();
cy.wait(300); // Aguarda animação
cy.get('.cart-count').should('contain', '1');

// ❌ Ruim - Não aguarda
cy.get('.btn-add-cart').click();
cy.get('.cart-count').should('contain', '1'); // Pode falhar
```

### 4. **Limpar estado antes dos testes**
```javascript
beforeEach(() => {
  cy.clearCart(); // Garantir estado limpo
  cy.clearCookies();
  cy.clearLocalStorage();
});
```

### 5. **Usar comandos customizados**
```javascript
// ✅ Bom - Reutilizável
cy.fillCheckoutForm(userData);

// ❌ Ruim - Repetitivo
cy.get('#nome').type('João');
cy.get('#email').type('joao@email.com');
// ... 10 linhas repetidas
```

---

## 📈 Interpretando Resultados

### Modo Interativo (cypress open)

Quando você executa `npm run test:open`:

1. **Seleção de testes**: Escolha qual arquivo `.cy.js` executar
2. **Execução visual**: Veja o navegador executando os testes em tempo real
3. **Time-travel**: Clique em cada comando para ver o estado da aplicação naquele momento
4. **Logs**: Console mostra detalhes de cada ação
5. **Screenshots**: Disponíveis automaticamente em falhas

### Modo Headless (npm test)

Saída no terminal:

```
  Página Inicial - Home
    ✓ Deve carregar a página inicial corretamente (523ms)
    ✓ Deve mostrar a seção hero (156ms)
    ✓ Deve navegar para o cardápio ao clicar no botão (412ms)
    ...

  15 passing (8s)
  0 failing
```

### Interpretação de falhas:

```
  1) Carrinho de Compras
     Deve aplicar cupom válido:
     
     AssertionError: Timed out retrying: Expected to find element: .desconto, but never found it.
      at Context.eval (cypress/e2e/03-carrinho.cy.js:145:25)
```

**Significado**: O teste esperava encontrar o elemento `.desconto` mas não encontrou.

**Ações**:
- Verificar se o elemento existe no HTML
- Verificar se a classe está correta
- Aumentar timeout se necessário
- Verificar se cupom foi aplicado corretamente

### Arquivos Gerados

#### 📸 Screenshots (em falhas)
```
cypress/screenshots/
  03-carrinho.cy.js/
    Deve aplicar cupom válido (failed).png
```

#### 🎥 Vídeos (todas as execuções)
```
cypress/videos/
  03-carrinho.cy.js.mp4
```

---

## 🐛 Troubleshooting

### Problema 1: Servidor não está rodando

**Erro**:
```
Error: getaddrinfo ENOTFOUND localhost
```

**Solução**:
```bash
# Iniciar servidor antes dos testes
cd frontend
python -m http.server 3000
```

---

### Problema 2: Porta já está em uso

**Erro**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solução**:
```powershell
# Windows - Matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou usar outra porta
python -m http.server 8080
# E atualizar cypress.config.js: baseUrl: 'http://localhost:8080'
```

---

### Problema 3: Testes passam localmente mas falham no CI

**Causas comuns**:
- Timeouts muito curtos
- Dependências de tempo
- Resolução de tela diferente

**Solução**:
```javascript
// Aumentar timeouts
cy.get('.elemento', { timeout: 10000 });

// Definir viewport explicitamente
cy.viewport(1280, 720);
```

---

### Problema 4: Elementos não encontrados

**Erro**:
```
Timed out retrying: Expected to find element: .btn-add-cart
```

**Soluções**:
1. Verificar se elemento existe no HTML
2. Aguardar carregamento da página
3. Verificar se seletor está correto

```javascript
// Aguardar página carregar
cy.visit('/cardapio.html');
cy.get('.product-card').should('be.visible');
cy.get('.btn-add-cart').first().click();
```

---

### Problema 5: LocalStorage não persiste

**Causa**: `cy.clearLocalStorage()` sendo chamado entre testes

**Solução**:
```javascript
// Remover do beforeEach se quer manter dados
beforeEach(() => {
  // cy.clearLocalStorage(); // Comentar esta linha
});
```

---

## 📚 Recursos Adicionais

### Documentação Oficial
- 📖 [Cypress Docs](https://docs.cypress.io/)
- 🎓 [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- 🧪 [API Reference](https://docs.cypress.io/api/table-of-contents)

### Exemplos
```bash
# Ver exemplos oficiais do Cypress
npx cypress open
# Clicar em "View example tests"
```

### Comunidade
- 💬 [Cypress Discord](https://discord.com/invite/cypress)
- 🐛 [GitHub Issues](https://github.com/cypress-io/cypress/issues)
- 📺 [YouTube Channel](https://www.youtube.com/c/Cypressio)

---

## 📊 Estatísticas dos Testes

```
📁 Arquivos de Teste:    5
🧪 Total de Testes:      100+
⏱️ Tempo Médio:          ~2 minutos (todos os testes)
📸 Screenshots:          Automático em falhas
🎥 Vídeos:               Todos os testes gravados
✅ Cobertura:            Home, Cardápio, Carrinho, Checkout, E2E
```

---

## 🎯 Próximos Passos

Após dominar estes testes, você pode:

1. **Adicionar mais cenários**
   - Testes de acessibilidade
   - Testes de performance
   - Testes de segurança

2. **Integrar com CI/CD**
   - GitHub Actions
   - GitLab CI
   - Jenkins

3. **Gerar relatórios**
   - Mochawesome
   - Allure Reports
   - Cypress Dashboard

4. **Testes de API**
   - Testar endpoints do backend
   - Mockar respostas
   - Validar contratos

---

## ✅ Checklist de Execução

Antes de executar os testes:

```
[ ] Servidor local está rodando (porta 3000)
[ ] Dependências instaladas (npm install)
[ ] Cypress instalado (npx cypress --version)
[ ] Navegador compatível disponível
[ ] Dados de teste atualizados (fixtures)
```

Durante os testes:

```
[ ] Executar em modo interativo para debug
[ ] Verificar screenshots de falhas
[ ] Analisar vídeos das execuções
[ ] Validar logs no console
```

Após os testes:

```
[ ] Todos os testes passando?
[ ] Falhas documentadas?
[ ] Screenshots/vídeos revisados?
[ ] Testes lentos otimizados?
```

---

## 🤝 Contribuindo com Testes

Se quiser adicionar novos testes:

1. Criar arquivo em `cypress/e2e/` com nomenclatura: `##-nome.cy.js`
2. Seguir estrutura dos testes existentes
3. Usar comandos customizados quando possível
4. Adicionar fixtures se necessário
5. Documentar cenários complexos
6. Executar todos os testes antes de commit

---

<div align="center">

### 🧁 Testes automatizados para um código mais doce! 🧁

**[⬆ Voltar ao Topo](#-guia-de-testes-com-cypress---sweet-cupcakes)**

</div>
