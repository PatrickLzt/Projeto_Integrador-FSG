# ✅ Banco de Dados Neon Configurado com Sucesso!

## 🎯 O que foi feito

### 1. ⚙️ Configuração do Backend

**Arquivos modificados:**

- **`backend/config/settings.py`**
  - Adicionado `import dj_database_url`
  - Adicionado `from dotenv import load_dotenv`
  - Configurado DATABASES para usar `DATABASE_URL` do Neon
  - Fallback automático para SQLite se DATABASE_URL não estiver definido

- **`backend/requirements.txt`**
  - Adicionado `dj-database-url==2.1.0`

- **`backend/.env`**
  - Adicionado `DATABASE_URL` do Neon Database
  - Mantido configurações locais como fallback

### 2. 🗄️ Banco de Dados

**Status:** ✅ **Conectado e funcional!**

**URL do Banco:** 
```
postgresql://neondb_owner:npg_buM6as2wJdCo@ep-purple-heart-ahqa7n2h-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Migrações Aplicadas:**
- ✅ Django admin, auth, sessions, authtoken
- ✅ Cupcakes_api (Categoria, Cupcake, Pedido, Carrinho, Cupom, Pagamento)

**Superusuário Criado:**
- Username: `admin`
- Email: `admin@sweetcupcakes.com`
- Senha: [definida durante criação]

### 3. 🚀 Servidor Backend

**Status:** ✅ **Rodando em http://127.0.0.1:8000/**

**Endpoints disponíveis:**
- http://127.0.0.1:8000/api/cupcakes/
- http://127.0.0.1:8000/api/categorias/
- http://127.0.0.1:8000/api/carrinho/
- http://127.0.0.1:8000/api/pedidos/
- http://127.0.0.1:8000/api/cupons/
- http://127.0.0.1:8000/api/auth/login/
- http://127.0.0.1:8000/api/auth/registro/
- http://127.0.0.1:8000/admin/ (Django Admin)

---

## 🧪 Testar Integração

### Passo 1: Verificar Backend

Abra no navegador:
```
http://127.0.0.1:8000/api/cupcakes/
```

Deve retornar JSON (lista vazia por enquanto).

### Passo 2: Acessar Django Admin

1. Abra: http://127.0.0.1:8000/admin/
2. Login: `admin` / [sua senha]
3. Adicione alguns cupcakes, categorias, etc.

### Passo 3: Testar Frontend

Com o backend rodando, abra o frontend e teste:

1. **Cadastrar usuário** → Deve salvar no Neon
2. **Fazer login** → Deve autenticar via API
3. **Adicionar ao carrinho** → Deve salvar no Neon
4. **Finalizar pedido** → Deve salvar no Neon
5. **Ver "Meus Pedidos"** → Deve buscar do Neon

---

## 🔧 Comandos Úteis

### Iniciar Servidor Backend
```bash
cd backend
python manage.py runserver
```

### Criar Migrações
```bash
python manage.py makemigrations
```

### Aplicar Migrações
```bash
python manage.py migrate
```

### Criar Superusuário
```bash
python manage.py createsuperuser
```

### Ver Shell Interativo
```bash
python manage.py shell
```

### Executar Testes
```bash
python manage.py test
```

---

## 🌐 Deploy para Produção

### Opção 1: Heroku (Recomendado)

```bash
# Criar app
heroku create sweet-cupcakes-api

# Adicionar variáveis de ambiente
heroku config:set DATABASE_URL="postgresql://neondb_owner:npg_buM6as2wJdCo@ep-purple-heart-ahqa7n2h-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
heroku config:set SECRET_KEY="sua-secret-key-aqui"
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=".herokuapp.com"

# Deploy
git push heroku main

# Aplicar migrações
heroku run python manage.py migrate

# Criar superusuário
heroku run python manage.py createsuperuser
```

### Opção 2: Railway

1. Conectar repositório no Railway
2. Adicionar variáveis de ambiente (mesmas acima)
3. Deploy automático

### Opção 3: Vercel (Serverless)

Vercel funciona melhor para frontend. Para backend, use Heroku ou Railway.

---

## 📱 Configurar Frontend

### Atualizar URL da API

Edite `frontend/api.js` (linha 7):

```javascript
const API = {
    baseURL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8000/api'
        : 'https://sweet-cupcakes-api.herokuapp.com/api',  // ⬅️ Sua URL do Heroku
    // ...
};
```

### Configurar CORS

No backend, edite `config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://sweet-cupcakes.vercel.app",  # Seu domínio Vercel
    "http://localhost:3000",
    "http://localhost:5173",
]
```

---

## 🔍 Troubleshooting

### Erro: "No module named 'dj_database_url'"

```bash
pip install dj-database-url
```

### Erro: "No module named 'psycopg2'"

```bash
pip install psycopg2-binary
```

### Erro: "Can't connect to database"

Verifique:
1. DATABASE_URL está correto no `.env`
2. Firewall não está bloqueando
3. SSL está habilitado (`?sslmode=require`)

### Erro: "CORS blocked"

Adicione seu domínio frontend em `CORS_ALLOWED_ORIGINS` no `settings.py`

---

## 📊 Próximos Passos

### 1. Popular Banco com Dados

```bash
python manage.py shell
```

```python
from cupcakes_api.models import Categoria, Cupcake

# Criar categoria
cat = Categoria.objects.create(
    nome="Tradicionais",
    descricao="Sabores clássicos",
    ativo=True
)

# Criar cupcake
Cupcake.objects.create(
    nome="Cupcake de Morango",
    descricao="Delicioso cupcake com cobertura de morango",
    preco=8.50,
    categoria=cat,
    estoque=50,
    ativo=True,
    destaque=True
)
```

### 2. Testar Endpoints

No navegador ou Postman:

**Listar cupcakes:**
```
GET http://127.0.0.1:8000/api/cupcakes/
```

**Registrar usuário:**
```
POST http://127.0.0.1:8000/api/auth/registro/
{
    "nome": "Teste Usuario",
    "email": "teste@email.com",
    "telefone": "11999999999",
    "senha": "senha123",
    "confirmar_senha": "senha123"
}
```

**Login:**
```
POST http://127.0.0.1:8000/api/auth/login/
{
    "email": "teste@email.com",
    "senha": "senha123"
}
```

### 3. Deploy Backend

Siga o guia [API_CONFIG.md](./API_CONFIG.md) para fazer deploy do backend.

### 4. Conectar Frontend

Atualize URL da API no `frontend/api.js` e teste integração completa.

---

## ✅ Checklist

- [x] Banco Neon configurado
- [x] Django conectado ao Neon
- [x] Migrações aplicadas
- [x] Superusuário criado
- [x] Servidor rodando localmente
- [ ] Dados de teste adicionados
- [ ] Backend deployado (Heroku/Railway)
- [ ] Frontend conectado ao backend
- [ ] Testes end-to-end funcionando

---

## 🎉 Parabéns!

Seu Sweet Cupcakes agora está conectado a um banco de dados em nuvem (Neon)!

**Vantagens:**
- ✅ Dados persistentes na nuvem
- ✅ Acesso de qualquer lugar
- ✅ Sincronização entre dispositivos
- ✅ Backup automático
- ✅ Escalável

**Próximo passo:** Deploy do backend e integração completa!

---

**Documentação Completa:**
- [DEPLOY.md](./DEPLOY.md) - Deploy do frontend
- [API_CONFIG.md](./API_CONFIG.md) - Configuração da API
- [QUICKSTART.md](./QUICKSTART.md) - Guia rápido
