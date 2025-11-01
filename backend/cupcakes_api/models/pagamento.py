from django.db import models
from django.core.validators import MinValueValidator
from .pedido import Pedido


class Pagamento(models.Model):
    """
    Model para pagamentos dos pedidos
    """
    METODO_PAGAMENTO_CHOICES = [
        ('pix', 'PIX'),
        ('credito', 'Cartão de Crédito'),
        ('debito', 'Cartão de Débito'),
        ('dinheiro', 'Dinheiro')
    ]

    STATUS_PAGAMENTO_CHOICES = [
        ('pendente', 'Pendente'),
        ('processando', 'Processando'),
        ('aprovado', 'Aprovado'),
        ('recusado', 'Recusado'),
        ('cancelado', 'Cancelado')
    ]

    pedido = models.OneToOneField(
        Pedido,
        on_delete=models.CASCADE,
        related_name='pagamento'
    )
    metodo_pagamento = models.CharField(
        max_length=20,
        choices=METODO_PAGAMENTO_CHOICES
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_PAGAMENTO_CHOICES,
        default='pendente'
    )
    valor = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    
    # Campos específicos para dinheiro
    valor_pago = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    troco = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)]
    )
    
    # Informações da transação
    transacao_id = models.CharField(max_length=200, blank=True, null=True)
    dados_transacao = models.JSONField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pagamentos'
        verbose_name = 'Pagamento'
        verbose_name_plural = 'Pagamentos'
        ordering = ['-created_at']

    def __str__(self):
        return f"Pagamento {self.metodo_pagamento} - Pedido #{self.pedido.numero_pedido}"

    def processar(self):
        """Simula o processamento do pagamento"""
        # Aqui você integraria com gateways de pagamento reais
        self.status = 'processando'
        self.save()
        
        # Simulação de aprovação automática
        self.aprovar()
        return True

    def aprovar(self):
        """Aprova o pagamento"""
        self.status = 'aprovado'
        self.save()
        # Atualiza o status do pedido
        self.pedido.atualizar_status('recebido')

    def recusar(self):
        """Recusa o pagamento"""
        self.status = 'recusado'
        self.save()

    def cancelar(self):
        """Cancela o pagamento"""
        self.status = 'cancelado'
        self.save()
        self.pedido.atualizar_status('cancelado')
