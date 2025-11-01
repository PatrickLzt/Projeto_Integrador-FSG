from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from .cupcake import Cupcake


class Carrinho(models.Model):
    """
    Model para carrinho de compras do usuário
    """
    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='carrinho'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'carrinhos'
        verbose_name = 'Carrinho'
        verbose_name_plural = 'Carrinhos'

    def __str__(self):
        return f"Carrinho de {self.usuario.username}"

    @property
    def total_itens(self):
        """Retorna o total de itens no carrinho"""
        return sum(item.quantidade for item in self.itens.all())

    @property
    def subtotal(self):
        """Calcula o subtotal do carrinho"""
        return sum(item.subtotal for item in self.itens.all())

    def limpar(self):
        """Remove todos os itens do carrinho"""
        self.itens.all().delete()


class ItemCarrinho(models.Model):
    """
    Model para itens individuais do carrinho
    """
    carrinho = models.ForeignKey(
        Carrinho,
        on_delete=models.CASCADE,
        related_name='itens'
    )
    cupcake = models.ForeignKey(
        Cupcake,
        on_delete=models.CASCADE
    )
    quantidade = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'itens_carrinho'
        verbose_name = 'Item do Carrinho'
        verbose_name_plural = 'Itens do Carrinho'
        unique_together = ['carrinho', 'cupcake']

    def __str__(self):
        return f"{self.quantidade}x {self.cupcake.nome}"

    @property
    def subtotal(self):
        """Calcula o subtotal do item"""
        return self.cupcake.preco * self.quantidade
