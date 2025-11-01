from decimal import Decimal
from django.db import transaction
from cupcakes_api.models import Pedido, ItemPedido, Pagamento, Cupom
from .carrinho_service import CarrinhoService
from .cupom_service import CupomService
from .frete_service import FreteService


class PedidoService:
    """
    Serviço para gerenciar pedidos
    """

    @staticmethod
    @transaction.atomic
    def criar_pedido(usuario, dados_pedido):
        """
        Cria um novo pedido a partir do carrinho
        
        Args:
            usuario (User): Instância do usuário
            dados_pedido (dict): Dados do pedido
            
        Returns:
            dict: Resultado da operação com o pedido criado
        """
        # Obtém o carrinho
        carrinho = CarrinhoService.obter_ou_criar_carrinho(usuario)
        
        # Valida o carrinho
        validacao = CarrinhoService.validar_carrinho(carrinho)
        if not validacao['valido']:
            return {
                'sucesso': False,
                'mensagem': validacao['mensagem']
            }

        # Calcula subtotal
        subtotal = carrinho.subtotal

        # Aplica cupom se fornecido
        cupom = None
        valor_desconto = Decimal('0.00')
        
        if dados_pedido.get('codigo_cupom'):
            resultado_cupom = CupomService.validar_cupom(
                dados_pedido['codigo_cupom'],
                subtotal
            )
            
            if resultado_cupom['valido']:
                cupom = resultado_cupom['cupom']
                valor_desconto = resultado_cupom['desconto']

        # Calcula frete
        frete_info = FreteService.calcular_frete(
            cep=dados_pedido.get('cep', ''),
            estado=dados_pedido.get('estado', ''),
            tipo_entrega=dados_pedido['tipo_entrega'],
            valor_pedido=subtotal
        )
        valor_frete = frete_info['valor']

        # Calcula total
        total = subtotal - valor_desconto + valor_frete

        # Cria o pedido
        pedido = Pedido.objects.create(
            usuario=usuario,
            status='pendente',
            tipo_entrega=dados_pedido['tipo_entrega'],
            nome_cliente=dados_pedido['nome_cliente'],
            email_cliente=dados_pedido['email_cliente'],
            telefone_cliente=dados_pedido['telefone_cliente'],
            cep=dados_pedido.get('cep', ''),
            endereco=dados_pedido.get('endereco', ''),
            numero=dados_pedido.get('numero', ''),
            complemento=dados_pedido.get('complemento', ''),
            bairro=dados_pedido.get('bairro', ''),
            cidade=dados_pedido.get('cidade', ''),
            estado=dados_pedido.get('estado', ''),
            subtotal=subtotal,
            valor_desconto=valor_desconto,
            valor_frete=valor_frete,
            total=total,
            cupom=cupom,
            observacoes=dados_pedido.get('observacoes', '')
        )

        # Cria os itens do pedido
        for item_carrinho in carrinho.itens.all():
            ItemPedido.objects.create(
                pedido=pedido,
                cupcake=item_carrinho.cupcake,
                quantidade=item_carrinho.quantidade,
                preco_unitario=item_carrinho.cupcake.preco
            )
            
            # Reduz o estoque
            item_carrinho.cupcake.reduzir_estoque(item_carrinho.quantidade)

        # Cria o pagamento
        troco = None
        if dados_pedido['metodo_pagamento'] == 'dinheiro' and dados_pedido.get('valor_pago'):
            valor_pago = Decimal(str(dados_pedido['valor_pago']))
            troco = valor_pago - total if valor_pago > total else Decimal('0.00')

        pagamento = Pagamento.objects.create(
            pedido=pedido,
            metodo_pagamento=dados_pedido['metodo_pagamento'],
            valor=total,
            valor_pago=dados_pedido.get('valor_pago'),
            troco=troco
        )

        # Processa o pagamento
        pagamento.processar()

        # Marca o cupom como usado
        if cupom:
            CupomService.aplicar_cupom(cupom)

        # Limpa o carrinho
        CarrinhoService.limpar_carrinho(usuario)

        return {
            'sucesso': True,
            'mensagem': 'Pedido criado com sucesso',
            'pedido': pedido,
            'pagamento': pagamento
        }

    @staticmethod
    def listar_pedidos_usuario(usuario, status=None):
        """
        Lista os pedidos de um usuário
        
        Args:
            usuario (User): Instância do usuário
            status (str, optional): Filtrar por status
            
        Returns:
            QuerySet: Pedidos do usuário
        """
        pedidos = Pedido.objects.filter(usuario=usuario)
        
        if status:
            pedidos = pedidos.filter(status=status)
        
        return pedidos.order_by('-created_at')

    @staticmethod
    def obter_pedido(pedido_id, usuario=None):
        """
        Obtém um pedido específico
        
        Args:
            pedido_id (int): ID do pedido
            usuario (User, optional): Validar se o pedido pertence ao usuário
            
        Returns:
            Pedido: Instância do pedido
        """
        try:
            pedido = Pedido.objects.get(id=pedido_id)
            
            if usuario and pedido.usuario != usuario:
                return None
            
            return pedido
        except Pedido.DoesNotExist:
            return None

    @staticmethod
    @transaction.atomic
    def atualizar_status_pedido(pedido_id, novo_status):
        """
        Atualiza o status de um pedido
        
        Args:
            pedido_id (int): ID do pedido
            novo_status (str): Novo status
            
        Returns:
            dict: Resultado da operação
        """
        pedido = PedidoService.obter_pedido(pedido_id)
        
        if not pedido:
            return {
                'sucesso': False,
                'mensagem': 'Pedido não encontrado'
            }

        if pedido.atualizar_status(novo_status):
            return {
                'sucesso': True,
                'mensagem': f'Status atualizado para {pedido.get_status_display()}',
                'pedido': pedido
            }
        
        return {
            'sucesso': False,
            'mensagem': 'Status inválido'
        }

    @staticmethod
    @transaction.atomic
    def cancelar_pedido(pedido_id, usuario=None):
        """
        Cancela um pedido
        
        Args:
            pedido_id (int): ID do pedido
            usuario (User, optional): Validar se o pedido pertence ao usuário
            
        Returns:
            dict: Resultado da operação
        """
        pedido = PedidoService.obter_pedido(pedido_id, usuario)
        
        if not pedido:
            return {
                'sucesso': False,
                'mensagem': 'Pedido não encontrado'
            }

        # Só pode cancelar se estiver pendente ou recebido
        if pedido.status not in ['pendente', 'recebido']:
            return {
                'sucesso': False,
                'mensagem': 'Não é possível cancelar este pedido'
            }

        # Devolve estoque
        for item in pedido.itens.all():
            item.cupcake.estoque += item.quantidade
            item.cupcake.save()

        # Cancela pagamento
        if hasattr(pedido, 'pagamento'):
            pedido.pagamento.cancelar()

        pedido.atualizar_status('cancelado')

        return {
            'sucesso': True,
            'mensagem': 'Pedido cancelado com sucesso',
            'pedido': pedido
        }

    @staticmethod
    def calcular_estatisticas_pedidos(data_inicio=None, data_fim=None):
        """
        Calcula estatísticas de pedidos
        
        Args:
            data_inicio (datetime, optional): Data inicial
            data_fim (datetime, optional): Data final
            
        Returns:
            dict: Estatísticas
        """
        from django.db.models import Sum, Count, Avg
        
        pedidos = Pedido.objects.all()
        
        if data_inicio:
            pedidos = pedidos.filter(created_at__gte=data_inicio)
        if data_fim:
            pedidos = pedidos.filter(created_at__lte=data_fim)

        return {
            'total_pedidos': pedidos.count(),
            'total_vendas': pedidos.aggregate(Sum('total'))['total__sum'] or Decimal('0.00'),
            'ticket_medio': pedidos.aggregate(Avg('total'))['total__avg'] or Decimal('0.00'),
            'por_status': pedidos.values('status').annotate(count=Count('id')),
            'por_tipo_entrega': pedidos.values('tipo_entrega').annotate(count=Count('id'))
        }
