# PipeRun MCP

API de integração do PipeRun com Model Context Protocol (MCP).

## Sobre o Projeto

Este projeto fornece endpoints RESTful para interagir com a API do PipeRun, permitindo acesso a:
- Negociações (Deals)
- Pipelines
- Estágios (Stages)
- Produtos

## Requisitos

- Node.js >= 16.0.0
- npm >= 7.0.0

## Instalação

```bash
npm install
```

## Desenvolvimento

Para executar o projeto em desenvolvimento:

```bash
npm run dev
```

## Produção

Para build e execução em produção:

```bash
npm run build
npm start
```

## Endpoints da API

### Raiz
- `GET /`: Retorna informações sobre a API e seus endpoints disponíveis

### Negociações
- `GET /deals`: Lista negociações
  - Parâmetros: 
    - `page`: Número da página (padrão: 1)
    - `show`: Quantidade de registros por página (padrão: 20)
    - `person_id`: Filtrar por ID de pessoa

### Pipelines
- `GET /pipelines`: Lista pipelines
  - Parâmetros: 
    - `page`: Número da página (padrão: 1)
    - `show`: Quantidade de registros por página (padrão: 20)

### Estágios
- `GET /stages`: Lista estágios
  - Parâmetros: 
    - `page`: Número da página (padrão: 1)
    - `show`: Quantidade de registros por página (padrão: 20)
    - `pipeline_id`: Filtrar por ID do pipeline

### Produtos
- `GET /products`: Lista produtos
  - Parâmetros: 
    - `page`: Número da página (padrão: 1)
    - `show`: Quantidade de registros por página (padrão: 20)

## Autenticação

Todas as requisições à API devem incluir o header `x-api-key` com a chave de API válida do PipeRun.

## Licença

ISC
