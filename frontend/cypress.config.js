const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        // URL base da aplicação
        baseUrl: 'http://localhost:3000',

        // Configurações de viewport
        viewportWidth: 1280,
        viewportHeight: 720,

        // Timeout padrão
        defaultCommandTimeout: 10000,

        // Pasta de fixtures (dados de teste)
        fixturesFolder: 'cypress/fixtures',

        // Pasta de screenshots
        screenshotsFolder: 'cypress/screenshots',

        // Pasta de vídeos
        videosFolder: 'cypress/videos',

        // Gravar vídeo dos testes
        video: true,

        // Screenshot em caso de falha
        screenshotOnRunFailure: true,

        // Configuração de testes
        setupNodeEvents(on, config) {
            // implement node event listeners here
            return config;
        },

        // Especificação dos testes
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

        // Suporte para múltiplos navegadores
        chromeWebSecurity: false,
    },

    // Configurações de componente (caso queira usar no futuro)
    component: {
        devServer: {
            framework: 'vanilla',
            bundler: 'webpack',
        },
    },
});
