-- =====================================================
-- QUERIES ÚTEIS - Sistema Sweet Cupcakes
-- Coleção de consultas SQL para análises e relatórios
-- =====================================================

-- =====================================================
-- 1. ANÁLISES DE PRODUTOS
-- =====================================================

-- 1.1. Cupcakes mais vendidos (quantidade)
SELECT 
    c.nome,
    c.slug,
    SUM(oi.quantidade) as total_vendido,
    COUNT(DISTINCT oi.order_id) as pedidos,
    SUM(oi.subtotal) as receita_total
FROM cupcakes c
JOIN order_items oi ON c.id = oi.cupcake_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status NOT IN ('cancelado')
GROUP BY c.id, c.nome, c.slug
ORDER BY total_vendido DESC
LIMIT 10;

-- 1.2. Cupcakes em destaque com estatísticas
SELECT 
    c.nome,
    c.preco,
    COALESCE(c.preco_promocional, c.preco) as preco_final,
    c.estoque,
    COUNT(DISTINCT r.id) as total_avaliacoes,
    COALESCE(AVG(r.nota), 0) as media_notas,
    STRING_AGG(DISTINCT cat.nome, ', ') as categorias
FROM cupcakes c
LEFT JOIN reviews r ON c.id = r.cupcake_id
LEFT JOIN cupcake_categories cc ON c.id = cc.cupcake_id
LEFT JOIN categories cat ON cc.category_id = cat.id
WHERE c.destaque = true AND c.ativo = true
GROUP BY c.id, c.nome, c.preco, c.preco_promocional, c.estoque
ORDER BY media_notas DESC, total_avaliacoes DESC;

-- 1.3. Cupcakes com estoque baixo (alerta)
SELECT 
    c.nome,
    c.estoque,
    c.preco,
    STRING_AGG(cat.nome, ', ') as categorias
FROM cupcakes c
LEFT JOIN cupcake_categories cc ON c.id = cc.cupcake_id
LEFT JOIN categories cat ON cc.category_id = cat.id
WHERE c.estoque < 20 AND c.ativo = true AND c.disponivel = true
GROUP BY c.id, c.nome, c.estoque, c.preco
ORDER BY c.estoque ASC;

-- 1.4. Cupcakes por categoria com contagem
SELECT 
    cat.nome as categoria,
    COUNT(DISTINCT c.id) as total_cupcakes,
    AVG(c.preco) as preco_medio,
    SUM(c.estoque) as estoque_total
FROM categories cat
LEFT JOIN cupcake_categories cc ON cat.id = cc.category_id
LEFT JOIN cupcakes c ON cc.cupcake_id = c.id AND c.ativo = true
WHERE cat.ativo = true
GROUP BY cat.id, cat.nome
ORDER BY total_cupcakes DESC;

-- 1.5. Produtos sem vendas (oportunidade de promoção)
SELECT 
    c.nome,
    c.preco,
    c.estoque,
    c.data_cadastro,
    EXTRACT(DAY FROM CURRENT_TIMESTAMP - c.data_cadastro) as dias_sem_venda
FROM cupcakes c
WHERE c.id NOT IN (
    SELECT DISTINCT cupcake_id FROM order_items
)
AND c.ativo = true
ORDER BY c.data_cadastro ASC;

-- =====================================================
-- 2. ANÁLISES DE CLIENTES
-- =====================================================

-- 2.1. Top clientes por valor gasto
SELECT 
    u.nome,
    u.email,
    COUNT(DISTINCT o.id) as total_pedidos,
    SUM(o.total) as valor_total_gasto,
    AVG(o.total) as ticket_medio,
    MAX(o.data_pedido) as ultimo_pedido
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status NOT IN ('cancelado') AND u.role = 'customer'
GROUP BY u.id, u.nome, u.email
ORDER BY valor_total_gasto DESC
LIMIT 20;

-- 2.2. Clientes mais frequentes
SELECT 
    u.nome,
    u.email,
    COUNT(o.id) as total_pedidos,
    SUM(o.total) as valor_total,
    DATE_TRUNC('day', MAX(o.data_pedido)) as ultimo_pedido,
    EXTRACT(DAY FROM CURRENT_TIMESTAMP - MAX(o.data_pedido)) as dias_sem_comprar
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status NOT IN ('cancelado')
GROUP BY u.id, u.nome, u.email
HAVING COUNT(o.id) >= 3
ORDER BY total_pedidos DESC;

-- 2.3. Clientes inativos (não compraram há mais de 30 dias)
SELECT 
    u.nome,
    u.email,
    u.telefone,
    MAX(o.data_pedido) as ultimo_pedido,
    EXTRACT(DAY FROM CURRENT_TIMESTAMP - MAX(o.data_pedido)) as dias_inativo,
    COUNT(o.id) as total_pedidos_historico,
    SUM(o.total) as valor_total_historico
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.role = 'customer'
GROUP BY u.id, u.nome, u.email, u.telefone
HAVING MAX(o.data_pedido) < CURRENT_TIMESTAMP - INTERVAL '30 days'
ORDER BY dias_inativo DESC;

-- 2.4. Novos clientes (cadastrados nos últimos 7 dias)
SELECT 
    u.nome,
    u.email,
    u.data_cadastro,
    COUNT(o.id) as pedidos_realizados,
    COALESCE(SUM(o.total), 0) as valor_gasto
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.status NOT IN ('cancelado')
WHERE u.role = 'customer' 
AND u.data_cadastro >= CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY u.id, u.nome, u.email, u.data_cadastro
ORDER BY u.data_cadastro DESC;

-- 2.5. Análise de retenção de clientes
SELECT 
    DATE_TRUNC('month', primeira_compra) as mes_primeira_compra,
    COUNT(DISTINCT user_id) as novos_clientes,
    COUNT(DISTINCT CASE WHEN total_pedidos > 1 THEN user_id END) as clientes_retidos,
    ROUND(
        COUNT(DISTINCT CASE WHEN total_pedidos > 1 THEN user_id END)::numeric / 
        COUNT(DISTINCT user_id) * 100, 
        2
    ) as taxa_retencao_percent
FROM (
    SELECT 
        u.id as user_id,
        MIN(o.data_pedido) as primeira_compra,
        COUNT(o.id) as total_pedidos
    FROM users u
    JOIN orders o ON u.id = o.user_id
    WHERE o.status NOT IN ('cancelado')
    GROUP BY u.id
) sub
GROUP BY DATE_TRUNC('month', primeira_compra)
ORDER BY mes_primeira_compra DESC;

-- =====================================================
-- 3. ANÁLISES DE VENDAS E RECEITA
-- =====================================================

-- 3.1. Receita por período (últimos 30 dias)
SELECT 
    DATE(o.data_pedido) as data,
    COUNT(o.id) as total_pedidos,
    SUM(o.subtotal) as subtotal,
    SUM(o.valor_desconto) as descontos,
    SUM(o.valor_frete) as frete,
    SUM(o.total) as receita_liquida,
    AVG(o.total) as ticket_medio
FROM orders o
WHERE o.status NOT IN ('cancelado')
AND o.data_pedido >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(o.data_pedido)
ORDER BY data DESC;

-- 3.2. Receita mensal (últimos 12 meses)
SELECT 
    TO_CHAR(o.data_pedido, 'YYYY-MM') as mes,
    COUNT(o.id) as total_pedidos,
    SUM(o.total) as receita_total,
    AVG(o.total) as ticket_medio,
    COUNT(DISTINCT o.user_id) as clientes_unicos
FROM orders o
WHERE o.status NOT IN ('cancelado')
AND o.data_pedido >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY TO_CHAR(o.data_pedido, 'YYYY-MM')
ORDER BY mes DESC;

-- 3.3. Comparação mês atual vs mês anterior
WITH mes_atual AS (
    SELECT 
        COUNT(*) as pedidos,
        SUM(total) as receita,
        AVG(total) as ticket_medio
    FROM orders
    WHERE status NOT IN ('cancelado')
    AND data_pedido >= DATE_TRUNC('month', CURRENT_DATE)
),
mes_anterior AS (
    SELECT 
        COUNT(*) as pedidos,
        SUM(total) as receita,
        AVG(total) as ticket_medio
    FROM orders
    WHERE status NOT IN ('cancelado')
    AND data_pedido >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
    AND data_pedido < DATE_TRUNC('month', CURRENT_DATE)
)
SELECT 
    'Mês Atual' as periodo,
    ma.pedidos,
    ROUND(ma.receita, 2) as receita,
    ROUND(ma.ticket_medio, 2) as ticket_medio
FROM mes_atual ma
UNION ALL
SELECT 
    'Mês Anterior' as periodo,
    mp.pedidos,
    ROUND(mp.receita, 2) as receita,
    ROUND(mp.ticket_medio, 2) as ticket_medio
FROM mes_anterior mp;

-- 3.4. Análise por tipo de entrega
SELECT 
    o.tipo_entrega,
    COUNT(o.id) as total_pedidos,
    ROUND(AVG(o.total), 2) as ticket_medio,
    SUM(o.total) as receita_total,
    ROUND(
        COUNT(o.id)::numeric / 
        (SELECT COUNT(*) FROM orders WHERE status NOT IN ('cancelado')) * 100, 
        2
    ) as percentual
FROM orders o
WHERE o.status NOT IN ('cancelado')
GROUP BY o.tipo_entrega
ORDER BY total_pedidos DESC;

-- 3.5. Horários de maior movimento (por hora do dia)
SELECT 
    EXTRACT(HOUR FROM o.data_pedido) as hora,
    COUNT(o.id) as total_pedidos,
    SUM(o.total) as receita,
    AVG(o.total) as ticket_medio
FROM orders o
WHERE o.status NOT IN ('cancelado')
AND o.data_pedido >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY EXTRACT(HOUR FROM o.data_pedido)
ORDER BY hora;

-- =====================================================
-- 4. ANÁLISES DE PEDIDOS
-- =====================================================

-- 4.1. Pedidos por status
SELECT 
    o.status,
    COUNT(o.id) as quantidade,
    SUM(o.total) as valor_total,
    AVG(o.total) as valor_medio,
    ROUND(
        COUNT(o.id)::numeric / 
        (SELECT COUNT(*) FROM orders) * 100, 
        2
    ) as percentual
FROM orders o
GROUP BY o.status
ORDER BY quantidade DESC;

-- 4.2. Tempo médio entre pedido e entrega
SELECT 
    AVG(EXTRACT(EPOCH FROM (o.data_entrega - o.data_pedido)) / 3600) as horas_media,
    MIN(EXTRACT(EPOCH FROM (o.data_entrega - o.data_pedido)) / 3600) as horas_minimo,
    MAX(EXTRACT(EPOCH FROM (o.data_entrega - o.data_pedido)) / 3600) as horas_maximo
FROM orders o
WHERE o.status = 'entregue' AND o.data_entrega IS NOT NULL;

-- 4.3. Taxa de conversão (carrinhos vs pedidos)
SELECT 
    (SELECT COUNT(*) FROM carts WHERE ultima_atualizacao >= CURRENT_DATE - INTERVAL '30 days') as carrinhos_ativos,
    (SELECT COUNT(*) FROM orders WHERE data_pedido >= CURRENT_DATE - INTERVAL '30 days') as pedidos_realizados,
    ROUND(
        (SELECT COUNT(*) FROM orders WHERE data_pedido >= CURRENT_DATE - INTERVAL '30 days')::numeric /
        NULLIF((SELECT COUNT(*) FROM carts WHERE ultima_atualizacao >= CURRENT_DATE - INTERVAL '30 days'), 0) * 100,
        2
    ) as taxa_conversao_percent;

-- 4.4. Pedidos com maior valor
SELECT 
    o.numero_pedido,
    u.nome as cliente,
    o.total,
    o.data_pedido,
    o.status,
    COUNT(oi.id) as total_itens
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.status NOT IN ('cancelado')
GROUP BY o.id, o.numero_pedido, u.nome, o.total, o.data_pedido, o.status
ORDER BY o.total DESC
LIMIT 10;

-- 4.5. Itens por pedido (cesta média)
SELECT 
    AVG(itens_por_pedido) as media_itens,
    MIN(itens_por_pedido) as min_itens,
    MAX(itens_por_pedido) as max_itens
FROM (
    SELECT 
        o.id,
        SUM(oi.quantidade) as itens_por_pedido
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.status NOT IN ('cancelado')
    GROUP BY o.id
) sub;

-- =====================================================
-- 5. ANÁLISES DE CUPONS
-- =====================================================

-- 5.1. Cupons mais utilizados
SELECT 
    c.codigo,
    c.descricao,
    c.tipo_desconto,
    COALESCE(c.valor_desconto, c.percentual_desconto) as desconto,
    c.uso_atual,
    c.uso_maximo,
    COUNT(cu.id) as registros_uso,
    COUNT(DISTINCT cu.user_id) as usuarios_unicos,
    COALESCE(SUM(o.valor_desconto), 0) as desconto_total_concedido
FROM coupons c
LEFT JOIN coupon_usage cu ON c.id = cu.coupon_id
LEFT JOIN orders o ON cu.order_id = o.id AND o.status NOT IN ('cancelado')
GROUP BY c.id, c.codigo, c.descricao, c.tipo_desconto, c.valor_desconto, c.percentual_desconto, c.uso_atual, c.uso_maximo
ORDER BY registros_uso DESC;

-- 5.2. Cupons válidos ativos
SELECT 
    c.codigo,
    c.descricao,
    c.tipo_desconto,
    CASE 
        WHEN c.tipo_desconto = 'percentual' THEN c.percentual_desconto || '%'
        ELSE 'R$ ' || c.valor_desconto
    END as desconto,
    c.valor_minimo_pedido,
    c.data_expiracao,
    EXTRACT(DAY FROM c.data_expiracao - CURRENT_TIMESTAMP) as dias_restantes,
    c.uso_atual || '/' || c.uso_maximo as utilizacao
FROM coupons c
WHERE c.ativo = true
AND c.data_inicio <= CURRENT_TIMESTAMP
AND c.data_expiracao >= CURRENT_TIMESTAMP
AND c.uso_atual < c.uso_maximo
ORDER BY c.data_expiracao ASC;

-- 5.3. Impacto dos cupons na receita
SELECT 
    TO_CHAR(o.data_pedido, 'YYYY-MM') as mes,
    COUNT(o.id) as pedidos_com_cupom,
    SUM(o.subtotal) as subtotal,
    SUM(o.valor_desconto) as desconto_total,
    SUM(o.total) as receita_liquida,
    ROUND(
        SUM(o.valor_desconto)::numeric / SUM(o.subtotal) * 100, 
        2
    ) as percentual_desconto
FROM orders o
WHERE o.coupon_id IS NOT NULL
AND o.status NOT IN ('cancelado')
AND o.data_pedido >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY TO_CHAR(o.data_pedido, 'YYYY-MM')
ORDER BY mes DESC;

-- =====================================================
-- 6. ANÁLISES DE PAGAMENTO
-- =====================================================

-- 6.1. Métodos de pagamento mais utilizados
SELECT 
    p.metodo_pagamento,
    COUNT(p.id) as total_transacoes,
    SUM(p.valor) as valor_total,
    AVG(p.valor) as valor_medio,
    ROUND(
        COUNT(p.id)::numeric / 
        (SELECT COUNT(*) FROM payments WHERE status = 'aprovado') * 100, 
        2
    ) as percentual
FROM payments p
WHERE p.status = 'aprovado'
GROUP BY p.metodo_pagamento
ORDER BY total_transacoes DESC;

-- 6.2. Taxa de aprovação por método
SELECT 
    p.metodo_pagamento,
    COUNT(*) as total,
    COUNT(CASE WHEN p.status = 'aprovado' THEN 1 END) as aprovados,
    COUNT(CASE WHEN p.status = 'recusado' THEN 1 END) as recusados,
    ROUND(
        COUNT(CASE WHEN p.status = 'aprovado' THEN 1 END)::numeric / 
        COUNT(*) * 100, 
        2
    ) as taxa_aprovacao_percent
FROM payments p
GROUP BY p.metodo_pagamento
ORDER BY taxa_aprovacao_percent DESC;

-- 6.3. Pagamentos pendentes (necessitam atenção)
SELECT 
    o.numero_pedido,
    u.nome as cliente,
    p.metodo_pagamento,
    p.valor,
    p.data_pagamento,
    EXTRACT(HOUR FROM CURRENT_TIMESTAMP - p.data_pagamento) as horas_pendente
FROM payments p
JOIN orders o ON p.order_id = o.id
JOIN users u ON o.user_id = u.id
WHERE p.status IN ('pendente', 'processando')
ORDER BY p.data_pagamento ASC;

-- =====================================================
-- 7. ANÁLISES DE AVALIAÇÕES
-- =====================================================

-- 7.1. Cupcakes com melhores avaliações
SELECT 
    c.nome,
    COUNT(r.id) as total_avaliacoes,
    ROUND(AVG(r.nota), 2) as media_notas,
    COUNT(CASE WHEN r.nota = 5 THEN 1 END) as avaliacoes_5_estrelas,
    COUNT(CASE WHEN r.nota >= 4 THEN 1 END) as avaliacoes_positivas
FROM cupcakes c
JOIN reviews r ON c.id = r.cupcake_id
GROUP BY c.id, c.nome
HAVING COUNT(r.id) >= 3
ORDER BY media_notas DESC, total_avaliacoes DESC
LIMIT 10;

-- 7.2. Distribuição de notas
SELECT 
    r.nota,
    COUNT(*) as quantidade,
    ROUND(
        COUNT(*)::numeric / 
        (SELECT COUNT(*) FROM reviews) * 100, 
        2
    ) as percentual
FROM reviews r
GROUP BY r.nota
ORDER BY r.nota DESC;

-- 7.3. Avaliações recentes
SELECT 
    r.titulo,
    r.nota,
    r.comentario,
    c.nome as cupcake,
    u.nome as cliente,
    r.data_review
FROM reviews r
JOIN cupcakes c ON r.cupcake_id = c.id
JOIN users u ON r.user_id = u.id
ORDER BY r.data_review DESC
LIMIT 10;

-- 7.4. Produtos que precisam de melhorias (notas baixas)
SELECT 
    c.nome,
    COUNT(r.id) as total_avaliacoes,
    ROUND(AVG(r.nota), 2) as media_notas,
    COUNT(CASE WHEN r.nota <= 2 THEN 1 END) as avaliacoes_negativas
FROM cupcakes c
JOIN reviews r ON c.id = r.cupcake_id
GROUP BY c.id, c.nome
HAVING AVG(r.nota) < 3.5 AND COUNT(r.id) >= 3
ORDER BY media_notas ASC;

-- =====================================================
-- 8. ANÁLISES GEOGRÁFICAS
-- =====================================================

-- 8.1. Pedidos por cidade
SELECT 
    o.endereco_cidade as cidade,
    o.endereco_estado as estado,
    COUNT(o.id) as total_pedidos,
    SUM(o.total) as receita_total,
    AVG(o.total) as ticket_medio
FROM orders o
WHERE o.status NOT IN ('cancelado') 
AND o.tipo_entrega = 'entrega'
AND o.endereco_cidade IS NOT NULL
GROUP BY o.endereco_cidade, o.endereco_estado
ORDER BY total_pedidos DESC
LIMIT 10;

-- 8.2. Pedidos por estado
SELECT 
    o.endereco_estado as estado,
    COUNT(o.id) as total_pedidos,
    SUM(o.total) as receita_total,
    AVG(o.valor_frete) as frete_medio
FROM orders o
WHERE o.status NOT IN ('cancelado')
AND o.tipo_entrega = 'entrega'
AND o.endereco_estado IS NOT NULL
GROUP BY o.endereco_estado
ORDER BY total_pedidos DESC;

-- =====================================================
-- 9. DASHBOARD - MÉTRICAS GERAIS
-- =====================================================

-- 9.1. Dashboard resumo (últimos 30 dias)
SELECT 
    (SELECT COUNT(*) FROM orders WHERE data_pedido >= CURRENT_DATE - INTERVAL '30 days' AND status NOT IN ('cancelado')) as total_pedidos,
    (SELECT ROUND(SUM(total), 2) FROM orders WHERE data_pedido >= CURRENT_DATE - INTERVAL '30 days' AND status NOT IN ('cancelado')) as receita_total,
    (SELECT ROUND(AVG(total), 2) FROM orders WHERE data_pedido >= CURRENT_DATE - INTERVAL '30 days' AND status NOT IN ('cancelado')) as ticket_medio,
    (SELECT COUNT(DISTINCT user_id) FROM orders WHERE data_pedido >= CURRENT_DATE - INTERVAL '30 days') as clientes_ativos,
    (SELECT COUNT(*) FROM users WHERE role = 'customer' AND data_cadastro >= CURRENT_DATE - INTERVAL '30 days') as novos_clientes,
    (SELECT COUNT(*) FROM cupcakes WHERE ativo = true AND disponivel = true) as produtos_ativos,
    (SELECT COUNT(*) FROM orders WHERE status = 'pendente') as pedidos_pendentes;

-- 9.2. KPIs principais
SELECT 
    'LTV (Lifetime Value)' as metrica,
    ROUND(AVG(valor_total), 2) as valor
FROM (
    SELECT user_id, SUM(total) as valor_total
    FROM orders
    WHERE status NOT IN ('cancelado')
    GROUP BY user_id
) sub
UNION ALL
SELECT 
    'Taxa de Retorno' as metrica,
    ROUND(
        COUNT(DISTINCT CASE WHEN total_pedidos > 1 THEN user_id END)::numeric /
        COUNT(DISTINCT user_id) * 100,
        2
    )
FROM (
    SELECT user_id, COUNT(*) as total_pedidos
    FROM orders
    WHERE status NOT IN ('cancelado')
    GROUP BY user_id
) sub;

-- =====================================================
-- FIM DAS QUERIES ÚTEIS
-- =====================================================
