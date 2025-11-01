from decimal import Decimal


class FreteService:
    """
    Serviço para cálculo de frete
    """

    # Taxas de frete por região (simulado)
    TAXAS_FRETE = {
        'RS': Decimal('8.00'),
        'SC': Decimal('12.00'),
        'PR': Decimal('15.00'),
        'SP': Decimal('20.00'),
        'RJ': Decimal('22.00'),
        'MG': Decimal('25.00'),
        'default': Decimal('30.00')
    }

    # Valor mínimo para frete grátis
    VALOR_FRETE_GRATIS = Decimal('100.00')

    # Taxa fixa para retirada
    TAXA_RETIRADA = Decimal('0.00')

    @staticmethod
    def calcular_frete(cep, estado, tipo_entrega='entrega', valor_pedido=Decimal('0.00')):
        """
        Calcula o valor do frete baseado no CEP e estado
        
        Args:
            cep (str): CEP do endereço
            estado (str): Estado (sigla)
            tipo_entrega (str): 'entrega' ou 'retirada'
            valor_pedido (Decimal): Valor do pedido para verificar frete grátis
            
        Returns:
            dict: Informações do frete
        """
        
        # Retirada na loja não tem frete
        if tipo_entrega == 'retirada':
            return {
                'valor': FreteService.TAXA_RETIRADA,
                'tipo': 'retirada',
                'prazo_dias': 0,
                'mensagem': 'Retirada na loja - Sem taxa de entrega'
            }

        # Verifica frete grátis
        if valor_pedido >= FreteService.VALOR_FRETE_GRATIS:
            return {
                'valor': Decimal('0.00'),
                'tipo': 'gratis',
                'prazo_dias': FreteService._calcular_prazo(estado),
                'mensagem': f'Frete grátis! Entrega em até {FreteService._calcular_prazo(estado)} dias úteis'
            }

        # Calcula frete por estado
        estado_upper = estado.upper() if estado else 'default'
        valor_frete = FreteService.TAXAS_FRETE.get(
            estado_upper,
            FreteService.TAXAS_FRETE['default']
        )

        prazo = FreteService._calcular_prazo(estado_upper)

        return {
            'valor': valor_frete,
            'tipo': 'pago',
            'prazo_dias': prazo,
            'mensagem': f'Frete de R$ {valor_frete:.2f} - Entrega em até {prazo} dias úteis'
        }

    @staticmethod
    def _calcular_prazo(estado):
        """
        Calcula prazo de entrega baseado no estado
        
        Args:
            estado (str): Sigla do estado
            
        Returns:
            int: Prazo em dias úteis
        """
        prazos = {
            'RS': 2,
            'SC': 3,
            'PR': 4,
            'SP': 5,
            'RJ': 5,
            'MG': 6,
            'default': 10
        }
        return prazos.get(estado.upper() if estado else 'default', 10)

    @staticmethod
    def validar_cep(cep):
        """
        Valida formato do CEP
        
        Args:
            cep (str): CEP a ser validado
            
        Returns:
            bool: True se válido
        """
        if not cep:
            return False
        
        # Remove caracteres não numéricos
        cep_numeros = ''.join(filter(str.isdigit, cep))
        
        # CEP deve ter 8 dígitos
        return len(cep_numeros) == 8

    @staticmethod
    def formatar_cep(cep):
        """
        Formata CEP no padrão XXXXX-XXX
        
        Args:
            cep (str): CEP a ser formatado
            
        Returns:
            str: CEP formatado
        """
        if not cep:
            return ''
        
        cep_numeros = ''.join(filter(str.isdigit, cep))
        
        if len(cep_numeros) == 8:
            return f'{cep_numeros[:5]}-{cep_numeros[5:]}'
        
        return cep

    @staticmethod
    def calcular_frete_por_peso(peso_kg, distancia_km):
        """
        Calcula frete baseado em peso e distância (método alternativo)
        
        Args:
            peso_kg (float): Peso total em kg
            distancia_km (float): Distância em km
            
        Returns:
            Decimal: Valor do frete
        """
        taxa_base = Decimal('5.00')
        taxa_por_kg = Decimal('2.00')
        taxa_por_km = Decimal('0.10')
        
        valor = taxa_base + (Decimal(str(peso_kg)) * taxa_por_kg) + (Decimal(str(distancia_km)) * taxa_por_km)
        
        return valor.quantize(Decimal('0.01'))
