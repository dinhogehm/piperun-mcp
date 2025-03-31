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
│   ├── mcp_config.py      # Nova configuração do MCP
│   ├── tools_interface.py  # Interface REST para as ferramentas
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
│   │   ├── reports.py     # Novas funcionalidades de relatórios
│   │   ├── diagnostics.py # Novas ferramentas de diagnóstico
│   │   └── utils.py
│   ├── prompts/           # Novo pacote para templates de prompts
│   │   ├── __init__.py
│   │   └── templates.py   # Templates para uso com LLMs
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
├── tests/                 # Testes automatizados
│   ├── __init__.py
│   ├── test_mcp_config.py
│   ├── test_diagnostics.py
│   └── test_tools_interface.py
├── docs/                  # Documentação adicional
│   └── mcp_guide.md       # Guia do MCP
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
- Exportação de dados em formato CSV (reports)
- Geração de estatísticas e resumos de vendas (reports)
- Templates de prompts para análise de dados do CRM (prompts)
- **Diagnóstico e monitoramento** do servidor MCP (diagnostics)
- **Configuração avançada** do servidor MCP (mcp_config)

## Requisitos

- Python 3.8+
- requests
- flask
- jsonrpc
- pydantic
- psutil (para monitoramento de recursos)
- pandas (para processamento de dados)
- jsonschema (para validação)
- flask-cors (para suporte a CORS)

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

### Testando o Servidor

Para executar os testes automatizados:

```bash
python run_tests.py
```

Para executar testes específicos:

```bash
python run_tests.py --test tests.test_diagnostics
```

### Ferramentas Disponíveis

O PipeRun MCP agora oferece duas interfaces para acesso às ferramentas:

1. **Interface JSON-RPC**: Acessível via `/jsonrpc`
2. **Interface REST**: Acessível via `/tools`
3. **Interface MCP**: Acessível via `/mcp`

#### Interface REST para Ferramentas

A interface REST segue o modelo do GitHub MCP, expondo as ferramentas diretamente:

- **GET `/tools`**: Lista todas as ferramentas disponíveis
- **POST `/tools/{tool_name}`**: Executa uma ferramenta específica

#### Interface MCP

A nova interface MCP segue o Protocolo de Contexto de Modelo:

- **GET `/mcp/info`**: Retorna informações sobre o servidor MCP e suas capacidades
- **GET `/mcp/health`**: Verifica a saúde do servidor MCP

Para mais detalhes sobre a implementação MCP, consulte o [Guia do MCP](docs/mcp_guide.md).

{{ ... }}

### 7. Diagnósticos e Monitoramento

#### get_server_health
Verifica a saúde do servidor MCP, incluindo uso de recursos do sistema.
**Parâmetros:**
- nenhum

**Exemplo:**
```bash
curl -X POST http://localhost:8000/tools/get_server_health
```

#### get_diagnostics
Obtém informações detalhadas de diagnóstico sobre o servidor MCP.
**Parâmetros:**
- nenhum

**Exemplo:**
```bash
curl -X POST http://localhost:8000/tools/get_diagnostics
```

#### reset_metrics
Reinicia todas as métricas coletadas pelo servidor MCP.
**Parâmetros:**
- nenhum

**Exemplo:**
```bash
curl -X POST http://localhost:8000/tools/reset_metrics
```

#### check_api_connection
Verifica a conexão com a API do PipeRun.
**Parâmetros:**
- nenhum

**Exemplo:**
```bash
curl -X POST http://localhost:8000/tools/check_api_connection
```

## Integrando com Clientes MCP

Este servidor é compatível com vários clientes que implementam o Protocolo de Contexto de Modelo (MCP), incluindo:

1. **Claude Desktop App**: Configure o PipeRun MCP como servidor MCP para interagir diretamente
2. **Cursor (VSCode)**: Configure nas configurações de AI
3. **Windsurf Editor**: Configure nas configurações de servidores MCP

Para configuração detalhada de cada cliente, consulte o [Guia do MCP](docs/mcp_guide.md).

## Desenvolvimento

### Executando Testes

O projeto inclui testes automatizados que podem ser executados com:

```bash
python run_tests.py
```

### Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie um branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das alterações (`git commit -am 'Adiciona nova feature'`)
4. Faça push para o branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
