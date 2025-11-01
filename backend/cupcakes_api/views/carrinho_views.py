from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from cupcakes_api.models import Carrinho, ItemCarrinho
from cupcakes_api.serializers import (
    CarrinhoSerializer,
    ItemCarrinhoSerializer,
    AdicionarItemCarrinhoSerializer
)
from cupcakes_api.services import CarrinhoService


class CarrinhoViewSet(viewsets.ViewSet):
    """
    ViewSet para gerenciar carrinho de compras
    
    retrieve: Obtém o carrinho do usuário
    adicionar_item: Adiciona um item ao carrinho
    remover_item: Remove um item do carrinho
    atualizar_quantidade: Atualiza quantidade de um item
    limpar: Remove todos os itens do carrinho
    """
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request):
        """
        Obtém o carrinho do usuário autenticado
        """
        carrinho = CarrinhoService.obter_ou_criar_carrinho(request.user)
        serializer = CarrinhoSerializer(carrinho, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def adicionar_item(self, request):
        """
        Adiciona um item ao carrinho
        
        Body:
            cupcake_id: ID do cupcake
            quantidade: Quantidade (padrão: 1)
        """
        serializer = AdicionarItemCarrinhoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resultado = CarrinhoService.adicionar_item(
            usuario=request.user,
            cupcake_id=serializer.validated_data['cupcake_id'],
            quantidade=serializer.validated_data['quantidade']
        )

        if resultado['sucesso']:
            carrinho_serializer = CarrinhoSerializer(
                resultado['carrinho'],
                context={'request': request}
            )
            return Response({
                'mensagem': resultado['mensagem'],
                'carrinho': carrinho_serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'mensagem': resultado['mensagem']
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], url_path='remover-item/(?P<item_id>[^/.]+)')
    def remover_item(self, request, item_id=None):
        """
        Remove um item do carrinho
        """
        resultado = CarrinhoService.remover_item(request.user, item_id)

        if resultado['sucesso']:
            return Response({
                'mensagem': resultado['mensagem']
            }, status=status.HTTP_200_OK)

        return Response({
            'mensagem': resultado['mensagem']
        }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['patch'], url_path='atualizar-quantidade/(?P<item_id>[^/.]+)')
    def atualizar_quantidade(self, request, item_id=None):
        """
        Atualiza a quantidade de um item
        
        Body:
            quantidade: Nova quantidade
        """
        quantidade = request.data.get('quantidade')
        
        if quantidade is None:
            return Response({
                'mensagem': 'Quantidade é obrigatória'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantidade = int(quantidade)
        except ValueError:
            return Response({
                'mensagem': 'Quantidade inválida'
            }, status=status.HTTP_400_BAD_REQUEST)

        resultado = CarrinhoService.atualizar_quantidade(
            request.user,
            item_id,
            quantidade
        )

        if resultado['sucesso']:
            return Response({
                'mensagem': resultado['mensagem']
            }, status=status.HTTP_200_OK)

        return Response({
            'mensagem': resultado['mensagem']
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def limpar(self, request):
        """
        Remove todos os itens do carrinho
        """
        resultado = CarrinhoService.limpar_carrinho(request.user)
        return Response({
            'mensagem': resultado['mensagem']
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def totais(self, request):
        """
        Calcula os totais do carrinho
        """
        carrinho = CarrinhoService.obter_ou_criar_carrinho(request.user)
        totais = CarrinhoService.calcular_totais(carrinho)
        
        return Response(totais)
