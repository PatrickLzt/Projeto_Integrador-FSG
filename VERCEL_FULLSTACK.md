# 🚀 Deploy Backend + Frontend na Vercel

Este guia mostra como fazer deploy do Django backend e frontend estático juntos na Vercel.

## 📋 Estrutura do Deploy

- **Frontend**: Servido como arquivos estáticos
- **Backend**: API Django rodando em serverless functions
- **Rotas**: Configuradas para direcionar `/api/*` para o backend e o resto para o frontend

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente na Vercel

Configure estas variáveis no dashboard da Vercel (Settings > Environment Variables):

```bash
SECRET_KEY=sua-chave-secreta-aqui-gere-uma-nova
DEBUG=False
DATABASE_URL=sua-url-do-postgres-aqui
DJANGO_SETTINGS_MODULE=config.settings
```

**Importante**: Use um banco PostgreSQL (Neon, Supabase, Railway, etc.), pois SQLite não funciona bem em ambientes serverless.

### 2. Estrutura de Arquivos Criada

✅ `vercel.json` - Configuração de build e rotas  
✅ `backend/config/wsgi.py` - Atualizado para Vercel  
✅ `backend/vercel_build.py` - Script de build  
✅ `backend/build.sh` - Script alternativo de build  
✅ `backend/.env.example` - Exemplo de variáveis  

### 3. Como as Rotas Funcionam

```
/ ou /index.html          → frontend/index.html
/cardapio                 → frontend/cardapio.html
/api/*                    → Django backend
/admin/*                  → Django admin
/static/*                 → Arquivos estáticos Django
/*.html, *.css, *.js      → Arquivos do frontend
```

## 🚀 Deploy via Vercel CLI

### 1. Instalar Vercel CLI

```powershell
npm install -g vercel
```

### 2. Fazer Login

```powershell
vercel login
```

### 3. Deploy

```powershell
# Na raiz do projeto
vercel

# Para produção
vercel --prod
```

## 🌐 Deploy via GitHub

1. Conecte seu repositório no dashboard da Vercel
2. Configure as variáveis de ambiente
3. Deploy automático acontece a cada push

## ⚙️ Configuração do Banco de Dados

### Opção 1: Neon (Recomendado)

1. Crie conta em [neon.tech](https://neon.tech)
2. Crie novo projeto
3. Copie a `DATABASE_URL`
4. Adicione nas variáveis de ambiente da Vercel

### Opção 2: Supabase

1. Crie conta em [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Vá em Settings > Database
4. Copie a Connection String (URI mode)
5. Adicione nas variáveis de ambiente da Vercel

### Opção 3: Railway

1. Crie conta em [railway.app](https://railway.app)
2. Crie novo projeto PostgreSQL
3. Copie a `DATABASE_URL`
4. Adicione nas variáveis de ambiente da Vercel

## 🔐 Gerando SECRET_KEY Segura

Execute no Python:

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Ou no PowerShell:

```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## 📝 Atualizar Frontend Config

Atualize `frontend/config.js` para usar a URL de produção:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api'
    : '/api';  // Usa o mesmo domínio em produção
```

## ✅ Checklist de Deploy

- [ ] Banco PostgreSQL criado (Neon/Supabase/Railway)
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] SECRET_KEY gerada e configurada
- [ ] DEBUG=False em produção
- [ ] DATABASE_URL configurada
- [ ] `frontend/config.js` atualizado
- [ ] Código commitado no Git
- [ ] Deploy realizado

## 🔍 Verificar Deploy

Após o deploy:

1. Acesse seu domínio `.vercel.app`
2. Teste o frontend navegando pelas páginas
3. Teste a API: `https://seu-dominio.vercel.app/api/cupcakes/`
4. Teste o admin: `https://seu-dominio.vercel.app/admin/`

## 🐛 Troubleshooting

### Erro 500 na API

- Verifique as variáveis de ambiente
- Verifique os logs: `vercel logs`
- Confirme que DATABASE_URL está correta

### Erro CORS

- Verifique `settings.py` - CORS_ALLOWED_ORIGINS
- Confirme que o domínio Vercel está permitido

### Static Files não carregam

- Execute `python manage.py collectstatic`
- Verifique `STATIC_ROOT` em `settings.py`
- Confirme que Whitenoise está instalado

### Migrações não rodaram

- Execute manualmente: Configure um script de deploy
- Ou rode migrations localmente no banco de produção

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Django on Vercel](https://vercel.com/guides/deploying-django-with-vercel)
- [Neon Postgres](https://neon.tech/docs/introduction)

## 🎉 Pronto!

Seu projeto agora está rodando na Vercel com backend Django e frontend estático integrados!
