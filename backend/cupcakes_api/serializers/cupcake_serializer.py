from rest_framework import serializers
from cupcakes_api.models import Cupcake, Categoria


class CupcakeListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listagem de cupcakes
    """
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)
    categoria_slug = serializers.CharField(source='categoria.slug', read_only=True)
    imagem = serializers.SerializerMethodField()

    class Meta:
        model = Cupcake
        fields = [
            'id', 'nome', 'slug', 'descricao', 'preco',
            'categoria_nome', 'categoria_slug', 'imagem',
            'destaque', 'disponivel'
        ]

    def get_imagem(self, obj):
        if obj.imagem:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagem.url)
            return obj.imagem.url
        return obj.imagem_url


class CupcakeSerializer(serializers.ModelSerializer):
    """
    Serializer completo para o modelo Cupcake
    """
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)
    imagem = serializers.SerializerMethodField()
    
    class Meta:
        model = Cupcake
        fields = [
            'id', 'nome', 'slug', 'descricao', 'preco',
            'categoria', 'categoria_nome', 'imagem_url', 'imagem',
            'destaque', 'ativo', 'estoque', 'disponivel',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'disponivel', 'created_at', 'updated_at']

    def get_imagem(self, obj):
        if obj.imagem:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagem.url)
            return obj.imagem.url
        return obj.imagem_url

    def validate_preco(self, value):
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero.")
        return value

    def validate_estoque(self, value):
        if value < 0:
            raise serializers.ValidationError("O estoque não pode ser negativo.")
        return value
