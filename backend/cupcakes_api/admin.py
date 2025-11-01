from django.contrib import admin
from cupcakes_api.models import (
    Categoria,
    Cupcake,
    Carrinho,
    ItemCarrinho,
    Cupom,
    Pedido,
    ItemPedido,
    Pagamento
)


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    """
    Admin para gerenciar Categorias
    """
    list_display = ['nome', 'slug', 'ativo', 'created_at']
    list_filter = ['ativo', 'created_at']
    search_fields = ['nome', 'slug', 'descricao']
    prepopulated_fields = {'slug': ('nome',)}
    ordering = ['nome']


@admin.register(Cupcake)
class CupcakeAdmin(admin.ModelAdmin):
    """
    Admin para gerenciar Cupcakes
    """
    list_display = ['nome', 'categoria', 'preco', 'estoque', 'destaque', 'ativo', 'created_at']
    list_filter = ['categoria', 'destaque', 'ativo', 'created_at']
    search_fields = ['nome', 'descricao', 'slug']
    prepopulated_fields = {'slug': ('nome',)}
    list_editable = ['preco', 'estoque', 'destaque', 'ativo']
    ordering = ['-destaque', 'nome']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'slug', 'descricao', 'categoria')
        }),
        ('Preço e Estoque', {
            'fields': ('preco', 'estoque')
        }),
        ('Imagens', {
            'fields': ('imagem', 'imagem_url')
        }),
        ('Status', {
            'fields': ('destaque', 'ativo')
        }),
    )


class ItemCarrinhoInline(admin.TabularInline):
    """
    Inline para itens do carrinho
    """
    model = ItemCarrinho
    extra = 0
    readonly_fields = ['subtotal']


@admin.register(Carrinho)
class CarrinhoAdmin(admin.ModelAdmin):
    """
    Admin para gerenciar Carrinhos
    """
    list_display = ['usuario', 'total_itens', 'subtotal', 'created_at', 'updated_at']
    search_fields = ['usuario__username', 'usuario__email']
    readonly_fields = ['total_itens', 'subtotal', 'created_at', 'updated_at']
    inlines = [ItemCarrinhoInline]


@admin.register(Cupom)
class CupomAdmin(admin.ModelAdmin):
    """
    Admin para gerenciar Cupons
    """
    list_display = [
        'codigo', 'tipo_desconto', 'valor_desconto', 'percentual_desconto',
        'valor_minimo_pedido', 'uso_atual', 'uso_maximo', 'ativo', 'valido'
    ]
    list_filter = ['tipo_desconto', 'ativo', 'data_inicio', 'data_expiracao']
    search_fields = ['codigo', 'descricao']
    readonly_fields = ['uso_atual', 'valido', 'created_at', 'updated_at']
    list_editable = ['ativo']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informações do Cupom', {
            'fields': ('codigo', 'descricao', 'ativo')
        }),
        ('Desconto', {
            'fields': ('tipo_desconto', 'valor_desconto', 'percentual_desconto', 'valor_minimo_pedido')
        }),
        ('Validade', {
            'fields': ('data_inicio', 'data_expiracao', 'uso_maximo', 'uso_atual', 'valido')
        }),
    )


class ItemPedidoInline(admin.TabularInline):
    """
    Inline para itens do pedido
    """
    model = ItemPedido
    extra = 0
    readonly_fields = ['subtotal']


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    """
    Admin para gerenciar Pedidos
    """
    list_display = [
        'numero_pedido', 'usuario', 'status', 'tipo_entrega',
        'total', 'created_at'
    ]
    list_filter = ['status', 'tipo_entrega', 'created_at']
    search_fields = [
        'numero_pedido', 'usuario__username', 'nome_cliente',
        'email_cliente', 'telefone_cliente'
    ]
    readonly_fields = [
        'numero_pedido', 'usuario', 'subtotal', 'valor_desconto',
        'valor_frete', 'total', 'created_at', 'updated_at'
    ]
    list_editable = ['status']
    ordering = ['-created_at']
    inlines = [ItemPedidoInline]
    
    fieldsets = (
        ('Informações do Pedido', {
            'fields': ('numero_pedido', 'usuario', 'status', 'tipo_entrega')
        }),
        ('Dados do Cliente', {
            'fields': ('nome_cliente', 'email_cliente', 'telefone_cliente')
        }),
        ('Endereço de Entrega', {
            'fields': ('cep', 'endereco', 'numero', 'complemento', 'bairro', 'cidade', 'estado'),
            'classes': ('collapse',)
        }),
        ('Valores', {
            'fields': ('subtotal', 'valor_desconto', 'valor_frete', 'total', 'cupom')
        }),
        ('Observações', {
            'fields': ('observacoes',),
            'classes': ('collapse',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Pagamento)
class PagamentoAdmin(admin.ModelAdmin):
    """
    Admin para gerenciar Pagamentos
    """
    list_display = [
        'pedido', 'metodo_pagamento', 'status', 'valor',
        'created_at'
    ]
    list_filter = ['metodo_pagamento', 'status', 'created_at']
    search_fields = ['pedido__numero_pedido', 'transacao_id']
    readonly_fields = ['pedido', 'valor', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informações do Pagamento', {
            'fields': ('pedido', 'metodo_pagamento', 'status', 'valor')
        }),
        ('Pagamento em Dinheiro', {
            'fields': ('valor_pago', 'troco'),
            'classes': ('collapse',)
        }),
        ('Transação', {
            'fields': ('transacao_id', 'dados_transacao'),
            'classes': ('collapse',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
