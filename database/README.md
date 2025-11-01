# 🗄️ Banco de Dados - Sweet Cupcakes

Projeto completo de banco de dados PostgreSQL para o sistema de vendas de cupcakes.

## 📋 Conteúdo

- **`schema.sql`**: Script SQL completo de criação do banco de dados
- **`dicionario_dados.md`**: Documentação detalhada de todas as tabelas e campos
- **`diagram_er.md`**: Diagrama de Entidade-Relacionamento visual

## 🚀 Como Usar

### 1. Instalação do PostgreSQL

Certifique-se de ter o PostgreSQL instalado (versão 12 ou superior):
```bash
# Windows
# Baixe o instalador em: https://www.postgresql.org/download/windows/

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
```

### 2. Criar o Banco de Dados

```bash
# Conectar ao PostgreSQL como usuário postgres
psql -U postgres

# Criar banco de dados
CREATE DATABASE sweet_cupcakes;

# Conectar ao banco criado
\c sweet_cupcakes
```

### 3. Executar o Script de Criação

```bash
# Opção 1: Através do psql
psql -U postgres -d sweet_cupcakes -f schema.sql

# Opção 2: Dentro do psql
\i /caminho/para/schema.sql
```

### 4. Verificar a Instalação

```sql
-- Listar todas as tabelas
\dt

-- Ver estrutura de uma tabela
\d users

-- Contar registros nas categorias
SELECT COUNT(*) FROM categories;
```

## 📊 Estrutura do Banco

### Tabelas Principais

| Tabela       | Descrição              | Registros  |
| ------------ | ---------------------- | ---------- |
| `users`      | Usuários do sistema    | Variável   |
| `addresses`  | Endereços de entrega   | Variável   |
| `categories` | Categorias de cupcakes | 5 (padrão) |
| `cupcakes`   | Produtos disponíveis   | Variável   |
| `carts`      | Carrinhos de compras   | Variável   |
| `orders`     | Pedidos realizados     | Variável   |
| `payments`   | Pagamentos             | Variável   |
| `coupons`    | Cupons de desconto     | 3 (padrão) |
| `reviews`    | Avaliações             | Variável   |

### Relacionamentos

```
users ──< addresses
users ──< carts ──< cart_items >── cupcakes
users ──< orders ──< order_items >── cupcakes
orders ──< payments
cupcakes >──< categories (N:N via cupcake_categories)
cupcakes ──< reviews
```

## 🔧 Configuração do Django

Para integrar com o back-end Django existente, atualize o arquivo `backend/config/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'sweet_cupcakes',
        'USER': 'seu_usuario',
        'PASSWORD': 'sua_senha',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Sincronizar Models Django com o Banco PostgreSQL

```bash
cd backend

# Instalar driver PostgreSQL
pip install psycopg2-binary

# Criar migrações baseadas nos models existentes
python manage.py makemigrations

# IMPORTANTE: Como o banco já existe, use --fake-initial
python manage.py migrate --fake-initial

# Criar superusuário
python manage.py createsuperuser
```

## 🌱 Dados Iniciais (Seeds)

O script `schema.sql` já inclui dados iniciais:

### Categorias Criadas:
- 🍫 Chocolate
- 🍓 Frutas
- ⭐ Especiais
- 🌱 Veganos
- 🥗 Diet

### Cupons Criados:
- `BEMVINDO`: 10% de desconto (mínimo R$ 50)
- `DOCURA15`: 15% de desconto
- `VALE20`: R$ 20 de desconto (mínimo R$ 100)

### Adicionar Cupcakes de Exemplo

```sql
INSERT INTO cupcakes (nome, slug, descricao, preco, estoque, destaque, disponivel, ativo) VALUES
('Red Velvet', 'red-velvet', 'Massa vermelha com cobertura de cream cheese', 8.50, 50, true, true, true),
('Chocolate Belga', 'chocolate-belga', 'Massa de chocolate com cobertura de chocolate belga', 9.00, 40, true, true, true),
('Morango', 'morango', 'Massa de baunilha com recheio de morango', 7.50, 60, false, true, true);

-- Associar às categorias
INSERT INTO cupcake_categories (cupcake_id, category_id) VALUES
(1, 3), -- Red Velvet -> Especiais
(2, 1), -- Chocolate Belga -> Chocolate
(3, 2); -- Morango -> Frutas
```

## 📈 Views Disponíveis

### v_cupcakes_completos
Lista cupcakes com categorias e avaliações:
```sql
SELECT * FROM v_cupcakes_completos;
```

### v_estatisticas_pedidos
Estatísticas diárias de vendas:
```sql
SELECT * FROM v_estatisticas_pedidos WHERE data >= CURRENT_DATE - INTERVAL '30 days';
```

## 🔐 Segurança

### Criar Usuário Específico para a Aplicação

```sql
-- Como usuário postgres
CREATE USER sweet_app WITH PASSWORD 'senha_segura';

-- Conceder permissões
GRANT ALL PRIVILEGES ON DATABASE sweet_cupcakes TO sweet_app;

-- Conectar ao banco
\c sweet_cupcakes

-- Conceder permissões nas tabelas
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sweet_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sweet_app;

-- Para futuras tabelas
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO sweet_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO sweet_app;
```

### Configuração de Variáveis de Ambiente

Crie um arquivo `.env` no diretório `backend/`:

```env
# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=sweet_cupcakes
DB_USER=sweet_app
DB_PASSWORD=senha_segura
DB_HOST=localhost
DB_PORT=5432
```

## 🧪 Testes e Validação

### Verificar Constraints

```sql
-- Testar inserção com valor inválido (deve falhar)
INSERT INTO cupcakes (nome, slug, descricao, preco, estoque) 
VALUES ('Teste', 'teste', 'Descrição', -10, 5);
-- ERROR: new row violates check constraint "cupcakes_preco_check"

-- Testar cupom com percentual inválido (deve falhar)
INSERT INTO coupons (codigo, tipo_desconto, percentual_desconto, data_expiracao) 
VALUES ('TESTE', 'percentual', 150, NOW() + INTERVAL '30 days');
-- ERROR: new row violates check constraint
```

### Testar Triggers

```sql
-- Criar um pedido
INSERT INTO orders (numero_pedido, user_id, status, tipo_entrega, nome_cliente, email_cliente, telefone_cliente, subtotal, total)
VALUES ('PED-001', 'user-uuid-aqui', 'pendente', 'entrega', 'João Silva', 'joao@email.com', '11999999999', 100.00, 100.00);

-- Atualizar status (deve criar registro em order_status_history)
UPDATE orders SET status = 'recebido' WHERE numero_pedido = 'PED-001';

-- Verificar histórico
SELECT * FROM order_status_history WHERE order_id = (SELECT id FROM orders WHERE numero_pedido = 'PED-001');
```

## 📊 Consultas Úteis

### Cupcakes Mais Vendidos

```sql
SELECT 
    c.nome,
    COUNT(oi.id) as total_vendas,
    SUM(oi.quantidade) as quantidade_total,
    SUM(oi.subtotal) as receita_total
FROM cupcakes c
JOIN order_items oi ON c.id = oi.cupcake_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status NOT IN ('cancelado')
GROUP BY c.id, c.nome
ORDER BY quantidade_total DESC
LIMIT 10;
```

### Clientes com Mais Pedidos

```sql
SELECT 
    u.nome,
    u.email,
    COUNT(o.id) as total_pedidos,
    SUM(o.total) as valor_total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status NOT IN ('cancelado')
GROUP BY u.id, u.nome, u.email
ORDER BY total_pedidos DESC
LIMIT 10;
```

### Cupons Mais Utilizados

```sql
SELECT 
    c.codigo,
    c.descricao,
    COUNT(cu.id) as total_usos,
    SUM(o.valor_desconto) as desconto_total
FROM coupons c
JOIN coupon_usage cu ON c.id = cu.coupon_id
LEFT JOIN orders o ON cu.order_id = o.id
GROUP BY c.id, c.codigo, c.descricao
ORDER BY total_usos DESC;
```

### Receita por Período

```sql
SELECT 
    DATE_TRUNC('month', o.data_pedido) as mes,
    COUNT(o.id) as total_pedidos,
    SUM(o.subtotal) as receita_bruta,
    SUM(o.valor_desconto) as descontos,
    SUM(o.total) as receita_liquida
FROM orders o
WHERE o.status NOT IN ('cancelado')
GROUP BY mes
ORDER BY mes DESC;
```

## 🔄 Backup e Restore

### Backup Completo

```bash
# Backup do banco completo
pg_dump -U sweet_app -d sweet_cupcakes -F c -f backup_$(date +%Y%m%d).dump

# Backup em SQL (texto)
pg_dump -U sweet_app -d sweet_cupcakes > backup_$(date +%Y%m%d).sql

# Backup apenas dos dados (sem estrutura)
pg_dump -U sweet_app -d sweet_cupcakes --data-only > dados_$(date +%Y%m%d).sql

# Backup apenas da estrutura (sem dados)
pg_dump -U sweet_app -d sweet_cupcakes --schema-only > estrutura.sql
```

### Restore

```bash
# Restore de backup em formato custom
pg_restore -U sweet_app -d sweet_cupcakes backup_20250101.dump

# Restore de backup SQL
psql -U sweet_app -d sweet_cupcakes < backup_20250101.sql
```

### Backup Automatizado (Linux/macOS)

Adicione ao crontab:
```bash
# Editar crontab
crontab -e

# Adicionar linha (backup diário às 2h da manhã)
0 2 * * * pg_dump -U sweet_app -d sweet_cupcakes -F c -f /caminho/backup/sweet_cupcakes_$(date +\%Y\%m\%d).dump
```

## 🛠️ Manutenção

### Análise e Otimização

```sql
-- Analisar todas as tabelas (atualiza estatísticas)
ANALYZE;

-- Limpar espaço não utilizado
VACUUM;

-- Limpar e analisar (mais completo)
VACUUM ANALYZE;

-- Reindexar banco completo
REINDEX DATABASE sweet_cupcakes;

-- Ver tamanho do banco
SELECT pg_size_pretty(pg_database_size('sweet_cupcakes'));

-- Ver tamanho das tabelas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Monitoramento de Performance

```sql
-- Queries mais lentas
SELECT 
    query,
    calls,
    total_time / 1000 as total_seconds,
    mean_time / 1000 as mean_seconds
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Tabelas com mais operações
SELECT 
    schemaname,
    relname,
    seq_scan,
    idx_scan,
    n_tup_ins,
    n_tup_upd,
    n_tup_del
FROM pg_stat_user_tables
ORDER BY seq_scan + idx_scan DESC;
```

## 📚 Documentação Adicional

- **Dicionário de Dados**: Veja `dicionario_dados.md` para documentação completa de cada tabela
- **Diagrama ER**: Veja `diagram_er.md` para o diagrama de relacionamentos
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

## ⚠️ Troubleshooting

### Erro: "role does not exist"
```bash
# Criar usuário
sudo -u postgres createuser sweet_app
```

### Erro: "database does not exist"
```bash
# Criar banco
sudo -u postgres createdb sweet_cupcakes
```

### Erro: "permission denied"
```sql
-- Conceder permissões
GRANT ALL PRIVILEGES ON DATABASE sweet_cupcakes TO sweet_app;
```

### Resetar Banco (CUIDADO: Apaga todos os dados)
```bash
# Dropar e recriar
psql -U postgres -c "DROP DATABASE sweet_cupcakes;"
psql -U postgres -c "CREATE DATABASE sweet_cupcakes;"
psql -U postgres -d sweet_cupcakes -f schema.sql
```

## 🎯 Próximos Passos

1. ✅ Criar banco de dados PostgreSQL
2. ✅ Executar script de criação
3. ✅ Verificar estrutura criada
4. 📝 Configurar Django para usar PostgreSQL
5. 📝 Executar migrações com `--fake-initial`
6. 📝 Adicionar dados de exemplo (cupcakes)
7. 📝 Testar integração front-end + back-end + banco
8. 📝 Implementar backup automatizado

## 📞 Suporte

Para dúvidas sobre o banco de dados:
- Consulte o arquivo `dicionario_dados.md`
- Verifique os comentários no `schema.sql`
- PostgreSQL Documentation: https://www.postgresql.org/docs/

---

**Versão do Banco**: 1.0  
**PostgreSQL Mínimo**: 12+  
**Compatível com**: Django 4.2+  
**Encoding**: UTF-8
