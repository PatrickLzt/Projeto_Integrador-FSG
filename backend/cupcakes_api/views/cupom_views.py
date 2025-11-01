from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from cupcakes_api.models import Cupom
from cupcakes_api.serializers import CupomSerializer, ValidarCupomSerializer
from cupcakes_api.services import CupomService


class CupomViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar cupons
    
    list: Lista cupons (admin)
    retrieve: Obtém um cupom específico (admin)
    create: Cria um novo cupom (admin)
    update: Atualiza um cupom (admin)
    destroy: Remove um cupom (admin)
    validar: Valida um cupom e calcula desconto
    """
    queryset = Cupom.objects.all()
    serializer_class = CupomSerializer

    def get_permissions(self):
        """
        Define permissões baseadas na action
        """
        if self.action == 'validar':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    @action(detail=False, methods=['post'])
    def validar(self, request):
        """
        Valida um cupom e calcula o desconto
        
        Body:
            codigo: Código do cupom
            valor_pedido: Valor do pedido
        """
        serializer = ValidarCupomSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resultado = CupomService.validar_cupom(
            codigo=serializer.validated_data['codigo'],
            valor_pedido=serializer.validated_data['valor_pedido']
        )

        if resultado['valido']:
            return Response({
                'valido': True,
                'codigo': resultado['cupom'].codigo,
                'desconto': resultado['desconto'],
                'tipo_desconto': resultado['tipo_desconto'],
                'mensagem': resultado['mensagem']
            }, status=status.HTTP_200_OK)

        return Response({
            'valido': False,
            'mensagem': resultado['mensagem']
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def ativos(self, request):
        """
        Lista cupons ativos (apenas admin)
        """
        cupons = CupomService.listar_cupons_ativos()
        serializer = self.get_serializer(cupons, many=True)
        return Response(serializer.data)
