from rest_framework import serializers
from cupcakes_api.models import Carrinho, ItemCarrinho, Cupcake


class ItemCarrinhoSerializer(serializers.ModelSerializer):
    """
    Serializer para itens do carrinho
    """
    cupcake_nome = serializers.CharField(source='cupcake.nome', read_only=True)
    cupcake_preco = serializers.DecimalField(
        source='cupcake.preco',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    cupcake_imagem = serializers.SerializerMethodField()
    subtotal = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = ItemCarrinho
        fields = [
            'id', 'cupcake', 'cupcake_nome', 'cupcake_preco',
            'cupcake_imagem', 'quantidade', 'subtotal',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_cupcake_imagem(self, obj):
        if obj.cupcake.imagem:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cupcake.imagem.url)
            return obj.cupcake.imagem.url
        return obj.cupcake.imagem_url


class CarrinhoSerializer(serializers.ModelSerializer):
    """
    Serializer para o carrinho de compras
    """
    itens = ItemCarrinhoSerializer(many=True, read_only=True)
    total_itens = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = Carrinho
        fields = ['id', 'usuario', 'itens', 'total_itens', 'subtotal', 'created_at', 'updated_at']
        read_only_fields = ['id', 'usuario', 'created_at', 'updated_at']


class AdicionarItemCarrinhoSerializer(serializers.Serializer):
    """
    Serializer para adicionar itens ao carrinho
    """
    cupcake_id = serializers.IntegerField()
    quantidade = serializers.IntegerField(min_value=1, default=1)

    def validate_cupcake_id(self, value):
        try:
            cupcake = Cupcake.objects.get(id=value)
            if not cupcake.disponivel:
                raise serializers.ValidationError("Este cupcake não está disponível.")
        except Cupcake.DoesNotExist:
            raise serializers.ValidationError("Cupcake não encontrado.")
        return value

    def validate(self, data):
        cupcake = Cupcake.objects.get(id=data['cupcake_id'])
        if cupcake.estoque < data['quantidade']:
            raise serializers.ValidationError(
                f"Quantidade solicitada ({data['quantidade']}) excede o estoque disponível ({cupcake.estoque})."
            )
        return data
