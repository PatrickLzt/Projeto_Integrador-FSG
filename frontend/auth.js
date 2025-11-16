// ===== Sistema de Autenticação =====

const Auth = {
    // Configurações
    STORAGE_KEY: 'sweetcupcakes_user',
    USERS_KEY: 'sweetcupcakes_users',

    // Inicializar usuários de demonstração
    init() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            const demoUsers = [
                {
                    id: '1',
                    firstName: 'Admin',
                    lastName: 'Sweet Cupcakes',
                    email: 'admin@sweetcupcakes.com',
                    phone: '(11) 99999-9999',
                    password: this.hashPassword('admin123'),
                    createdAt: new Date().toISOString(),
                    isAdmin: true
                },
                {
                    id: '2',
                    firstName: 'João',
                    lastName: 'Silva',
                    email: 'joao@email.com',
                    phone: '(11) 98888-8888',
                    password: this.hashPassword('123456'),
                    createdAt: new Date().toISOString(),
                    isAdmin: false
                }
            ];
            localStorage.setItem(this.USERS_KEY, JSON.stringify(demoUsers));
        }
    },

    // Hash simples de senha (em produção, usar bcrypt no backend)
    hashPassword(password) {
        // Simulação de hash - em produção, usar algoritmo real no backend
        return btoa(password + 'sweetcupcakes_salt');
    },

    // Verificar hash de senha
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    },

    // Registrar novo usuário
    register(userData) {
        this.init();

        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];

        // Verificar se e-mail já existe
        if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            return {
                success: false,
                message: 'Este e-mail já está cadastrado'
            };
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now().toString(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email.toLowerCase(),
            phone: userData.phone,
            password: this.hashPassword(userData.password),
            createdAt: new Date().toISOString(),
            isAdmin: false
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        return {
            success: true,
            message: 'Cadastro realizado com sucesso!'
        };
    },

    // Fazer login
    login(email, password, rememberMe = false) {
        this.init();

        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return {
                success: false,
                message: 'E-mail ou senha incorretos'
            };
        }

        if (!this.verifyPassword(password, user.password)) {
            return {
                success: false,
                message: 'E-mail ou senha incorretos'
            };
        }

        // Criar sessão
        const session = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            loginAt: new Date().toISOString(),
            rememberMe: rememberMe
        };

        // Salvar sessão
        if (rememberMe) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
        } else {
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
        }

        return {
            success: true,
            message: 'Login realizado com sucesso!',
            user: session
        };
    },

    // Fazer logout
    logout() {
        localStorage.removeItem(this.STORAGE_KEY);
        sessionStorage.removeItem(this.STORAGE_KEY);
        window.location.href = 'index.html';
    },

    // Verificar se está logado
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    // Obter usuário atual
    getCurrentUser() {
        let session = localStorage.getItem(this.STORAGE_KEY);
        if (!session) {
            session = sessionStorage.getItem(this.STORAGE_KEY);
        }
        return session ? JSON.parse(session) : null;
    },

    // Obter nome completo do usuário
    getFullName() {
        const user = this.getCurrentUser();
        return user ? `${user.firstName} ${user.lastName}` : null;
    },

    // Verificar se é admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user ? user.isAdmin : false;
    },

    // Atualizar dados do usuário
    updateProfile(updates) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Usuário não está logado'
            };
        }

        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) {
            return {
                success: false,
                message: 'Usuário não encontrado'
            };
        }

        // Atualizar dados
        users[userIndex] = {
            ...users[userIndex],
            ...updates,
            email: users[userIndex].email // E-mail não pode ser alterado
        };

        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        // Atualizar sessão
        const updatedSession = {
            ...currentUser,
            firstName: updates.firstName || currentUser.firstName,
            lastName: updates.lastName || currentUser.lastName,
            phone: updates.phone || currentUser.phone
        };

        if (currentUser.rememberMe) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSession));
        } else {
            sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSession));
        }

        return {
            success: true,
            message: 'Perfil atualizado com sucesso!'
        };
    },

    // Alterar senha
    changePassword(currentPassword, newPassword) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                message: 'Usuário não está logado'
            };
        }

        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
        const user = users.find(u => u.id === currentUser.id);

        if (!user) {
            return {
                success: false,
                message: 'Usuário não encontrado'
            };
        }

        // Verificar senha atual
        if (!this.verifyPassword(currentPassword, user.password)) {
            return {
                success: false,
                message: 'Senha atual incorreta'
            };
        }

        // Atualizar senha
        user.password = this.hashPassword(newPassword);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        return {
            success: true,
            message: 'Senha alterada com sucesso!'
        };
    },

    // Proteger página (requer login)
    requireLogin(redirectTo = null) {
        if (!this.isLoggedIn()) {
            const currentPage = window.location.pathname.split('/').pop();
            const redirect = redirectTo || currentPage;
            window.location.href = `login.html?redirect=${redirect}`;
            return false;
        }
        return true;
    },

    // Proteger página (requer admin)
    requireAdmin() {
        if (!this.isLoggedIn() || !this.isAdmin()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    // Obter todos os usuários (apenas admin)
    getAllUsers() {
        if (!this.isAdmin()) {
            return [];
        }
        this.init();
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
        // Remover senhas antes de retornar
        return users.map(u => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            phone: u.phone,
            createdAt: u.createdAt,
            isAdmin: u.isAdmin
        }));
    }
};

// Inicializar sistema ao carregar
Auth.init();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.Auth = Auth;
}

// ===== Utilitários para UI =====

// Atualizar menu de navegação com informações do usuário
function updateNavigation() {
    if (typeof document === 'undefined') return;

    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // Remover itens de autenticação existentes
    const authItems = navMenu.querySelectorAll('[data-auth-item]');
    authItems.forEach(item => item.remove());

    if (Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        const userName = user.firstName;

        // Adicionar menu do usuário
        const userMenuItem = document.createElement('li');
        userMenuItem.setAttribute('data-auth-item', 'true');
        userMenuItem.innerHTML = `
            <a href="#" class="user-menu-toggle">
                👤 ${userName}
            </a>
            <ul class="user-dropdown" style="display: none;">
                <li><a href="perfil.html">Meu Perfil</a></li>
                <li><a href="pedidos.html">Meus Pedidos</a></li>
                ${user.isAdmin ? '<li><a href="admin.html">Painel Admin</a></li>' : ''}
                <li><a href="#" id="logoutBtn">Sair</a></li>
            </ul>
        `;
        navMenu.appendChild(userMenuItem);

        // Toggle dropdown
        const toggle = userMenuItem.querySelector('.user-menu-toggle');
        const dropdown = userMenuItem.querySelector('.user-dropdown');
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Deseja realmente sair?')) {
                    Auth.logout();
                }
            });
        }
    } else {
        // Adicionar link de login
        const loginItem = document.createElement('li');
        loginItem.setAttribute('data-auth-item', 'true');
        loginItem.innerHTML = '<a href="login.html">Login</a>';
        navMenu.appendChild(loginItem);
    }
}

// Executar ao carregar página
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateNavigation);
    } else {
        updateNavigation();
    }
}
