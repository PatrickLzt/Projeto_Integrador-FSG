# 🚀 Guia de Deploy - Sweet Cupcakes na Vercel

![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)
![Status](https://img.shields.io/badge/status-production-brightgreen)

Guia completo para fazer deploy do projeto Sweet Cupcakes na Vercel.

---

## 📋 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Preparação do Projeto](#-preparação-do-projeto)
3. [Deploy via Vercel CLI](#-deploy-via-vercel-cli)
4. [Deploy via Vercel Dashboard](#-deploy-via-vercel-dashboard)
5. [Deploy via GitHub](#-deploy-via-github)
6. [Configuração de Variáveis de Ambiente](#-configuração-de-variáveis-de-ambiente)
7. [Domínio Customizado](#-domínio-customizado)
8. [Troubleshooting](#-troubleshooting)
9. [Manutenção e Atualizações](#-manutenção-e-atualizações)

---

## ✅ Pré-requisitos

### 1. Conta na Vercel
- Criar conta gratuita em [vercel.com](https://vercel.com)
- Pode usar conta GitHub, GitLab ou Bitbucket
- Plano gratuito (Hobby) já é suficiente

### 2. Node.js e NPM
```bash
node --version  # v16+ recomendado
npm --version   # v8+ recomendado
```

### 3. Git
```bash
git --version
```

### 4. Projeto commitado no GitHub (recomendado)
```bash
git add .
git commit -m "Preparar projeto para deploy"
git push origin main
```

---

## 🔧 Preparação do Projeto

### Arquivos já criados:

✅ `vercel.json` - Configuração do deploy  
✅ `.vercelignore` - Arquivos a ignorar  
✅ `frontend/config.js` - Configurações da API  
✅ `frontend/.env.example` - Exemplo de variáveis  

### Estrutura final:

```
Projeto_Integrador-FSG/
├── frontend/                  # ← Será deployado na Vercel
│   ├── index.html
│   ├── cardapio.html
│   ├── carrinho.html
│   ├── checkout.html
│   ├── style.css
│   ├── script.js
│   ├── config.js
│   └── .env.example
├── backend/                   # ← Deploy separado (Heroku, Railway, etc)
├── database/
├── vercel.json               # ← Configuração Vercel
├── .vercelignore
└── README.md
```

---

## 🚀 Deploy via Vercel CLI

### Método 1: Deploy Rápido (mais fácil)

#### 1. Instalar Vercel CLI

```powershell
npm install -g vercel
```

#### 2. Fazer login

```powershell
vercel login
```

Escolha o método de autenticação (GitHub, Email, etc).

#### 3. Navegar até o projeto

```powershell
cd C:\Users\patri\Documents\Projeto_Integrador-FSG
```

#### 4. Executar deploy

```powershell
vercel
```

Responda as perguntas:
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Selecione sua conta
- **Link to existing project?** → `N` (No)
- **What's your project's name?** → `sweet-cupcakes` (ou outro nome)
- **In which directory is your code located?** → `./` (deixe padrão ou `.`)
- **Want to override the settings?** → `N` (No, já temos `vercel.json`)

#### 5. Deploy para produção

```powershell
vercel --prod
```

✅ **Pronto!** Sua aplicação estará online!

---

## 🌐 Deploy via Vercel Dashboard

### Método 2: Interface Gráfica (recomendado para iniciantes)

#### 1. Acesse [vercel.com/new](https://vercel.com/new)

#### 2. Importe seu repositório GitHub

- Clique em **"Import Git Repository"**
- Conecte sua conta GitHub (se ainda não conectou)
- Selecione `PatrickLzt/Projeto_Integrador-FSG`

#### 3. Configure o projeto

**Nome do Projeto:**
```
sweet-cupcakes
```

**Framework Preset:**
```
Other
```

**Root Directory:**
```
./
```

**Build Settings:**
- **Build Command:** (deixe em branco)
- **Output Directory:** `frontend`
- **Install Command:** (deixe em branco)

#### 4. Variáveis de Ambiente (opcional)

Adicione se necessário:
```
API_URL=https://seu-backend.herokuapp.com/api
```

#### 5. Clique em "Deploy"

Aguarde ~1-2 minutos.

✅ **Deploy concluído!** Você receberá uma URL: `https://sweet-cupcakes.vercel.app`

---

## 🔗 Deploy via GitHub (Deploy Automático)

### Método 3: CI/CD Automático (recomendado para projetos em produção)

#### 1. Conectar repositório GitHub

No dashboard da Vercel:
- Vá em **"Import Project"**
- Selecione seu repositório

#### 2. Configurar Deploy Automático

A Vercel criará automaticamente:
- ✅ Deploy em **cada push** para `main` → Produção
- ✅ Deploy em **cada PR** → Preview
- ✅ Deploy em **cada branch** → Development

#### 3. Arquivo de configuração já existe

O `vercel.json` já define todas as configurações:

```json
{
  "version": 2,
  "name": "sweet-cupcakes",
  "builds": [
    {
      "src": "frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

#### 4. Push para atualizar

```bash
git add .
git commit -m "Nova feature"
git push origin main
```

✅ **Deploy automático!** Em 1-2 minutos estará online.

---

## 🔐 Configuração de Variáveis de Ambiente

### No Vercel Dashboard

1. Vá para **Settings** → **Environment Variables**

2. Adicione as variáveis:

| Key       | Value                                   | Environments        |
| --------- | --------------------------------------- | ------------------- |
| `API_URL` | `https://seu-backend.herokuapp.com/api` | Production, Preview |

3. Clique em **"Save"**

4. **Redeploy** o projeto:
   - Vá em **Deployments**
   - Clique nos 3 pontos do último deploy
   - **"Redeploy"**

### Via Vercel CLI

```powershell
# Adicionar variável
vercel env add API_URL

# Escolha o ambiente: Production, Preview, Development
# Cole o valor da variável
```

### Usar no código

```javascript
// config.js ou script.js
const API_URL = process.env.API_URL || 'http://localhost:8000/api';
```

---

## 🌐 Domínio Customizado

### Adicionar domínio próprio

#### 1. No Vercel Dashboard

- Vá em **Settings** → **Domains**
- Clique em **"Add"**
- Digite seu domínio: `sweetcupcakes.com`

#### 2. Configurar DNS

A Vercel mostrará as configurações DNS:

**Opção A: Domínio raiz (sweetcupcakes.com)**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Opção B: Subdomínio (www.sweetcupcakes.com)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 3. Aguardar propagação

- DNS pode levar até 24-48 horas
- Geralmente propaga em minutos

#### 4. SSL Automático

✅ Vercel configura HTTPS automaticamente!

---

## 🐛 Troubleshooting

### Problema 1: Página 404

**Sintoma:** Todas as rotas mostram 404

**Causa:** `vercel.json` mal configurado

**Solução:**
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    },
    {
      "src": "/",
      "dest": "/frontend/index.html"
    }
  ]
}
```

---

### Problema 2: CSS/JS não carregam

**Sintoma:** Página carrega mas sem estilos

**Causa:** Caminhos relativos incorretos

**Solução:** Verificar caminhos nos HTML:

```html
<!-- ❌ Errado -->
<link rel="stylesheet" href="/style.css">

<!-- ✅ Correto -->
<link rel="stylesheet" href="./style.css">
```

---

### Problema 3: API não conecta

**Sintoma:** Requests falham com CORS error

**Causa:** Backend não configurado para aceitar origem Vercel

**Solução no Django:**

```python
# backend/config/settings.py
CORS_ALLOWED_ORIGINS = [
    "https://sweet-cupcakes.vercel.app",
    "https://www.sweetcupcakes.com",
    "http://localhost:3000",  # Desenvolvimento
]
```

---

### Problema 4: Deploy falha

**Sintoma:** Build error na Vercel

**Causa:** Arquivos desnecessários ou estrutura incorreta

**Solução:** Verificar `.vercelignore`:

```
node_modules/
venv/
__pycache__/
*.pyc
.env
```

---

### Problema 5: localStorage não funciona

**Sintoma:** Carrinho não persiste

**Causa:** Navegador bloqueia localStorage em alguns casos

**Solução:** Já funciona! Mas adicione fallback:

```javascript
function saveCart(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Erro ao salvar carrinho:', e);
        // Fallback: usar cookie ou sessionStorage
    }
}
```

---

### Problema 6: Deploy lento

**Sintoma:** Build demora mais de 5 minutos

**Causa:** Muitos arquivos grandes

**Solução:**
1. Verificar `.vercelignore`
2. Remover arquivos desnecessários
3. Otimizar imagens

---

## 🔄 Manutenção e Atualizações

### Atualizar o site

#### Via Git (deploy automático):

```bash
# Fazer alterações no código
git add .
git commit -m "Atualização: novo layout"
git push origin main

# Deploy automático acontece em 1-2 min
```

#### Via Vercel CLI:

```powershell
# Deploy direto
vercel --prod
```

### Rollback (voltar versão anterior)

1. Vá em **Deployments**
2. Encontre o deploy desejado
3. Clique nos 3 pontos → **"Promote to Production"**

### Ver logs

```powershell
# Ver logs do deploy
vercel logs sweet-cupcakes

# Ver logs em tempo real
vercel logs sweet-cupcakes --follow
```

### Remover projeto

```powershell
vercel remove sweet-cupcakes
```

Ou via Dashboard: **Settings** → **Advanced** → **Delete Project**

---

## 📊 Monitoramento

### Analytics (opcional)

A Vercel oferece analytics gratuito:

1. Vá em **Analytics**
2. Veja métricas:
   - Visitantes
   - Page views
   - Top pages
   - Devices
   - Locations

### Speed Insights

Métricas de performance:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

---

## 🎯 Checklist de Deploy

### Antes do deploy:

```
[ ] Código testado localmente
[ ] Testes Cypress passando
[ ] vercel.json configurado
[ ] .vercelignore atualizado
[ ] Variáveis de ambiente definidas
[ ] Backend deployado (se aplicável)
[ ] CORS configurado no backend
[ ] Imagens otimizadas
[ ] README atualizado
[ ] Git commitado e pushed
```

### Durante o deploy:

```
[ ] Build completou com sucesso
[ ] Nenhum erro no log
[ ] Preview URL funcionando
[ ] Rotas testadas
[ ] CSS/JS carregando
[ ] Imagens carregando
[ ] LocalStorage funcionando
```

### Após o deploy:

```
[ ] Site acessível via URL
[ ] Todas as páginas funcionam
[ ] Formulários funcionam
[ ] Carrinho persiste
[ ] Checkout funciona
[ ] Mobile responsivo
[ ] Desktop responsivo
[ ] HTTPS ativo (cadeado verde)
[ ] Performance aceitável (< 3s)
[ ] SEO básico ok
```

---

## 🚀 URLs Importantes

Após o deploy, você terá:

### Produção:
```
https://sweet-cupcakes.vercel.app
```

### Preview (branches):
```
https://sweet-cupcakes-git-feature-sua-feature.vercel.app
```

### Dashboard:
```
https://vercel.com/PatrickLzt/sweet-cupcakes
```

---

## 📚 Recursos Adicionais

### Documentação Oficial:
- 📖 [Vercel Docs](https://vercel.com/docs)
- 🚀 [Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)
- 🔧 [CLI Reference](https://vercel.com/docs/cli)

### Tutoriais:
- 🎥 [Vercel YouTube Channel](https://www.youtube.com/c/VercelHQ)
- 📝 [Deploy Static Sites](https://vercel.com/guides)

### Suporte:
- 💬 [Vercel Community](https://github.com/vercel/vercel/discussions)
- 🐛 [Report Issues](https://github.com/vercel/vercel/issues)

---

## 🎉 Deploy do Backend (Complementar)

O front-end está na Vercel, mas o **backend Django** precisa ser deployado separadamente:

### Opções para o backend:

#### 1. **Heroku** (recomendado)
```bash
# Ver guia em: README.md seção "Deploy"
heroku create sweet-cupcakes-api
git push heroku main
```

#### 2. **Railway**
```bash
# Deploy via dashboard: railway.app
```

#### 3. **Render**
```bash
# Deploy via dashboard: render.com
```

#### 4. **PythonAnywhere**
```bash
# Upload via FTP e configure WSGI
```

Depois de deployar o backend, atualize a variável de ambiente na Vercel:

```
API_URL=https://sweet-cupcakes-api.herokuapp.com/api
```

---

## 💡 Dicas Pro

### 1. Use Preview Deployments

Teste mudanças antes de ir para produção:

```bash
git checkout -b nova-feature
# Fazer alterações
git push origin nova-feature
# Vercel cria preview automático
```

### 2. Configure Redirects

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/cardapio",
      "destination": "/cardapio.html"
    }
  ]
}
```

### 3. Headers de Segurança

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### 4. Cache Control

```json
// vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 📈 Estatísticas

Após o deploy na Vercel:

```
⚡ Build Time:        ~30 segundos
🌍 Global CDN:        Edge Network
🔒 SSL:               Automático (Let's Encrypt)
📊 Analytics:         Incluído (grátis)
🚀 Deploy:            Instantâneo
💰 Custo:             $0 (plano Hobby)
```

---

## 🎯 Próximos Passos

Após o deploy:

1. ✅ **Testar site em produção**
2. ✅ **Configurar domínio customizado**
3. ✅ **Configurar analytics**
4. ✅ **Otimizar performance**
5. ✅ **Configurar SEO**
6. ✅ **Deploy do backend**
7. ✅ **Integrar front + back**
8. ✅ **Monitoramento contínuo**

---

<div align="center">

### 🚀 Seu Sweet Cupcakes está no ar! 🧁

**URL de Produção:** `https://sweet-cupcakes.vercel.app`

**[⬆ Voltar ao Topo](#-guia-de-deploy---sweet-cupcakes-na-vercel)**

</div>
