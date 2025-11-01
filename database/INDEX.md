# 📚 Índice da Documentação - Banco de Dados Sweet Cupcakes

Bem-vindo à documentação completa do banco de dados PostgreSQL do sistema Sweet Cupcakes.

---

## 📋 Conteúdo do Diretório

```
database/
├── README.md                    ← 📖 Você está aqui! Guia de início rápido
├── schema.sql                   ← 🗄️ Script completo de criação do banco
├── seed_data.sql                ← 🌱 Dados de exemplo para testes
├── queries_uteis.sql            ← 🔍 Queries prontas para análises
├── dicionario_dados.md          ← 📚 Documentação detalhada de tabelas
├── diagram_er.md                ← 🎨 Diagrama de Entidade-Relacionamento (Mermaid)
├── VISUAL_DIAGRAM.md            ← 🖼️ Diagrama visual em ASCII art
├── MIGRATION_GUIDE.md           ← 🔄 Guia de migração Django → PostgreSQL
├── API_EXAMPLES.md              ← 🧪 Exemplos de uso da API REST
└── INDEX.md                     ← 📑 Este arquivo (navegação rápida)
```

---

## 🚀 Guia de Início Rápido

### Para Iniciantes
1. Leia [`README.md`](./README.md) - Visão geral e instalação
2. Execute [`schema.sql`](./schema.sql) - Cria o banco
3. Execute [`seed_data.sql`](./seed_data.sql) - Adiciona dados de teste
4. Consulte [`dicionario_dados.md`](./dicionario_dados.md) - Entenda cada tabela

### Para Desenvolvedores
1. Siga [`MIGRATION_GUIDE.md`](./MIGRATION_GUIDE.md) - Integre com Django
2. Use [`queries_uteis.sql`](./queries_uteis.sql) - Análises e relatórios
3. Teste com [`API_EXAMPLES.md`](./API_EXAMPLES.md) - Exemplos de requisições

### Para Arquitetos/DBAs
1. Analise [`diagram_er.md`](./diagram_er.md) - Diagrama completo
2. Visualize [`VISUAL_DIAGRAM.md`](./VISUAL_DIAGRAM.md) - Fluxos e estrutura
3. Consulte [`dicionario_dados.md`](./dicionario_dados.md) - Especificações técnicas

---

## 📖 Descrição dos Arquivos

### [`schema.sql`](./schema.sql)
**Propósito**: Script SQL completo de criação do banco de dados

**Conteúdo**:
- Criação de 15 tabelas normalizadas
- Chaves primárias, estrangeiras, constraints e índices
- Triggers para atualização automática de timestamps
- Trigger para log de mudanças de status
- Views para consultas otimizadas
- Dados iniciais (categorias e cupons)

**Como usar**:
```bash
psql -U postgres -d sweet_cupcakes -f schema.sql
```

---

### [`seed_data.sql`](./seed_data.sql)
**Propósito**: Inserir dados de exemplo para desenvolvimento e testes

**Conteúdo**:
- 17 cupcakes em 5 categorias diferentes
- 5 usuários (1 admin, 1 staff, 3 clientes)
- 4 endereços cadastrados
- 3 pedidos de exemplo (pendente, em preparo, entregue)
- 3 avaliações de produtos
- Carrinhos com itens
- Uso de cupons registrado

**Como usar**:
```bash
psql -U postgres -d sweet_cupcakes -f seed_data.sql
```

**⚠️ Importante**: Execute APÓS o `schema.sql`

---

### [`queries_uteis.sql`](./queries_uteis.sql)
**Propósito**: Biblioteca de consultas SQL prontas para análises e relatórios

**Categorias**:
1. **Análises de Produtos** (5 queries)
   - Cupcakes mais vendidos
   - Produtos em destaque
   - Alerta de estoque baixo
   - Produtos sem vendas

2. **Análises de Clientes** (5 queries)
   - Top clientes por valor
   - Clientes mais frequentes
   - Clientes inativos
   - Novos clientes
   - Taxa de retenção

3. **Análises de Vendas** (5 queries)
   - Receita por período
   - Receita mensal
   - Comparação mês atual vs anterior
   - Análise por tipo de entrega
   - Horários de pico

4. **Análises de Pedidos** (5 queries)
   - Pedidos por status
   - Tempo médio de entrega
   - Taxa de conversão
   - Maiores pedidos
   - Cesta média

5. **Análises de Cupons** (3 queries)
   - Cupons mais utilizados
   - Cupons válidos ativos
   - Impacto na receita

6. **Análises de Pagamento** (3 queries)
   - Métodos mais usados
   - Taxa de aprovação
   - Pagamentos pendentes

7. **Análises de Avaliações** (4 queries)
   - Melhores avaliações
   - Distribuição de notas
   - Avaliações recentes
   - Produtos com problemas

8. **Análises Geográficas** (2 queries)
   - Pedidos por cidade
   - Pedidos por estado

9. **Dashboard e KPIs** (2 queries)
   - Métricas gerais
   - Indicadores principais

**Total**: 40+ queries prontas para uso

---

### [`dicionario_dados.md`](./dicionario_dados.md)
**Propósito**: Documentação técnica completa de todas as tabelas e campos

**Estrutura** (15 tabelas documentadas):
- Descrição da tabela
- Lista de todos os campos com tipos e descrições
- Constraints (PK, FK, UK, CHECK)
- Índices criados
- Relacionamentos com outras tabelas
- Valores possíveis para campos ENUM
- Exemplos de uso

**Destaques**:
- 📊 Diagrama de Relacionamentos (ER)
- 🔗 Cardinalidades detalhadas
- 📝 Estratégia de normalização
- 🛡️ Constraints e validações
- 🔍 Índices e performance
- 🔐 Triggers implementados
- 💾 Estratégia de snapshot

**Páginas**: ~300 linhas de documentação

---

### [`diagram_er.md`](./diagram_er.md)
**Propósito**: Diagrama de Entidade-Relacionamento visual com Mermaid

**Conteúdo**:
- Diagrama ER completo em formato Mermaid
- Diagrama textual detalhado (ASCII)
- Tipos de relacionamentos (1:1, 1:N, N:M)
- Cardinalidades explicadas
- Constraints principais
- Índices importantes
- Views criadas
- Triggers implementados

**Visualização**:
- Suporta renderização no GitHub
- Compatível com VS Code + extensões Mermaid
- Pode ser copiado para ferramentas online

---

### [`VISUAL_DIAGRAM.md`](./VISUAL_DIAGRAM.md)
**Propósito**: Diagrama visual em ASCII art para referência rápida

**Conteúdo**:
- Diagrama completo em ASCII art
- Módulos organizados (Usuários, Produtos, Carrinho, Cupons, Pedidos, Avaliações)
- Views e Triggers ilustrados
- Fluxo de criação de pedido
- Fluxo de status do pedido
- Estatísticas do banco
- Legenda completa

**Vantagens**:
- Visualização offline
- Não requer ferramentas especiais
- Imprime bem em texto puro
- Ótimo para documentação técnica

---

### [`MIGRATION_GUIDE.md`](./MIGRATION_GUIDE.md)
**Propósito**: Guia completo de migração do Django (SQLite) para PostgreSQL

**Tópicos**:
1. **Pré-requisitos** - O que você precisa antes de começar
2. **Estratégias de Migração** - Duas abordagens explicadas
3. **Passo a Passo** - 9 passos detalhados:
   - Instalar driver PostgreSQL
   - Configurar variáveis de ambiente
   - Atualizar settings.py
   - Ajustar models Django
   - Aplicar --fake-initial
   - Verificar conexão
   - Criar superusuário
   - Testar o sistema

4. **Ajustes nos Models** - Exemplos de código
5. **Mapeamento Django → PostgreSQL** - Tabela de correspondência
6. **Troubleshooting** - Soluções para erros comuns
7. **Verificações Finais** - Checklist de validação
8. **Próximos Passos** - O que fazer após migração

**Páginas**: ~250 linhas

---

### [`API_EXAMPLES.md`](./API_EXAMPLES.md)
**Propósito**: Exemplos práticos de requisições HTTP para testar a API

**Categorias** (10 módulos):
1. **Autenticação** (registro, login, logout)
2. **Cupcakes** (CRUD, filtros, busca, destaques)
3. **Categorias** (listar, criar, buscar)
4. **Carrinho** (ver, adicionar, atualizar, remover, limpar)
5. **Cupons** (validar, listar)
6. **Pedidos** (criar, listar, buscar, atualizar status, cancelar)
7. **Pagamentos** (ver, processar, aprovar)
8. **Cálculo de Frete** (calcular por estado)
9. **Avaliações** (listar, criar)
10. **Estatísticas** (dashboard, relatórios)

**Formatos**:
- Exemplos em `curl`
- Exemplos em Python (requests)
- Coleção Postman (JSON)

**Páginas**: ~300 linhas

---

## 🎯 Casos de Uso por Perfil

### 👨‍💻 Desenvolvedor Front-end
```
1. Leia API_EXAMPLES.md
2. Use queries_uteis.sql para entender os dados
3. Consulte dicionario_dados.md quando necessário
```

### 👨‍💻 Desenvolvedor Back-end
```
1. Execute schema.sql e seed_data.sql
2. Siga MIGRATION_GUIDE.md
3. Use queries_uteis.sql para análises
4. Teste com API_EXAMPLES.md
```

### 🎨 Designer de Banco de Dados
```
1. Analise diagram_er.md
2. Estude dicionario_dados.md
3. Visualize VISUAL_DIAGRAM.md
4. Revise schema.sql
```

### 🧪 QA / Tester
```
1. Execute seed_data.sql para dados de teste
2. Use API_EXAMPLES.md para testar endpoints
3. Consulte queries_uteis.sql para validações
```

### 📊 Analista de Dados
```
1. Use queries_uteis.sql como ponto de partida
2. Consulte dicionario_dados.md para entender campos
3. Crie novas queries baseadas nos exemplos
```

---

## 📊 Estatísticas da Documentação

```
Total de Arquivos: 10
Total de Linhas: ~3.000 linhas
Páginas Equivalentes: ~50 páginas

Arquivos SQL: 3 (schema, seed_data, queries_uteis)
Arquivos Markdown: 7 (documentação completa)

Tabelas Documentadas: 15
Queries Prontas: 40+
Exemplos de API: 50+
Diagramas: 3 (Mermaid, ASCII, Textual)
```

---

## 🔄 Fluxo de Trabalho Recomendado

### Fase 1: Setup Inicial (30 min)
```
1. ✅ Instalar PostgreSQL
2. ✅ Criar banco: CREATE DATABASE sweet_cupcakes
3. ✅ Executar schema.sql
4. ✅ Executar seed_data.sql
5. ✅ Verificar: SELECT COUNT(*) FROM cupcakes
```

### Fase 2: Integração Django (1-2h)
```
1. ✅ Ler MIGRATION_GUIDE.md completamente
2. ✅ Configurar .env com credenciais do banco
3. ✅ Instalar psycopg2-binary
4. ✅ Ajustar models Django
5. ✅ Executar python manage.py migrate --fake-initial
6. ✅ Criar superusuário
7. ✅ Testar servidor: python manage.py runserver
```

### Fase 3: Testes e Validação (1h)
```
1. ✅ Acessar admin: http://localhost:8000/admin
2. ✅ Testar endpoints básicos (API_EXAMPLES.md)
3. ✅ Executar queries de validação (queries_uteis.sql)
4. ✅ Verificar integridade dos dados
5. ✅ Testar fluxo completo: cadastro → carrinho → pedido
```

### Fase 4: Desenvolvimento (Contínuo)
```
1. ✅ Consultar dicionario_dados.md conforme necessidade
2. ✅ Usar queries_uteis.sql para análises
3. ✅ Adicionar novos dados via seed ou admin
4. ✅ Testar integrações com API_EXAMPLES.md
```

---

## 🆘 Onde Encontrar Ajuda

### Problema: Não sei como criar o banco
**Solução**: [`README.md`](./README.md) - Seção "Como Usar"

### Problema: Preciso entender uma tabela específica
**Solução**: [`dicionario_dados.md`](./dicionario_dados.md) - Índice de Tabelas

### Problema: Como migrar do SQLite?
**Solução**: [`MIGRATION_GUIDE.md`](./MIGRATION_GUIDE.md) - Passo a Passo

### Problema: Preciso fazer uma análise de vendas
**Solução**: [`queries_uteis.sql`](./queries_uteis.sql) - Análises de Vendas

### Problema: Como testar a API?
**Solução**: [`API_EXAMPLES.md`](./API_EXAMPLES.md) - Exemplos Práticos

### Problema: Não entendo o relacionamento entre tabelas
**Solução**: [`diagram_er.md`](./diagram_er.md) ou [`VISUAL_DIAGRAM.md`](./VISUAL_DIAGRAM.md)

---

## 📚 Links Externos Úteis

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Django PostgreSQL](https://docs.djangoproject.com/en/4.2/ref/databases/#postgresql-notes)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Mermaid Live Editor](https://mermaid.live/)
- [SQL Tutorial](https://www.w3schools.com/sql/)

---

## 🎓 Aprendizado Progressivo

### Nível Iniciante
```
Dia 1: README.md + schema.sql
Dia 2: seed_data.sql + dicionario_dados.md (primeiras 5 tabelas)
Dia 3: dicionario_dados.md (restantes) + diagram_er.md
```

### Nível Intermediário
```
Semana 1: MIGRATION_GUIDE.md + integração Django
Semana 2: queries_uteis.sql + criação de novas queries
Semana 3: API_EXAMPLES.md + desenvolvimento front-end
```

### Nível Avançado
```
Mês 1: Otimização de queries e índices
Mês 2: Implementação de novas features
Mês 3: Escalabilidade e performance
```

---

## ✅ Checklist de Conclusão

Após trabalhar com esta documentação, você deverá ser capaz de:

- [ ] Criar o banco de dados do zero
- [ ] Entender todas as 15 tabelas e seus relacionamentos
- [ ] Migrar o projeto Django de SQLite para PostgreSQL
- [ ] Executar queries complexas para análises
- [ ] Testar todos os endpoints da API
- [ ] Inserir e manipular dados
- [ ] Explicar o fluxo de um pedido do início ao fim
- [ ] Identificar e corrigir problemas comuns

---

## 📞 Contato e Contribuições

Para dúvidas, sugestões ou melhorias nesta documentação:

1. Abra uma issue no repositório
2. Consulte a documentação oficial do PostgreSQL
3. Revise os arquivos de exemplo e diagramas

---

## 🎉 Conclusão

Esta documentação foi criada para ser:
- ✅ **Completa**: Cobre todos os aspectos do banco
- ✅ **Didática**: Explicações claras e exemplos práticos
- ✅ **Progressiva**: Do básico ao avançado
- ✅ **Prática**: Queries e exemplos prontos para uso
- ✅ **Visual**: Diagramas para facilitar compreensão

**Boa sorte no desenvolvimento! 🚀**

---

**Versão da Documentação**: 1.0  
**Última Atualização**: 2025  
**Banco de Dados**: PostgreSQL 12+  
**Framework**: Django 4.2+
