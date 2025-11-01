# Sweet Cupcakes API - Backend Django

API REST completa para sistema de vendas de cupcakes, desenvolvida com Django e Django REST Framework seguindo o padrão MVC.

## 📋 Características

- ✅ **Arquitetura MVC** (Models, Views, Controllers/Services)
- ✅ **API REST** completa com Django REST Framework
- ✅ **Autenticação** via Token Authentication
- ✅ **CRUD completo** de todas as entidades
- ✅ **Serviços** para lógica de negócio (Cupons, Frete, Carrinho, Pedidos)
- ✅ **Admin Django** configurado para gerenciar dados
- ✅ **Testes unitários** para serviços críticos
- ✅ **Documentação automática** via Swagger/OpenAPI
- ✅ **CORS** configurado para integração com front-end

## 🗂️ Estrutura do Projeto

```
backend/
├── config/                      # Configurações do Django
│   ├── settings.py             # Configurações principais
│   ├── urls.py                 # URLs raiz do projeto
│   └── wsgi.py                 # Configuração WSGI
├── cupcakes_api/               # Aplicação principal
│   ├── models/                 # Modelos (Entidades)
│   │   ├── categoria.py
│   │   ├── cupcake.py
│   │   ├── carrinho.py
│   │   ├── cupom.py
│   │   ├── pedido.py
│   │   └── pagamento.py
│   ├── serializers/            # Serializers para API REST
│   │   ├── categoria_serializer.py
│   │   ├── cupcake_serializer.py
│   │   ├── carrinho_serializer.py
│   │   ├── cupom_serializer.py
│   │   ├── pedido_serializer.py
│   │   ├── pagamento_serializer.py
│   │   └── auth_serializer.py
│   ├── services/               # Lógica de negócio
│   │   ├── cupom_service.py
│   │   ├── frete_service.py
│   │   ├── carrinho_service.py
│   │   └── pedido_service.py
│   ├── views/                  # Controllers (Views/ViewSets)
│   │   ├── categoria_views.py
│   │   ├── cupcake_views.py
│   │   ├── carrinho_views.py
│   │   ├── cupom_views.py
│   │   ├── pedido_views.py
│   │   ├── pagamento_views.py
│   │   └── auth_views.py
│   ├── tests/                  # Testes unitários
│   │   ├── test_cupom_service.py
│   │   └── test_frete_service.py
│   ├── admin.py                # Configuração do Django Admin
│   └── urls.py                 # URLs da aplicação
├── manage.py                   # Utilitário Django CLI
└── requirements.txt            # Dependências Python
```

## 🚀 Instalação e Configuração

### 1. Criar Ambiente Virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar Banco de Dados

```bash
# Criar migrações
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate
```

### 4. Criar Superusuário (Admin)

```bash
python manage.py createsuperuser
```

### 5. Executar Servidor

```bash
python manage.py runserver
```

A API estará disponível em: `http://localhost:8000`

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/registro/` - Registrar usuário
- `POST /api/auth/login/` - Login (retorna token)
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/perfil/` - Obter perfil
- `PUT /api/auth/perfil/` - Atualizar perfil

### Categorias
- `GET /api/categorias/` - Listar categorias
- `POST /api/categorias/` - Criar categoria (admin)
- `GET /api/categorias/{id}/` - Obter categoria
- `PUT /api/categorias/{id}/` - Atualizar categoria (admin)
- `DELETE /api/categorias/{id}/` - Remover categoria (admin)
- `GET /api/categorias/{id}/cupcakes/` - Listar cupcakes da categoria

### Cupcakes
- `GET /api/cupcakes/` - Listar cupcakes
- `POST /api/cupcakes/` - Criar cupcake (admin)
- `GET /api/cupcakes/{id}/` - Obter cupcake
- `PUT /api/cupcakes/{id}/` - Atualizar cupcake (admin)
- `DELETE /api/cupcakes/{id}/` - Remover cupcake (admin)
- `GET /api/cupcakes/destaques/` - Listar destaques
- `GET /api/cupcakes/disponiveis/` - Listar disponíveis

### Carrinho
- `GET /api/carrinho/` - Obter carrinho
- `POST /api/carrinho/adicionar_item/` - Adicionar item
- `DELETE /api/carrinho/remover-item/{item_id}/` - Remover item
- `PATCH /api/carrinho/atualizar-quantidade/{item_id}/` - Atualizar quantidade
- `POST /api/carrinho/limpar/` - Limpar carrinho
- `GET /api/carrinho/totais/` - Obter totais

### Cupons
- `GET /api/cupons/` - Listar cupons (admin)
- `POST /api/cupons/` - Criar cupom (admin)
- `POST /api/cupons/validar/` - Validar cupom
- `GET /api/cupons/ativos/` - Listar ativos (admin)

### Pedidos
- `GET /api/pedidos/` - Listar pedidos
- `POST /api/pedidos/criar/` - Criar pedido
- `GET /api/pedidos/{id}/` - Obter pedido
- `POST /api/pedidos/{id}/cancelar/` - Cancelar pedido
- `PATCH /api/pedidos/{id}/atualizar_status/` - Atualizar status (admin)
- `GET /api/pedidos/meus_pedidos/` - Meus pedidos
- `GET /api/pedidos/estatisticas/` - Estatísticas (admin)

### Pagamentos
- `GET /api/pagamentos/` - Listar pagamentos
- `GET /api/pagamentos/{id}/` - Obter pagamento

## 🔑 Autenticação

A API usa Token Authentication. Após o login, inclua o token no header:

```
Authorization: Token seu_token_aqui
```

### Exemplo de Requisição com Token

```bash
curl -H "Authorization: Token abc123xyz" http://localhost:8000/api/pedidos/
```

## 🧪 Executar Testes

```bash
# Executar todos os testes
python manage.py test

# Executar testes específicos
python manage.py test cupcakes_api.tests.test_cupom_service
python manage.py test cupcakes_api.tests.test_frete_service

# Com cobertura
coverage run --source='.' manage.py test
coverage report
```

## 🎯 Funcionalidades dos Serviços

### CupomService
- Validação de cupons (validade, uso, valor mínimo)
- Cálculo de desconto (percentual ou fixo)
- Aplicação de cupons

### FreteService
- Cálculo de frete por estado
- Frete grátis acima de R$ 100
- Validação e formatação de CEP
- Cálculo por peso e distância (alternativo)

### CarrinhoService
- Adicionar/remover itens
- Atualizar quantidades
- Validação de estoque
- Cálculo de totais

### PedidoService
- Criação de pedidos a partir do carrinho
- Atualização de status
- Cancelamento de pedidos
- Estatísticas de vendas

## 🔧 Admin Django

Acesse o admin em: `http://localhost:8000/admin`

Funcionalidades:
- CRUD completo de Cupcakes e Categorias
- Gerenciamento de Pedidos e Status
- Visualização de Carrinhos
- Gestão de Cupons
- Controle de Pagamentos

## 📖 Documentação Interativa

- **Swagger UI**: `http://localhost:8000/swagger/`
- **ReDoc**: `http://localhost:8000/redoc/`

## 🛠️ Tecnologias Utilizadas

- **Django 4.2** - Framework web
- **Django REST Framework 3.14** - API REST
- **Token Authentication** - Autenticação
- **Django Filter** - Filtragem avançada
- **CORS Headers** - Integração front-end
- **drf-yasg** - Documentação Swagger
- **Pillow** - Processamento de imagens
- **PostgreSQL** - Banco de dados (recomendado para produção)
- **SQLite** - Banco de dados (desenvolvimento)

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
SECRET_KEY=sua_chave_secreta_aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=cupcakes_db
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```

## 🚀 Deploy em Produção

1. Configure `DEBUG=False` no `.env`
2. Configure `ALLOWED_HOSTS` com seu domínio
3. Use PostgreSQL em vez de SQLite
4. Configure `gunicorn` como servidor WSGI
5. Use `whitenoise` para servir arquivos estáticos
6. Configure variáveis de ambiente no servidor

```bash
# Coletar arquivos estáticos
python manage.py collectstatic --no-input

# Executar com Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido para o Projeto Integrador - FSG

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.
