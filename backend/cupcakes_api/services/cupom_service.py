from decimal import Decimal
from cupcakes_api.models import Cupom
from django.utils import timezone


class CupomService:
    """
    Serviço para gerenciar cupons de desconto
    """

    @staticmethod
    def validar_cupom(codigo, valor_pedido):
        """
        Valida um cupom e retorna informações sobre o desconto
        
        Args:
            codigo (str): Código do cupom
            valor_pedido (Decimal): Valor do pedido
            
        Returns:
            dict: Informações do cupom e desconto calculado
        """
        try:
            cupom = Cupom.objects.get(codigo=codigo.upper())
        except Cupom.DoesNotExist:
            return {
                'valido': False,
                'mensagem': 'Cupom não encontrado'
            }

        # Verifica se o cupom está ativo
        if not cupom.ativo:
            return {
                'valido': False,
                'mensagem': 'Cupom inativo'
            }

        # Verifica datas
        agora = timezone.now()
        if agora < cupom.data_inicio:
            return {
                'valido': False,
                'mensagem': 'Cupom ainda não está disponível'
            }
        
        if agora > cupom.data_expiracao:
            return {
                'valido': False,
                'mensagem': 'Cupom expirado'
            }

        # Verifica uso máximo
        if cupom.uso_atual >= cupom.uso_maximo:
            return {
                'valido': False,
                'mensagem': 'Cupom esgotado'
            }

        # Verifica valor mínimo do pedido
        if valor_pedido < cupom.valor_minimo_pedido:
            return {
                'valido': False,
                'mensagem': f'Pedido mínimo de R$ {cupom.valor_minimo_pedido:.2f} para usar este cupom'
            }

        # Calcula o desconto
        desconto = cupom.calcular_desconto(valor_pedido)

        return {
            'valido': True,
            'cupom': cupom,
            'desconto': desconto,
            'tipo_desconto': cupom.tipo_desconto,
            'mensagem': f'Cupom aplicado com sucesso! Desconto de R$ {desconto:.2f}'
        }

    @staticmethod
    def aplicar_cupom(cupom):
        """
        Marca o cupom como usado
        
        Args:
            cupom (Cupom): Instância do cupom
        """
        cupom.usar()

    @staticmethod
    def calcular_desconto(cupom, valor_pedido):
        """
        Calcula o valor do desconto baseado no cupom
        
        Args:
            cupom (Cupom): Instância do cupom
            valor_pedido (Decimal): Valor do pedido
            
        Returns:
            Decimal: Valor do desconto
        """
        return cupom.calcular_desconto(valor_pedido)

    @staticmethod
    def listar_cupons_ativos():
        """
        Lista todos os cupons ativos e válidos
        
        Returns:
            QuerySet: Cupons válidos
        """
        agora = timezone.now()
        return Cupom.objects.filter(
            ativo=True,
            data_inicio__lte=agora,
            data_expiracao__gte=agora
        ).exclude(uso_atual__gte=models.F('uso_maximo'))
