from django.urls import path, include
from rest_framework.routers import DefaultRouter
from cupcakes_api.views import (
    CategoriaViewSet,
    CupcakeViewSet,
    CarrinhoViewSet,
    CupomViewSet,
    PedidoViewSet,
    PagamentoViewSet,
    RegistroView,
    LoginView,
    LogoutView,
    PerfilView
)

# Router para ViewSets
router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'cupcakes', CupcakeViewSet, basename='cupcake')
router.register(r'carrinho', CarrinhoViewSet, basename='carrinho')
router.register(r'cupons', CupomViewSet, basename='cupom')
router.register(r'pedidos', PedidoViewSet, basename='pedido')
router.register(r'pagamentos', PagamentoViewSet, basename='pagamento')

# URLs da aplicação
urlpatterns = [
    # API Router
    path('api/', include(router.urls)),
    
    # Autenticação
    path('api/auth/registro/', RegistroView.as_view(), name='registro'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/auth/perfil/', PerfilView.as_view(), name='perfil'),
]

"""
Documentação das Rotas da API REST:

=== AUTENTICAÇÃO ===
POST   /api/auth/registro/          - Registrar novo usuário
POST   /api/auth/login/             - Login (retorna token)
POST   /api/auth/logout/            - Logout
GET    /api/auth/perfil/            - Obter perfil do usuário
PUT    /api/auth/perfil/            - Atualizar perfil

=== CATEGORIAS ===
GET    /api/categorias/             - Listar todas as categorias
POST   /api/categorias/             - Criar categoria (admin)
GET    /api/categorias/{id}/        - Obter categoria específica
PUT    /api/categorias/{id}/        - Atualizar categoria (admin)
DELETE /api/categorias/{id}/        - Remover categoria (admin)
GET    /api/categorias/{id}/cupcakes/ - Listar cupcakes da categoria

=== CUPCAKES ===
GET    /api/cupcakes/               - Listar todos os cupcakes
POST   /api/cupcakes/               - Criar cupcake (admin)
GET    /api/cupcakes/{id}/          - Obter cupcake específico
PUT    /api/cupcakes/{id}/          - Atualizar cupcake (admin)
DELETE /api/cupcakes/{id}/          - Remover cupcake (admin)
GET    /api/cupcakes/destaques/     - Listar cupcakes em destaque
GET    /api/cupcakes/disponiveis/   - Listar cupcakes disponíveis

=== CARRINHO ===
GET    /api/carrinho/               - Obter carrinho do usuário
POST   /api/carrinho/adicionar_item/ - Adicionar item ao carrinho
        Body: { cupcake_id, quantidade }
DELETE /api/carrinho/remover-item/{item_id}/ - Remover item do carrinho
PATCH  /api/carrinho/atualizar-quantidade/{item_id}/ - Atualizar quantidade
        Body: { quantidade }
POST   /api/carrinho/limpar/        - Limpar carrinho
GET    /api/carrinho/totais/        - Obter totais do carrinho

=== CUPONS ===
GET    /api/cupons/                 - Listar cupons (admin)
POST   /api/cupons/                 - Criar cupom (admin)
GET    /api/cupons/{id}/            - Obter cupom (admin)
PUT    /api/cupons/{id}/            - Atualizar cupom (admin)
DELETE /api/cupons/{id}/            - Remover cupom (admin)
POST   /api/cupons/validar/         - Validar cupom
        Body: { codigo, valor_pedido }
GET    /api/cupons/ativos/          - Listar cupons ativos (admin)

=== PEDIDOS ===
GET    /api/pedidos/                - Listar pedidos
POST   /api/pedidos/criar/          - Criar novo pedido
        Body: { nome_cliente, email_cliente, telefone_cliente,
                tipo_entrega, metodo_pagamento, cep, endereco,
                numero, bairro, cidade, estado, complemento,
                valor_pago, codigo_cupom, observacoes }
GET    /api/pedidos/{id}/           - Obter pedido específico
POST   /api/pedidos/{id}/cancelar/  - Cancelar pedido
PATCH  /api/pedidos/{id}/atualizar_status/ - Atualizar status (admin)
        Body: { status }
GET    /api/pedidos/meus_pedidos/   - Listar pedidos do usuário
GET    /api/pedidos/estatisticas/   - Estatísticas de pedidos (admin)

=== PAGAMENTOS ===
GET    /api/pagamentos/             - Listar pagamentos
GET    /api/pagamentos/{id}/        - Obter pagamento específico
"""
