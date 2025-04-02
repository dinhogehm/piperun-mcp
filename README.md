# Servidor MCP para Piperun

Este projeto implementa um servidor MCP (Model Context Protocol) para o CRM Piperun, permitindo que modelos de linguagem possam interagir com dados e funcionalidades do Piperun de forma padronizada e segura.

## O que é MCP?

O [Model Context Protocol (MCP)](https://modelcontextprotocol.io) permite construir servidores que expõem dados e funcionalidades para aplicações LLM de maneira segura e padronizada. O MCP funciona como uma API web, mas especificamente projetada para interações com LLMs.

## Funcionalidades

O servidor MCP do Piperun fornece:

- **Recursos (Resources)**: Dados do Piperun como negócios, funis, estágios, produtos e contatos
- **Ferramentas (Tools)**: Funcionalidades para consultar e atualizar dados no Piperun

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Credenciais de API do Piperun

## Instalação

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/piperun-mcp.git
cd piperun-mcp
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e adicione sua chave API do Piperun:
```
PIPERUN_API_KEY=sua_api_key_aqui
PIPERUN_API_URL=https://app.piperun.com/api/v1
```

## Compilação

Para compilar o projeto:

```bash
npm run build
```

## Execução

O servidor pode ser executado em dois modos:

### Modo stdio (padrão)

Útil para integração com ferramentas LLM que suportam MCP via stdio:

```bash
npm start
```

### Modo HTTP/SSE

Para expor o servidor MCP via HTTP:

```bash
MCP_TRANSPORT=http npm start
```

O servidor será iniciado na porta 3000 (padrão) ou na porta definida na variável de ambiente `PORT`.

## Ferramentas disponíveis

O servidor expõe as seguintes ferramentas para interagir com o Piperun:

- `listar-negocios`: Lista negócios com suporte a paginação e filtros
- `detalhes-negocio`: Obtém detalhes de um negócio específico
- `atualizar-negocio`: Atualiza informações de um negócio
- `listar-funis`: Lista funis disponíveis
- `listar-estagios`: Lista estágios de um funil específico
- `listar-produtos`: Lista produtos
- `listar-contatos`: Lista contatos

## Recursos disponíveis

O servidor expõe os seguintes recursos para carregar dados do Piperun:

- `piperun://negocios`: Lista de negócios
- `piperun://negocios/{dealId}`: Detalhes de um negócio específico
- `piperun://funis`: Lista de funis
- `piperun://estagios`: Lista de estágios
- `piperun://produtos`: Lista de produtos
- `piperun://contatos`: Lista de contatos

## Desenvolvimento

Para executar o projeto em modo de desenvolvimento:

```bash
npm run dev
```

## Licença

Este projeto está licenciado sob a licença ISC.
