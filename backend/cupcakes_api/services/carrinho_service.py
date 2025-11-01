from decimal import Decimal
from cupcakes_api.models import Carrinho, ItemCarrinho, Cupcake
from django.db import transaction


class CarrinhoService:
    """
    Serviço para gerenciar operações do carrinho
    """

    @staticmethod
    def obter_ou_criar_carrinho(usuario):
        """
        Obtém ou cria um carrinho para o usuário
        
        Args:
            usuario (User): Instância do usuário
            
        Returns:
            Carrinho: Instância do carrinho
        """
        carrinho, created = Carrinho.objects.get_or_create(usuario=usuario)
        return carrinho

    @staticmethod
    @transaction.atomic
    def adicionar_item(usuario, cupcake_id, quantidade=1):
        """
        Adiciona um item ao carrinho
        
        Args:
            usuario (User): Instância do usuário
            cupcake_id (int): ID do cupcake
            quantidade (int): Quantidade a adicionar
            
        Returns:
            dict: Resultado da operação
        """
        try:
            cupcake = Cupcake.objects.get(id=cupcake_id)
        except Cupcake.DoesNotExist:
            return {
                'sucesso': False,
                'mensagem': 'Cupcake não encontrado'
            }

        # Verifica disponibilidade
        if not cupcake.disponivel:
            return {
                'sucesso': False,
                'mensagem': 'Cupcake não disponível'
            }

        # Verifica estoque
        carrinho = CarrinhoService.obter_ou_criar_carrinho(usuario)
        item_existente = carrinho.itens.filter(cupcake=cupcake).first()
        
        quantidade_total = quantidade
        if item_existente:
            quantidade_total += item_existente.quantidade

        if cupcake.estoque < quantidade_total:
            return {
                'sucesso': False,
                'mensagem': f'Estoque insuficiente. Disponível: {cupcake.estoque}'
            }

        # Adiciona ou atualiza item
        if item_existente:
            item_existente.quantidade += quantidade
            item_existente.save()
        else:
            ItemCarrinho.objects.create(
                carrinho=carrinho,
                cupcake=cupcake,
                quantidade=quantidade
            )

        return {
            'sucesso': True,
            'mensagem': f'{cupcake.nome} adicionado ao carrinho',
            'carrinho': carrinho
        }

    @staticmethod
    @transaction.atomic
    def remover_item(usuario, item_id):
        """
        Remove um item do carrinho
        
        Args:
            usuario (User): Instância do usuário
            item_id (int): ID do item do carrinho
            
        Returns:
            dict: Resultado da operação
        """
        carrinho = CarrinhoService.obter_ou_criar_carrinho(usuario)
        
        try:
            item = carrinho.itens.get(id=item_id)
            item.delete()
            return {
                'sucesso': True,
                'mensagem': 'Item removido do carrinho'
            }
        except ItemCarrinho.DoesNotExist:
            return {
                'sucesso': False,
                'mensagem': 'Item não encontrado no carrinho'
            }

    @staticmethod
    @transaction.atomic
    def atualizar_quantidade(usuario, item_id, quantidade):
        """
        Atualiza a quantidade de um item no carrinho
        
        Args:
            usuario (User): Instância do usuário
            item_id (int): ID do item do carrinho
            quantidade (int): Nova quantidade
            
        Returns:
            dict: Resultado da operação
        """
        if quantidade < 1:
            return CarrinhoService.remover_item(usuario, item_id)

        carrinho = CarrinhoService.obter_ou_criar_carrinho(usuario)
        
        try:
            item = carrinho.itens.get(id=item_id)
            
            # Verifica estoque
            if item.cupcake.estoque < quantidade:
                return {
                    'sucesso': False,
                    'mensagem': f'Estoque insuficiente. Disponível: {item.cupcake.estoque}'
                }
            
            item.quantidade = quantidade
            item.save()
            
            return {
                'sucesso': True,
                'mensagem': 'Quantidade atualizada',
                'item': item
            }
        except ItemCarrinho.DoesNotExist:
            return {
                'sucesso': False,
                'mensagem': 'Item não encontrado no carrinho'
            }

    @staticmethod
    @transaction.atomic
    def limpar_carrinho(usuario):
        """
        Remove todos os itens do carrinho
        
        Args:
            usuario (User): Instância do usuário
            
        Returns:
            dict: Resultado da operação
        """
        carrinho = CarrinhoService.obter_ou_criar_carrinho(usuario)
        carrinho.limpar()
        
        return {
            'sucesso': True,
            'mensagem': 'Carrinho limpo'
        }

    @staticmethod
    def calcular_totais(carrinho, cupom=None):
        """
        Calcula os totais do carrinho
        
        Args:
            carrinho (Carrinho): Instância do carrinho
            cupom (Cupom, optional): Cupom a ser aplicado
            
        Returns:
            dict: Totais calculados
        """
        from .cupom_service import CupomService
        
        subtotal = carrinho.subtotal
        desconto = Decimal('0.00')
        
        if cupom:
            desconto = CupomService.calcular_desconto(cupom, subtotal)
        
        total = subtotal - desconto
        
        return {
            'subtotal': subtotal,
            'desconto': desconto,
            'total': total,
            'total_itens': carrinho.total_itens
        }

    @staticmethod
    def validar_carrinho(carrinho):
        """
        Valida se o carrinho pode ser processado
        
        Args:
            carrinho (Carrinho): Instância do carrinho
            
        Returns:
            dict: Resultado da validação
        """
        if not carrinho.itens.exists():
            return {
                'valido': False,
                'mensagem': 'Carrinho vazio'
            }

        # Verifica disponibilidade e estoque de cada item
        for item in carrinho.itens.all():
            if not item.cupcake.disponivel:
                return {
                    'valido': False,
                    'mensagem': f'{item.cupcake.nome} não está mais disponível'
                }
            
            if item.cupcake.estoque < item.quantidade:
                return {
                    'valido': False,
                    'mensagem': f'Estoque insuficiente para {item.cupcake.nome}'
                }

        return {
            'valido': True,
            'mensagem': 'Carrinho válido'
        }
