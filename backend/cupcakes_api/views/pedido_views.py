from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from cupcakes_api.models import Pedido
from cupcakes_api.serializers import PedidoSerializer, CriarPedidoSerializer
from cupcakes_api.services import PedidoService


class PedidoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para gerenciar pedidos
    
    list: Lista pedidos do usuário
    retrieve: Obtém um pedido específico
    criar: Cria um novo pedido
    cancelar: Cancela um pedido
    atualizar_status: Atualiza status do pedido (admin)
    """
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Retorna pedidos do usuário ou todos (se admin)
        """
        if self.request.user.is_staff:
            return Pedido.objects.all()
        return PedidoService.listar_pedidos_usuario(self.request.user)

    @action(detail=False, methods=['post'])
    def criar(self, request):
        """
        Cria um novo pedido a partir do carrinho
        
        Body:
            nome_cliente: Nome do cliente
            email_cliente: Email do cliente
            telefone_cliente: Telefone do cliente
            tipo_entrega: 'entrega' ou 'retirada'
            metodo_pagamento: 'pix', 'credito', 'debito', 'dinheiro'
            cep: CEP (obrigatório se entrega)
            endereco: Endereço (obrigatório se entrega)
            numero: Número (obrigatório se entrega)
            bairro: Bairro (obrigatório se entrega)
            cidade: Cidade (obrigatório se entrega)
            estado: Estado (obrigatório se entrega)
            complemento: Complemento (opcional)
            valor_pago: Valor pago (obrigatório se dinheiro)
            codigo_cupom: Código do cupom (opcional)
            observacoes: Observações (opcional)
        """
        serializer = CriarPedidoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resultado = PedidoService.criar_pedido(
            usuario=request.user,
            dados_pedido=serializer.validated_data
        )

        if resultado['sucesso']:
            pedido_serializer = PedidoSerializer(
                resultado['pedido'],
                context={'request': request}
            )
            return Response({
                'mensagem': resultado['mensagem'],
                'pedido': pedido_serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'mensagem': resultado['mensagem']
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        """
        Cancela um pedido
        """
        pedido = self.get_object()
        
        # Verifica se o usuário é o dono do pedido ou admin
        if pedido.usuario != request.user and not request.user.is_staff:
            return Response({
                'mensagem': 'Você não tem permissão para cancelar este pedido'
            }, status=status.HTTP_403_FORBIDDEN)

        resultado = PedidoService.cancelar_pedido(
            pedido_id=pk,
            usuario=request.user if not request.user.is_staff else None
        )

        if resultado['sucesso']:
            pedido_serializer = PedidoSerializer(
                resultado['pedido'],
                context={'request': request}
            )
            return Response({
                'mensagem': resultado['mensagem'],
                'pedido': pedido_serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            'mensagem': resultado['mensagem']
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def atualizar_status(self, request, pk=None):
        """
        Atualiza o status de um pedido (apenas admin)
        
        Body:
            status: Novo status
        """
        novo_status = request.data.get('status')
        
        if not novo_status:
            return Response({
                'mensagem': 'Status é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)

        resultado = PedidoService.atualizar_status_pedido(pk, novo_status)

        if resultado['sucesso']:
            pedido_serializer = PedidoSerializer(
                resultado['pedido'],
                context={'request': request}
            )
            return Response({
                'mensagem': resultado['mensagem'],
                'pedido': pedido_serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            'mensagem': resultado['mensagem']
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def meus_pedidos(self, request):
        """
        Lista todos os pedidos do usuário autenticado
        """
        pedidos = PedidoService.listar_pedidos_usuario(request.user)
        serializer = self.get_serializer(pedidos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def estatisticas(self, request):
        """
        Retorna estatísticas de pedidos (apenas admin)
        """
        stats = PedidoService.calcular_estatisticas_pedidos()
        return Response(stats)
