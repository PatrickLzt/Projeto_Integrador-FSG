from rest_framework import serializers
from cupcakes_api.models import Categoria


class CategoriaSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Categoria
    """
    total_cupcakes = serializers.SerializerMethodField()

    class Meta:
        model = Categoria
        fields = ['id', 'nome', 'slug', 'descricao', 'ativo', 'total_cupcakes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_total_cupcakes(self, obj):
        return obj.cupcakes.filter(ativo=True).count()
