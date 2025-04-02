# Piperun MCP Server
[![smithery badge](https://smithery.ai/badge/@dinhogehm/piperun-mcp)](https://smithery.ai/server/@dinhogehm/piperun-mcp)

Servidor MCP (Model Context Protocol) para integração com o CRM Piperun.

## Sobre o Projeto

Este servidor MCP permite a integração de LLMs (Large Language Models) com o CRM Piperun, expondo as seguintes funcionalidades:

- Gerenciamento de negócios (deals)
- Gerenciamento de pessoas (contacts)
- Gerenciamento de organizações
- Gerenciamento de funis (pipelines) e etapas (stages)
- Gerenciamento de produtos

O servidor foi implementado seguindo os conceitos de:
- Clean Code
- Princípios SOLID
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)

## Configuração do Ambiente

### Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn

### Instalação

#### Instalação via Smithery

Para instalar Piperun MCP for Claude Desktop automaticamente via [Smithery](https://smithery.ai/server/@dinhogehm/piperun-mcp):

```bash
npx -y @smithery/cli install @dinhogehm/piperun-mcp --client claude
```

#### Instalação Manual

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd piperun-mcp
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
PIPERUN_API_TOKEN=seu_token_aqui
PIPERUN_API_URL=https://api.piperun.com/v1
```

## Execução

### Ambiente de Desenvolvimento

Para executar o servidor em modo de desenvolvimento (STDIO):
```bash
npm run dev
```

### Ambiente de Produção

Para construir e executar o servidor para produção:
```bash
npm run build
npm start
```

## Deploy no Smithery.ai

Este projeto está configurado para ser deployado no [Smithery.ai](https://smithery.ai), uma plataforma que permite hospedar servidores MCP.

### Requisitos para Deploy no Smithery

1. O servidor usa WebSocketServerTransport quando em produção
2. Implementa "lazy loading" das credenciais de API
3. Funciona em ambiente serverless com timeout de 5 minutos

### Procedimento de Deploy

1. Crie uma conta no [Smithery.ai](https://smithery.ai)
2. Adicione o servidor ao Smithery usando a opção "Add Server"
3. Na página do servidor, acesse a aba "Smithery Deployments" e clique em "Deploy"
4. Configure as variáveis de ambiente necessárias (PIPERUN_API_TOKEN e PIPERUN_API_URL)

### Arquivo de Configuração Smithery

O arquivo `smithery.json` na raiz do projeto já contém a configuração necessária para o deploy:

```json
{
  "name": "piperun-mcp-server",
  "description": "Servidor MCP para integração com o CRM Piperun",
  "entrypoint": "src/index.ts",
  "build": {
    "command": "npm install && npm run build"
  },
  "start": {
    "command": "node dist/index.js",
    "env": {
      "SMITHERY": "true",
      "NODE_ENV": "production"
    }
  },
  "metadata": {
    "category": "crm",
    "tags": ["piperun", "crm", "mcp", "api"]
  }
}
```

## Ferramentas Disponíveis

O servidor expõe as seguintes ferramentas:

- `get-deals`: Obter todos os negócios
- `get-deal`: Obter um negócio específico por ID
- `get-persons`: Obter todas as pessoas
- `get-person`: Obter uma pessoa específica por ID
- `get-organizations`: Obter todas as organizações
- `get-organization`: Obter uma organização específica por ID
- `get-pipelines`: Obter todos os funis
- `get-pipeline`: Obter um funil específico por ID
- `get-stages`: Obter todas as etapas
- `get-products`: Obter todos os produtos

## Prompts Pré-definidos

O servidor também inclui os seguintes prompts pré-definidos:

- `list-all-deals`: Listar todos os negócios
- `list-all-persons`: Listar todas as pessoas
- `list-all-pipelines`: Listar todos os funis
- `analyze-deals`: Analisar negócios por etapa
- `analyze-contacts`: Analisar contatos por organização
- `compare-pipelines`: Comparar diferentes funis
- `analyze-products`: Analisar produtos por categoria

## Solução de Problemas

Se você encontrar erros de tipo durante o desenvolvimento:

1. Verifique se todas as dependências estão instaladas:
```bash
npm install
```

2. Se os erros persistirem, tente reinstalar as dependências com a flag `--force`:
```bash
npm install --force
```

## Contribuição

Sinta-se à vontade para contribuir com o projeto através de pull requests.
