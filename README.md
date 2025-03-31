# PipeRun MCP (Model Context Protocol)

Este projeto implementa ferramentas para o Model Context Protocol (MCP) da Anthropic, permitindo que modelos de IA interajam com a API do CRM PipeRun.

## Estrutura do Projeto

```
piperun-mcp/
├── README.md
├── requirements.txt
├── server.py
├── src/
│   ├── __init__.py
│   ├── config.py
│   ├── tools_interface.py  # Nova interface REST para as ferramentas
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── companies.py
│   │   ├── contacts.py
│   │   ├── deals.py
│   │   ├── teams.py
│   │   ├── pipelines.py
│   │   ├── stages.py
│   │   ├── tasks.py
│   │   └── utils.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── companies.py
│   │   ├── contacts.py
│   │   ├── deals.py
│   │   ├── teams.py
│   │   ├── pipelines.py
│   │   ├── stages.py
│   │   └── tasks.py
│   └── service/
│       ├── __init__.py
│       └── api_client.py
└── examples/
    ├── __init__.py
    └── usage_examples.py
```

## Sobre o Projeto

Este projeto implementa ferramentas MCP (Model Context Protocol) para integração com a API do CRM PipeRun. As ferramentas permitem que modelos de IA da Anthropic interajam com o PipeRun para realizar operações como:

- Autenticação e gerenciamento de tokens
- Gerenciamento de empresas (companies)
- Gerenciamento de contatos (contacts)
- Gerenciamento de oportunidades (deals)
- Gerenciamento de equipes (teams)
- Gerenciamento de funis (pipelines)
- Gerenciamento de etapas de funil (stages)
- Gerenciamento de tarefas (tasks)

## Requisitos

- Python 3.8+
- requests
- flask
- jsonrpc
- pydantic

## Como usar

### Configuração

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/piperun-mcp.git
   cd piperun-mcp
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure seu token de API do PipeRun:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione seu token API do PipeRun:
     ```
     PIPERUN_API_TOKEN=seu_token_aqui
     ```
   - Você pode obter seu token em: https://app.pipe.run/v2/me/user-data

### Iniciando o Servidor

Para iniciar o servidor MCP:

```bash
python server.py
```

Por padrão, o servidor irá executar na porta 8000. Você pode definir uma porta diferente no arquivo `.env`:

```
PORT=9000
```

### Ferramentas Disponíveis

O PipeRun MCP agora oferece duas interfaces para acesso às ferramentas:

1. **Interface JSON-RPC**: Acessível via `/jsonrpc`
2. **Interface REST**: Acessível via `/tools`

#### Interface REST para Ferramentas

A interface REST segue o modelo do GitHub MCP, expondo as ferramentas diretamente:

- **GET `/tools`**: Lista todas as ferramentas disponíveis
- **POST `/tools/{tool_name}`**: Executa uma ferramenta específica

## Ferramentas (Tools)

### 1. Empresas (Companies)

#### list_companies
Lista as empresas cadastradas no PipeRun.
**Parâmetros:**
- search (string): Termo para busca por nome da empresa
- page (integer): Número da página para paginação
- show (integer): Quantidade de itens por página

#### get_company
Obtém detalhes de uma empresa específica.
**Parâmetros:**
- company_id (integer, required): ID da empresa

#### create_company
Cria uma nova empresa no PipeRun.
**Parâmetros:**
- name (string, required): Nome da empresa
- email (string): Email da empresa
- phone (string): Telefone da empresa

#### update_company
Atualiza uma empresa existente no PipeRun.
**Parâmetros:**
- company_id (integer, required): ID da empresa
- name (string): Nome da empresa
- email (string): Email da empresa
- phone (string): Telefone da empresa

#### delete_company
Exclui uma empresa do PipeRun.
**Parâmetros:**
- company_id (integer, required): ID da empresa

### 2. Contatos (Contacts)

#### list_contacts
Lista os contatos cadastrados no PipeRun.
**Parâmetros:**
- search (string): Termo para busca por nome do contato
- company_id (integer): Filtrar contatos por ID da empresa
- page (integer): Número da página para paginação
- show (integer): Quantidade de itens por página

#### get_contact
Obtém detalhes de um contato específico.
**Parâmetros:**
- contact_id (integer, required): ID do contato

#### create_contact
Cria um novo contato no PipeRun.
**Parâmetros:**
- name (string, required): Nome do contato
- email (string): Email do contato
- company_id (integer): ID da empresa do contato
- phone (string): Telefone do contato

#### update_contact
Atualiza um contato existente no PipeRun.
**Parâmetros:**
- contact_id (integer, required): ID do contato
- name (string): Nome do contato
- email (string): Email do contato
- company_id (integer): ID da empresa do contato
- phone (string): Telefone do contato

#### delete_contact
Exclui um contato do PipeRun.
**Parâmetros:**
- contact_id (integer, required): ID do contato

### 3. Negócios/Oportunidades (Deals)

#### list_deals
Lista os negócios/oportunidades cadastrados no PipeRun.
**Parâmetros:**
- search (string): Termo para busca por título do negócio
- pipeline_id (integer): Filtrar por ID do funil
- stage_id (integer): Filtrar por ID da etapa
- company_id (integer): Filtrar por ID da empresa
- contact_id (integer): Filtrar por ID do contato
- page (integer): Número da página para paginação
- show (integer): Quantidade de itens por página

### 4. Funis (Pipelines)

#### list_pipelines
Lista os funis de vendas no PipeRun.
**Parâmetros:**
- page (integer): Número da página para paginação
- show (integer): Quantidade de itens por página

### 5. Etapas de Funil (Stages)

#### list_stages
Lista as etapas de um funil específico no PipeRun.
**Parâmetros:**
- pipeline_id (integer, required): ID do funil
- page (integer): Número da página para paginação
- show (integer): Quantidade de itens por página

### 6. Produtos (Products)

#### list_products
Lista os produtos cadastrados no PipeRun.
**Parâmetros:**
- search (string): Termo para busca por nome do produto
- page (integer): Número da página para paginação
- show (integer): Quantidade de itens por página

### Testando as Ferramentas

Você pode testar as ferramentas das seguintes maneiras:

#### 1. Via Interface REST

Usando curl para listar empresas:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"search": "Empresa", "page": 1, "show": 10}' http://localhost:8000/tools/list_companies
```

#### 2. Via JSON-RPC

Usando curl para listar empresas:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc": "2.0", "method": "mcp_run_tool", "params": {"tool_name": "listar_empresas", "parameters": {"search": "Empresa", "page": 1, "show": 10}}, "id": 1}' http://localhost:8000/jsonrpc
```

#### 3. Usando os exemplos prontos

Execute o arquivo de exemplos para ver como as ferramentas funcionam:
```bash
python -m examples.usage_examples
