from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from cupcakes_api.models import Cupcake
from cupcakes_api.serializers import CupcakeSerializer, CupcakeListSerializer


class CupcakeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar cupcakes
    
    list: Lista todos os cupcakes disponíveis
    retrieve: Obtém um cupcake específico
    create: Cria um novo cupcake (admin)
    update: Atualiza um cupcake (admin)
    destroy: Remove um cupcake (admin)
    """
    queryset = Cupcake.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'destaque', 'ativo']
    search_fields = ['nome', 'descricao']
    ordering_fields = ['preco', 'nome', 'created_at']
    ordering = ['-destaque', 'nome']

    def get_serializer_class(self):
        """
        Usa serializer simplificado para listagem
        """
        if self.action == 'list':
            return CupcakeListSerializer
        return CupcakeSerializer

    def get_permissions(self):
        """
        Define permissões baseadas na action
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        """
        Filtra cupcakes ativos para usuários não-admin
        """
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(ativo=True)
        return queryset

    @action(detail=False, methods=['get'])
    def destaques(self, request):
        """
        Lista cupcakes em destaque
        """
        cupcakes = self.get_queryset().filter(destaque=True, ativo=True)
        serializer = self.get_serializer(cupcakes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def disponiveis(self, request):
        """
        Lista cupcakes disponíveis (com estoque)
        """
        cupcakes = self.get_queryset().filter(ativo=True, estoque__gt=0)
        serializer = self.get_serializer(cupcakes, many=True)
        return Response(serializer.data)
