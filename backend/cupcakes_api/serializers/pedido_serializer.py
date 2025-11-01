from rest_framework import serializers
from cupcakes_api.models import Pedido, ItemPedido


class ItemPedidoSerializer(serializers.ModelSerializer):
    """
    Serializer para itens do pedido
    """
    cupcake_nome = serializers.CharField(source='cupcake.nome', read_only=True)
    cupcake_imagem = serializers.SerializerMethodField()

    class Meta:
        model = ItemPedido
        fields = [
            'id', 'cupcake', 'cupcake_nome', 'cupcake_imagem',
            'quantidade', 'preco_unitario', 'subtotal'
        ]
        read_only_fields = ['id', 'subtotal']

    def get_cupcake_imagem(self, obj):
        if obj.cupcake.imagem:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cupcake.imagem.url)
            return obj.cupcake.imagem.url
        return obj.cupcake.imagem_url


class PedidoSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Pedido
    """
    itens = ItemPedidoSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    tipo_entrega_display = serializers.CharField(source='get_tipo_entrega_display', read_only=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'numero_pedido', 'usuario', 'status', 'status_display',
            'tipo_entrega', 'tipo_entrega_display', 'nome_cliente',
            'email_cliente', 'telefone_cliente', 'cep', 'endereco',
            'numero', 'complemento', 'bairro', 'cidade', 'estado',
            'subtotal', 'valor_desconto', 'valor_frete', 'total',
            'cupom', 'observacoes', 'itens', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'numero_pedido', 'usuario', 'created_at', 'updated_at'
        ]


class CriarPedidoSerializer(serializers.Serializer):
    """
    Serializer para criar um novo pedido
    """
    # Dados do cliente
    nome_cliente = serializers.CharField(max_length=200)
    email_cliente = serializers.EmailField()
    telefone_cliente = serializers.CharField(max_length=20)
    
    # Tipo de entrega
    tipo_entrega = serializers.ChoiceField(choices=['entrega', 'retirada'])
    
    # Endereço (obrigatório apenas se tipo_entrega = 'entrega')
    cep = serializers.CharField(max_length=10, required=False, allow_blank=True)
    endereco = serializers.CharField(max_length=300, required=False, allow_blank=True)
    numero = serializers.CharField(max_length=20, required=False, allow_blank=True)
    complemento = serializers.CharField(max_length=100, required=False, allow_blank=True)
    bairro = serializers.CharField(max_length=100, required=False, allow_blank=True)
    cidade = serializers.CharField(max_length=100, required=False, allow_blank=True)
    estado = serializers.CharField(max_length=2, required=False, allow_blank=True)
    
    # Pagamento
    metodo_pagamento = serializers.ChoiceField(
        choices=['pix', 'credito', 'debito', 'dinheiro']
    )
    valor_pago = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        allow_null=True
    )
    
    # Cupom e observações
    codigo_cupom = serializers.CharField(required=False, allow_blank=True)
    observacoes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        # Valida endereço se tipo_entrega for 'entrega'
        if data['tipo_entrega'] == 'entrega':
            campos_obrigatorios = ['cep', 'endereco', 'numero', 'bairro', 'cidade', 'estado']
            for campo in campos_obrigatorios:
                if not data.get(campo):
                    raise serializers.ValidationError({
                        campo: f'Campo obrigatório para entrega.'
                    })
        
        return data
