from .categoria_views import CategoriaViewSet
from .cupcake_views import CupcakeViewSet
from .carrinho_views import CarrinhoViewSet
from .cupom_views import CupomViewSet
from .pedido_views import PedidoViewSet
from .pagamento_views import PagamentoViewSet
from .auth_views import RegistroView, LoginView, LogoutView, PerfilView

__all__ = [
    'CategoriaViewSet',
    'CupcakeViewSet',
    'CarrinhoViewSet',
    'CupomViewSet',
    'PedidoViewSet',
    'PagamentoViewSet',
    'RegistroView',
    'LoginView',
    'LogoutView',
    'PerfilView'
]
