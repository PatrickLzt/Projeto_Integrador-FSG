from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from .cupcake import Cupcake
from .cupom import Cupom


class Pedido(models.Model):
    """
    Model para pedidos realizados
    """
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('recebido', 'Recebido'),
        ('em_preparo', 'Em Preparo'),
        ('pronto', 'Pronto'),
        ('saiu_entrega', 'Saiu para Entrega'),
        ('entregue', 'Entregue'),
        ('cancelado', 'Cancelado')
    ]

    TIPO_ENTREGA_CHOICES = [
        ('entrega', 'Entrega'),
        ('retirada', 'Retirada')
    ]

    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='pedidos'
    )
    numero_pedido = models.CharField(max_length=20, unique=True, editable=False)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pendente'
    )
    tipo_entrega = models.CharField(
        max_length=20,
        choices=TIPO_ENTREGA_CHOICES,
        default='entrega'
    )
    
    # Dados do cliente
    nome_cliente = models.CharField(max_length=200)
    email_cliente = models.EmailField()
    telefone_cliente = models.CharField(max_length=20)
    
    # Endereço de entrega
    cep = models.CharField(max_length=10, blank=True, null=True)
    endereco = models.CharField(max_length=300, blank=True, null=True)
    numero = models.CharField(max_length=20, blank=True, null=True)
    complemento = models.CharField(max_length=100, blank=True, null=True)
    bairro = models.CharField(max_length=100, blank=True, null=True)
    cidade = models.CharField(max_length=100, blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)
    
    # Valores
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    valor_desconto = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    valor_frete = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    
    # Cupom utilizado
    cupom = models.ForeignKey(
        Cupom,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pedidos'
    )
    
    observacoes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pedidos'
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['usuario', 'status']),
            models.Index(fields=['numero_pedido']),
        ]

    def __str__(self):
        return f"Pedido #{self.numero_pedido}"

    def save(self, *args, **kwargs):
        if not self.numero_pedido:
            # Gera número único do pedido
            import uuid
            self.numero_pedido = f"CP{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def atualizar_status(self, novo_status):
        """Atualiza o status do pedido"""
        if novo_status in dict(self.STATUS_CHOICES):
            self.status = novo_status
            self.save()
            return True
        return False


class ItemPedido(models.Model):
    """
    Model para itens individuais do pedido
    """
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name='itens'
    )
    cupcake = models.ForeignKey(
        Cupcake,
        on_delete=models.PROTECT
    )
    quantidade = models.IntegerField(validators=[MinValueValidator(1)])
    preco_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    class Meta:
        db_table = 'itens_pedido'
        verbose_name = 'Item do Pedido'
        verbose_name_plural = 'Itens do Pedido'

    def __str__(self):
        return f"{self.quantidade}x {self.cupcake.nome}"

    def save(self, *args, **kwargs):
        # Calcula o subtotal automaticamente
        self.subtotal = self.preco_unitario * self.quantidade
        super().save(*args, **kwargs)
