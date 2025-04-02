# Ferramentas Disponíveis no Servidor MCP do Piperun

Este documento detalha todas as ferramentas (tools) disponíveis no servidor MCP do Piperun, seus parâmetros e exemplos de uso.

## Ferramentas de Negócios

### listar-negocios

Lista negócios (deals) com suporte a filtros e paginação.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| page | número | Não | Página atual (padrão: 1) |
| show | número | Não | Itens por página (padrão: 10) |
| person_id | número | Não | ID do contato para filtrar negócios |
| title | string | Não | Filtra por título do negócio |
| pipeline_id | número | Não | ID do funil para filtrar negócios |
| stage_id | número | Não | ID da etapa para filtrar negócios |

**Exemplo de uso:**

```json
{
  "page": 1,
  "show": 5,
  "pipeline_id": 123
}
```

### detalhes-negocio

Obtém detalhes de um negócio específico.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| deal_id | número | Sim | ID do negócio |

**Exemplo de uso:**

```json
{
  "deal_id": 42
}
```

### atualizar-negocio

Atualiza informações de um negócio existente.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| deal_id | número | Sim | ID do negócio a ser atualizado |
| data | objeto | Sim | Dados a serem atualizados |

O objeto `data` pode conter:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| title | string | Título do negócio |
| value | número | Valor do negócio |
| stage_id | número | ID da etapa do negócio |
| person_id | número | ID do contato associado |
| user_id | número | ID do usuário responsável |

**Exemplo de uso:**

```json
{
  "deal_id": 42,
  "data": {
    "title": "Novo título do negócio",
    "value": 5000,
    "stage_id": 2
  }
}
```

## Ferramentas de Funis e Etapas

### listar-funis

Lista funis (pipelines) com suporte a paginação.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| page | número | Não | Página atual (padrão: 1) |
| show | número | Não | Itens por página (padrão: 10) |

**Exemplo de uso:**

```json
{
  "page": 1,
  "show": 10
}
```

### listar-estagios

Lista etapas (stages) de um funil com suporte a paginação.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| pipeline_id | número | Não | ID do funil para filtrar etapas |
| page | número | Não | Página atual (padrão: 1) |
| show | número | Não | Itens por página (padrão: 10) |

**Exemplo de uso:**

```json
{
  "pipeline_id": 123,
  "page": 1,
  "show": 20
}
```

## Ferramentas de Produtos

### listar-produtos

Lista produtos (items) com suporte a paginação.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| page | número | Não | Página atual (padrão: 1) |
| show | número | Não | Itens por página (padrão: 10) |
| name | string | Não | Filtra produtos por nome |

**Exemplo de uso:**

```json
{
  "page": 1,
  "show": 10,
  "name": "Software"
}
```

## Ferramentas de Contatos

### listar-contatos

Lista contatos (people) com suporte a paginação e filtros.

**Parâmetros:**

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| page | número | Não | Página atual (padrão: 1) |
| show | número | Não | Itens por página (padrão: 10) |
| name | string | Não | Filtra contatos por nome |
| email | string | Não | Filtra contatos por email |

**Exemplo de uso:**

```json
{
  "page": 1,
  "show": 10,
  "email": "cliente@exemplo.com"
}
```

## Ferramentas de Estatísticas e Monitoramento

### estatisticas-servidor

Obtém estatísticas e métricas de desempenho do servidor MCP.

**Parâmetros:** Nenhum

**Exemplo de uso:**

```json
{}
```

### verificar-saude

Verifica o estado de saúde e conectividade do servidor MCP.

**Parâmetros:** Nenhum

**Exemplo de uso:**

```json
{}
```
