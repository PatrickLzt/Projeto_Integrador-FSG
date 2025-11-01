from django.test import TestCase
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from cupcakes_api.models import Cupom
from cupcakes_api.services import CupomService


class CupomServiceTestCase(TestCase):
    """
    Testes unitários para o serviço de cupons
    """

    def setUp(self):
        """
        Configura dados de teste
        """
        # Cupom percentual válido
        self.cupom_percentual = Cupom.objects.create(
            codigo='DESCONTO10',
            descricao='10% de desconto',
            tipo_desconto='percentual',
            percentual_desconto=Decimal('10.00'),
            valor_minimo_pedido=Decimal('50.00'),
            data_inicio=timezone.now(),
            data_expiracao=timezone.now() + timedelta(days=30),
            uso_maximo=100,
            ativo=True
        )

        # Cupom valor fixo válido
        self.cupom_fixo = Cupom.objects.create(
            codigo='VALE15',
            descricao='R$ 15 de desconto',
            tipo_desconto='fixo',
            valor_desconto=Decimal('15.00'),
            valor_minimo_pedido=Decimal('100.00'),
            data_inicio=timezone.now(),
            data_expiracao=timezone.now() + timedelta(days=30),
            uso_maximo=50,
            ativo=True
        )

        # Cupom expirado
        self.cupom_expirado = Cupom.objects.create(
            codigo='EXPIRADO',
            descricao='Cupom expirado',
            tipo_desconto='percentual',
            percentual_desconto=Decimal('20.00'),
            valor_minimo_pedido=Decimal('0.00'),
            data_inicio=timezone.now() - timedelta(days=60),
            data_expiracao=timezone.now() - timedelta(days=30),
            uso_maximo=100,
            ativo=True
        )

        # Cupom esgotado
        self.cupom_esgotado = Cupom.objects.create(
            codigo='ESGOTADO',
            descricao='Cupom esgotado',
            tipo_desconto='percentual',
            percentual_desconto=Decimal('15.00'),
            valor_minimo_pedido=Decimal('0.00'),
            data_inicio=timezone.now(),
            data_expiracao=timezone.now() + timedelta(days=30),
            uso_maximo=10,
            uso_atual=10,
            ativo=True
        )

    def test_validar_cupom_percentual_valido(self):
        """
        Testa validação de cupom percentual válido
        """
        resultado = CupomService.validar_cupom('DESCONTO10', Decimal('100.00'))
        
        self.assertTrue(resultado['valido'])
        self.assertEqual(resultado['desconto'], Decimal('10.00'))
        self.assertEqual(resultado['tipo_desconto'], 'percentual')

    def test_validar_cupom_fixo_valido(self):
        """
        Testa validação de cupom de valor fixo válido
        """
        resultado = CupomService.validar_cupom('VALE15', Decimal('150.00'))
        
        self.assertTrue(resultado['valido'])
        self.assertEqual(resultado['desconto'], Decimal('15.00'))
        self.assertEqual(resultado['tipo_desconto'], 'fixo')

    def test_validar_cupom_inexistente(self):
        """
        Testa validação de cupom inexistente
        """
        resultado = CupomService.validar_cupom('NAEXISTE', Decimal('100.00'))
        
        self.assertFalse(resultado['valido'])
        self.assertEqual(resultado['mensagem'], 'Cupom não encontrado')

    def test_validar_cupom_expirado(self):
        """
        Testa validação de cupom expirado
        """
        resultado = CupomService.validar_cupom('EXPIRADO', Decimal('100.00'))
        
        self.assertFalse(resultado['valido'])
        self.assertEqual(resultado['mensagem'], 'Cupom expirado')

    def test_validar_cupom_esgotado(self):
        """
        Testa validação de cupom esgotado
        """
        resultado = CupomService.validar_cupom('ESGOTADO', Decimal('100.00'))
        
        self.assertFalse(resultado['valido'])
        self.assertEqual(resultado['mensagem'], 'Cupom esgotado')

    def test_validar_cupom_valor_minimo_nao_atingido(self):
        """
        Testa validação quando valor mínimo não é atingido
        """
        resultado = CupomService.validar_cupom('DESCONTO10', Decimal('30.00'))
        
        self.assertFalse(resultado['valido'])
        self.assertIn('Pedido mínimo', resultado['mensagem'])

    def test_calcular_desconto_percentual(self):
        """
        Testa cálculo de desconto percentual
        """
        desconto = CupomService.calcular_desconto(
            self.cupom_percentual,
            Decimal('100.00')
        )
        
        self.assertEqual(desconto, Decimal('10.00'))

    def test_calcular_desconto_fixo(self):
        """
        Testa cálculo de desconto fixo
        """
        desconto = CupomService.calcular_desconto(
            self.cupom_fixo,
            Decimal('150.00')
        )
        
        self.assertEqual(desconto, Decimal('15.00'))

    def test_calcular_desconto_maior_que_valor(self):
        """
        Testa que desconto não pode ser maior que o valor do pedido
        """
        desconto = CupomService.calcular_desconto(
            self.cupom_fixo,
            Decimal('10.00')
        )
        
        # Desconto deve ser limitado ao valor do pedido
        self.assertLessEqual(desconto, Decimal('10.00'))

    def test_aplicar_cupom(self):
        """
        Testa aplicação de cupom (incremento de uso)
        """
        uso_inicial = self.cupom_percentual.uso_atual
        CupomService.aplicar_cupom(self.cupom_percentual)
        
        self.cupom_percentual.refresh_from_db()
        self.assertEqual(self.cupom_percentual.uso_atual, uso_inicial + 1)

    def test_cupom_property_valido(self):
        """
        Testa a property 'valido' do modelo Cupom
        """
        self.assertTrue(self.cupom_percentual.valido)
        self.assertTrue(self.cupom_fixo.valido)
        self.assertFalse(self.cupom_expirado.valido)
        self.assertFalse(self.cupom_esgotado.valido)
