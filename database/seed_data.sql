-- =====================================================
-- SCRIPT DE INSERÇÃO DE DADOS DE EXEMPLO
-- Sistema Sweet Cupcakes - PostgreSQL
-- =====================================================
-- Este script insere dados de exemplo para testes e desenvolvimento

-- =====================================================
-- IMPORTANTE: Execute este script APÓS o schema.sql
-- =====================================================

-- =====================================================
-- 1. INSERIR CUPCAKES DE EXEMPLO
-- =====================================================

-- Cupcakes de Chocolate
INSERT INTO cupcakes (nome, slug, descricao, ingredientes, preco, preco_promocional, imagem_url, estoque, peso_gramas, calorias, destaque, disponivel, ativo) VALUES
('Red Velvet', 'red-velvet', 'Massa vermelha aveludada com deliciosa cobertura de cream cheese', 'Massa: farinha, cacau, buttermilk, ovos. Cobertura: cream cheese, açúcar', 8.50, NULL, '/images/red-velvet.jpg', 50, 120, 380, true, true, true),
('Chocolate Belga', 'chocolate-belga', 'Cupcake de chocolate com cobertura de chocolate belga premium', 'Chocolate belga 70% cacau, farinha, ovos, manteiga, açúcar', 9.00, 7.50, '/images/chocolate-belga.jpg', 40, 130, 420, true, true, true),
('Chocolate Meio Amargo', 'chocolate-meio-amargo', 'Para os amantes de chocolate intenso', 'Chocolate meio amargo, farinha integral, cacau em pó, ovos', 8.00, NULL, '/images/chocolate-amargo.jpg', 35, 125, 360, false, true, true),
('Brownie Cupcake', 'brownie-cupcake', 'Textura de brownie em formato de cupcake', 'Chocolate, nozes, manteiga, farinha, ovos', 9.50, NULL, '/images/brownie-cupcake.jpg', 30, 140, 450, true, true, true);

-- Cupcakes de Frutas
INSERT INTO cupcakes (nome, slug, descricao, ingredientes, preco, preco_promocional, imagem_url, estoque, peso_gramas, calorias, destaque, disponivel, ativo) VALUES
('Morango', 'morango', 'Massa de baunilha com recheio e cobertura de morango fresco', 'Morangos frescos, baunilha, farinha, ovos, creme de leite', 7.50, NULL, '/images/morango.jpg', 60, 115, 340, true, true, true),
('Limão Siciliano', 'limao-siciliano', 'Refrescante cupcake de limão com cobertura de merengue', 'Limão siciliano, farinha, ovos, açúcar, merengue', 7.00, NULL, '/images/limao.jpg', 45, 110, 320, false, true, true),
('Frutas Vermelhas', 'frutas-vermelhas', 'Mix de morangos, framboesas e mirtilos', 'Morangos, framboesas, mirtilos, farinha, ovos', 8.50, NULL, '/images/frutas-vermelhas.jpg', 40, 120, 350, true, true, true),
('Maracujá', 'maracuja', 'Cupcake tropical com recheio de maracujá', 'Polpa de maracujá, farinha, ovos, creme', 7.50, NULL, '/images/maracuja.jpg', 35, 115, 330, false, true, true);

-- Cupcakes Especiais
INSERT INTO cupcakes (nome, slug, descricao, ingredientes, preco, preco_promocional, imagem_url, estoque, peso_gramas, calorias, destaque, disponivel, ativo) VALUES
('Doce de Leite', 'doce-de-leite', 'Cupcake com recheio e cobertura de doce de leite argentino', 'Doce de leite, farinha, ovos, manteiga', 9.00, NULL, '/images/doce-leite.jpg', 35, 135, 410, true, true, true),
('Churros', 'churros', 'Sabor de churros com canela e doce de leite', 'Farinha, canela, doce de leite, ovos, açúcar mascavo', 9.50, NULL, '/images/churros.jpg', 30, 130, 400, true, true, true),
('Cookies & Cream', 'cookies-cream', 'Massa com pedaços de cookies Oreo', 'Biscoito Oreo, creme, farinha, ovos, baunilha', 8.50, NULL, '/images/cookies-cream.jpg', 40, 125, 390, false, true, true),
('Brigadeiro Gourmet', 'brigadeiro-gourmet', 'Massa de chocolate com brigadeiro belga', 'Chocolate belga, leite condensado, farinha, ovos', 10.00, 8.50, '/images/brigadeiro.jpg', 25, 140, 430, true, true, true);

-- Cupcakes Veganos
INSERT INTO cupcakes (nome, slug, descricao, ingredientes, preco, preco_promocional, imagem_url, estoque, peso_gramas, calorias, destaque, disponivel, ativo) VALUES
('Chocolate Vegano', 'chocolate-vegano', 'Delicioso cupcake de chocolate 100% vegano', 'Cacau, farinha integral, leite de amêndoas, açúcar demerara', 8.00, NULL, '/images/chocolate-vegano.jpg', 30, 120, 320, false, true, true),
('Cenoura Vegana', 'cenoura-vegana', 'Tradicional bolo de cenoura em versão vegana', 'Cenoura, farinha integral, açúcar mascavo, óleo de coco', 7.50, NULL, '/images/cenoura-vegana.jpg', 35, 115, 300, false, true, true),
('Banana e Aveia', 'banana-aveia', 'Cupcake saudável e vegano', 'Banana, aveia, farinha integral, mel vegano', 7.00, NULL, '/images/banana-aveia.jpg', 40, 110, 280, true, true, true);

-- Cupcakes Diet
INSERT INTO cupcakes (nome, slug, descricao, ingredientes, preco, preco_promocional, imagem_url, estoque, peso_gramas, calorias, destaque, disponivel, ativo) VALUES
('Chocolate Zero', 'chocolate-zero', 'Cupcake de chocolate sem açúcar', 'Cacau, farinha integral, adoçante stevia, ovos', 9.00, NULL, '/images/chocolate-zero.jpg', 25, 110, 180, false, true, true),
('Baunilha Light', 'baunilha-light', 'Cupcake de baunilha com baixas calorias', 'Baunilha, farinha integral, adoçante, claras de ovos', 8.50, NULL, '/images/baunilha-light.jpg', 30, 105, 160, false, true, true);

-- =====================================================
-- 2. ASSOCIAR CUPCAKES ÀS CATEGORIAS
-- =====================================================

-- Chocolate (category_id = 1)
INSERT INTO cupcake_categories (cupcake_id, category_id) VALUES
(2, 1), (3, 1), (4, 1), (13, 1), (16, 1);

-- Frutas (category_id = 2)
INSERT INTO cupcake_categories (cupcake_id, category_id) VALUES
(5, 2), (6, 2), (7, 2), (8, 2);

-- Especiais (category_id = 3)
INSERT INTO cupcake_categories (cupcake_id, category_id) VALUES
(1, 3), (9, 3), (10, 3), (11, 3), (12, 3);

-- Veganos (category_id = 4)
INSERT INTO cupcake_categories (cupcake_id, category_id) VALUES
(13, 4), (14, 4), (15, 4);

-- Diet (category_id = 5)
INSERT INTO cupcake_categories (cupcake_id, category_id) VALUES
(16, 5), (17, 5);

-- Alguns cupcakes podem ter múltiplas categorias
INSERT INTO cupcake_categories (cupcake_id, category_id) VALUES
(4, 3);  -- Brownie é Chocolate e Especial

-- =====================================================
-- 3. INSERIR USUÁRIOS DE EXEMPLO
-- =====================================================

-- IMPORTANTE: Em produção, as senhas devem ser hash bcrypt
-- Aqui estão em texto plano apenas para exemplo
-- Senha de todos os usuários de teste: "senha123"

-- Admin
INSERT INTO users (id, nome, email, senha, telefone, role, ativo) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin Sistema', 'admin@sweetcupcakes.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5MUwOY.TZ9Vqe', '11987654321', 'admin', true);

-- Staff
INSERT INTO users (id, nome, email, senha, telefone, role, ativo) VALUES
('b1ffcd99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Maria Santos', 'maria.santos@sweetcupcakes.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5MUwOY.TZ9Vqe', '11987654322', 'staff', true);

-- Clientes
INSERT INTO users (id, nome, email, senha, telefone, role, ativo) VALUES
('c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33', 'João Silva', 'joao.silva@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5MUwOY.TZ9Vqe', '11912345678', 'customer', true),
('d3ffcd99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Ana Costa', 'ana.costa@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5MUwOY.TZ9Vqe', '11923456789', 'customer', true),
('e4ffcd99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Pedro Oliveira', 'pedro.oliveira@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5MUwOY.TZ9Vqe', '11934567890', 'customer', true);

-- =====================================================
-- 4. INSERIR ENDEREÇOS DE EXEMPLO
-- =====================================================

-- Endereços do João Silva
INSERT INTO addresses (user_id, tipo, rua, numero, complemento, bairro, cidade, estado, cep, lat, lng, padrao, ativo) VALUES
('c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33', 'ambos', 'Rua das Flores', '123', 'Apto 45', 'Centro', 'São Paulo', 'SP', '01001-000', -23.5505, -46.6333, true, true),
('c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33', 'entrega', 'Avenida Paulista', '1000', 'Sala 12', 'Bela Vista', 'São Paulo', 'SP', '01310-100', -23.5617, -46.6559, false, true);

-- Endereço da Ana Costa
INSERT INTO addresses (user_id, tipo, rua, numero, complemento, bairro, cidade, estado, cep, lat, lng, padrao, ativo) VALUES
('d3ffcd99-9c0b-4ef8-bb6d-6bb9bd380a44', 'ambos', 'Rua dos Jardins', '456', NULL, 'Jardim Paulista', 'São Paulo', 'SP', '01401-000', -23.5646, -46.6615, true, true);

-- Endereço do Pedro Oliveira
INSERT INTO addresses (user_id, tipo, rua, numero, complemento, bairro, cidade, estado, cep, lat, lng, padrao, ativo) VALUES
('e4ffcd99-9c0b-4ef8-bb6d-6bb9bd380a55', 'entrega', 'Rua Augusta', '789', 'Casa 2', 'Consolação', 'São Paulo', 'SP', '01305-000', -23.5558, -46.6617, true, true);

-- =====================================================
-- 5. CRIAR CARRINHOS PARA OS USUÁRIOS
-- =====================================================

INSERT INTO carts (user_id) VALUES
('c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33'),
('d3ffcd99-9c0b-4ef8-bb6d-6bb9bd380a44'),
('e4ffcd99-9c0b-4ef8-bb6d-6bb9bd380a55');

-- =====================================================
-- 6. ADICIONAR ITENS AOS CARRINHOS (EXEMPLO)
-- =====================================================

-- Carrinho do João (2 Red Velvet, 1 Chocolate Belga)
INSERT INTO cart_items (cart_id, cupcake_id, quantidade, preco_unitario) VALUES
((SELECT id FROM carts WHERE user_id = 'c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33'), 1, 2, 8.50),
((SELECT id FROM carts WHERE user_id = 'c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33'), 2, 1, 7.50);

-- Carrinho da Ana (3 Morango)
INSERT INTO cart_items (cart_id, cupcake_id, quantidade, preco_unitario) VALUES
((SELECT id FROM carts WHERE user_id = 'd3ffcd99-9c0b-4ef8-bb6d-6bb9bd380a44'), 5, 3, 7.50);

-- =====================================================
-- 7. CRIAR PEDIDOS DE EXEMPLO
-- =====================================================

-- Pedido 1: João Silva (ENTREGUE)
INSERT INTO orders (
    id, numero_pedido, user_id, status, tipo_entrega,
    nome_cliente, email_cliente, telefone_cliente,
    endereco_entrega_id, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep,
    subtotal, valor_desconto, valor_frete, total,
    data_pedido, data_entrega
) VALUES (
    '10000000-0000-0000-0000-000000000001',
    'PED-2025-0001',
    'c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'entregue',
    'entrega',
    'João Silva',
    'joao.silva@email.com',
    '11912345678',
    (SELECT id FROM addresses WHERE user_id = 'c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33' AND padrao = true),
    'Rua das Flores',
    '123',
    'Centro',
    'São Paulo',
    'SP',
    '01001-000',
    42.00,
    4.20,
    10.00,
    47.80,
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    CURRENT_TIMESTAMP - INTERVAL '4 days'
);

-- Itens do Pedido 1
INSERT INTO order_items (order_id, cupcake_id, nome_cupcake, quantidade, preco_unitario, subtotal) VALUES
('10000000-0000-0000-0000-000000000001', 1, 'Red Velvet', 3, 8.50, 25.50),
('10000000-0000-0000-0000-000000000001', 2, 'Chocolate Belga', 2, 7.50, 15.00),
('10000000-0000-0000-0000-000000000001', 5, 'Morango', 1, 7.50, 7.50);

-- Pagamento do Pedido 1
INSERT INTO payments (order_id, metodo_pagamento, status, valor, data_pagamento, data_confirmacao) VALUES
('10000000-0000-0000-0000-000000000001', 'pix', 'aprovado', 47.80, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days');

-- Pedido 2: Ana Costa (EM PREPARO)
INSERT INTO orders (
    id, numero_pedido, user_id, status, tipo_entrega,
    nome_cliente, email_cliente, telefone_cliente,
    subtotal, valor_desconto, valor_frete, total,
    coupon_id,
    data_pedido
) VALUES (
    '20000000-0000-0000-0000-000000000002',
    'PED-2025-0002',
    'd3ffcd99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'em_preparo',
    'retirada',
    'Ana Costa',
    'ana.costa@email.com',
    '11923456789',
    60.00,
    6.00,
    0.00,
    54.00,
    (SELECT id FROM coupons WHERE codigo = 'BEMVINDO'),
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
);

-- Itens do Pedido 2
INSERT INTO order_items (order_id, cupcake_id, nome_cupcake, quantidade, preco_unitario, subtotal) VALUES
('20000000-0000-0000-0000-000000000002', 12, 'Brigadeiro Gourmet', 4, 8.50, 34.00),
('20000000-0000-0000-0000-000000000002', 9, 'Doce de Leite', 3, 9.00, 27.00);

-- Pagamento do Pedido 2
INSERT INTO payments (order_id, metodo_pagamento, status, valor, data_pagamento, data_confirmacao) VALUES
('20000000-0000-0000-0000-000000000002', 'credito', 'aprovado', 54.00, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours');

-- Registrar uso do cupom
INSERT INTO coupon_usage (coupon_id, user_id, order_id) VALUES
((SELECT id FROM coupons WHERE codigo = 'BEMVINDO'), 'd3ffcd99-9c0b-4ef8-bb6d-6bb9bd380a44', '20000000-0000-0000-0000-000000000002');

-- Atualizar uso do cupom
UPDATE coupons SET uso_atual = uso_atual + 1 WHERE codigo = 'BEMVINDO';

-- Pedido 3: Pedro Oliveira (PENDENTE)
INSERT INTO orders (
    id, numero_pedido, user_id, status, tipo_entrega,
    nome_cliente, email_cliente, telefone_cliente,
    endereco_entrega_id, endereco_rua, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep,
    subtotal, valor_desconto, valor_frete, total,
    data_pedido
) VALUES (
    '30000000-0000-0000-0000-000000000003',
    'PED-2025-0003',
    'e4ffcd99-9c0b-4ef8-bb6d-6bb9bd380a55',
    'pendente',
    'entrega',
    'Pedro Oliveira',
    'pedro.oliveira@email.com',
    '11934567890',
    (SELECT id FROM addresses WHERE user_id = 'e4ffcd99-9c0b-4ef8-bb6d-6bb9bd380a55'),
    'Rua Augusta',
    '789',
    'Casa 2',
    'Consolação',
    'São Paulo',
    'SP',
    '01305-000',
    35.00,
    0.00,
    8.00,
    43.00,
    CURRENT_TIMESTAMP - INTERVAL '30 minutes'
);

-- Itens do Pedido 3
INSERT INTO order_items (order_id, cupcake_id, nome_cupcake, quantidade, preco_unitario, subtotal) VALUES
('30000000-0000-0000-0000-000000000003', 7, 'Frutas Vermelhas', 2, 8.50, 17.00),
('30000000-0000-0000-0000-000000000003', 6, 'Limão Siciliano', 2, 7.00, 14.00);

-- Pagamento do Pedido 3 (aguardando)
INSERT INTO payments (order_id, metodo_pagamento, status, valor) VALUES
('30000000-0000-0000-0000-000000000003', 'dinheiro', 'pendente', 43.00);

-- =====================================================
-- 8. INSERIR AVALIAÇÕES (REVIEWS)
-- =====================================================

-- João avalia os cupcakes do seu pedido entregue
INSERT INTO reviews (cupcake_id, user_id, order_id, nota, titulo, comentario) VALUES
(1, 'c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000001', 5, 'Perfeito!', 'O Red Velvet é simplesmente maravilhoso. Massa úmida e cobertura deliciosa!'),
(2, 'c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000001', 5, 'Chocolate incrível', 'O melhor cupcake de chocolate que já comi. Muito chocolate belga de qualidade.'),
(5, 'c2ffcd99-9c0b-4ef8-bb6d-6bb9bd380a33', '10000000-0000-0000-0000-000000000001', 4, 'Muito bom', 'Cupcake de morango bem gostoso, morango fresco. Recomendo!');

-- =====================================================
-- 9. INSERIR IMAGENS ADICIONAIS (GALERIA)
-- =====================================================

-- Imagens adicionais do Red Velvet
INSERT INTO cupcake_images (cupcake_id, url, caminho, ordem) VALUES
(1, '/images/red-velvet-2.jpg', '/uploads/cupcakes/red-velvet-2.jpg', 1),
(1, '/images/red-velvet-3.jpg', '/uploads/cupcakes/red-velvet-3.jpg', 2);

-- Imagens adicionais do Chocolate Belga
INSERT INTO cupcake_images (cupcake_id, url, caminho, ordem) VALUES
(2, '/images/chocolate-belga-2.jpg', '/uploads/cupcakes/chocolate-belga-2.jpg', 1),
(2, '/images/chocolate-belga-3.jpg', '/uploads/cupcakes/chocolate-belga-3.jpg', 2),
(2, '/images/chocolate-belga-4.jpg', '/uploads/cupcakes/chocolate-belga-4.jpg', 3);

-- =====================================================
-- 10. ATUALIZAR ESTOQUE (SIMULAR VENDAS)
-- =====================================================

-- Reduzir estoque dos cupcakes vendidos
UPDATE cupcakes SET estoque = estoque - 3 WHERE id = 1;  -- Red Velvet
UPDATE cupcakes SET estoque = estoque - 2 WHERE id = 2;  -- Chocolate Belga
UPDATE cupcakes SET estoque = estoque - 1 WHERE id = 5;  -- Morango
UPDATE cupcakes SET estoque = estoque - 4 WHERE id = 12; -- Brigadeiro
UPDATE cupcakes SET estoque = estoque - 3 WHERE id = 9;  -- Doce de Leite
UPDATE cupcakes SET estoque = estoque - 2 WHERE id = 7;  -- Frutas Vermelhas
UPDATE cupcakes SET estoque = estoque - 2 WHERE id = 6;  -- Limão

-- =====================================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- =====================================================

-- Contar registros
SELECT 'Cupcakes cadastrados: ' || COUNT(*) FROM cupcakes;
SELECT 'Usuários cadastrados: ' || COUNT(*) FROM users;
SELECT 'Endereços cadastrados: ' || COUNT(*) FROM addresses;
SELECT 'Pedidos cadastrados: ' || COUNT(*) FROM orders;
SELECT 'Avaliações cadastradas: ' || COUNT(*) FROM reviews;
SELECT 'Carrinhos criados: ' || COUNT(*) FROM carts;

-- Mostrar cupcakes com categorias
SELECT 
    c.nome,
    c.preco,
    c.estoque,
    STRING_AGG(cat.nome, ', ') as categorias
FROM cupcakes c
LEFT JOIN cupcake_categories cc ON c.id = cc.cupcake_id
LEFT JOIN categories cat ON cc.category_id = cat.id
GROUP BY c.id, c.nome, c.preco, c.estoque
ORDER BY c.nome;

-- Mostrar pedidos com totais
SELECT 
    o.numero_pedido,
    u.nome as cliente,
    o.status,
    o.total,
    o.data_pedido
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.data_pedido DESC;

-- =====================================================
-- FIM DO SCRIPT DE DADOS DE EXEMPLO
-- =====================================================

COMMIT;
