// Configuração da API
// Em produção (Vercel), usa o mesmo domínio com /api
// Em desenvolvimento, usa localhost:8000
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000/api'
    : '/api';  // Usa o mesmo domínio em produção

// Exportar configuração
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_URL };
}
