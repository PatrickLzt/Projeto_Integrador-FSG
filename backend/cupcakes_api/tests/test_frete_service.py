from django.test import TestCase
from decimal import Decimal
from cupcakes_api.services import FreteService


class FreteServiceTestCase(TestCase):
    """
    Testes unitários para o serviço de cálculo de frete
    """

    def test_calcular_frete_retirada(self):
        """
        Testa cálculo de frete para retirada na loja
        """
        resultado = FreteService.calcular_frete(
            cep='90000-000',
            estado='RS',
            tipo_entrega='retirada'
        )
        
        self.assertEqual(resultado['valor'], Decimal('0.00'))
        self.assertEqual(resultado['tipo'], 'retirada')
        self.assertEqual(resultado['prazo_dias'], 0)

    def test_calcular_frete_rs(self):
        """
        Testa cálculo de frete para Rio Grande do Sul
        """
        resultado = FreteService.calcular_frete(
            cep='90000-000',
            estado='RS',
            tipo_entrega='entrega',
            valor_pedido=Decimal('50.00')
        )
        
        self.assertEqual(resultado['valor'], Decimal('8.00'))
        self.assertEqual(resultado['tipo'], 'pago')
        self.assertEqual(resultado['prazo_dias'], 2)

    def test_calcular_frete_sp(self):
        """
        Testa cálculo de frete para São Paulo
        """
        resultado = FreteService.calcular_frete(
            cep='01000-000',
            estado='SP',
            tipo_entrega='entrega',
            valor_pedido=Decimal('50.00')
        )
        
        self.assertEqual(resultado['valor'], Decimal('20.00'))
        self.assertEqual(resultado['tipo'], 'pago')
        self.assertEqual(resultado['prazo_dias'], 5)

    def test_calcular_frete_estado_default(self):
        """
        Testa cálculo de frete para estado não mapeado
        """
        resultado = FreteService.calcular_frete(
            cep='60000-000',
            estado='CE',
            tipo_entrega='entrega',
            valor_pedido=Decimal('50.00')
        )
        
        self.assertEqual(resultado['valor'], Decimal('30.00'))
        self.assertEqual(resultado['tipo'], 'pago')
        self.assertEqual(resultado['prazo_dias'], 10)

    def test_calcular_frete_gratis(self):
        """
        Testa frete grátis para pedidos acima do valor mínimo
        """
        resultado = FreteService.calcular_frete(
            cep='90000-000',
            estado='RS',
            tipo_entrega='entrega',
            valor_pedido=Decimal('150.00')
        )
        
        self.assertEqual(resultado['valor'], Decimal('0.00'))
        self.assertEqual(resultado['tipo'], 'gratis')
        self.assertIn('Frete grátis', resultado['mensagem'])

    def test_validar_cep_valido(self):
        """
        Testa validação de CEP válido
        """
        self.assertTrue(FreteService.validar_cep('90000-000'))
        self.assertTrue(FreteService.validar_cep('90000000'))
        self.assertTrue(FreteService.validar_cep('01310-100'))

    def test_validar_cep_invalido(self):
        """
        Testa validação de CEP inválido
        """
        self.assertFalse(FreteService.validar_cep(''))
        self.assertFalse(FreteService.validar_cep('1234'))
        self.assertFalse(FreteService.validar_cep('123456789'))
        self.assertFalse(FreteService.validar_cep(None))

    def test_formatar_cep(self):
        """
        Testa formatação de CEP
        """
        self.assertEqual(FreteService.formatar_cep('90000000'), '90000-000')
        self.assertEqual(FreteService.formatar_cep('90000-000'), '90000-000')
        self.assertEqual(FreteService.formatar_cep(''), '')
        self.assertEqual(FreteService.formatar_cep('1234'), '1234')

    def test_calcular_frete_por_peso(self):
        """
        Testa cálculo de frete por peso e distância
        """
        # 2kg, 10km
        frete = FreteService.calcular_frete_por_peso(2.0, 10.0)
        
        # taxa_base (5.00) + (2kg * 2.00) + (10km * 0.10) = 5 + 4 + 1 = 10.00
        self.assertEqual(frete, Decimal('10.00'))

    def test_calcular_frete_por_peso_longa_distancia(self):
        """
        Testa cálculo de frete por peso com longa distância
        """
        # 5kg, 100km
        frete = FreteService.calcular_frete_por_peso(5.0, 100.0)
        
        # taxa_base (5.00) + (5kg * 2.00) + (100km * 0.10) = 5 + 10 + 10 = 25.00
        self.assertEqual(frete, Decimal('25.00'))

    def test_calcular_prazo_entrega(self):
        """
        Testa cálculo de prazo de entrega por estado
        """
        self.assertEqual(FreteService._calcular_prazo('RS'), 2)
        self.assertEqual(FreteService._calcular_prazo('SC'), 3)
        self.assertEqual(FreteService._calcular_prazo('PR'), 4)
        self.assertEqual(FreteService._calcular_prazo('SP'), 5)
        self.assertEqual(FreteService._calcular_prazo('RJ'), 5)
        self.assertEqual(FreteService._calcular_prazo('MG'), 6)
        self.assertEqual(FreteService._calcular_prazo('CE'), 10)
        self.assertEqual(FreteService._calcular_prazo(''), 10)

    def test_valor_minimo_frete_gratis(self):
        """
        Testa se o valor mínimo para frete grátis está correto
        """
        self.assertEqual(FreteService.VALOR_FRETE_GRATIS, Decimal('100.00'))

    def test_frete_limiar_frete_gratis(self):
        """
        Testa frete no limiar do valor para frete grátis
        """
        # Exatamente R$ 100 - deve ter frete grátis
        resultado = FreteService.calcular_frete(
            cep='90000-000',
            estado='RS',
            tipo_entrega='entrega',
            valor_pedido=Decimal('100.00')
        )
        self.assertEqual(resultado['valor'], Decimal('0.00'))
        self.assertEqual(resultado['tipo'], 'gratis')

        # R$ 99.99 - deve cobrar frete
        resultado = FreteService.calcular_frete(
            cep='90000-000',
            estado='RS',
            tipo_entrega='entrega',
            valor_pedido=Decimal('99.99')
        )
        self.assertEqual(resultado['valor'], Decimal('8.00'))
        self.assertEqual(resultado['tipo'], 'pago')
