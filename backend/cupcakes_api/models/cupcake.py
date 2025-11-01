from django.db import models
from django.core.validators import MinValueValidator
from .categoria import Categoria


class Cupcake(models.Model):
    """
    Model para cupcakes disponíveis na loja
    """
    nome = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    descricao = models.TextField()
    preco = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    categoria = models.ForeignKey(
        Categoria, 
        on_delete=models.PROTECT,
        related_name='cupcakes'
    )
    imagem_url = models.URLField(max_length=500, blank=True, null=True)
    imagem = models.ImageField(upload_to='cupcakes/', blank=True, null=True)
    destaque = models.BooleanField(default=False)
    ativo = models.BooleanField(default=True)
    estoque = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cupcakes'
        verbose_name = 'Cupcake'
        verbose_name_plural = 'Cupcakes'
        ordering = ['-destaque', 'nome']
        indexes = [
            models.Index(fields=['categoria', 'ativo']),
            models.Index(fields=['destaque']),
        ]

    def __str__(self):
        return self.nome

    @property
    def disponivel(self):
        """Verifica se o cupcake está disponível para venda"""
        return self.ativo and self.estoque > 0

    def reduzir_estoque(self, quantidade):
        """Reduz o estoque do cupcake"""
        if self.estoque >= quantidade:
            self.estoque -= quantidade
            self.save()
            return True
        return False
