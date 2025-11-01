from rest_framework import viewsets, permissions
from cupcakes_api.models import Pagamento
from cupcakes_api.serializers import PagamentoSerializer


class PagamentoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para visualizar pagamentos
    
    list: Lista pagamentos (admin ou próprios)
    retrieve: Obtém um pagamento específico
    """
    serializer_class = PagamentoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retorna pagamentos do usuário ou todos (se admin)
        """
        if self.request.user.is_staff:
            return Pagamento.objects.all()
        return Pagamento.objects.filter(pedido__usuario=self.request.user)
