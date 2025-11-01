from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class Cupom(models.Model):
    """
    Model para cupons de desconto
    """
    TIPO_DESCONTO_CHOICES = [
        ('percentual', 'Percentual'),
        ('fixo', 'Valor Fixo')
    ]

    codigo = models.CharField(max_length=50, unique=True)
    descricao = models.TextField(blank=True, null=True)
    tipo_desconto = models.CharField(
        max_length=20,
        choices=TIPO_DESCONTO_CHOICES,
        default='percentual'
    )
    valor_desconto = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    percentual_desconto = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        null=True,
        blank=True
    )
    valor_minimo_pedido = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    data_inicio = models.DateTimeField(default=timezone.now)
    data_expiracao = models.DateTimeField()
    uso_maximo = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    uso_atual = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cupons'
        verbose_name = 'Cupom'
        verbose_name_plural = 'Cupons'
        ordering = ['-created_at']

    def __str__(self):
        return self.codigo

    @property
    def valido(self):
        """Verifica se o cupom está válido"""
        agora = timezone.now()
        return (
            self.ativo and
            self.data_inicio <= agora <= self.data_expiracao and
            self.uso_atual < self.uso_maximo
        )

    def calcular_desconto(self, valor_pedido):
        """Calcula o valor do desconto baseado no pedido"""
        if not self.valido:
            return 0

        if valor_pedido < self.valor_minimo_pedido:
            return 0

        if self.tipo_desconto == 'percentual':
            desconto = valor_pedido * (self.percentual_desconto / 100)
        else:
            desconto = self.valor_desconto

        return min(desconto, valor_pedido)

    def usar(self):
        """Incrementa o uso do cupom"""
        self.uso_atual += 1
        self.save()
