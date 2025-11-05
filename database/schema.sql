-- =====================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS
-- Sistema de Vendas de Cupcakes - Sweet Cupcakes
-- Banco: PostgreSQL
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELA: users
-- Descrição: Armazena dados dos usuários do sistema
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_ativo ON users(ativo);

-- Comentários da tabela users
COMMENT ON TABLE users IS 'Usuários do sistema (clientes, staff e administradores)';
COMMENT ON COLUMN users.id IS 'Identificador único do usuário (UUID)';
COMMENT ON COLUMN users.nome IS 'Nome completo do usuário';
COMMENT ON COLUMN users.email IS 'Email do usuário (único, usado para login)';
COMMENT ON COLUMN users.senha IS 'Senha criptografada (hash bcrypt)';
COMMENT ON COLUMN users.telefone IS 'Telefone de contato';
COMMENT ON COLUMN users.role IS 'Papel do usuário: customer (cliente), admin (administrador), staff (funcionário)';
COMMENT ON COLUMN users.ativo IS 'Status do usuário (TRUE = ativo, FALSE = inativo)';
COMMENT ON COLUMN users.data_cadastro IS 'Data e hora do cadastro';
COMMENT ON COLUMN users.ultima_atualizacao IS 'Data e hora da última atualização do cadastro';
COMMENT ON COLUMN users.ultimo_acesso IS 'Data e hora do último acesso ao sistema';

-- =====================================================
-- TABELA: addresses
-- Descrição: Endereços dos usuários
-- =====================================================
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'entrega' CHECK (tipo IN ('entrega', 'cobranca', 'ambos')),
    rua VARCHAR(300) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    padrao BOOLEAN NOT NULL DEFAULT FALSE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para addresses
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_cep ON addresses(cep);
CREATE INDEX idx_addresses_padrao ON addresses(padrao);
CREATE INDEX idx_addresses_ativo ON addresses(ativo);

-- Comentários da tabela addresses
COMMENT ON TABLE addresses IS 'Endereços de entrega e cobrança dos usuários';
COMMENT ON COLUMN addresses.id IS 'Identificador único do endereço (UUID)';
COMMENT ON COLUMN addresses.user_id IS 'Referência ao usuário proprietário do endereço';
COMMENT ON COLUMN addresses.tipo IS 'Tipo de endereço: entrega, cobranca ou ambos';
COMMENT ON COLUMN addresses.rua IS 'Nome da rua/logradouro';
COMMENT ON COLUMN addresses.numero IS 'Número do endereço';
COMMENT ON COLUMN addresses.complemento IS 'Complemento (apartamento, bloco, etc)';
COMMENT ON COLUMN addresses.bairro IS 'Bairro';
COMMENT ON COLUMN addresses.cidade IS 'Cidade';
COMMENT ON COLUMN addresses.estado IS 'Estado (sigla de 2 caracteres)';
COMMENT ON COLUMN addresses.cep IS 'CEP do endereço';
COMMENT ON COLUMN addresses.lat IS 'Latitude (para cálculo de frete/entrega)';
COMMENT ON COLUMN addresses.lng IS 'Longitude (para cálculo de frete/entrega)';
COMMENT ON COLUMN addresses.padrao IS 'Indica se é o endereço padrão do usuário';
COMMENT ON COLUMN addresses.ativo IS 'Status do endereço';

-- =====================================================
-- TABELA: categories
-- Descrição: Categorias de cupcakes
-- =====================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    icone VARCHAR(50),
    ordem INTEGER NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_ativo ON categories(ativo);
CREATE INDEX idx_categories_ordem ON categories(ordem);

-- Comentários da tabela categories
COMMENT ON TABLE categories IS 'Categorias de cupcakes (Chocolate, Frutas, Especiais, etc)';
COMMENT ON COLUMN categories.id IS 'Identificador único da categoria';
COMMENT ON COLUMN categories.nome IS 'Nome da categoria';
COMMENT ON COLUMN categories.slug IS 'Slug para URL amigável (único)';
COMMENT ON COLUMN categories.descricao IS 'Descrição da categoria';
COMMENT ON COLUMN categories.icone IS 'Nome do ícone/emoji da categoria';
COMMENT ON COLUMN categories.ordem IS 'Ordem de exibição';
COMMENT ON COLUMN categories.ativo IS 'Status da categoria';

-- =====================================================
-- TABELA: cupcakes
-- Descrição: Produtos (cupcakes) disponíveis
-- =====================================================
CREATE TABLE cupcakes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    ingredientes TEXT,
    preco DECIMAL(10, 2) NOT NULL CHECK (preco >= 0),
    preco_promocional DECIMAL(10, 2) CHECK (preco_promocional >= 0 AND preco_promocional < preco),
    imagem_url VARCHAR(500),
    imagem_principal VARCHAR(500),
    estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    peso_gramas INTEGER,
    calorias INTEGER,
    destaque BOOLEAN NOT NULL DEFAULT FALSE,
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para cupcakes
CREATE INDEX idx_cupcakes_slug ON cupcakes(slug);
CREATE INDEX idx_cupcakes_preco ON cupcakes(preco);
CREATE INDEX idx_cupcakes_destaque ON cupcakes(destaque);
CREATE INDEX idx_cupcakes_disponivel ON cupcakes(disponivel);
CREATE INDEX idx_cupcakes_ativo ON cupcakes(ativo);
CREATE INDEX idx_cupcakes_estoque ON cupcakes(estoque);

-- Comentários da tabela cupcakes
COMMENT ON TABLE cupcakes IS 'Produtos (cupcakes) disponíveis para venda';
COMMENT ON COLUMN cupcakes.id IS 'Identificador único do cupcake';
COMMENT ON COLUMN cupcakes.nome IS 'Nome do cupcake';
COMMENT ON COLUMN cupcakes.slug IS 'Slug para URL amigável (único)';
COMMENT ON COLUMN cupcakes.descricao IS 'Descrição detalhada do cupcake';
COMMENT ON COLUMN cupcakes.ingredientes IS 'Lista de ingredientes';
COMMENT ON COLUMN cupcakes.preco IS 'Preço regular do cupcake';
COMMENT ON COLUMN cupcakes.preco_promocional IS 'Preço promocional (opcional)';
COMMENT ON COLUMN cupcakes.imagem_url IS 'URL da imagem do cupcake';
COMMENT ON COLUMN cupcakes.imagem_principal IS 'Caminho da imagem principal armazenada';
COMMENT ON COLUMN cupcakes.estoque IS 'Quantidade disponível em estoque';
COMMENT ON COLUMN cupcakes.peso_gramas IS 'Peso do cupcake em gramas';
COMMENT ON COLUMN cupcakes.calorias IS 'Quantidade de calorias';
COMMENT ON COLUMN cupcakes.destaque IS 'Indica se o cupcake está em destaque';
COMMENT ON COLUMN cupcakes.disponivel IS 'Indica se está disponível para venda';
COMMENT ON COLUMN cupcakes.ativo IS 'Status do cupcake no sistema';

-- =====================================================
-- TABELA: cupcake_categories (Relacionamento N:N)
-- Descrição: Relaciona cupcakes com categorias
-- =====================================================
CREATE TABLE cupcake_categories (
    cupcake_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (cupcake_id, category_id),
    FOREIGN KEY (cupcake_id) REFERENCES cupcakes(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Índices para cupcake_categories
CREATE INDEX idx_cupcake_categories_cupcake ON cupcake_categories(cupcake_id);
CREATE INDEX idx_cupcake_categories_category ON cupcake_categories(category_id);

-- Comentários da tabela cupcake_categories
COMMENT ON TABLE cupcake_categories IS 'Relacionamento N:N entre cupcakes e categorias';
COMMENT ON COLUMN cupcake_categories.cupcake_id IS 'Referência ao cupcake';
COMMENT ON COLUMN cupcake_categories.category_id IS 'Referência à categoria';

-- =====================================================
-- TABELA: cupcake_images
-- Descrição: Imagens adicionais dos cupcakes
-- =====================================================
CREATE TABLE cupcake_images (
    id SERIAL PRIMARY KEY,
    cupcake_id INTEGER NOT NULL,
    url VARCHAR(500) NOT NULL,
    caminho VARCHAR(500),
    ordem INTEGER NOT NULL DEFAULT 0,
    data_upload TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cupcake_id) REFERENCES cupcakes(id) ON DELETE CASCADE
);

-- Índices para cupcake_images
CREATE INDEX idx_cupcake_images_cupcake ON cupcake_images(cupcake_id);
CREATE INDEX idx_cupcake_images_ordem ON cupcake_images(ordem);

-- Comentários da tabela cupcake_images
COMMENT ON TABLE cupcake_images IS 'Imagens adicionais dos cupcakes (galeria)';
COMMENT ON COLUMN cupcake_images.id IS 'Identificador único da imagem';
COMMENT ON COLUMN cupcake_images.cupcake_id IS 'Referência ao cupcake';
COMMENT ON COLUMN cupcake_images.url IS 'URL da imagem';
COMMENT ON COLUMN cupcake_images.caminho IS 'Caminho da imagem no servidor';
COMMENT ON COLUMN cupcake_images.ordem IS 'Ordem de exibição na galeria';

-- =====================================================
-- TABELA: coupons
-- Descrição: Cupons de desconto
-- =====================================================
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    tipo_desconto VARCHAR(20) NOT NULL CHECK (tipo_desconto IN ('percentual', 'fixo')),
    valor_desconto DECIMAL(10, 2) CHECK (valor_desconto >= 0),
    percentual_desconto DECIMAL(5, 2) CHECK (percentual_desconto >= 0 AND percentual_desconto <= 100),
    valor_minimo_pedido DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (valor_minimo_pedido >= 0),
    data_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP NOT NULL,
    uso_maximo INTEGER NOT NULL DEFAULT 1 CHECK (uso_maximo > 0),
    uso_atual INTEGER NOT NULL DEFAULT 0 CHECK (uso_atual >= 0),
    uso_por_usuario INTEGER NOT NULL DEFAULT 1 CHECK (uso_por_usuario > 0),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_desconto CHECK (
        (tipo_desconto = 'percentual' AND percentual_desconto IS NOT NULL) OR
        (tipo_desconto = 'fixo' AND valor_desconto IS NOT NULL)
    )
);

-- Índices para coupons
CREATE INDEX idx_coupons_codigo ON coupons(codigo);
CREATE INDEX idx_coupons_ativo ON coupons(ativo);
CREATE INDEX idx_coupons_data_expiracao ON coupons(data_expiracao);
CREATE INDEX idx_coupons_validade ON coupons(data_inicio, data_expiracao);

-- Comentários da tabela coupons
COMMENT ON TABLE coupons IS 'Cupons de desconto disponíveis';
COMMENT ON COLUMN coupons.id IS 'Identificador único do cupom';
COMMENT ON COLUMN coupons.codigo IS 'Código do cupom (único)';
COMMENT ON COLUMN coupons.descricao IS 'Descrição do cupom';
COMMENT ON COLUMN coupons.tipo_desconto IS 'Tipo: percentual ou fixo';
COMMENT ON COLUMN coupons.valor_desconto IS 'Valor fixo de desconto (em reais)';
COMMENT ON COLUMN coupons.percentual_desconto IS 'Percentual de desconto (0-100)';
COMMENT ON COLUMN coupons.valor_minimo_pedido IS 'Valor mínimo do pedido para usar o cupom';
COMMENT ON COLUMN coupons.data_inicio IS 'Data de início da validade';
COMMENT ON COLUMN coupons.data_expiracao IS 'Data de expiração do cupom';
COMMENT ON COLUMN coupons.uso_maximo IS 'Número máximo de usos do cupom (total)';
COMMENT ON COLUMN coupons.uso_atual IS 'Número de vezes que o cupom foi usado';
COMMENT ON COLUMN coupons.uso_por_usuario IS 'Número máximo de usos por usuário';
COMMENT ON COLUMN coupons.ativo IS 'Status do cupom';

-- =====================================================
-- TABELA: coupon_usage
-- Descrição: Histórico de uso de cupons por usuários
-- =====================================================
CREATE TABLE coupon_usage (
    id SERIAL PRIMARY KEY,
    coupon_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    order_id UUID,
    data_uso TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para coupon_usage
CREATE INDEX idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user ON coupon_usage(user_id);
CREATE INDEX idx_coupon_usage_order ON coupon_usage(order_id);

-- Comentários da tabela coupon_usage
COMMENT ON TABLE coupon_usage IS 'Histórico de uso de cupons por usuários';
COMMENT ON COLUMN coupon_usage.id IS 'Identificador único do registro';
COMMENT ON COLUMN coupon_usage.coupon_id IS 'Referência ao cupom usado';
COMMENT ON COLUMN coupon_usage.user_id IS 'Referência ao usuário que usou';
COMMENT ON COLUMN coupon_usage.order_id IS 'Referência ao pedido (se aplicado)';
COMMENT ON COLUMN coupon_usage.data_uso IS 'Data e hora do uso';

-- =====================================================
-- TABELA: carts
-- Descrição: Carrinhos de compras dos usuários
-- =====================================================
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para carts
CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_ultima_atualizacao ON carts(ultima_atualizacao);

-- Comentários da tabela carts
COMMENT ON TABLE carts IS 'Carrinhos de compras dos usuários';
COMMENT ON COLUMN carts.id IS 'Identificador único do carrinho (UUID)';
COMMENT ON COLUMN carts.user_id IS 'Referência ao usuário proprietário (único)';
COMMENT ON COLUMN carts.data_criacao IS 'Data de criação do carrinho';
COMMENT ON COLUMN carts.ultima_atualizacao IS 'Data da última atualização';

-- =====================================================
-- TABELA: cart_items
-- Descrição: Itens no carrinho de compras
-- =====================================================
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id UUID NOT NULL,
    cupcake_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1 CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL CHECK (preco_unitario >= 0),
    data_adicao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (cupcake_id) REFERENCES cupcakes(id) ON DELETE CASCADE,
    UNIQUE (cart_id, cupcake_id)
);

-- Índices para cart_items
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_cupcake ON cart_items(cupcake_id);

-- Comentários da tabela cart_items
COMMENT ON TABLE cart_items IS 'Itens individuais dentro dos carrinhos';
COMMENT ON COLUMN cart_items.id IS 'Identificador único do item';
COMMENT ON COLUMN cart_items.cart_id IS 'Referência ao carrinho';
COMMENT ON COLUMN cart_items.cupcake_id IS 'Referência ao cupcake';
COMMENT ON COLUMN cart_items.quantidade IS 'Quantidade do item';
COMMENT ON COLUMN cart_items.preco_unitario IS 'Preço unitário no momento da adição';
COMMENT ON COLUMN cart_items.data_adicao IS 'Data de adição ao carrinho';
COMMENT ON COLUMN cart_items.ultima_atualizacao IS 'Data da última atualização';

-- =====================================================
-- TABELA: orders
-- Descrição: Pedidos realizados
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_pedido VARCHAR(20) NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN (
        'pendente', 'recebido', 'em_preparo', 'pronto', 
        'saiu_entrega', 'entregue', 'cancelado'
    )),
    tipo_entrega VARCHAR(20) NOT NULL CHECK (tipo_entrega IN ('entrega', 'retirada')),
    
    -- Dados do cliente (snapshot)
    nome_cliente VARCHAR(200) NOT NULL,
    email_cliente VARCHAR(255) NOT NULL,
    telefone_cliente VARCHAR(20) NOT NULL,
    
    -- Endereço de entrega (snapshot)
    endereco_entrega_id UUID,
    endereco_rua VARCHAR(300),
    endereco_numero VARCHAR(20),
    endereco_complemento VARCHAR(100),
    endereco_bairro VARCHAR(100),
    endereco_cidade VARCHAR(100),
    endereco_estado CHAR(2),
    endereco_cep VARCHAR(10),
    
    -- Valores
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    valor_desconto DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (valor_desconto >= 0),
    valor_frete DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (valor_frete >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    
    -- Cupom utilizado
    coupon_id INTEGER,
    
    observacoes TEXT,
    data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_entrega TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (endereco_entrega_id) REFERENCES addresses(id) ON DELETE SET NULL,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
);

-- Índices para orders
CREATE INDEX idx_orders_numero_pedido ON orders(numero_pedido);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_data_pedido ON orders(data_pedido DESC);
CREATE INDEX idx_orders_tipo_entrega ON orders(tipo_entrega);

-- Comentários da tabela orders
COMMENT ON TABLE orders IS 'Pedidos realizados pelos usuários';
COMMENT ON COLUMN orders.id IS 'Identificador único do pedido (UUID)';
COMMENT ON COLUMN orders.numero_pedido IS 'Número do pedido (único, amigável)';
COMMENT ON COLUMN orders.user_id IS 'Referência ao usuário que fez o pedido';
COMMENT ON COLUMN orders.status IS 'Status atual do pedido';
COMMENT ON COLUMN orders.tipo_entrega IS 'Tipo: entrega ou retirada';
COMMENT ON COLUMN orders.nome_cliente IS 'Nome do cliente (snapshot)';
COMMENT ON COLUMN orders.email_cliente IS 'Email do cliente (snapshot)';
COMMENT ON COLUMN orders.telefone_cliente IS 'Telefone do cliente (snapshot)';
COMMENT ON COLUMN orders.endereco_entrega_id IS 'Referência ao endereço de entrega';
COMMENT ON COLUMN orders.subtotal IS 'Subtotal dos itens';
COMMENT ON COLUMN orders.valor_desconto IS 'Valor do desconto aplicado';
COMMENT ON COLUMN orders.valor_frete IS 'Valor do frete';
COMMENT ON COLUMN orders.total IS 'Valor total do pedido';
COMMENT ON COLUMN orders.coupon_id IS 'Referência ao cupom usado';
COMMENT ON COLUMN orders.data_pedido IS 'Data de criação do pedido';
COMMENT ON COLUMN orders.data_entrega IS 'Data de entrega realizada';

-- =====================================================
-- TABELA: order_items
-- Descrição: Itens dos pedidos
-- =====================================================
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL,
    cupcake_id INTEGER NOT NULL,
    nome_cupcake VARCHAR(200) NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL CHECK (preco_unitario >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (cupcake_id) REFERENCES cupcakes(id) ON DELETE RESTRICT
);

-- Índices para order_items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_cupcake ON order_items(cupcake_id);

-- Comentários da tabela order_items
COMMENT ON TABLE order_items IS 'Itens individuais dos pedidos';
COMMENT ON COLUMN order_items.id IS 'Identificador único do item';
COMMENT ON COLUMN order_items.order_id IS 'Referência ao pedido';
COMMENT ON COLUMN order_items.cupcake_id IS 'Referência ao cupcake';
COMMENT ON COLUMN order_items.nome_cupcake IS 'Nome do cupcake (snapshot)';
COMMENT ON COLUMN order_items.quantidade IS 'Quantidade comprada';
COMMENT ON COLUMN order_items.preco_unitario IS 'Preço unitário no momento da compra';
COMMENT ON COLUMN order_items.subtotal IS 'Subtotal do item (quantidade × preço)';

-- =====================================================
-- TABELA: payments
-- Descrição: Pagamentos dos pedidos
-- =====================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE,
    metodo_pagamento VARCHAR(20) NOT NULL CHECK (metodo_pagamento IN (
        'pix', 'credito', 'debito', 'dinheiro', 'boleto'
    )),
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN (
        'pendente', 'processando', 'aprovado', 'recusado', 'cancelado', 'estornado'
    )),
    valor DECIMAL(10, 2) NOT NULL CHECK (valor >= 0),
    
    -- Campos específicos para dinheiro
    valor_pago DECIMAL(10, 2) CHECK (valor_pago >= 0),
    troco DECIMAL(10, 2) CHECK (troco >= 0),
    
    -- Informações da transação
    transacao_id VARCHAR(200),
    codigo_autorizacao VARCHAR(100),
    gateway VARCHAR(50),
    dados_transacao JSONB,
    
    data_pagamento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_confirmacao TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Índices para payments
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_metodo ON payments(metodo_pagamento);
CREATE INDEX idx_payments_transacao ON payments(transacao_id);
CREATE INDEX idx_payments_data_pagamento ON payments(data_pagamento DESC);

-- Comentários da tabela payments
COMMENT ON TABLE payments IS 'Pagamentos associados aos pedidos';
COMMENT ON COLUMN payments.id IS 'Identificador único do pagamento (UUID)';
COMMENT ON COLUMN payments.order_id IS 'Referência ao pedido (único)';
COMMENT ON COLUMN payments.metodo_pagamento IS 'Método: pix, credito, debito, dinheiro, boleto';
COMMENT ON COLUMN payments.status IS 'Status do pagamento';
COMMENT ON COLUMN payments.valor IS 'Valor do pagamento';
COMMENT ON COLUMN payments.valor_pago IS 'Valor pago pelo cliente (para dinheiro)';
COMMENT ON COLUMN payments.troco IS 'Troco a ser devolvido';
COMMENT ON COLUMN payments.transacao_id IS 'ID da transação no gateway';
COMMENT ON COLUMN payments.codigo_autorizacao IS 'Código de autorização';
COMMENT ON COLUMN payments.gateway IS 'Gateway de pagamento usado';
COMMENT ON COLUMN payments.dados_transacao IS 'Dados completos da transação (JSON)';
COMMENT ON COLUMN payments.data_pagamento IS 'Data de criação do pagamento';
COMMENT ON COLUMN payments.data_confirmacao IS 'Data de confirmação do pagamento';

-- =====================================================
-- TABELA: order_status_history
-- Descrição: Histórico de mudanças de status dos pedidos
-- =====================================================
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL,
    status_anterior VARCHAR(20),
    status_novo VARCHAR(20) NOT NULL,
    observacao TEXT,
    alterado_por UUID,
    data_alteracao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (alterado_por) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para order_status_history
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_data ON order_status_history(data_alteracao DESC);

-- Comentários da tabela order_status_history
COMMENT ON TABLE order_status_history IS 'Histórico de alterações de status dos pedidos';
COMMENT ON COLUMN order_status_history.id IS 'Identificador único do registro';
COMMENT ON COLUMN order_status_history.order_id IS 'Referência ao pedido';
COMMENT ON COLUMN order_status_history.status_anterior IS 'Status anterior do pedido';
COMMENT ON COLUMN order_status_history.status_novo IS 'Novo status do pedido';
COMMENT ON COLUMN order_status_history.observacao IS 'Observação sobre a mudança';
COMMENT ON COLUMN order_status_history.alterado_por IS 'Usuário que fez a alteração';

-- =====================================================
-- TABELA: reviews
-- Descrição: Avaliações dos cupcakes
-- =====================================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    cupcake_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    order_id UUID NOT NULL,
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    titulo VARCHAR(200),
    comentario TEXT,
    data_review TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cupcake_id) REFERENCES cupcakes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    UNIQUE (cupcake_id, user_id, order_id)
);

-- Índices para reviews
CREATE INDEX idx_reviews_cupcake ON reviews(cupcake_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_nota ON reviews(nota);
CREATE INDEX idx_reviews_data ON reviews(data_review DESC);

-- Comentários da tabela reviews
COMMENT ON TABLE reviews IS 'Avaliações dos cupcakes feitas pelos clientes';
COMMENT ON COLUMN reviews.id IS 'Identificador único da avaliação';
COMMENT ON COLUMN reviews.cupcake_id IS 'Referência ao cupcake avaliado';
COMMENT ON COLUMN reviews.user_id IS 'Referência ao usuário que avaliou';
COMMENT ON COLUMN reviews.order_id IS 'Referência ao pedido (para validar compra)';
COMMENT ON COLUMN reviews.nota IS 'Nota de 1 a 5 estrelas';
COMMENT ON COLUMN reviews.titulo IS 'Título da avaliação';
COMMENT ON COLUMN reviews.comentario IS 'Comentário detalhado';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para atualizar ultima_atualizacao automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ultima_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em tabelas relevantes
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cupcakes_updated_at BEFORE UPDATE ON cupcakes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para registrar mudanças de status de pedidos
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (order_id, status_anterior, status_novo)
        VALUES (NEW.id, OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_order_status_changes AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para listar cupcakes com informações de categorias
CREATE OR REPLACE VIEW v_cupcakes_completos AS
SELECT 
    c.id,
    c.nome,
    c.slug,
    c.descricao,
    c.preco,
    c.preco_promocional,
    COALESCE(c.preco_promocional, c.preco) as preco_final,
    c.imagem_url,
    c.estoque,
    c.destaque,
    c.disponivel,
    c.ativo,
    STRING_AGG(DISTINCT cat.nome, ', ') as categorias,
    COALESCE(AVG(r.nota), 0) as media_avaliacoes,
    COUNT(DISTINCT r.id) as total_avaliacoes
FROM cupcakes c
LEFT JOIN cupcake_categories cc ON c.id = cc.cupcake_id
LEFT JOIN categories cat ON cc.category_id = cat.id
LEFT JOIN reviews r ON c.id = r.cupcake_id
WHERE c.ativo = TRUE
GROUP BY c.id;

-- View para estatísticas de pedidos
CREATE OR REPLACE VIEW v_estatisticas_pedidos AS
SELECT 
    DATE(o.data_pedido) as data,
    COUNT(*) as total_pedidos,
    SUM(o.total) as valor_total,
    AVG(o.total) as ticket_medio,
    COUNT(DISTINCT o.user_id) as clientes_unicos
FROM orders o
WHERE o.status NOT IN ('cancelado')
GROUP BY DATE(o.data_pedido)
ORDER BY data DESC;

-- =====================================================
-- DADOS INICIAIS (SEEDS)
-- =====================================================

-- Inserir categorias padrão
INSERT INTO categories (nome, slug, descricao, icone, ordem) VALUES
('Chocolate', 'chocolate', 'Deliciosos cupcakes com chocolate', '🍫', 1),
('Frutas', 'frutas', 'Cupcakes com frutas frescas', '🍓', 2),
('Especiais', 'especiais', 'Sabores especiais e únicos', '⭐', 3),
('Veganos', 'veganos', 'Opções veganas', '🌱', 4),
('Diet', 'diet', 'Opções diet e sem açúcar', '🥗', 5);

-- Inserir cupons de exemplo
INSERT INTO coupons (codigo, descricao, tipo_desconto, percentual_desconto, valor_desconto, valor_minimo_pedido, data_inicio, data_expiracao, uso_maximo) VALUES
('BEMVINDO', 'Cupom de boas-vindas - 10% de desconto', 'percentual', 10.00, NULL, 50.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days', 1000),
('DOCURA15', '15% de desconto em qualquer pedido', 'percentual', 15.00, NULL, 0.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', 500),
('VALE20', 'R$ 20 de desconto', 'fixo', NULL, 20.00, 100.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '60 days', 300);

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Conceder permissões (ajuste conforme necessário)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO seu_usuario;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO seu_usuario;
