# Recursos Disponíveis no Servidor MCP do Piperun

Este documento detalha todos os recursos (resources) disponíveis no servidor MCP do Piperun, seus formatos de URL e exemplos de uso.

## Recursos de Negócios

### `piperun://negocios/lista`

Lista todos os negócios do Piperun, com suporte a paginação e filtros.

**Parâmetros via URL:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| page | string | Não | Página atual (padrão: 1) |
| show | string | Não | Itens por página (padrão: 10) |
| person_id | string | Não | ID do contato para filtrar negócios |
| pipeline_id | string | Não | ID do funil para filtrar |

**Exemplo de URL:**

```
piperun://negocios/lista?page=1&show=10&pipeline_id=42
```

**Formato de Resposta:**

```json
{
  "data": [
    {
      "id": 123,
      "title": "Venda de software para Empresa X",
      "value": 10000,
      "person_id": 456,
      "stage_id": 789,
      "pipeline_id": 42,
      "created_at": "2023-05-15T14:30:00Z",
      "updated_at": "2023-05-20T09:15:00Z"
    },
    // mais negócios...
  ],
  "meta": {
    "pagination": {
      "total": 50,
      "count": 10,
      "per_page": 10,
      "current_page": 1,
      "total_pages": 5
    }
  }
}
```

### `piperun://negocios/{id}`

Obtém detalhes de um negócio específico pelo ID.

**Parâmetros via URL:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| id | string | Sim | ID do negócio |

**Exemplo de URL:**

```
piperun://negocios/123
```

**Formato de Resposta:**

```json
{
  "id": 123,
  "title": "Venda de software para Empresa X",
  "value": 10000,
  "person": {
    "id": 456,
    "name": "João Silva",
    "email": "joao@empresax.com"
  },
  "stage": {
    "id": 789,
    "name": "Proposta enviada"
  },
  "pipeline": {
    "id": 42,
    "name": "Vendas de Software"
  },
  "created_at": "2023-05-15T14:30:00Z",
  "updated_at": "2023-05-20T09:15:00Z",
  "produtos": [
    {
      "id": 111,
      "name": "Software de CRM",
      "price": 5000
    },
    {
      "id": 222,
      "name": "Consultoria de implementação",
      "price": 5000
    }
  ]
}
```

## Recursos de Funis e Etapas

### `piperun://funis/lista`

Lista todos os funis de vendas disponíveis no Piperun.

**Parâmetros via URL:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| page | string | Não | Página atual (padrão: 1) |
| show | string | Não | Itens por página (padrão: 10) |

**Exemplo de URL:**

```
piperun://funis/lista?page=1&show=10
```

**Formato de Resposta:**

```json
{
  "data": [
    {
      "id": 42,
      "name": "Vendas de Software",
      "description": "Funil de vendas para produtos de software",
      "created_at": "2023-01-10T10:00:00Z",
      "updated_at": "2023-03-15T11:30:00Z"
    },
    // mais funis...
  ],
  "meta": {
    "pagination": {
      "total": 3,
      "count": 3,
      "per_page": 10,
      "current_page": 1,
      "total_pages": 1
    }
  }
}
```

### `piperun://funis/{pipeline_id}/estagios`

Lista todas as etapas de um funil específico.

**Parâmetros via URL:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| pipeline_id | string | Sim | ID do funil |
| page | string | Não | Página atual (padrão: 1) |
| show | string | Não | Itens por página (padrão: 10) |

**Exemplo de URL:**

```
piperun://funis/42/estagios?page=1&show=10
```

**Formato de Resposta:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Primeiro contato",
      "pipeline_id": 42,
      "order": 1,
      "probability": 10,
      "created_at": "2023-01-10T10:00:00Z",
      "updated_at": "2023-03-15T11:30:00Z"
    },
    {
      "id": 2,
      "name": "Qualificação",
      "pipeline_id": 42,
      "order": 2,
      "probability": 30,
      "created_at": "2023-01-10T10:00:00Z",
      "updated_at": "2023-03-15T11:30:00Z"
    },
    // mais etapas...
  ],
  "meta": {
    "pagination": {
      "total": 5,
      "count": 5,
      "per_page": 10,
      "current_page": 1,
      "total_pages": 1
    }
  }
}
```

## Recursos de Produtos

### `piperun://produtos/lista`

Lista todos os produtos disponíveis no Piperun.

**Parâmetros via URL:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| page | string | Não | Página atual (padrão: 1) |
| show | string | Não | Itens por página (padrão: 10) |
| name | string | Não | Filtra produtos por nome |

**Exemplo de URL:**

```
piperun://produtos/lista?page=1&show=10&name=Software
```

**Formato de Resposta:**

```json
{
  "data": [
    {
      "id": 111,
      "name": "Software de CRM",
      "description": "Licença anual do software de CRM",
      "price": 5000,
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2023-03-20T14:15:00Z"
    },
    // mais produtos...
  ],
  "meta": {
    "pagination": {
      "total": 12,
      "count": 10,
      "per_page": 10,
      "current_page": 1,
      "total_pages": 2
    }
  }
}
```

## Recursos de Contatos

### `piperun://contatos/lista`

Lista todos os contatos registrados no Piperun.

**Parâmetros via URL:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| page | string | Não | Página atual (padrão: 1) |
| show | string | Não | Itens por página (padrão: 10) |
| name | string | Não | Filtra contatos por nome |
| email | string | Não | Filtra contatos por email |

**Exemplo de URL:**

```
piperun://contatos/lista?page=1&show=10&name=João
```

**Formato de Resposta:**

```json
{
  "data": [
    {
      "id": 456,
      "name": "João Silva",
      "email": "joao@empresax.com",
      "phone": "+5511999887766",
      "company": "Empresa X",
      "created_at": "2023-02-10T11:20:00Z",
      "updated_at": "2023-04-05T16:45:00Z"
    },
    // mais contatos...
  ],
  "meta": {
    "pagination": {
      "total": 25,
      "count": 10,
      "per_page": 10,
      "current_page": 1,
      "total_pages": 3
    }
  }
}
```
