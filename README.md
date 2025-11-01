# 🧁 Sweet Cupcakes - Sistema Completo de E-commerce

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Django](https://img.shields.io/badge/Django-4.2.7-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Sistema completo de e-commerce para venda de cupcakes, desenvolvido como Projeto Integrador da FSG. Inclui front-end responsivo, API REST Django e banco de dados PostgreSQL normalizado.

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
3. [Arquitetura do Sistema](#-arquitetura-do-sistema)
4. [Estrutura do Projeto](#-estrutura-do-projeto)
5. [Front-End](#-front-end)
6. [Back-End](#-back-end)
7. [Banco de Dados](#-banco-de-dados)
8. [Instalação e Configuração](#-instalação-e-configuração)
9. [Funcionalidades](#-funcionalidades)
10. [API REST](#-api-rest)
11. [Testes](#-testes)
12. [Deploy](#-deploy)
13. [Contribuindo](#-contribuindo)
14. [Licença](#-licença)

---

## 🎯 Visão Geral

O **Sweet Cupcakes** é um sistema completo de e-commerce que permite:

- 🛒 **Clientes**: Navegar pelo catálogo, adicionar produtos ao carrinho, aplicar cupons de desconto e finalizar pedidos
- 👨‍💼 **Administradores**: Gerenciar produtos, categorias, cupons, pedidos e usuários
- 📊 **Gestores**: Visualizar relatórios de vendas, estatísticas e métricas de negócio

### Diferenciais do Projeto

✅ **Arquitetura MVC** completa e bem estruturada  
✅ **API REST** documentada com Swagger/OpenAPI  
✅ **Banco de dados normalizado** (3NF) com PostgreSQL  
✅ **Interface responsiva** mobile-first  
✅ **Sistema de autenticação** com tokens  
✅ **Testes automatizados** para camada de serviços  
✅ **Documentação completa** de todos os módulos  

---

## 🛠️ Tecnologias Utilizadas

### Front-End
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna (Flexbox, Grid, Animations)
- **JavaScript (Vanilla)** - Lógica de interação
- **LocalStorage** - Persistência temporária do carrinho

### Back-End
- **Python 3.11+** - Linguagem principal
- **Django 4.2.7** - Framework web
- **Django REST Framework 3.14.0** - API REST
- **Token Authentication** - Autenticação segura
- **drf-yasg 1.21.7** - Documentação automática Swagger

### Banco de Dados
- **PostgreSQL 12+** - Banco de dados relacional
- **15 tabelas normalizadas** - Estrutura otimizada
- **Views e Triggers** - Lógica no banco
- **Índices estratégicos** - Performance

### Ferramentas de Desenvolvimento
- **VS Code** - IDE
- **Git/GitHub** - Controle de versão
- **Postman** - Testes de API
- **pgAdmin** - Gerenciamento do banco

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   index.html │  │cardapio.html │  │ carrinho.html│ ...     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
│                     ┌──────▼───────┐                            │
│                     │  script.js   │                            │
│                     │  style.css   │                            │
│                     └──────┬───────┘                            │
└────────────────────────────┼──────────────────────────────────┘
                             │ HTTP/REST
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      SERVIDOR (Django)                         │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    API REST (DRF)                         │ │
│  │                                                           │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │ │
│  │  │   Views    │  │Serializers │  │   URLs     │        │ │
│  │  │(Controllers)│  │  (DTO)     │  │  (Routes)  │        │ │
│  │  └─────┬──────┘  └────────────┘  └────────────┘        │ │
│  └────────┼───────────────────────────────────────────────┘ │
│           │                                                   │
│  ┌────────▼──────────────────────────────────────────────┐  │
│  │              Services (Business Logic)                 │  │
│  │                                                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │  │
│  │  │  Cupom   │ │  Frete   │ │ Carrinho │ │ Pedido  │ │  │
│  │  │ Service  │ │ Service  │ │ Service  │ │ Service │ │  │
│  │  └─────┬────┘ └─────┬────┘ └─────┬────┘ └────┬────┘ │  │
│  └────────┼────────────┼────────────┼──────────┼───────┘  │
│           │            │            │          │           │
│  ┌────────▼────────────▼────────────▼──────────▼───────┐  │
│  │                    Models (ORM)                      │  │
│  │                                                      │  │
│  │  User, Cupcake, Categoria, Carrinho, Pedido, etc   │  │
│  └────────┬─────────────────────────────────────────┘  │
└───────────┼──────────────────────────────────────────────┘
            │ SQL
            │
┌───────────▼──────────────────────────────────────────────┐
│                PostgreSQL Database                        │
│                                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │  users  │ │cupcakes │ │  carts  │ │ orders  │  ...  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                           │
│  • 15 Tables      • Views      • Triggers                │
└───────────────────────────────────────────────────────────┘
```

### Padrão MVC Implementado

```
Model (Modelos Django)
├─ Entidades do domínio
├─ Relacionamentos entre tabelas
└─ Validações de dados

View (Controllers DRF)
├─ Recebe requisições HTTP
├─ Chama services para lógica de negócio
└─ Retorna respostas JSON

Controller (Services)
├─ Lógica de negócio
├─ Validações complexas
└─ Transações e integrações
```

---

## 📁 Estrutura do Projeto

```
Projeto_Integrador-FSG/
│
├── frontend/                          # Front-end (HTML/CSS/JS)
│   ├── index.html                    # Página inicial
│   ├── cardapio.html                 # Catálogo de produtos
│   ├── carrinho.html                 # Carrinho de compras
│   ├── checkout.html                 # Finalização do pedido
│   ├── style.css                     # Estilos globais
│   └── script.js                     # Lógica JavaScript
│
├── backend/                           # Back-end Django
│   ├── manage.py                     # CLI Django
│   ├── requirements.txt              # Dependências Python
│   ├── .env.example                  # Exemplo de variáveis de ambiente
│   ├── .gitignore                    # Arquivos ignorados
│   │
│   ├── config/                       # Configurações do projeto
│   │   ├── __init__.py
│   │   ├── settings.py              # Configurações Django
│   │   ├── urls.py                  # URLs principais
│   │   ├── wsgi.py                  # WSGI para deploy
│   │   └── asgi.py                  # ASGI para deploy
│   │
│   └── cupcakes_api/                 # App principal
│       ├── __init__.py
│       ├── admin.py                 # Django Admin
│       ├── apps.py                  # Configuração do app
│       ├── urls.py                  # URLs da API
│       │
│       ├── models/                   # Modelos (Entidades)
│       │   ├── __init__.py
│       │   ├── categoria.py         # Model Categoria
│       │   ├── cupcake.py           # Model Cupcake
│       │   ├── carrinho.py          # Model Carrinho
│       │   ├── cupom.py             # Model Cupom
│       │   ├── pedido.py            # Model Pedido
│       │   └── pagamento.py         # Model Pagamento
│       │
│       ├── serializers/              # Serializadores (DTOs)
│       │   ├── __init__.py
│       │   ├── auth_serializer.py   # Autenticação
│       │   ├── categoria_serializer.py
│       │   ├── cupcake_serializer.py
│       │   ├── carrinho_serializer.py
│       │   ├── cupom_serializer.py
│       │   ├── pedido_serializer.py
│       │   └── pagamento_serializer.py
│       │
│       ├── services/                 # Lógica de Negócio
│       │   ├── __init__.py
│       │   ├── cupom_service.py     # Validação de cupons
│       │   ├── frete_service.py     # Cálculo de frete
│       │   ├── carrinho_service.py  # Gestão do carrinho
│       │   └── pedido_service.py    # Criação de pedidos
│       │
│       ├── views/                    # Controllers (API)
│       │   ├── __init__.py
│       │   ├── auth_views.py        # Registro/Login
│       │   ├── categoria_views.py   # CRUD Categorias
│       │   ├── cupcake_views.py     # CRUD Cupcakes
│       │   ├── carrinho_views.py    # Gestão Carrinho
│       │   ├── cupom_views.py       # Validação Cupons
│       │   ├── pedido_views.py      # Gestão Pedidos
│       │   └── pagamento_views.py   # Gestão Pagamentos
│       │
│       └── tests/                    # Testes Automatizados
│           ├── __init__.py
│           ├── test_cupom_service.py    # Testes Cupons
│           └── test_frete_service.py    # Testes Frete
│
├── database/                          # Banco de Dados
│   ├── INDEX.md                      # Índice da documentação
│   ├── README.md                     # Guia do banco
│   ├── schema.sql                    # Criação das tabelas
│   ├── seed_data.sql                 # Dados de exemplo
│   ├── queries_uteis.sql             # Queries prontas
│   ├── dicionario_dados.md           # Documentação completa
│   ├── diagram_er.md                 # Diagrama ER (Mermaid)
│   ├── VISUAL_DIAGRAM.md             # Diagrama ASCII
│   ├── MIGRATION_GUIDE.md            # Guia de migração
│   └── API_EXAMPLES.md               # Exemplos de uso
│
└── README.md                          # Este arquivo (Documentação Geral)
```

---

## 🎨 Front-End

### Páginas Implementadas

#### 1. **index.html** - Página Inicial
- Hero section com call-to-action
- Produtos em destaque
- Seção "Sobre Nós"
- Navegação responsiva

#### 2. **cardapio.html** - Catálogo de Produtos
- Listagem de todos os cupcakes
- Filtros por categoria (Chocolate, Frutas, Especiais)
- Cards de produtos com preço e botão "Adicionar"
- Responsive grid layout

#### 3. **carrinho.html** - Carrinho de Compras
- Listagem de itens adicionados
- Controles de quantidade (+/-)
- Aplicação de cupons de desconto
- Resumo do pedido (subtotal, desconto, frete, total)

#### 4. **checkout.html** - Finalização
- Formulário de dados do cliente
- Seleção de tipo de entrega (Entrega/Retirada)
- Formulário de endereço (se entrega)
- Seleção de método de pagamento
- Campo de troco (se dinheiro)

### Tecnologias e Recursos

```css
/* Principais recursos CSS utilizados */
- CSS Variables (--primary-color, --secondary-color, etc)
- Flexbox (layout de navegação, cards)
- CSS Grid (grade de produtos)
- Media Queries (responsividade)
- Animations (@keyframes fadeIn, slideIn)
- Transitions (hover effects)
- Box-shadow (elevação de elementos)
```

```javascript
// Principais funcionalidades JavaScript
- LocalStorage API (persistência do carrinho)
- DOM Manipulation (renderização dinâmica)
- Event Listeners (interações do usuário)
- Array Methods (filter, map, reduce)
- Template Literals (HTML dinâmico)
- Máscaras de input (telefone, CEP)
```

### Sistema de Produtos (script.js)

```javascript
// Array de produtos pré-carregados
const products = [
    {
        id: 1,
        name: "Red Velvet",
        category: "especiais",
        price: 8.50,
        image: "/images/red-velvet.jpg"
    },
    // ... 11 produtos no total
];
```

### Sistema de Cupons (Front-end)

```javascript
const cupons = {
    'DOCURA10': { desconto: 10, tipo: 'percentual' },
    'PRIMEIRA': { desconto: 15, tipo: 'percentual' },
    'CUPOM20': { desconto: 20, tipo: 'fixo' }
};
```

### Responsividade

```css
/* Breakpoints */
@media (max-width: 768px) { /* Tablets */ }
@media (max-width: 480px) { /* Smartphones */ }
```

- ✅ Layout adaptável para desktop, tablet e mobile
- ✅ Navegação hamburger menu em mobile
- ✅ Cards empilhados em telas pequenas
- ✅ Formulários otimizados para touch

### Documentação do Front-End

📖 **Para mais detalhes**, consulte:
- Código-fonte em `frontend/`
- Comentários inline no `script.js`
- Documentação CSS no `style.css`

---

## ⚙️ Back-End

### Arquitetura Django

O back-end segue o padrão **MVC** (Model-View-Controller) adaptado para REST API:

```
Request → URL Router → View (Controller) → Service → Model → Database
                           ↓
                      Serializer (DTO)
                           ↓
Response ← JSON ←────────────┘
```

### Models (Entidades)

#### 1. **Categoria** (`models/categoria.py`)
```python
- nome (CharField, unique)
- slug (SlugField, unique)
- ativo (BooleanField)
- Relacionamento: N:M com Cupcake
```

#### 2. **Cupcake** (`models/cupcake.py`)
```python
- nome, descricao, preco, estoque
- categorias (ManyToMany)
- destaque, disponivel, ativo
- Métodos: reduzir_estoque()
```

#### 3. **Carrinho** (`models/carrinho.py`)
```python
- usuario (OneToOneField User)
- ItemCarrinho (quantidade, preco_unitario)
- Métodos: adicionar_item(), limpar()
```

#### 4. **Cupom** (`models/cupom.py`)
```python
- codigo (unique), tipo_desconto
- valor_desconto, percentual_desconto
- data_expiracao, uso_maximo
- Propriedade: valido (valida expiração e uso)
- Método: calcular_desconto()
```

#### 5. **Pedido** (`models/pedido.py`)
```python
- numero_pedido (auto-generated)
- usuario, status, tipo_entrega
- subtotal, desconto, frete, total
- ItemPedido (snapshot de produtos)
- Método: atualizar_status()
```

#### 6. **Pagamento** (`models/pagamento.py`)
```python
- pedido (OneToOne)
- metodo_pagamento, status
- valor, transacao_id
- Métodos: processar(), aprovar()
```

### Services (Lógica de Negócio)

#### 1. **CupomService** (`services/cupom_service.py`)
```python
@staticmethod
def validar_cupom(codigo, valor_pedido, usuario):
    """
    Valida cupom considerando:
    - Código existente e ativo
    - Período de validade
    - Valor mínimo do pedido
    - Limite de uso geral e por usuário
    
    Retorna: {'valido': bool, 'desconto': Decimal, 'mensagem': str}
    """
```

**Testes**: 12 cenários cobertos

#### 2. **FreteService** (`services/frete_service.py`)
```python
@staticmethod
def calcular_frete(estado, valor_pedido):
    """
    Calcula frete baseado em:
    - Estado de destino (tabela de taxas)
    - Frete grátis acima de R$ 100
    
    Retorna: {'valor_frete': Decimal, 'frete_gratis': bool}
    """
```

**Testes**: 13 cenários cobertos

#### 3. **CarrinhoService** (`services/carrinho_service.py`)
```python
- adicionar_item() com validação de estoque
- atualizar_quantidade() com @transaction.atomic
- remover_item()
- limpar_carrinho()
```

#### 4. **PedidoService** (`services/pedido_service.py`)
```python
@staticmethod
@transaction.atomic
def criar_pedido(carrinho, dados_pedido, usuario):
    """
    Cria pedido completo:
    1. Valida carrinho não vazio
    2. Cria ordem com snapshot de dados
    3. Cria itens do pedido
    4. Reduz estoque dos produtos
    5. Registra uso de cupom
    6. Cria registro de pagamento
    7. Limpa carrinho
    
    Tudo em transação atômica (rollback em caso de erro)
    """
```

### Serializers (DTOs)

Os serializers convertem entre Python objects e JSON:

```python
# Exemplo: CupcakeSerializer
class CupcakeSerializer(serializers.ModelSerializer):
    categorias = CategoriaSerializer(many=True, read_only=True)
    preco_final = serializers.SerializerMethodField()
    
    def get_preco_final(self, obj):
        return obj.preco_promocional or obj.preco
```

**Validações implementadas**:
- Validação de campos obrigatórios
- Validação de formato de dados
- Validação de regras de negócio
- Validação cruzada entre campos

### Views (Controllers)

#### ViewSets (CRUD completo)

```python
# Exemplo: CupcakeViewSet
class CupcakeViewSet(viewsets.ModelViewSet):
    queryset = Cupcake.objects.filter(ativo=True)
    serializer_class = CupcakeSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['categorias', 'destaque']
    search_fields = ['nome', 'descricao']
    
    @action(detail=False, methods=['get'])
    def destaques(self, request):
        """Endpoint customizado: /api/cupcakes/destaques/"""
        # ...
```

#### APIViews (Endpoints específicos)

```python
# Exemplo: AuthViews
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        # Autentica e retorna token
```

### Autenticação

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}
```

**Endpoints de autenticação**:
- `POST /api/auth/registro/` - Criar conta
- `POST /api/auth/login/` - Login (retorna token)
- `POST /api/auth/logout/` - Logout (invalida token)

### Django Admin

Configurado para gerenciar todas as entidades:

```python
# admin.py
@admin.register(Cupcake)
class CupcakeAdmin(admin.ModelAdmin):
    list_display = ['nome', 'preco', 'estoque', 'destaque', 'ativo']
    list_editable = ['preco', 'estoque', 'destaque']
    search_fields = ['nome', 'descricao']
    list_filter = ['categorias', 'destaque', 'ativo']
```

Acesso: `http://localhost:8000/admin/`

### Documentação do Back-End

📖 **Para mais detalhes**, consulte:
- Código-fonte em `backend/cupcakes_api/`
- `backend/README.md` - Documentação completa
- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

---

## 🗄️ Banco de Dados

### Visão Geral PostgreSQL

O banco de dados foi projetado seguindo as melhores práticas:

✅ **Normalização 3NF** - Sem redundância de dados  
✅ **Integridade Referencial** - Foreign keys com ações apropriadas  
✅ **Constraints** - Validações no nível do banco  
✅ **Índices** - Performance otimizada (~50 índices)  
✅ **Triggers** - Automação de tarefas  
✅ **Views** - Consultas complexas pré-compiladas  

### Estrutura das Tabelas

#### Tabelas Principais (15 no total)

```sql
1. users                  -- Usuários do sistema (UUID)
2. addresses              -- Endereços dos usuários
3. categories             -- Categorias de cupcakes
4. cupcakes               -- Produtos (cupcakes)
5. cupcake_categories     -- N:M entre cupcakes e categorias
6. cupcake_images         -- Galeria de imagens
7. coupons                -- Cupons de desconto
8. coupon_usage           -- Histórico de uso de cupons
9. carts                  -- Carrinhos de compras
10. cart_items            -- Itens nos carrinhos
11. orders                -- Pedidos realizados
12. order_items           -- Itens dos pedidos
13. payments              -- Pagamentos
14. order_status_history  -- Histórico de mudanças
15. reviews               -- Avaliações de produtos
```

### Relacionamentos Principais

```
users (1) ──────< (N) addresses
users (1) ──────< (1) carts ──────< (N) cart_items ──────> (1) cupcakes
users (1) ──────< (N) orders ──────< (N) order_items ──────> (1) cupcakes
orders (1) ──────< (1) payments
orders (1) ──────< (N) order_status_history
cupcakes (N) ────<>──── (N) categories  [via cupcake_categories]
cupcakes (1) ──────< (N) reviews
coupons (1) ──────< (N) orders
```

### Tipos de Dados Utilizados

```sql
UUID        -- IDs de users, carts, orders, payments, addresses
SERIAL      -- IDs de cupcakes, categories, itens (auto-incremento)
DECIMAL     -- Valores monetários (10,2)
BOOLEAN     -- Flags de status
TIMESTAMP   -- Datas e horas
VARCHAR     -- Textos curtos
TEXT        -- Textos longos
JSONB       -- Dados flexíveis (dados_transacao em payments)
```

### Triggers Implementados

#### 1. Auto-atualização de Timestamps

```sql
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Aplicado em 9 tabelas
```

#### 2. Log de Mudanças de Status

```sql
CREATE TRIGGER log_order_status_changes 
AFTER UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- Registra automaticamente mudanças em order_status_history
```

### Views Criadas

#### 1. v_cupcakes_completos

```sql
-- Lista cupcakes com categorias e avaliações agregadas
SELECT 
    c.*,
    STRING_AGG(cat.nome, ', ') as categorias,
    AVG(r.nota) as media_avaliacoes,
    COUNT(r.id) as total_avaliacoes
FROM cupcakes c
LEFT JOIN cupcake_categories cc ON ...
LEFT JOIN reviews r ON ...
GROUP BY c.id;
```

#### 2. v_estatisticas_pedidos

```sql
-- Estatísticas diárias de vendas
SELECT 
    DATE(data_pedido) as data,
    COUNT(*) as total_pedidos,
    SUM(total) as valor_total,
    AVG(total) as ticket_medio
FROM orders
WHERE status NOT IN ('cancelado')
GROUP BY DATE(data_pedido);
```

### Estratégia de Snapshot

Para garantir integridade histórica, alguns dados são **copiados** (snapshot) no momento do pedido:

```sql
-- Em orders:
nome_cliente, email_cliente, telefone_cliente  -- Dados do cliente
endereco_rua, endereco_numero, ...             -- Dados do endereço

-- Em order_items:
nome_cupcake    -- Nome do produto
preco_unitario  -- Preço no momento da compra
```

**Benefício**: Mesmo que o usuário altere seu endereço ou o produto seja renomeado, os pedidos antigos mantêm os dados corretos.

### Índices Estratégicos

```sql
-- Busca por identificadores
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cupcakes_slug ON cupcakes(slug);
CREATE INDEX idx_orders_numero_pedido ON orders(numero_pedido);

-- Filtros comuns
CREATE INDEX idx_cupcakes_destaque ON cupcakes(destaque);
CREATE INDEX idx_orders_status ON orders(status);

-- Relacionamentos (todos os FKs têm índices)
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Datas (DESC para ORDER BY recentes primeiro)
CREATE INDEX idx_orders_data_pedido ON orders(data_pedido DESC);
```

### Dados Iniciais (Seeds)

O `seed_data.sql` inclui:

- ✅ 5 categorias (Chocolate, Frutas, Especiais, Veganos, Diet)
- ✅ 17 cupcakes de exemplo
- ✅ 3 cupons ativos
- ✅ 5 usuários (1 admin, 1 staff, 3 clientes)
- ✅ 4 endereços
- ✅ 3 pedidos completos (diferentes status)
- ✅ 3 avaliações

### Queries Úteis Disponíveis

40+ queries prontas em `database/queries_uteis.sql`:

```sql
-- Exemplos:
- Cupcakes mais vendidos
- Top clientes por valor
- Receita por período
- Taxa de conversão
- Análise de cupons
- Métodos de pagamento
- Estatísticas geográficas
- Dashboard KPIs
```

### Documentação do Banco

📖 **Documentação completa** em `database/`:
- [`INDEX.md`](database/INDEX.md) - Navegação da documentação
- [`README.md`](database/README.md) - Guia de instalação
- [`dicionario_dados.md`](database/dicionario_dados.md) - Todas as tabelas
- [`diagram_er.md`](database/diagram_er.md) - Diagramas ER
- [`MIGRATION_GUIDE.md`](database/MIGRATION_GUIDE.md) - Migração Django

---

## 🚀 Instalação e Configuração

### Pré-requisitos

```bash
- Python 3.11 ou superior
- PostgreSQL 12 ou superior
- Git
- Node.js (opcional, para ferramentas de build)
```

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/PatrickLzt/Projeto_Integrador-FSG.git
cd Projeto_Integrador-FSG
```

### Passo 2: Configurar o Banco de Dados

```bash
# 1. Instalar PostgreSQL (se não tiver)
# Windows: Baixar instalador em https://www.postgresql.org/download/

# 2. Criar banco de dados
psql -U postgres
CREATE DATABASE sweet_cupcakes;
\q

# 3. Executar script de criação
psql -U postgres -d sweet_cupcakes -f database/schema.sql

# 4. Inserir dados de exemplo
psql -U postgres -d sweet_cupcakes -f database/seed_data.sql

# 5. Verificar
psql -U postgres -d sweet_cupcakes -c "SELECT COUNT(*) FROM cupcakes;"
# Deve retornar: 17
```

### Passo 3: Configurar o Back-End

```bash
cd backend

# 1. Criar ambiente virtual
python -m venv venv

# 2. Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Criar arquivo .env
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# 5. Editar .env com suas credenciais
# DB_NAME=sweet_cupcakes
# DB_USER=seu_usuario
# DB_PASSWORD=sua_senha
# DB_HOST=localhost
# DB_PORT=5432

# 6. Aplicar migrações Django (fake-initial pois tabelas já existem)
python manage.py migrate --fake-initial

# 7. Criar superusuário Django
python manage.py createsuperuser

# 8. Rodar servidor
python manage.py runserver
```

### Passo 4: Configurar o Front-End

```bash
cd ../frontend

# Opção 1: Usar servidor Python simples
python -m http.server 3000

# Opção 2: Usar Live Server do VS Code
# Instale a extensão "Live Server"
# Clique com botão direito em index.html > "Open with Live Server"

# Opção 3: Usar servidor Node.js
npx http-server -p 3000
```

### Passo 5: Acessar o Sistema

```
Front-End:  http://localhost:3000
Back-End:   http://localhost:8000
Admin:      http://localhost:8000/admin
API Docs:   http://localhost:8000/swagger
```

### Configuração Adicional: CORS

Para integrar front e back-end em diferentes portas:

```python
# backend/config/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite
]
```

---

## ✨ Funcionalidades

### Para Clientes

#### 🏠 Navegação e Catálogo
- ✅ Visualizar página inicial com destaques
- ✅ Navegar pelo catálogo completo
- ✅ Filtrar produtos por categoria
- ✅ Buscar produtos por nome
- ✅ Ver detalhes de cada produto

#### 🛒 Carrinho de Compras
- ✅ Adicionar produtos ao carrinho
- ✅ Alterar quantidade de itens
- ✅ Remover itens do carrinho
- ✅ Visualizar subtotal em tempo real
- ✅ Carrinho persiste no navegador (LocalStorage)

#### 🎟️ Cupons de Desconto
- ✅ Aplicar cupom de desconto
- ✅ Ver desconto calculado
- ✅ Remover cupom aplicado
- ✅ Validações: expiração, valor mínimo, limite de uso

#### 📦 Finalização de Pedido
- ✅ Preencher dados pessoais
- ✅ Escolher tipo de entrega (Entrega/Retirada)
- ✅ Informar endereço de entrega
- ✅ Cálculo automático de frete
- ✅ Escolher método de pagamento (PIX, Crédito, Débito, Dinheiro)
- ✅ Informar troco (se dinheiro)
- ✅ Ver resumo do pedido antes de confirmar

#### 👤 Conta de Usuário
- ✅ Criar conta
- ✅ Fazer login
- ✅ Ver histórico de pedidos
- ✅ Acompanhar status do pedido
- ✅ Avaliar produtos comprados

### Para Administradores

#### 📊 Dashboard
- ✅ Ver métricas gerais (vendas, clientes, produtos)
- ✅ Gráficos de vendas
- ✅ Produtos mais vendidos
- ✅ Relatórios personalizados

#### 🧁 Gestão de Produtos
- ✅ Cadastrar novos cupcakes
- ✅ Editar informações de produtos
- ✅ Definir preço e preço promocional
- ✅ Controlar estoque
- ✅ Marcar produtos em destaque
- ✅ Ativar/desativar produtos
- ✅ Upload de imagens

#### 📂 Gestão de Categorias
- ✅ Criar categorias
- ✅ Editar categorias
- ✅ Definir ordem de exibição
- ✅ Ativar/desativar categorias

#### 🎫 Gestão de Cupons
- ✅ Criar cupons (percentual ou fixo)
- ✅ Definir validade
- ✅ Definir valor mínimo
- ✅ Definir limite de uso
- ✅ Ver relatório de uso de cupons

#### 📦 Gestão de Pedidos
- ✅ Ver todos os pedidos
- ✅ Filtrar por status
- ✅ Atualizar status do pedido
- ✅ Ver detalhes completos
- ✅ Histórico de mudanças de status
- ✅ Cancelar pedidos

#### 👥 Gestão de Usuários
- ✅ Ver lista de clientes
- ✅ Ver histórico de compras
- ✅ Ativar/desativar contas
- ✅ Definir roles (admin, staff, customer)

---

## 🔌 API REST

### Documentação Automática

- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/
- **Schema JSON**: http://localhost:8000/swagger.json

### Endpoints Principais

#### Autenticação

```
POST   /api/auth/registro/           # Criar conta
POST   /api/auth/login/              # Login (retorna token)
POST   /api/auth/logout/             # Logout
```

#### Cupcakes

```
GET    /api/cupcakes/                # Listar todos
GET    /api/cupcakes/{id}/           # Buscar por ID
GET    /api/cupcakes/destaques/      # Listar destaques
GET    /api/cupcakes/disponiveis/    # Listar disponíveis
POST   /api/cupcakes/                # Criar (admin)
PUT    /api/cupcakes/{id}/           # Atualizar (admin)
PATCH  /api/cupcakes/{id}/           # Atualizar parcial (admin)
DELETE /api/cupcakes/{id}/           # Deletar (admin)

# Filtros e busca
GET    /api/cupcakes/?categoria=chocolate
GET    /api/cupcakes/?search=red velvet
GET    /api/cupcakes/?destaque=true
```

#### Categorias

```
GET    /api/categorias/              # Listar todas
GET    /api/categorias/{id}/         # Buscar por ID
POST   /api/categorias/              # Criar (admin)
PUT    /api/categorias/{id}/         # Atualizar (admin)
DELETE /api/categorias/{id}/         # Deletar (admin)
```

#### Carrinho

```
GET    /api/carrinho/                # Ver meu carrinho
POST   /api/carrinho/adicionar_item/ # Adicionar item
PATCH  /api/carrinho/atualizar_item/{id}/ # Atualizar quantidade
DELETE /api/carrinho/remover_item/{id}/   # Remover item
POST   /api/carrinho/limpar/         # Limpar carrinho
```

#### Cupons

```
POST   /api/cupons/validar/          # Validar cupom
GET    /api/cupons/                  # Listar (admin)
POST   /api/cupons/                  # Criar (admin)
```

#### Pedidos

```
GET    /api/pedidos/                 # Listar meus pedidos
POST   /api/pedidos/criar/           # Criar pedido
GET    /api/pedidos/{id}/            # Ver detalhes
POST   /api/pedidos/{id}/atualizar_status/ # Atualizar (staff)
POST   /api/pedidos/{id}/cancelar/   # Cancelar
GET    /api/pedidos/buscar_por_numero/?numero=PED-001
```

#### Pagamentos

```
GET    /api/pagamentos/              # Listar pagamentos
POST   /api/pagamentos/{id}/processar/ # Processar (admin)
POST   /api/pagamentos/{id}/aprovar/   # Aprovar (admin)
```

### Exemplos de Requisições

#### Criar Conta

```bash
curl -X POST http://localhost:8000/api/auth/registro/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "senha": "senha123",
    "confirmar_senha": "senha123"
  }'
```

#### Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'

# Resposta:
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": "uuid-aqui",
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "customer"
  }
}
```

#### Listar Cupcakes

```bash
curl http://localhost:8000/api/cupcakes/
```

#### Adicionar ao Carrinho

```bash
curl -X POST http://localhost:8000/api/carrinho/adicionar_item/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" \
  -H "Content-Type: application/json" \
  -d '{
    "cupcake_id": 1,
    "quantidade": 2
  }'
```

#### Validar Cupom

```bash
curl -X POST http://localhost:8000/api/cupons/validar/ \
  -H "Authorization: Token seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "BEMVINDO",
    "valor_pedido": 50.00
  }'

# Resposta:
{
  "valido": true,
  "desconto": 5.00,
  "tipo": "percentual",
  "mensagem": "Cupom aplicado com sucesso! Desconto de 10%"
}
```

### Autenticação

Todos os endpoints protegidos requerem o header:

```
Authorization: Token seu-token-aqui
```

### Códigos de Status HTTP

```
200 OK                    - Sucesso
201 Created               - Criado com sucesso
204 No Content            - Deletado com sucesso
400 Bad Request           - Dados inválidos
401 Unauthorized          - Não autenticado
403 Forbidden             - Sem permissão
404 Not Found             - Recurso não encontrado
500 Internal Server Error - Erro no servidor
```

### Paginação

Endpoints de listagem são paginados:

```
GET /api/cupcakes/?page=2&page_size=10
```

Resposta:
```json
{
  "count": 17,
  "next": "http://localhost:8000/api/cupcakes/?page=3",
  "previous": "http://localhost:8000/api/cupcakes/?page=1",
  "results": [...]
}
```

📖 **Mais exemplos** em [`database/API_EXAMPLES.md`](database/API_EXAMPLES.md)

---

## 🧪 Testes

### Testes Automatizados

O projeto inclui testes para as camadas críticas de negócio.

#### Executar Todos os Testes

```bash
cd backend
python manage.py test cupcakes_api.tests
```

#### Executar Testes Específicos

```bash
# Testar apenas serviço de cupons
python manage.py test cupcakes_api.tests.test_cupom_service

# Testar apenas serviço de frete
python manage.py test cupcakes_api.tests.test_frete_service
```

#### Cobertura de Testes

```bash
# Instalar coverage
pip install coverage

# Executar com cobertura
coverage run --source='.' manage.py test cupcakes_api.tests
coverage report
coverage html

# Ver relatório HTML
# Abrir htmlcov/index.html no navegador
```

### Testes Implementados

#### CupomService (12 testes)

```python
✅ test_validar_cupom_percentual_valido
✅ test_validar_cupom_fixo_valido
✅ test_cupom_inexistente
✅ test_cupom_inativo
✅ test_cupom_expirado
✅ test_cupom_nao_iniciado
✅ test_valor_minimo_nao_atingido
✅ test_limite_uso_total_atingido
✅ test_limite_uso_usuario_atingido
✅ test_calcular_desconto_percentual
✅ test_calcular_desconto_fixo
✅ test_desconto_nao_excede_valor
```

#### FreteService (13 testes)

```python
✅ test_calcular_frete_sp
✅ test_calcular_frete_rj
✅ test_calcular_frete_mg
✅ test_calcular_frete_outros_estados
✅ test_frete_gratis_acima_100
✅ test_frete_gratis_exatos_100
✅ test_frete_nao_gratis_abaixo_100
✅ test_estado_uppercase
✅ test_estado_lowercase
✅ test_estado_invalido
✅ test_valor_pedido_zero
✅ test_valor_pedido_negativo
✅ test_todos_estados_brasileiros
```

### Testes Manuais

#### Checklist de Testes Front-End

```
[ ] Navegação entre páginas funciona
[ ] Filtro de categorias funciona
[ ] Adicionar ao carrinho funciona
[ ] Alterar quantidade funciona
[ ] Remover item funciona
[ ] Aplicar cupom funciona
[ ] Calcular frete funciona
[ ] Formulário de checkout valida campos
[ ] Responsividade em mobile
[ ] Responsividade em tablet
```

#### Checklist de Testes API

```
[ ] Registro de usuário funciona
[ ] Login retorna token
[ ] Endpoints protegidos requerem token
[ ] Listar cupcakes retorna dados
[ ] Filtros funcionam
[ ] Adicionar ao carrinho funciona
[ ] Criar pedido funciona
[ ] Validar cupom retorna desconto
[ ] Atualizar status funciona (admin)
```

### Ferramentas de Teste

- **Postman**: Teste manual de APIs
- **Coverage.py**: Cobertura de código Python
- **Django TestCase**: Framework de testes
- **Browser DevTools**: Debug front-end

---

## 🚢 Deploy

### Deploy do Banco de Dados

#### Opção 1: Heroku Postgres

```bash
# Instalar Heroku CLI
# Criar app
heroku create sweet-cupcakes

# Adicionar Postgres
heroku addons:create heroku-postgresql:hobby-dev

# Obter credenciais
heroku config:get DATABASE_URL

# Executar migrations
heroku run python manage.py migrate

# Popular banco
heroku pg:psql < database/seed_data.sql
```

#### Opção 2: AWS RDS

1. Criar instância PostgreSQL no RDS
2. Configurar Security Group (liberar porta 5432)
3. Obter endpoint e credenciais
4. Atualizar `.env` com credenciais RDS
5. Executar migrations remotamente

#### Opção 3: Digital Ocean Database

1. Criar Managed PostgreSQL Database
2. Adicionar IP da aplicação às conexões permitidas
3. Baixar certificado SSL
4. Configurar connection string
5. Executar schema e migrations

### Deploy do Back-End

#### Opção 1: Heroku

```bash
# Criar arquivo Procfile
echo "web: gunicorn config.wsgi" > Procfile

# Criar runtime.txt
echo "python-3.11.0" > runtime.txt

# Deploy
git push heroku main

# Configurar variáveis
heroku config:set SECRET_KEY="sua-chave-secreta"
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS="sweet-cupcakes.herokuapp.com"

# Executar migrations
heroku run python manage.py migrate

# Criar superuser
heroku run python manage.py createsuperuser
```

#### Opção 2: AWS Elastic Beanstalk

```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar
eb init -p python-3.11 sweet-cupcakes

# Criar ambiente
eb create sweet-cupcakes-env

# Deploy
eb deploy

# Configurar variáveis
eb setenv SECRET_KEY="sua-chave" DEBUG=False
```

#### Opção 3: Digital Ocean App Platform

```bash
# Criar app.yaml
spec:
  name: sweet-cupcakes
  services:
  - name: web
    github:
      repo: PatrickLzt/Projeto_Integrador-FSG
      branch: main
    build_command: pip install -r requirements.txt
    run_command: gunicorn config.wsgi
    envs:
    - key: SECRET_KEY
      value: "sua-chave-secreta"
```

### Deploy do Front-End

#### Opção 1: GitHub Pages

```bash
# Habilitar GitHub Pages no repositório
# Settings > Pages > Source: main branch > /frontend folder

# URL ficará:
# https://patricklzt.github.io/Projeto_Integrador-FSG/
```

#### Opção 2: Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

#### Opção 3: Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

### Configurações de Produção

#### settings.py

```python
# Production settings
DEBUG = False
ALLOWED_HOSTS = ['seu-dominio.com', 'www.seu-dominio.com']

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Database
DATABASES = {
    'default': dj_database_url.config(default=os.getenv('DATABASE_URL'))
}

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### Checklist de Deploy

```
[ ] Variáveis de ambiente configuradas
[ ] DEBUG=False em produção
[ ] ALLOWED_HOSTS configurado
[ ] SECRET_KEY única e segura
[ ] Banco de dados PostgreSQL configurado
[ ] Migrations executadas
[ ] Static files coletados (collectstatic)
[ ] HTTPS configurado
[ ] CORS configurado corretamente
[ ] Backup do banco configurado
[ ] Monitoring configurado
[ ] Logs configurados
```

---

## 🤝 Contribuindo

### Como Contribuir

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Padrões de Código

#### Python (Backend)

```python
# Seguir PEP 8
# Usar Black para formatação
black .

# Usar isort para imports
isort .

# Usar flake8 para linting
flake8 cupcakes_api/
```

#### JavaScript (Frontend)

```javascript
// Usar ESLint
// Usar Prettier para formatação
// Seguir padrões do Airbnb Style Guide
```

### Estrutura de Commits

```
feat: Adiciona nova funcionalidade
fix: Corrige um bug
docs: Atualiza documentação
style: Mudanças de formatação
refactor: Refatora código
test: Adiciona ou modifica testes
chore: Tarefas de manutenção
```

### Reportar Bugs

Abra uma issue com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (OS, navegador, versão Python, etc)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2025 Patrick L.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Equipe

**Desenvolvedor Principal**: Patrick L. ([@PatrickLzt](https://github.com/PatrickLzt))

**Instituição**: FSG - Centro Universitário  
**Curso**: Projeto Integrador  
**Ano**: 2025

---

## 📞 Contato

- **GitHub**: [@PatrickLzt](https://github.com/PatrickLzt)
- **Repositório**: [Projeto_Integrador-FSG](https://github.com/PatrickLzt/Projeto_Integrador-FSG)
- **Issues**: [Reportar Problemas](https://github.com/PatrickLzt/Projeto_Integrador-FSG/issues)

---

## 📚 Documentação Adicional

### Por Módulo

- 📂 **Front-End**: Código em `frontend/` com comentários inline
- 📂 **Back-End**: [`backend/README.md`](backend/README.md)
- 📂 **Banco de Dados**: [`database/INDEX.md`](database/INDEX.md)

### Guias Específicos

- 🔄 **Migração Django → PostgreSQL**: [`database/MIGRATION_GUIDE.md`](database/MIGRATION_GUIDE.md)
- 📊 **Dicionário de Dados**: [`database/dicionario_dados.md`](database/dicionario_dados.md)
- 🎨 **Diagramas ER**: [`database/diagram_er.md`](database/diagram_er.md)
- 🧪 **Exemplos de API**: [`database/API_EXAMPLES.md`](database/API_EXAMPLES.md)
- 🔍 **Queries Úteis**: [`database/queries_uteis.sql`](database/queries_uteis.sql)

---

## 🎓 Aprendizados do Projeto

Este projeto foi desenvolvido como trabalho acadêmico e proporcionou aprendizado em:

✅ **Desenvolvimento Full-Stack** completo  
✅ **Arquitetura MVC** e separação de responsabilidades  
✅ **Design de Banco de Dados** normalizado  
✅ **API REST** com documentação automática  
✅ **Autenticação e Autorização** segura  
✅ **Testes Automatizados** de unidade  
✅ **Deploy** em ambientes de produção  
✅ **Git Flow** e controle de versão  
✅ **Documentação Técnica** completa  
✅ **UI/UX** responsivo e acessível  

---

## 🚀 Próximas Melhorias

### Roadmap

#### Versão 1.1
- [ ] Integração com gateway de pagamento real (Stripe/PayPal)
- [ ] Sistema de notificações por email
- [ ] Painel administrativo aprimorado
- [ ] Relatórios em PDF

#### Versão 1.2
- [ ] App mobile (React Native)
- [ ] Sistema de fidelidade/pontos
- [ ] Programa de indicação
- [ ] Chat de suporte

#### Versão 2.0
- [ ] Marketplace multi-vendedores
- [ ] Sistema de delivery próprio
- [ ] Assinatura mensal de cupcakes
- [ ] Personalização de produtos

---

## ⭐ Agradecimentos

- **FSG - Centro Universitário** pela oportunidade
- **Professores orientadores** pelo suporte
- **Comunidade Open Source** pelas ferramentas incríveis
- **Django/DRF** pela excelente documentação
- **PostgreSQL** pela robustez e confiabilidade

---

## 📊 Estatísticas do Projeto

```
📁 Arquivos:        60+
📝 Linhas de Código: ~10.000
🗄️ Tabelas DB:      15
🔌 Endpoints API:   30+
🧪 Testes:          25
📖 Páginas Doc:     ~100
⏱️ Tempo Desenvolvimento: ~3 meses
```

---

<div align="center">

### 🧁 Feito com ❤️ e muito açúcar! 🧁

**[⬆ Voltar ao Topo](#-sweet-cupcakes---sistema-completo-de-e-commerce)**

</div>
