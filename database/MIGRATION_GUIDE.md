# 🔄 Guia de Migração Django → PostgreSQL

Este guia explica como migrar o projeto Django existente (que usa SQLite) para o banco de dados PostgreSQL criado.

## 📋 Pré-requisitos

- PostgreSQL instalado e rodando
- Banco de dados `sweet_cupcakes` criado
- Scripts `schema.sql` e `seed_data.sql` executados
- Python e virtualenv configurados

---

## 🎯 Estratégia de Migração

Existem **duas abordagens** possíveis:

### Opção A: Usar o Banco PostgreSQL Criado (Recomendado)
✅ Usa a estrutura normalizada e otimizada já criada  
✅ Inclui triggers, views e dados de exemplo  
✅ Melhor para produção  

### Opção B: Deixar o Django Criar as Tabelas
⚠️ Estrutura baseada nos models do Django  
⚠️ Pode divergir do schema criado  
⚠️ Requer ajustes nos models  

**Vamos seguir com a Opção A** (usar o banco já criado).

---

## 🚀 Passo a Passo da Migração

### 1. Instalar Driver PostgreSQL

```bash
cd backend

# Ativar virtualenv
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac

# Instalar psycopg2
pip install psycopg2-binary
```

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `backend/.env`:

```env
# Database Configuration
DB_ENGINE=django.db.backends.postgresql
DB_NAME=sweet_cupcakes
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432

# Django Secret Key
SECRET_KEY=your-secret-key-here-change-in-production

# Debug Mode
DEBUG=True

# Allowed Hosts (separados por vírgula)
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 3. Atualizar settings.py

Edite `backend/config/settings.py` para usar variáveis de ambiente:

```python
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ... (resto do código)

# Database
DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': os.getenv('DB_NAME', BASE_DIR / 'db.sqlite3'),
        'USER': os.getenv('DB_USER', ''),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', ''),
        'PORT': os.getenv('DB_PORT', ''),
    }
}
```

### 4. Instalar python-dotenv

```bash
pip install python-dotenv
```

Adicione ao `requirements.txt`:
```
python-dotenv==1.0.0
```

### 5. Ajustar Models Django para Corresponder ao Schema

Os models Django precisam ser ajustados para corresponder exatamente às tabelas PostgreSQL criadas.

#### 5.1. Atualizar `cupcakes_api/models/cupcake.py`

```python
from django.db import models

class Cupcake(models.Model):
    # Importante: usar db_table para corresponder ao nome da tabela PostgreSQL
    class Meta:
        db_table = 'cupcakes'
        
    # O Django criará o campo 'id' automaticamente como serial
    nome = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    descricao = models.TextField()
    ingredientes = models.TextField(blank=True, null=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    preco_promocional = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    imagem_url = models.CharField(max_length=500, blank=True, null=True)
    imagem_principal = models.CharField(max_length=500, blank=True, null=True)
    estoque = models.IntegerField(default=0)
    peso_gramas = models.IntegerField(blank=True, null=True)
    calorias = models.IntegerField(blank=True, null=True)
    destaque = models.BooleanField(default=False)
    disponivel = models.BooleanField(default=True)
    ativo = models.BooleanField(default=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)
    ultima_atualizacao = models.DateTimeField(auto_now=True)
```

#### 5.2. Atualizar User Model

O Django já possui um User model. Você pode:
1. Extender o User do Django
2. Criar um Profile relacionado
3. Usar um Custom User Model

Para manter compatibilidade com o schema PostgreSQL, use Custom User:

```python
# Em cupcakes_api/models/user.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import uuid

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    class Meta:
        db_table = 'users'
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200)
    email = models.EmailField(max_length=255, unique=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    ativo = models.BooleanField(default=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)
    ultima_atualizacao = models.DateTimeField(auto_now=True)
    ultimo_acesso = models.DateTimeField(blank=True, null=True)
    
    # Campos necessários para AbstractBaseUser
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome']
    
    def __str__(self):
        return self.email
```

Adicione ao `settings.py`:
```python
AUTH_USER_MODEL = 'cupcakes_api.User'
```

### 6. Aplicar --fake-initial

Como as tabelas já existem no PostgreSQL, use `--fake-initial`:

```bash
# Gerar migrações baseadas nos models
python manage.py makemigrations

# Aplicar migrações com fake (não executar SQL, apenas registrar)
python manage.py migrate --fake-initial
```

⚠️ **Importante**: O `--fake-initial` registra as migrações sem executar o SQL, pois as tabelas já existem.

### 7. Verificar a Conexão

```bash
# Testar conexão com o banco
python manage.py dbshell

# Você deve estar conectado ao PostgreSQL
# Execute:
\dt
# Deve listar todas as tabelas

\q
# Para sair
```

### 8. Criar Superusuário Django

```bash
python manage.py createsuperuser
```

Siga as instruções para criar um admin.

### 9. Testar o Sistema

```bash
# Rodar o servidor
python manage.py runserver

# Acessar:
# http://localhost:8000/admin/
# http://localhost:8000/api/
# http://localhost:8000/swagger/
```

---

## 🔧 Ajustes Necessários nos Models

Para cada model do Django, adicione:

1. **Meta class com db_table**:
```python
class Meta:
    db_table = 'nome_tabela_postgresql'
```

2. **Campos UUID** para users, orders, payments, carts:
```python
import uuid
id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
```

3. **Timestamps automáticos**:
```python
data_cadastro = models.DateTimeField(auto_now_add=True)
ultima_atualizacao = models.DateTimeField(auto_now=True)
```

### Exemplo Completo: Categoria

```python
from django.db import models

class Categoria(models.Model):
    class Meta:
        db_table = 'categories'
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
    
    # id será serial (auto-incremento) automaticamente
    nome = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    descricao = models.TextField(blank=True, null=True)
    icone = models.CharField(max_length=50, blank=True, null=True)
    ordem = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    data_cadastro = models.DateTimeField(auto_now_add=True, db_column='data_cadastro')
    ultima_atualizacao = models.DateTimeField(auto_now=True, db_column='ultima_atualizacao')
    
    def __str__(self):
        return self.nome
```

---

## 🗺️ Mapeamento Django Models → PostgreSQL Tables

| Django Model       | PostgreSQL Table     | Tipo ID  | Observações                   |
| ------------------ | -------------------- | -------- | ----------------------------- |
| User               | users                | UUID     | Custom User Model             |
| Address            | addresses            | UUID     | FK para users                 |
| Categoria          | categories           | Serial   | Auto-incremento               |
| Cupcake            | cupcakes             | Serial   | Auto-incremento               |
| CupcakeCategoria   | cupcake_categories   | Composta | N:N                           |
| CupcakeImage       | cupcake_images       | Serial   | FK para cupcakes              |
| Cupom              | coupons              | Serial   | Auto-incremento               |
| CupomUsage         | coupon_usage         | Serial   | FK para coupons/users         |
| Carrinho           | carts                | UUID     | FK para users                 |
| CarrinhoItem       | cart_items           | Serial   | FK para carts/cupcakes        |
| Pedido             | orders               | UUID     | FK para users                 |
| PedidoItem         | order_items          | Serial   | FK para orders/cupcakes       |
| Pagamento          | payments             | UUID     | FK para orders                |
| OrderStatusHistory | order_status_history | Serial   | FK para orders                |
| Review             | reviews              | Serial   | FK para cupcakes/users/orders |

---

## 🐛 Troubleshooting

### Erro: "relation does not exist"

**Causa**: Tabela não existe no PostgreSQL.

**Solução**:
```bash
# Verificar se schema.sql foi executado
psql -U postgres -d sweet_cupcakes -c "\dt"

# Se não, executar:
psql -U postgres -d sweet_cupcakes -f database/schema.sql
```

### Erro: "column does not exist"

**Causa**: Nome de campo no model Django diferente do PostgreSQL.

**Solução**: Use `db_column` no model:
```python
data_cadastro = models.DateTimeField(auto_now_add=True, db_column='data_cadastro')
```

### Erro: "duplicate key value violates unique constraint"

**Causa**: Tentando inserir registro com chave já existente.

**Solução**: Verificar se `seed_data.sql` foi executado. Se sim, use IDs diferentes ou DELETE os dados de teste.

### Erro: "password authentication failed"

**Causa**: Credenciais incorretas no `.env`.

**Solução**: Verificar usuário e senha no arquivo `.env`.

### Erro: "FATAL: database does not exist"

**Causa**: Banco `sweet_cupcakes` não foi criado.

**Solução**:
```bash
psql -U postgres -c "CREATE DATABASE sweet_cupcakes;"
```

---

## 🔒 Sincronização de Senhas

O PostgreSQL `seed_data.sql` usa senhas com hash bcrypt. O Django também usa bcrypt (via `django.contrib.auth`).

Para sincronizar:

1. **Opção 1**: Usar os usuários do seed_data.sql (senha: "senha123")
2. **Opção 2**: Criar novos usuários via Django Admin
3. **Opção 3**: Atualizar senhas via Django:

```python
from django.contrib.auth import get_user_model
User = get_user_model()

user = User.objects.get(email='admin@sweetcupcakes.com')
user.set_password('nova_senha')
user.save()
```

---

## 📊 Verificações Finais

### 1. Verificar Tabelas

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Deve listar 15 tabelas.

### 2. Verificar Dados

```sql
SELECT COUNT(*) FROM cupcakes;  -- Deve retornar 17
SELECT COUNT(*) FROM categories;  -- Deve retornar 5
SELECT COUNT(*) FROM coupons;  -- Deve retornar 3
SELECT COUNT(*) FROM users;  -- Deve retornar 5
```

### 3. Testar API

```bash
# Listar cupcakes
curl http://localhost:8000/api/cupcakes/

# Listar categorias
curl http://localhost:8000/api/categorias/

# Validar cupom
curl -X POST http://localhost:8000/api/cupons/validar/ \
  -H "Content-Type: application/json" \
  -d '{"codigo": "BEMVINDO", "valor_pedido": 50.00}'
```

---

## 🎉 Próximos Passos

Após a migração bem-sucedida:

1. ✅ Testar todas as rotas da API
2. ✅ Verificar integridade dos dados
3. ✅ Executar testes automatizados: `python manage.py test`
4. ✅ Configurar backup automatizado (veja `database/README.md`)
5. ✅ Integrar front-end com as APIs
6. ✅ Configurar variáveis de ambiente para produção
7. ✅ Deploy (Heroku, AWS, Digital Ocean, etc.)

---

## 📚 Recursos Adicionais

- [Django PostgreSQL Documentation](https://docs.djangoproject.com/en/4.2/ref/databases/#postgresql-notes)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Django Migrations](https://docs.djangoproject.com/en/4.2/topics/migrations/)
- [Custom User Model](https://docs.djangoproject.com/en/4.2/topics/auth/customizing/#substituting-a-custom-user-model)

---

**Boa sorte com a migração! 🚀**
