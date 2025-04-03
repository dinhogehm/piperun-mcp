# Piperun MCP

Este é um servidor MCP (Model Context Protocol) para interação com a API do CRM Piperun. O servidor disponibiliza diversas ferramentas que facilitam a consulta de informações no Piperun através de uma interface padronizada para modelos de linguagem.

O projeto suporta duas modalidades de uso:
1. **Servidor MCP local via stdio** (padrão) - para integração direta com assistentes de IA
2. **Servidor HTTP RESTful** - para uso remoto e integração com outras aplicações

## Funcionalidades

O servidor MCP fornece as seguintes ferramentas para interagir com a API do Piperun:

- **list_deals**: Lista negócios com opções de filtragem e paginação
  - Suporta filtragem por pipeline, etapa, contato, título e status
  
- **list_pipelines**: Lista os pipelines disponíveis no Piperun

- **list_stages**: Lista as etapas de um pipeline específico
  - Requer o ID do pipeline para listar suas etapas

- **list_products**: Lista os produtos disponíveis
  - Suporta filtragem por nome

- **list_contacts**: Lista os contatos cadastrados
  - Suporta filtragem por nome e email

- **check_status**: Verifica se a API do Piperun está ativa e respondendo

## Pré-requisitos

- Node.js (versão 16 ou superior)
- NPM ou Yarn
- Uma conta no Piperun com acesso à API
- Token de API do Piperun

## Configuração

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/piperun-mcp.git
   cd piperun-mcp
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env.example`:
   ```bash
   cp src/.env.example .env
   ```

4. Edite o arquivo `.env` e adicione sua chave de API do Piperun:
   ```
   PIPERUN_API_KEY=sua_chave_de_api_aqui
   ```

## Executando o servidor

### Modo MCP (stdio)

Para iniciar o servidor MCP no modo stdio para integração direta com ferramentas de IA:

```bash
npm start
# ou
yarn start
```

O servidor iniciará e ficará aguardando comandos via stdin/stdout.

### Modo HTTP (RESTful API)

Para iniciar o servidor no modo HTTP, permitindo o acesso remoto via API REST:

```bash
npm run start:server
# ou
yarn start:server
```

O servidor iniciará na porta 3000 (ou na porta definida na variável de ambiente PORT).

## Integração com ferramentas de IA

### Uso Direto (Local)

Este servidor MCP pode ser integrado com várias ferramentas de IA que suportam o protocolo MCP, como:

- Claude Desktop
- Ferramentas baseadas em MCPHost
- Outros clientes compatíveis com MCP

### Uso Remoto

Para usar o serviço remotamente, você tem várias opções:

#### Opção 1: MCPHost

A maneira mais fácil é usar o [MCPHost](https://github.com/llmkde/mcphost), uma ferramenta para hospedar servidores MCP remotamente:

```bash
# Instale o MCPHost
npm install -g @llmkde/mcphost

# Hospede seu servidor MCP
mcphost serve --name piperun-mcp --path /caminho/para/piperun-mcp --command "npm start"
```

Isso fornecerá um endpoint HTTP que pode ser acessado remotamente.

#### Opção 2: Expor o servidor HTTP com Ngrok

```bash
# Inicie o servidor HTTP
npm run start:server

# Em outro terminal, execute o Ngrok
ngrok http 3000
```

#### Opção 3: Deploy em Serviços de Hospedagem

O serviço pode ser hospedado em plataformas como:
- [Render.com](https://render.com)
- [Railway.app](https://railway.app)
- [Heroku](https://heroku.com)

#### Opção 4: Conteneirização com Docker

Um arquivo `Dockerfile` está disponível para criar um container Docker do serviço.

## Estrutura do projeto

```
piperun-mcp/
├── src/
│   ├── config/      # Configurações do servidor e da API
│   ├── services/    # Serviços para comunicação com a API do Piperun
│   ├── tools/       # Ferramentas MCP disponibilizadas pelo servidor
│   ├── types/       # Definições de tipos TypeScript
│   └── utils/       # Funções utilitárias
├── .env             # Variáveis de ambiente (não versionado)
├── .env.example     # Exemplo de variáveis de ambiente
├── package.json     # Dependências e scripts
├── tsconfig.json    # Configuração do TypeScript
├── smithery.yaml    # Configuração para integração com Smithery.ai
└── Dockerfile       # Configuração para criação de container Docker (opcional)
```

## Exemplo de consultas

### Modo MCP (via stdio)

#### Listar pipelines disponíveis

```
list_pipelines
```

#### Listar negócios de um pipeline específico

```
list_deals { "pipeline_id": 123 }
```

#### Listar etapas de um pipeline

```
list_stages { "pipeline_id": 123 }
```

#### Verificar status da API

```
check_status
```

### Modo HTTP (via REST API)

#### Listar pipelines disponíveis

```bash
curl http://localhost:3000/api/pipelines
```

#### Listar negócios de um pipeline específico

```bash
curl http://localhost:3000/api/deals?pipeline_id=123
```

#### Listar etapas de um pipeline

```bash
curl http://localhost:3000/api/stages?pipeline_id=123
```

#### Verificar status da API

```bash
curl http://localhost:3000/api/status
```

## Configuração Smithery.ai

O projeto inclui um arquivo `smithery.yaml` que permite a integração com o [Smithery.ai](https://smithery.ai). Esta configuração facilita a descoberta e uso das ferramentas MCP por assistentes de IA e outras ferramentas compatíveis.

## Uso com Docker (Opcional)

Se você instalou o Docker, pode construir e executar o projeto em um container:

```bash
# Construir a imagem
docker build -t piperun-mcp .

# Executar o container (modo HTTP)
docker run -p 3000:3000 -e PIPERUN_API_KEY=sua_chave_api piperun-mcp
```

## Licença

MIT
