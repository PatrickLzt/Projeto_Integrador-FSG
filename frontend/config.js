// Configuração da API
const API_URL = process.env.API_URL || 'http://localhost:8000/api';

// Exportar configuração
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_URL };
}
