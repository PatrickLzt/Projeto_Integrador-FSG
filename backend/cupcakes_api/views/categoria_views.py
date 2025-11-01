from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from cupcakes_api.models import Categoria
from cupcakes_api.serializers import CategoriaSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar categorias
    
    list: Lista todas as categorias ativas
    retrieve: Obtém uma categoria específica
    create: Cria uma nova categoria (admin)
    update: Atualiza uma categoria (admin)
    destroy: Remove uma categoria (admin)
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def get_permissions(self):
        """
        Define permissões baseadas na action
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        """
        Filtra categorias ativas para usuários não-admin
        """
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(ativo=True)
        return queryset

    @action(detail=True, methods=['get'])
    def cupcakes(self, request, pk=None):
        """
        Lista cupcakes de uma categoria específica
        """
        categoria = self.get_object()
        cupcakes = categoria.cupcakes.filter(ativo=True)
        
        from cupcakes_api.serializers import CupcakeListSerializer
        serializer = CupcakeListSerializer(cupcakes, many=True, context={'request': request})
        
        return Response(serializer.data)
