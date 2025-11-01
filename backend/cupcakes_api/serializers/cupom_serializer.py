from rest_framework import serializers
from cupcakes_api.models import Cupom


class CupomSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Cupom
    """
    valido = serializers.BooleanField(read_only=True)

    class Meta:
        model = Cupom
        fields = [
            'id', 'codigo', 'descricao', 'tipo_desconto',
            'valor_desconto', 'percentual_desconto',
            'valor_minimo_pedido', 'data_inicio', 'data_expiracao',
            'uso_maximo', 'uso_atual', 'ativo', 'valido',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'uso_atual', 'created_at', 'updated_at']

    def validate(self, data):
        if data.get('tipo_desconto') == 'percentual':
            if not data.get('percentual_desconto'):
                raise serializers.ValidationError({
                    'percentual_desconto': 'Obrigatório para desconto percentual.'
                })
        elif data.get('tipo_desconto') == 'fixo':
            if not data.get('valor_desconto'):
                raise serializers.ValidationError({
                    'valor_desconto': 'Obrigatório para desconto fixo.'
                })
        return data


class ValidarCupomSerializer(serializers.Serializer):
    """
    Serializer para validar cupom e calcular desconto
    """
    codigo = serializers.CharField()
    valor_pedido = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate_codigo(self, value):
        try:
            cupom = Cupom.objects.get(codigo=value.upper())
            if not cupom.valido:
                raise serializers.ValidationError("Cupom inválido ou expirado.")
            return value.upper()
        except Cupom.DoesNotExist:
            raise serializers.ValidationError("Cupom não encontrado.")
