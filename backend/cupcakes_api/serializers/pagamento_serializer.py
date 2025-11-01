from rest_framework import serializers
from cupcakes_api.models import Pagamento


class PagamentoSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Pagamento
    """
    metodo_pagamento_display = serializers.CharField(
        source='get_metodo_pagamento_display',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    numero_pedido = serializers.CharField(
        source='pedido.numero_pedido',
        read_only=True
    )

    class Meta:
        model = Pagamento
        fields = [
            'id', 'pedido', 'numero_pedido', 'metodo_pagamento',
            'metodo_pagamento_display', 'status', 'status_display',
            'valor', 'valor_pago', 'troco', 'transacao_id',
            'dados_transacao', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'status', 'transacao_id', 'dados_transacao',
            'created_at', 'updated_at'
        ]
