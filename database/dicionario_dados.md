# 📊 Dicionário de Dados - Sistema de Vendas de Cupcakes

## Visão Geral

Este documento descreve todas as tabelas, campos, tipos de dados, constraints e relacionamentos do banco de dados PostgreSQL do sistema de vendas de cupcakes "Sweet Cupcakes".

---

## 🗂️ Índice de Tabelas

1. [users](#1-users) - Usuários do sistema
2. [addresses](#2-addresses) - Endereços dos usuários
3. [categories](#3-categories) - Categorias de cupcakes
4. [cupcakes](#4-cupcakes) - Produtos (cupcakes)
5. [cupcake_categories](#5-cupcake_categories) - Relacionamento N:N entre cupcakes e categorias
6. [cupcake_images](#6-cupcake_images) - Imagens adicionais dos cupcakes
7. [coupons](#7-coupons) - Cupons de desconto
8. [coupon_usage](#8-coupon_usage) - Histórico de uso de cupons
9. [carts](#9-carts) - Carrinhos de compras
10. [cart_items](#10-cart_items) - Itens nos carrinhos
11. [orders](#11-orders) - Pedidos realizados
12. [order_items](#12-order_items) - Itens dos pedidos
13. [payments](#13-payments) - Pagamentos dos pedidos
14. [order_status_history](#14-order_status_history) - Histórico de status dos pedidos
15. [reviews](#15-reviews) - Avaliações dos cupcakes

---

## 1. users

**Descrição**: Armazena os dados dos usuários do sistema (clientes, funcionários e administradores).

| Campo                | Tipo         | Nulo     | Padrão             | Descrição                                       |
| -------------------- | ------------ | -------- | ------------------ | ----------------------------------------------- |
| `id`                 | UUID         | NOT NULL | uuid_generate_v4() | Identificador único do usuário (chave primária) |
| `nome`               | VARCHAR(200) | NOT NULL | -                  | Nome completo do usuário                        |
| `email`              | VARCHAR(255) | NOT NULL | -                  | Email do usuário (único, usado para login)      |
| `senha`              | VARCHAR(255) | NOT NULL | -                  | Senha criptografada (hash bcrypt)               |
| `telefone`           | VARCHAR(20)  | NULL     | -                  | Telefone de contato                             |
| `role`               | VARCHAR(20)  | NOT NULL | 'customer'         | Papel do usuário no sistema                     |
| `ativo`              | BOOLEAN      | NOT NULL | TRUE               | Status do usuário (ativo/inativo)               |
| `data_cadastro`      | TIMESTAMP    | NOT NULL | CURRENT_TIMESTAMP  | Data e hora do cadastro                         |
| `ultima_atualizacao` | TIMESTAMP    | NOT NULL | CURRENT_TIMESTAMP  | Data da última atualização do cadastro          |
| `ultimo_acesso`      | TIMESTAMP    | NULL     | -                  | Data e hora do último acesso ao sistema         |

### Constraints

- **PRIMARY KEY**: `id`
- **UNIQUE**: `email`
- **CHECK**: `role IN ('customer', 'admin', 'staff')`

### Índices

- `idx_users_email` em `email`
- `idx_users_role` em `role`
- `idx_users_ativo` em `ativo`

### Relacionamentos

- **1:N** com `addresses` (um usuário pode ter vários endereços)
- **1:1** com `carts` (um usuário tem um carrinho)
- **1:N** com `orders` (um usuário pode ter vários pedidos)
- **1:N** com `reviews` (um usuário pode fazer várias avaliações)

### Valores Possíveis para `role`

- `customer`: Cliente comum
- `admin`: Administrador do sistema
- `staff`: Funcionário

---

## 2. addresses

**Descrição**: Armazena os endereços de entrega e cobrança dos usuários.

| Campo                | Tipo          | Nulo     | Padrão             | Descrição                                        |
| -------------------- | ------------- | -------- | ------------------ | ------------------------------------------------ |
| `id`                 | UUID          | NOT NULL | uuid_generate_v4() | Identificador único do endereço (chave primária) |
| `user_id`            | UUID          | NOT NULL | -                  | Referência ao usuário proprietário               |
| `tipo`               | VARCHAR(20)   | NOT NULL | 'entrega'          | Tipo de endereço                                 |
| `rua`                | VARCHAR(300)  | NOT NULL | -                  | Nome da rua/logradouro                           |
| `numero`             | VARCHAR(20)   | NOT NULL | -                  | Número do endereço                               |
| `complemento`        | VARCHAR(100)  | NULL     | -                  | Complemento (apto, bloco, etc)                   |
| `bairro`             | VARCHAR(100)  | NOT NULL | -                  | Bairro                                           |
| `cidade`             | VARCHAR(100)  | NOT NULL | -                  | Cidade                                           |
| `estado`             | CHAR(2)       | NOT NULL | -                  | Estado (sigla de 2 caracteres)                   |
| `cep`                | VARCHAR(10)   | NOT NULL | -                  | CEP do endereço                                  |
| `lat`                | DECIMAL(10,8) | NULL     | -                  | Latitude (para cálculo de frete)                 |
| `lng`                | DECIMAL(11,8) | NULL     | -                  | Longitude (para cálculo de frete)                |
| `padrao`             | BOOLEAN       | NOT NULL | FALSE              | Indica se é o endereço padrão                    |
| `ativo`              | BOOLEAN       | NOT NULL | TRUE               | Status do endereço                               |
| `data_cadastro`      | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP  | Data de cadastro do endereço                     |
| `ultima_atualizacao` | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP  | Data da última atualização                       |

### Constraints

- **PRIMARY KEY**: `id`
- **FOREIGN KEY**: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- **CHECK**: `tipo IN ('entrega', 'cobranca', 'ambos')`

### Índices

- `idx_addresses_user_id` em `user_id`
- `idx_addresses_cep` em `cep`
- `idx_addresses_padrao` em `padrao`
- `idx_addresses_ativo` em `ativo`

### Relacionamentos

- **N:1** com `users` (muitos endereços pertencem a um usuário)
- **1:N** com `orders` (endereço pode ser usado em vários pedidos)

### Valores Possíveis para `tipo`

- `entrega`: Endereço de entrega
- `cobranca`: Endereço de cobrança
- `ambos`: Usado para entrega e cobrança

---

## 3. categories

**Descrição**: Categorias dos cupcakes (Chocolate, Frutas, Especiais, etc).

| Campo                | Tipo         | Nulo     | Padrão            | Descrição                                         |
| -------------------- | ------------ | -------- | ----------------- | ------------------------------------------------- |
| `id`                 | SERIAL       | NOT NULL | AUTO              | Identificador único da categoria (chave primária) |
| `nome`               | VARCHAR(100) | NOT NULL | -                 | Nome da categoria                                 |
| `slug`               | VARCHAR(100) | NOT NULL | -                 | Slug para URL amigável (único)                    |
| `descricao`          | TEXT         | NULL     | -                 | Descrição da categoria                            |
| `icone`              | VARCHAR(50)  | NULL     | -                 | Nome do ícone/emoji da categoria                  |
| `ordem`              | INTEGER      | NOT NULL | 0                 | Ordem de exibição                                 |
| `ativo`              | BOOLEAN      | NOT NULL | TRUE              | Status da categoria                               |
| `data_cadastro`      | TIMESTAMP    | NOT NULL | CURRENT_TIMESTAMP | Data de cadastro                                  |
| `ultima_atualizacao` | TIMESTAMP    | NOT NULL | CURRENT_TIMESTAMP | Data da última atualização                        |

### Constraints

- **PRIMARY KEY**: `id`
- **UNIQUE**: `nome`, `slug`

### Índices

- `idx_categories_slug` em `slug`
- `idx_categories_ativo` em `ativo`
- `idx_categories_ordem` em `ordem`

### Relacionamentos

- **N:M** com `cupcakes` através de `cupcake_categories`

### Exemplos de Categorias

- Chocolate (🍫)
- Frutas (🍓)
- Especiais (⭐)
- Veganos (🌱)
- Diet (🥗)

---

## 4. cupcakes

**Descrição**: Produtos (cupcakes) disponíveis para venda no sistema.

| Campo                | Tipo          | Nulo     | Padrão            | Descrição                                       |
| -------------------- | ------------- | -------- | ----------------- | ----------------------------------------------- |
| `id`                 | SERIAL        | NOT NULL | AUTO              | Identificador único do cupcake (chave primária) |
| `nome`               | VARCHAR(200)  | NOT NULL | -                 | Nome do cupcake                                 |
| `slug`               | VARCHAR(200)  | NOT NULL | -                 | Slug para URL amigável (único)                  |
| `descricao`          | TEXT          | NOT NULL | -                 | Descrição detalhada do cupcake                  |
| `ingredientes`       | TEXT          | NULL     | -                 | Lista de ingredientes                           |
| `preco`              | DECIMAL(10,2) | NOT NULL | -                 | Preço regular do cupcake                        |
| `preco_promocional`  | DECIMAL(10,2) | NULL     | -                 | Preço promocional (opcional)                    |
| `imagem_url`         | VARCHAR(500)  | NULL     | -                 | URL da imagem do cupcake                        |
| `imagem_principal`   | VARCHAR(500)  | NULL     | -                 | Caminho da imagem principal armazenada          |
| `estoque`            | INTEGER       | NOT NULL | 0                 | Quantidade disponível em estoque                |
| `peso_gramas`        | INTEGER       | NULL     | -                 | Peso do cupcake em gramas                       |
| `calorias`           | INTEGER       | NULL     | -                 | Quantidade de calorias                          |
| `destaque`           | BOOLEAN       | NOT NULL | FALSE             | Indica se está em destaque                      |
| `disponivel`         | BOOLEAN       | NOT NULL | TRUE              | Indica se está disponível para venda            |
| `ativo`              | BOOLEAN       | NOT NULL | TRUE              | Status do cupcake no sistema                    |
| `data_cadastro`      | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP | Data de cadastro                                |
| `ultima_atualizacao` | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP | Data da última atualização                      |

### Constraints

- **PRIMARY KEY**: `id`
- **UNIQUE**: `slug`
- **CHECK**: `preco >= 0`
- **CHECK**: `preco_promocional >= 0 AND preco_promocional < preco`
- **CHECK**: `estoque >= 0`

### Índices

- `idx_cupcakes_slug` em `slug`
- `idx_cupcakes_preco` em `preco`
- `idx_cupcakes_destaque` em `destaque`
- `idx_cupcakes_disponivel` em `disponivel`
- `idx_cupcakes_ativo` em `ativo`
- `idx_cupcakes_estoque` em `estoque`

### Relacionamentos

- **N:M** com `categories` através de `cupcake_categories`
- **1:N** com `cupcake_images` (um cupcake pode ter várias imagens)
- **1:N** com `cart_items` (pode estar em vários carrinhos)
- **1:N** com `order_items` (pode estar em vários pedidos)
- **1:N** com `reviews` (pode ter várias avaliações)

---

## 5. cupcake_categories

**Descrição**: Tabela de relacionamento N:N entre cupcakes e categorias.

| Campo         | Tipo    | Nulo     | Padrão | Descrição              |
| ------------- | ------- | -------- | ------ | ---------------------- |
| `cupcake_id`  | INTEGER | NOT NULL | -      | Referência ao cupcake  |
| `category_id` | INTEGER | NOT NULL | -      | Referência à categoria |

### Constraints

- **PRIMARY KEY**: Composta (`cupcake_id`, `category_id`)
- **FOREIGN KEY**: `cupcake_id` REFERENCES `cupcakes(id)` ON DELETE CASCADE
- **FOREIGN KEY**: `category_id` REFERENCES `categories(id)` ON DELETE CASCADE

### Índices

- `idx_cupcake_categories_cupcake` em `cupcake_id`
- `idx_cupcake_categories_category` em `category_id`

### Relacionamentos

- **N:1** com `cupcakes`
- **N:1** com `categories`

---

## 6. cupcake_images

**Descrição**: Imagens adicionais dos cupcakes (galeria de fotos).

| Campo         | Tipo         | Nulo     | Padrão            | Descrição                                      |
| ------------- | ------------ | -------- | ----------------- | ---------------------------------------------- |
| `id`          | SERIAL       | NOT NULL | AUTO              | Identificador único da imagem (chave primária) |
| `cupcake_id`  | INTEGER      | NOT NULL | -                 | Referência ao cupcake                          |
| `url`         | VARCHAR(500) | NOT NULL | -                 | URL da imagem                                  |
| `caminho`     | VARCHAR(500) | NULL     | -                 | Caminho da imagem no servidor                  |
| `ordem`       | INTEGER      | NOT NULL | 0                 | Ordem de exibição na galeria                   |
| `data_upload` | TIMESTAMP    | NOT NULL | CURRENT_TIMESTAMP | Data do upload da imagem                       |

### Constraints

- **PRIMARY KEY**: `id`
- **FOREIGN KEY**: `cupcake_id` REFERENCES `cupcakes(id)` ON DELETE CASCADE

### Índices

- `idx_cupcake_images_cupcake` em `cupcake_id`
- `idx_cupcake_images_ordem` em `ordem`

### Relacionamentos

- **N:1** com `cupcakes` (muitas imagens pertencem a um cupcake)

---

## 7. coupons

**Descrição**: Cupons de desconto disponíveis no sistema.

| Campo                 | Tipo          | Nulo     | Padrão            | Descrição                                     |
| --------------------- | ------------- | -------- | ----------------- | --------------------------------------------- |
| `id`                  | SERIAL        | NOT NULL | AUTO              | Identificador único do cupom (chave primária) |
| `codigo`              | VARCHAR(50)   | NOT NULL | -                 | Código do cupom (único)                       |
| `descricao`           | TEXT          | NULL     | -                 | Descrição do cupom                            |
| `tipo_desconto`       | VARCHAR(20)   | NOT NULL | -                 | Tipo de desconto (percentual ou fixo)         |
| `valor_desconto`      | DECIMAL(10,2) | NULL     | -                 | Valor fixo de desconto em reais               |
| `percentual_desconto` | DECIMAL(5,2)  | NULL     | -                 | Percentual de desconto (0-100)                |
| `valor_minimo_pedido` | DECIMAL(10,2) | NOT NULL | 0                 | Valor mínimo do pedido para usar              |
| `data_inicio`         | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP | Data de início da validade                    |
| `data_expiracao`      | TIMESTAMP     | NOT NULL | -                 | Data de expiração do cupom                    |
| `uso_maximo`          | INTEGER       | NOT NULL | 1                 | Número máximo de usos (total)                 |
| `uso_atual`           | INTEGER       | NOT NULL | 0                 | Número de vezes já usado                      |
| `uso_por_usuario`     | INTEGER       | NOT NULL | 1                 | Máximo de usos por usuário                    |
| `ativo`               | BOOLEAN       | NOT NULL | TRUE              | Status do cupom                               |
| `data_cadastro`       | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP | Data de cadastro                              |
| `ultima_atualizacao`  | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP | Data da última atualização                    |

### Constraints

- **PRIMARY KEY**: `id`
- **UNIQUE**: `codigo`
- **CHECK**: `tipo_desconto IN ('percentual', 'fixo')`
- **CHECK**: `valor_desconto >= 0`
- **CHECK**: `percentual_desconto >= 0 AND percentual_desconto <= 100`
- **CHECK**: `valor_minimo_pedido >= 0`
- **CHECK**: `uso_maximo > 0`
- **CHECK**: `uso_atual >= 0`
- **CHECK**: `uso_por_usuario > 0`
- **CHECK**: Validação de que `valor_desconto` ou `percentual_desconto` esteja preenchido conforme o tipo

### Índices

- `idx_coupons_codigo` em `codigo`
- `idx_coupons_ativo` em `ativo`
- `idx_coupons_data_expiracao` em `data_expiracao`
- `idx_coupons_validade` em (`data_inicio`, `data_expiracao`)

### Relacionamentos

- **1:N** com `coupon_usage` (histórico de usos)
- **1:N** com `orders` (usado em vários pedidos)

### Valores Possíveis para `tipo_desconto`

- `percentual`: Desconto em porcentagem
- `fixo`: Desconto em valor fixo (R$)

---

## 8. coupon_usage

**Descrição**: Histórico de uso de cupons por usuários.

| Campo       | Tipo      | Nulo     | Padrão            | Descrição                                        |
| ----------- | --------- | -------- | ----------------- | ------------------------------------------------ |
| `id`        | SERIAL    | NOT NULL | AUTO              | Identificador único do registro (chave primária) |
| `coupon_id` | INTEGER   | NOT NULL | -                 | Referência ao cupom usado                        |
| `user_id`   | UUID      | NOT NULL | -                 | Referência ao usuário que usou                   |
| `order_id`  | UUID      | NULL     | -                 | Referência ao pedido (se aplicado)               |
| `data_uso`  | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Data e hora do uso                               |

### Constraints

- **PRIMARY KEY**: `id`
- **FOREIGN KEY**: `coupon_id` REFERENCES `coupons(id)` ON DELETE CASCADE
- **FOREIGN KEY**: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

### Índices

- `idx_coupon_usage_coupon` em `coupon_id`
- `idx_coupon_usage_user` em `user_id`
- `idx_coupon_usage_order` em `order_id`

### Relacionamentos

- **N:1** com `coupons`
- **N:1** com `users`
- **N:1** com `orders` (opcional)

---

## 9. carts

**Descrição**: Carrinhos de compras dos usuários autenticados.

| Campo                | Tipo      | Nulo     | Padrão             | Descrição                                        |
| -------------------- | --------- | -------- | ------------------ | ------------------------------------------------ |
| `id`                 | UUID      | NOT NULL | uuid_generate_v4() | Identificador único do carrinho (chave primária) |
| `user_id`            | UUID      | NOT NULL | -                  | Referência ao usuário proprietário (único)       |
| `data_criacao`       | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP  | Data de criação do carrinho                      |
| `ultima_atualizacao` | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP  | Data da última atualização                       |

### Constraints

- **PRIMARY KEY**: `id`
- **UNIQUE**: `user_id` (um usuário tem apenas um carrinho)
- **FOREIGN KEY**: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

### Índices

- `idx_carts_user` em `user_id`
- `idx_carts_ultima_atualizacao` em `ultima_atualizacao`

### Relacionamentos

- **1:1** com `users` (cada usuário tem um carrinho)
- **1:N** com `cart_items` (um carrinho tem vários itens)

---

## 10. cart_items

**Descrição**: Itens individuais dentro dos carrinhos de compras.

| Campo                | Tipo          | Nulo     | Padrão            | Descrição                                    |
| -------------------- | ------------- | -------- | ----------------- | -------------------------------------------- |
| `id`                 | SERIAL        | NOT NULL | AUTO              | Identificador único do item (chave primária) |
| `cart_id`            | UUID          | NOT NULL | -                 | Referência ao carrinho                       |
| `cupcake_id`         | INTEGER       | NOT NULL | -                 | Referência ao cupcake                        |
| `quantidade`         | INTEGER       | NOT NULL | 1                 | Quantidade do item                           |
| `preco_unitario`     | DECIMAL(10,2) | NOT NULL | -                 | Preço unitário no momento da adição          |
| `data_adicao`        | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP | Data de adição ao carrinho                   |
| `ultima_atualizacao` | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP | Data da última atualização                   |

### Constraints

- **PRIMARY KEY**: `id`
- **UNIQUE**: (`cart_id`, `cupcake_id`) - Um cupcake aparece apenas uma vez por carrinho
- **FOREIGN KEY**: `cart_id` REFERENCES `carts(id)` ON DELETE CASCADE
- **FOREIGN KEY**: `cupcake_id` REFERENCES `cupcakes(id)` ON DELETE CASCADE
- **CHECK**: `quantidade > 0`
- **CHECK**: `preco_unitario >= 0`

### Índices

- `idx_cart_items_cart` em `cart_id`
- `idx_cart_items_cupcake` em `cupcake_id`

### Relacionamentos

- **N:1** com `carts`
- **N:1** com `cupcakes`

---

## 11. orders

**Descrição**: Pedidos realizados pelos usuários.

| Campo                  | Tipo          | Nulo     | Padrão             | Descrição                                      |
| ---------------------- | ------------- | -------- | ------------------ | ---------------------------------------------- |
| `id`                   | UUID          | NOT NULL | uuid_generate_v4() | Identificador único do pedido (chave primária) |
| `numero_pedido`        | VARCHAR(20)   | NOT NULL | -                  | Número do pedido (único, amigável)             |
| `user_id`              | UUID          | NOT NULL | -                  | Referência ao usuário que fez o pedido         |
| `status`               | VARCHAR(20)   | NOT NULL | 'pendente'         | Status atual do pedido                         |
| `tipo_entrega`         | VARCHAR(20)   | NOT NULL | -                  | Tipo de entrega (entrega ou retirada)          |
| `nome_cliente`         | VARCHAR(200)  | NOT NULL | -                  | Nome do cliente (snapshot)                     |
| `email_cliente`        | VARCHAR(255)  | NOT NULL | -                  | Email do cliente (snapshot)                    |
| `telefone_cliente`     | VARCHAR(20)   | NOT NULL | -                  | Telefone do cliente (snapshot)                 |
| `endereco_entrega_id`  | UUID          | NULL     | -                  | Referência ao endereço de entrega              |
| `endereco_rua`         | VARCHAR(300)  | NULL     | -                  | Rua (snapshot)                                 |
| `endereco_numero`      | VARCHAR(20)   | NULL     | -                  | Número (snapshot)                              |
| `endereco_complemento` | VARCHAR(100)  | NULL     | -                  | Complemento (snapshot)                         |
| `endereco_bairro`      | VARCHAR(100)  | NULL     | -                  | Bairro (snapshot)                              |
| `endereco_cidade`      | VARCHAR(100)  | NULL     | -                  | Cidade (snapshot)                              |
| `endereco_estado`      | CHAR(2)       | NULL     | -                  | Estado (snapshot)                              |
| `endereco_cep`         | VARCHAR(10)   | NULL     | -                  | CEP (snapshot)                                 |
| `subtotal`             | DECIMAL(10,2) | NOT NULL | -                  | Subtotal dos itens                             |
| `valor_desconto`       | DECIMAL(10,2) | NOT NULL | 0                  | Valor do desconto aplicado                     |
| `valor_frete`          | DECIMAL(10,2) | NOT NULL | 0                  | Valor do frete                                 |
| `total`                | DECIMAL(10,2) | NOT NULL | -                  | Valor total do pedido                          |
| `coupon_id`            | INTEGER       | NULL     | -                  | Referência ao cupom usado                      |
| `observacoes`          | TEXT          | NULL     | -                  | Observações do cliente                         |
| `data_pedido`          | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP  | Data de criação do pedido                      |
| `data_atualizacao`     | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP  | Data da última atualização                     |
| `data_entrega`         | TIMESTAMP     | NULL     | -                  | Data de entrega realizada                      |

### Constraints

- **PRIMARY KEY**: `id`
- **UNIQUE**: `numero_pedido`
- **FOREIGN KEY**: `user_id` REFERENCES `users(id)` ON DELETE RESTRICT
- **FOREIGN KEY**: `endereco_entrega_id` REFERENCES `addresses(id)` ON DELETE SET NULL
- **FOREIGN KEY**: `coupon_id` REFERENCES `coupons(id)` ON DELETE SET NULL
- **CHECK**: `status IN ('pendente', 'recebido', 'em_preparo', 'pronto', 'saiu_entrega', 'entregue', 'cancelado')`
- **CHECK**: `tipo_entrega IN ('entrega', 'retirada')`
- **CHECK**: `subtotal >= 0`, `valor_desconto >= 0`, `valor_frete >= 0`, `total >= 0`

### Índices

- `idx_orders_numero_pedido` em `numero_pedido`
- `idx_orders_user` em `user_id`
- `idx_orders_status` em `status`
- `idx_orders_data_pedido` em `data_pedido DESC`
- `idx_orders_tipo_entrega` em `tipo_entrega`

### Relacionamentos

- **N:1** com `users`
- **N:1** com `addresses` (opcional)
- **N:1** com `coupons` (opcional)
- **1:N** com `order_items`
- **1:1** com `payments`
- **1:N** com `order_status_history`

### Valores Possíveis para `status`

- `pendente`: Aguardando confirmação
- `recebido`: Pedido recebido/confirmado
- `em_preparo`: Em preparação
- `pronto`: Pronto para retirada/entrega
- `saiu_entrega`: Saiu para entrega
- `entregue`: Entregue ao cliente
- `cancelado`: Pedido cancelado

### Valores Possíveis para `tipo_entrega`

- `entrega`: Entrega no endereço
- `retirada`: Retirada na loja

---

## 12. order_items

**Descrição**: Itens individuais dos pedidos.

| Campo            | Tipo          | Nulo     | Padrão | Descrição                                    |
| ---------------- | ------------- | -------- | ------ | -------------------------------------------- |
| `id`             | SERIAL        | NOT NULL | AUTO   | Identificador único do item (chave primária) |
| `order_id`       | UUID          | NOT NULL | -      | Referência ao pedido                         |
| `cupcake_id`     | INTEGER       | NOT NULL | -      | Referência ao cupcake                        |
| `nome_cupcake`   | VARCHAR(200)  | NOT NULL | -      | Nome do cupcake (snapshot)                   |
| `quantidade`     | INTEGER       | NOT NULL | -      | Quantidade comprada                          |
| `preco_unitario` | DECIMAL(10,2) | NOT NULL | -      | Preço unitário no momento da compra          |
| `subtotal`       | DECIMAL(10,2) | NOT NULL | -      | Subtotal do item (quantidade × preço)        |

### Constraints

- **PRIMARY KEY**: `id`
- **FOREIGN KEY**: `order_id` REFERENCES `orders(id)` ON DELETE CASCADE
- **FOREIGN KEY**: `cupcake_id` REFERENCES `cupcakes(id)` ON DELETE RESTRICT
- **CHECK**: `quantidade > 0`
- **CHECK**: `preco_unitario >= 0`, `subtotal >= 0`

### Índices

- `idx_order_items_order` em `order_id`
- `idx_order_items_cupcake` em `cupcake_id`

### Relacionamentos

- **N:1** com `orders`
- **N:1** com `cupcakes`

---

## 13. payments

**Descrição**: Pagamentos associados aos pedidos.

| Campo                | Tipo          | Nulo     | Padrão             | Descrição                                         |
| -------------------- | ------------- | -------- | ------------------ | ------------------------------------------------- |
| `id`                 | UUID          | NOT NULL | uuid_generate_v4() | Identificador único do pagamento (chave primária) |
| `order_id`           | UUID          | NOT NULL | -                  | Referência ao pedido (único)                      |
| `metodo_pagamento`   | VARCHAR(20)   | NOT NULL | -                  | Método de pagamento utilizado                     |
| `status`             | VARCHAR(20)   | NOT NULL | 'pendente'         | Status do pagamento                               |
| `valor`              | DECIMAL(10,2) | NOT NULL | -                  | Valor do pagamento                                |
| `valor_pago`         | DECIMAL(10,2) | NULL     | -                  | Valor pago pelo cliente (para dinheiro)           |
| `troco`              | DECIMAL(10,2) | NULL     | -                  | Troco a ser devolvido                             |
| `transacao_id`       | VARCHAR(200)  | NULL     | -                  | ID da transação no gateway                        |
| `codigo_autorizacao` | VARCHAR(100)  | NULL     | -                  | Código de autorização                             |
| `gateway`            | VARCHAR(50)   | NULL     | -                  | Gateway de pagamento usado                        |
| `dados_transacao`    | JSONB         | NULL     | -                  | Dados completos da transação (JSON)               |
| `data_pagamento`     | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP  | Data de criação do pagamento                      |
| `data_confirmacao`   | TIMESTAMP     | NULL     | -                  | Data de confirmação do pagamento                  |
| `data_atualizacao`   | TIMESTAMP     | NOT NULL | CURRENT_TIMESTAMP  | Data da última atualização                        |

### Constraints

- **PRIMARY KEY**: `id`
- **UNIQUE**: `order_id` (um pedido tem um pagamento)
- **FOREIGN KEY**: `order_id` REFERENCES `orders(id)` ON DELETE CASCADE
- **CHECK**: `metodo_pagamento IN ('pix', 'credito', 'debito', 'dinheiro', 'boleto')`
- **CHECK**: `status IN ('pendente', 'processando', 'aprovado', 'recusado', 'cancelado', 'estornado')`
- **CHECK**: `valor >= 0`, `valor_pago >= 0`, `troco >= 0`

### Índices

- `idx_payments_order` em `order_id`
- `idx_payments_status` em `status`
- `idx_payments_metodo` em `metodo_pagamento`
- `idx_payments_transacao` em `transacao_id`
- `idx_payments_data_pagamento` em `data_pagamento DESC`

### Relacionamentos

- **1:1** com `orders`

### Valores Possíveis para `metodo_pagamento`

- `pix`: Pagamento via PIX
- `credito`: Cartão de crédito
- `debito`: Cartão de débito
- `dinheiro`: Dinheiro
- `boleto`: Boleto bancário

### Valores Possíveis para `status`

- `pendente`: Aguardando pagamento
- `processando`: Processando pagamento
- `aprovado`: Pagamento aprovado
- `recusado`: Pagamento recusado
- `cancelado`: Pagamento cancelado
- `estornado`: Pagamento estornado

---

## 14. order_status_history

**Descrição**: Histórico de alterações de status dos pedidos.

| Campo             | Tipo        | Nulo     | Padrão            | Descrição                                        |
| ----------------- | ----------- | -------- | ----------------- | ------------------------------------------------ |
| `id`              | SERIAL      | NOT NULL | AUTO              | Identificador único do registro (chave primária) |
| `order_id`        | UUID        | NOT NULL | -                 | Referência ao pedido                             |
| `status_anterior` | VARCHAR(20) | NULL     | -                 | Status anterior do pedido                        |
| `status_novo`     | VARCHAR(20) | NOT NULL | -                 | Novo status do pedido                            |
| `observacao`      | TEXT        | NULL     | -                 | Observação sobre a mudança                       |
| `alterado_por`    | UUID        | NULL     | -                 | Usuário que fez a alteração                      |
| `data_alteracao`  | TIMESTAMP   | NOT NULL | CURRENT_TIMESTAMP | Data e hora da alteração                         |

### Constraints

- **PRIMARY KEY**: `id`
- **FOREIGN KEY**: `order_id` REFERENCES `orders(id)` ON DELETE CASCADE
- **FOREIGN KEY**: `alterado_por` REFERENCES `users(id)` ON DELETE SET NULL

### Índices

- `idx_order_status_history_order` em `order_id`
- `idx_order_status_history_data` em `data_alteracao DESC`

### Relacionamentos

- **N:1** com `orders`
- **N:1** com `users` (quem alterou)

---

## 15. reviews

**Descrição**: Avaliações dos cupcakes feitas pelos clientes.

| Campo              | Tipo         | Nulo     | Padrão            | Descrição                                         |
| ------------------ | ------------ | -------- | ----------------- | ------------------------------------------------- |
| `id`               | SERIAL       | NOT NULL | AUTO              | Identificador único da avaliação (chave primária) |
| `cupcake_id`       | INTEGER      | NOT NULL | -                 | Referência ao cupcake avaliado                    |
| `user_id`          | UUID         | NOT NULL | -                 | Referência ao usuário que avaliou                 |
| `order_id`         | UUID         | NOT NULL | -                 | Referência ao pedido (valida compra)              |
| `nota`             | INTEGER      | NOT NULL | -                 | Nota de 1 a 5 estrelas                            |
| `titulo`           | VARCHAR(200) | NULL     | -                 | Título da avaliação                               |
| `comentario`       | TEXT         | NULL     | -                 | Comentário detalhado                              |
| `data_review`      | TIMESTAMP    | NOT NULL | CURRENT_TIMESTAMP | Data da avaliação                                 |
| `data_atualizacao` | TIMESTAMP    | NOT NULL | CURRENT_TIMESTAMP | Data da última atualização                        |

### Constraints

- **PRIMARY KEY**: `id`
- **UNIQUE**: (`cupcake_id`, `user_id`, `order_id`) - Uma avaliação por cupcake por pedido
- **FOREIGN KEY**: `cupcake_id` REFERENCES `cupcakes(id)` ON DELETE CASCADE
- **FOREIGN KEY**: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- **FOREIGN KEY**: `order_id` REFERENCES `orders(id)` ON DELETE CASCADE
- **CHECK**: `nota >= 1 AND nota <= 5`

### Índices

- `idx_reviews_cupcake` em `cupcake_id`
- `idx_reviews_user` em `user_id`
- `idx_reviews_nota` em `nota`
- `idx_reviews_data` em `data_review DESC`

### Relacionamentos

- **N:1** com `cupcakes`
- **N:1** com `users`
- **N:1** com `orders`

---

## 🔗 Diagrama de Relacionamentos (ER)

```
users (1) ──────< (N) addresses
users (1) ──────< (1) carts
users (1) ──────< (N) orders
users (1) ──────< (N) reviews
users (1) ──────< (N) coupon_usage

carts (1) ──────< (N) cart_items
cart_items (N) ──────> (1) cupcakes

orders (1) ──────< (N) order_items
orders (1) ──────< (1) payments
orders (1) ──────< (N) order_status_history
orders (N) ──────> (1) addresses [opcional]
orders (N) ──────> (1) coupons [opcional]

order_items (N) ──────> (1) cupcakes

cupcakes (N) ──────< (N) categories [via cupcake_categories]
cupcakes (1) ──────< (N) cupcake_images
cupcakes (1) ──────< (N) reviews

coupons (1) ──────< (N) coupon_usage

reviews (N) ──────> (1) cupcakes
reviews (N) ──────> (1) users
reviews (N) ──────> (1) orders
```

---

## 📝 Views Criadas

### v_cupcakes_completos

Listagem completa de cupcakes com categorias e avaliações agregadas.

**Campos**:
- Todos os campos de `cupcakes`
- `preco_final`: Preço promocional ou regular
- `categorias`: Lista de categorias (STRING_AGG)
- `media_avaliacoes`: Média das notas (AVG)
- `total_avaliacoes`: Total de avaliações (COUNT)

### v_estatisticas_pedidos

Estatísticas diárias de pedidos.

**Campos**:
- `data`: Data do pedido
- `total_pedidos`: Quantidade de pedidos
- `valor_total`: Soma dos valores
- `ticket_medio`: Ticket médio
- `clientes_unicos`: Quantidade de clientes únicos

---

## 🔐 Triggers Implementados

### update_updated_at_column()

Atualiza automaticamente o campo `ultima_atualizacao` em:
- `users`
- `addresses`
- `categories`
- `cupcakes`
- `coupons`
- `carts`
- `cart_items`
- `orders`
- `payments`

### log_order_status_change()

Registra automaticamente mudanças de status na tabela `order_status_history` sempre que o campo `status` de `orders` for alterado.

---

## 📦 Extensões PostgreSQL Utilizadas

1. **uuid-ossp**: Geração de UUIDs (v4)
2. **pgcrypto**: Funções criptográficas (opcional para hash de senhas)

---

## 🚀 Dados Iniciais (Seeds)

O script cria automaticamente:

### Categorias Padrão:
- Chocolate 🍫
- Frutas 🍓
- Especiais ⭐
- Veganos 🌱
- Diet 🥗

### Cupons de Exemplo:
- `BEMVINDO`: 10% de desconto (mínimo R$ 50)
- `DOCURA15`: 15% de desconto
- `VALE20`: R$ 20 de desconto (mínimo R$ 100)

---

## 📊 Estratégia de Normalização

O banco de dados segue as formas normais:

### 1NF (Primeira Forma Normal)
- Todos os campos são atômicos
- Não há grupos repetidos

### 2NF (Segunda Forma Normal)
- Todas as colunas não-chave dependem totalmente da chave primária
- Não há dependências parciais

### 3NF (Terceira Forma Normal)
- Não há dependências transitivas
- Cada coluna não-chave depende apenas da chave primária

### Desnormalização Controlada (Snapshots)

Alguns campos foram **intencionalmente desnormalizados** para garantir integridade histórica:

#### Em `orders`:
- `nome_cliente`, `email_cliente`, `telefone_cliente`: Preserva dados do cliente no momento do pedido
- `endereco_rua`, `endereco_numero`, etc: Preserva endereço mesmo se o usuário alterá-lo ou excluí-lo

#### Em `order_items`:
- `nome_cupcake`: Preserva o nome do produto mesmo se for alterado posteriormente

#### Em `cart_items` e `order_items`:
- `preco_unitario`: Preserva o preço no momento da adição/compra

Essa abordagem garante que:
1. Pedidos antigos mantenham os dados corretos
2. Alterações cadastrais não afetem histórico
3. Relatórios históricos sejam precisos

---

## 🔍 Índices e Performance

### Estratégia de Indexação:

1. **Índices em Chaves Estrangeiras**: Aceleram JOINs
2. **Índices em Campos de Busca**: email, slug, codigo
3. **Índices em Campos de Filtro**: status, ativo, disponivel
4. **Índices Compostos**: Para queries comuns (data_inicio, data_expiracao)

### Índices Únicos:
- Garantem integridade de dados
- Previnem duplicação (email, slug, codigo, numero_pedido)

---

## 🛡️ Constraints e Validações

### Check Constraints:
- **Valores Monetários**: Sempre >= 0
- **Quantidades**: Sempre > 0
- **Percentuais**: Entre 0 e 100
- **Enums**: Valores permitidos para status, roles, tipos
- **Lógica de Negócio**: Preço promocional < preço regular

### Foreign Keys:
- **ON DELETE CASCADE**: Para dados dependentes (itens de carrinho, imagens)
- **ON DELETE RESTRICT**: Para dados críticos (cupcakes em pedidos)
- **ON DELETE SET NULL**: Para referências opcionais (endereço, cupom)

---

## 📈 Recomendações de Uso

### Backup:
```sql
pg_dump -U usuario -d sweet_cupcakes > backup.sql
```

### Restore:
```sql
psql -U usuario -d sweet_cupcakes < backup.sql
```

### Manutenção:
```sql
-- Analisar e atualizar estatísticas
ANALYZE;

-- Limpar espaço não utilizado
VACUUM;

-- Reindexar tabelas
REINDEX DATABASE sweet_cupcakes;
```

---

## 📞 Observações Finais

- **UUID**: Usado para entidades principais (users, carts, orders, payments) para maior segurança
- **SERIAL**: Usado para entidades secundárias (itens, categorias) para melhor performance
- **JSONB**: Campo `dados_transacao` permite flexibilidade para diferentes gateways de pagamento
- **Timestamps**: Todos em UTC (CURRENT_TIMESTAMP)
- **Soft Delete**: Campos `ativo` permitem exclusão lógica

---

**Versão**: 1.0  
**Data**: 2025  
**Banco**: PostgreSQL 12+  
**Autor**: Sistema Sweet Cupcakes
