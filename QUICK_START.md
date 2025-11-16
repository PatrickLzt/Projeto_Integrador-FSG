# 🚀 Comandos Rápidos - Deploy Vercel

## 📦 Instalação Inicial

```powershell
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login
```

## 🎯 Deploy

```powershell
# Deploy de desenvolvimento/preview
vercel

# Deploy de produção
vercel --prod

# Ver logs em tempo real
vercel logs
```

## 🔧 Configuração Local

### 1. Criar arquivo .env no backend

```powershell
cd backend
copy .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```
SECRET_KEY=sua-chave-aqui
DEBUG=True
DATABASE_URL=postgresql://user:pass@host:5432/db
```

### 2. Gerar SECRET_KEY

```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## 🗄️ Configurar Banco de Dados

### Opção 1: Neon (Mais fácil)

1. Acesse [neon.tech](https://neon.tech)
2. Crie novo projeto
3. Copie a CONNECTION STRING
4. Adicione em Vercel: Settings > Environment Variables
   - Nome: `DATABASE_URL`
   - Valor: sua connection string

### Opção 2: Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Settings > Database > Connection string (URI)
4. Adicione em Vercel

## ⚙️ Variáveis de Ambiente na Vercel

No dashboard da Vercel, adicione:

```
SECRET_KEY=<sua-chave-gerada>
DEBUG=False
DATABASE_URL=<sua-url-do-postgres>
DJANGO_SETTINGS_MODULE=config.settings
```

## 🧪 Testar Localmente

```powershell
# Backend
cd backend
python manage.py runserver

# Abrir frontend
cd ../frontend
# Abra index.html no navegador ou use Live Server
```

## 📋 Checklist de Deploy

- [ ] Banco PostgreSQL criado
- [ ] SECRET_KEY gerada
- [ ] Variáveis configuradas na Vercel
- [ ] Código commitado no Git (se usar GitHub)
- [ ] Deploy realizado: `vercel --prod`

## 🔗 Links Úteis

- Dashboard Vercel: https://vercel.com/dashboard
- Logs: `vercel logs` ou dashboard
- Documentação: https://vercel.com/docs

## 🐛 Problemas Comuns

### Erro 500 na API
```powershell
# Ver logs detalhados
vercel logs --follow
```

### Migrations não rodaram
- Configure DATABASE_URL corretamente
- Rode migrations manualmente no banco de produção

### Frontend não encontra API
- Verifique `frontend/config.js`
- Confirme que as rotas em `vercel.json` estão corretas
