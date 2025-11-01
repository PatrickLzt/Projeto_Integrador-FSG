from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, logout
from cupcakes_api.serializers import (
    RegistroSerializer,
    LoginSerializer,
    UsuarioSerializer
)


class RegistroView(APIView):
    """
    View para registro de novos usuários
    
    POST: Registra um novo usuário
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Registra um novo usuário
        
        Body:
            username: Nome de usuário
            email: E-mail
            password: Senha
            password_confirm: Confirmação de senha
            first_name: Primeiro nome (opcional)
            last_name: Sobrenome (opcional)
        """
        serializer = RegistroSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'mensagem': 'Usuário registrado com sucesso',
                'usuario': UsuarioSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    View para login de usuários
    
    POST: Realiza login e retorna token
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Realiza login do usuário
        
        Body:
            username: Nome de usuário
            password: Senha
        """
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'mensagem': 'Login realizado com sucesso',
                'usuario': UsuarioSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    View para logout de usuários
    
    POST: Realiza logout (remove token)
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Realiza logout do usuário
        """
        try:
            request.user.auth_token.delete()
            logout(request)
            return Response({
                'mensagem': 'Logout realizado com sucesso'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'mensagem': 'Erro ao realizar logout'
            }, status=status.HTTP_400_BAD_REQUEST)


class PerfilView(APIView):
    """
    View para visualizar e atualizar perfil do usuário
    
    GET: Obtém dados do usuário autenticado
    PUT: Atualiza dados do usuário
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Obtém dados do usuário autenticado
        """
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """
        Atualiza dados do usuário
        
        Body:
            email: E-mail (opcional)
            first_name: Primeiro nome (opcional)
            last_name: Sobrenome (opcional)
        """
        serializer = UsuarioSerializer(request.user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'mensagem': 'Perfil atualizado com sucesso',
                'usuario': serializer.data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
