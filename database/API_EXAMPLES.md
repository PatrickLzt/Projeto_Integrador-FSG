# 🧪 Exemplos de Uso da API - Sweet Cupcakes

Coleção de exemplos práticos de requisições HTTP para testar a API após a integração com PostgreSQL.

## 📋 Pré-requisitos

- Servidor Django rodando: `python manage.py runserver`
- PostgreSQL configurado e conectado
- Dados de exemplo carregados (`seed_data.sql`)

---

## 🔐 1. Autenticação

### Registro de Novo Usuário

```bash
curl -X POST http://localhost:8000/api/auth/registro/ \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Carlos Souza",
    "email": "carlos@email.com",
    "telefone": "11999887766",
    "senha": "senha123",
    "confirmar_senha": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "user": {
    "id": "uuid-aqui",
    "nome": "Carlos Souza",
    "email": "carlos@email.com",
    "telefone": "11999887766",
    "role": "customer"
  },
  "token": "seu-token-aqui"
}
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@email.com",
    "senha": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "token": "seu-token-aqui",
  "user": {
    "id": "uuid-aqui",
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "role": "customer"
  }
}
```

### Logout

```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Authorization: Token seu-token-aqui"
```

---

## 🧁 2. Cupcakes

### Listar Todos os Cupcakes

```bash
curl http://localhost:8000/api/cupcakes/
```

### Buscar Cupcake por ID

```bash
curl http://localhost:8000/api/cupcakes/1/
```

### Filtrar Cupcakes por Categoria

```bash
curl "http://localhost:8000/api/cupcakes/?categoria=chocolate"
```

### Buscar por Nome

```bash
curl "http://localhost:8000/api/cupcakes/?search=red%20velvet"
```

### Listar Cupcakes em Destaque

```bash
curl http://localhost:8000/api/cupcakes/destaques/
```

### Listar Cupcakes Disponíveis

```bash
curl http://localhost:8000/api/cupcakes/disponiveis/
```

### Criar Novo Cupcake (Admin)

```bash
curl -X POST http://localhost:8000/api/cupcakes/ \
  -H "Authorization: Token seu-token-admin" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Nutella",
    "slug": "nutella",
    "descricao": "Cupcake recheado com Nutella",
    "preco": 10.00,
    "estoque": 30,
    "categorias": [1, 3],
    "destaque": true
  }'
```

### Atualizar Cupcake (Admin)

```bash
curl -X PATCH http://localhost:8000/api/cupcakes/1/ \
  -H "Authorization: Token seu-token-admin" \
  -H "Content-Type: application/json" \
  -d '{
    "preco": 9.00,
    "estoque": 45
  }'
```

### Deletar Cupcake (Admin)

```bash
curl -X DELETE http://localhost:8000/api/cupcakes/1/ \
  -H "Authorization: Token seu-token-admin"
```

---

## 📂 3. Categorias

### Listar Todas as Categorias

```bash
curl http://localhost:8000/api/categorias/
```

### Buscar Categoria por ID

```bash
curl http://localhost:8000/api/categorias/1/
```

### Criar Nova Categoria (Admin)

```bash
curl -X POST http://localhost:8000/api/categorias/ \
  -H "Authorization: Token seu-token-admin" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Sem Glúten",
    "slug": "sem-gluten",
    "descricao": "Opções sem glúten",
    "icone": "🌾",
    "ordem": 6
  }'
```

---

## 🛒 4. Carrinho

### Ver Meu Carrinho

```bash
curl http://localhost:8000/api/carrinho/ \
  -H "Authorization: Token seu-token"
```

### Adicionar Item ao Carrinho

```bash
curl -X POST http://localhost:8000/api/carrinho/adicionar_item/ \
  -H "Authorization: Token seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "cupcake_id": 1,
    "quantidade": 2
  }'
```

**Resposta esperada:**
```json
{
  "message": "Item adicionado ao carrinho",
  "carrinho": {
    "id": "uuid-carrinho",
    "itens": [
      {
        "id": 1,
        "cupcake": {
          "id": 1,
          "nome": "Red Velvet",
          "preco": 8.50
        },
        "quantidade": 2,
        "subtotal": 17.00
      }
    ],
    "total": 17.00
  }
}
```

### Atualizar Quantidade

```bash
curl -X PATCH http://localhost:8000/api/carrinho/atualizar_item/1/ \
  -H "Authorization: Token seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "quantidade": 3
  }'
```

### Remover Item do Carrinho

```bash
curl -X DELETE http://localhost:8000/api/carrinho/remover_item/1/ \
  -H "Authorization: Token seu-token"
```

### Limpar Carrinho

```bash
curl -X POST http://localhost:8000/api/carrinho/limpar/ \
  -H "Authorization: Token seu-token"
```

---

## 🎟️ 5. Cupons

### Validar Cupom

```bash
curl -X POST http://localhost:8000/api/cupons/validar/ \
  -H "Authorization: Token seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "BEMVINDO",
    "valor_pedido": 50.00
  }'
```

**Resposta esperada (cupom válido):**
```json
{
  "valido": true,
  "desconto": 5.00,
  "tipo": "percentual",
  "mensagem": "Cupom aplicado com sucesso! Desconto de 10%"
}
```

**Resposta esperada (cupom inválido):**
```json
{
  "valido": false,
  "desconto": 0,
  "mensagem": "Cupom expirado"
}
```

### Listar Cupons Ativos (Admin)

```bash
curl http://localhost:8000/api/cupons/ \
  -H "Authorization: Token seu-token-admin"
```

---

## 📦 6. Pedidos

### Criar Novo Pedido

```bash
curl -X POST http://localhost:8000/api/pedidos/criar/ \
  -H "Authorization: Token seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "tipo_entrega": "entrega",
    "endereco_id": "uuid-do-endereco",
    "cupom_codigo": "BEMVINDO",
    "observacoes": "Sem nozes, por favor",
    "metodo_pagamento": "pix"
  }'
```

**Resposta esperada:**
```json
{
  "id": "uuid-pedido",
  "numero_pedido": "PED-2025-0004",
  "status": "pendente",
  "tipo_entrega": "entrega",
  "itens": [
    {
      "cupcake": "Red Velvet",
      "quantidade": 2,
      "preco_unitario": 8.50,
      "subtotal": 17.00
    }
  ],
  "subtotal": 17.00,
  "valor_desconto": 1.70,
  "valor_frete": 10.00,
  "total": 25.30,
  "pagamento": {
    "metodo": "pix",
    "status": "pendente"
  }
}
```

### Listar Meus Pedidos

```bash
curl http://localhost:8000/api/pedidos/ \
  -H "Authorization: Token seu-token"
```

### Buscar Pedido Específico

```bash
curl http://localhost:8000/api/pedidos/uuid-do-pedido/ \
  -H "Authorization: Token seu-token"
```

### Buscar Pedido por Número

```bash
curl http://localhost:8000/api/pedidos/buscar_por_numero/?numero=PED-2025-0001 \
  -H "Authorization: Token seu-token"
```

### Atualizar Status do Pedido (Admin/Staff)

```bash
curl -X POST http://localhost:8000/api/pedidos/uuid-do-pedido/atualizar_status/ \
  -H "Authorization: Token seu-token-admin" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "em_preparo"
  }'
```

### Cancelar Pedido

```bash
curl -X POST http://localhost:8000/api/pedidos/uuid-do-pedido/cancelar/ \
  -H "Authorization: Token seu-token"
```

---

## 💳 7. Pagamentos

### Ver Pagamento do Pedido

```bash
curl http://localhost:8000/api/pagamentos/?pedido=uuid-do-pedido \
  -H "Authorization: Token seu-token"
```

### Processar Pagamento (Simular aprovação)

```bash
curl -X POST http://localhost:8000/api/pagamentos/uuid-do-pagamento/processar/ \
  -H "Authorization: Token seu-token-admin" \
  -H "Content-Type: application/json" \
  -d '{
    "transacao_id": "TXN123456",
    "codigo_autorizacao": "AUTH789"
  }'
```

### Aprovar Pagamento

```bash
curl -X POST http://localhost:8000/api/pagamentos/uuid-do-pagamento/aprovar/ \
  -H "Authorization: Token seu-token-admin"
```

---

## 🚚 8. Cálculo de Frete

### Calcular Frete

```bash
curl -X POST http://localhost:8000/api/pedidos/calcular_frete/ \
  -H "Authorization: Token seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "SP",
    "valor_pedido": 50.00
  }'
```

**Resposta esperada:**
```json
{
  "estado": "SP",
  "valor_frete": 10.00,
  "valor_minimo_frete_gratis": 100.00,
  "frete_gratis": false,
  "mensagem": "Frete para SP: R$ 10.00. Frete grátis acima de R$ 100.00"
}
```

---

## ⭐ 9. Avaliações

### Listar Avaliações de um Cupcake

```bash
curl http://localhost:8000/api/cupcakes/1/avaliacoes/
```

### Criar Avaliação

```bash
curl -X POST http://localhost:8000/api/avaliacoes/ \
  -H "Authorization: Token seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "cupcake_id": 1,
    "pedido_id": "uuid-do-pedido",
    "nota": 5,
    "titulo": "Maravilhoso!",
    "comentario": "O melhor cupcake que já comi!"
  }'
```

---

## 📊 10. Estatísticas (Admin)

### Dashboard de Vendas

```bash
curl http://localhost:8000/api/admin/dashboard/ \
  -H "Authorization: Token seu-token-admin"
```

**Resposta esperada:**
```json
{
  "periodo": "últimos 30 dias",
  "total_pedidos": 45,
  "receita_total": 2345.50,
  "ticket_medio": 52.12,
  "clientes_ativos": 23,
  "novos_clientes": 8,
  "produtos_mais_vendidos": [
    {"nome": "Red Velvet", "quantidade": 67},
    {"nome": "Chocolate Belga", "quantidade": 54}
  ]
}
```

### Relatório de Vendas por Período

```bash
curl "http://localhost:8000/api/admin/relatorio-vendas/?data_inicio=2025-01-01&data_fim=2025-01-31" \
  -H "Authorization: Token seu-token-admin"
```

---

## 🧪 Testes com Python (requests)

Crie um arquivo `test_api.py`:

```python
import requests

BASE_URL = "http://localhost:8000/api"

# 1. Registrar usuário
response = requests.post(f"{BASE_URL}/auth/registro/", json={
    "nome": "Teste User",
    "email": "teste@email.com",
    "telefone": "11999999999",
    "senha": "senha123",
    "confirmar_senha": "senha123"
})
print("Registro:", response.json())
token = response.json()['token']

# 2. Listar cupcakes
headers = {"Authorization": f"Token {token}"}
response = requests.get(f"{BASE_URL}/cupcakes/", headers=headers)
print("Cupcakes:", response.json())

# 3. Adicionar ao carrinho
response = requests.post(
    f"{BASE_URL}/carrinho/adicionar_item/",
    headers=headers,
    json={"cupcake_id": 1, "quantidade": 2}
)
print("Carrinho:", response.json())

# 4. Validar cupom
response = requests.post(
    f"{BASE_URL}/cupons/validar/",
    headers=headers,
    json={"codigo": "BEMVINDO", "valor_pedido": 50.00}
)
print("Cupom:", response.json())
```

Execute:
```bash
python test_api.py
```

---

## 🧪 Testes com Postman

### Importar Coleção

Crie um arquivo `Sweet_Cupcakes_API.postman_collection.json`:

```json
{
  "info": {
    "name": "Sweet Cupcakes API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Registro",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nome\": \"Teste User\",\n  \"email\": \"teste@email.com\",\n  \"senha\": \"senha123\",\n  \"confirmar_senha\": \"senha123\"\n}"
            },
            "url": {"raw": "{{base_url}}/auth/registro/"}
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"joao.silva@email.com\",\n  \"senha\": \"senha123\"\n}"
            },
            "url": {"raw": "{{base_url}}/auth/login/"}
          }
        }
      ]
    },
    {
      "name": "Cupcakes",
      "item": [
        {
          "name": "Listar Cupcakes",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Token {{token}}"}],
            "url": {"raw": "{{base_url}}/cupcakes/"}
          }
        }
      ]
    }
  ],
  "variable": [
    {"key": "base_url", "value": "http://localhost:8000/api"},
    {"key": "token", "value": "seu-token-aqui"}
  ]
}
```

Importe no Postman: `File > Import > Upload Files`

---

## 🐛 Troubleshooting

### Erro 401 Unauthorized
**Causa**: Token não enviado ou inválido  
**Solução**: Incluir header `Authorization: Token seu-token`

### Erro 403 Forbidden
**Causa**: Permissões insuficientes  
**Solução**: Verificar role do usuário (admin/staff/customer)

### Erro 404 Not Found
**Causa**: Endpoint ou recurso não existe  
**Solução**: Verificar URL e ID do recurso

### Erro 400 Bad Request
**Causa**: Dados inválidos  
**Solução**: Verificar formato JSON e campos obrigatórios

---

## 📚 Documentação Automática

### Swagger UI
```
http://localhost:8000/swagger/
```

### ReDoc
```
http://localhost:8000/redoc/
```

### Schema JSON
```
http://localhost:8000/swagger.json
```

---

**Bons testes! 🚀**
