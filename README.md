# PipeRun MCP (Model Context Protocol)

Este projeto implementa ferramentas para o Model Context Protocol (MCP) da Anthropic, permitindo que modelos de IA interajam com a API do CRM PipeRun.

## Estrutura do Projeto

```
piperun-mcp/
├── README.md
├── requirements.txt
├── server.py
├── mcp_bridge.py     # Script ponte para STDIO MCP
├── mcp_config.json   # Configuração do MCP
├── src/
│   ├── __init__.py
│   ├── config.py
│   ├── mcp_config.py      # Configuração do MCP
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
│   │   ├── reports.py     # Funcionalidades de relatórios
│   │   ├── diagnostics.py # Ferramentas de diagnóstico
│   │   └── utils.py
│   ├── prompts/           # Pacote para templates de prompts
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
- Diagnóstico e monitoramento do servidor MCP (diagnostics)
- Configuração avançada do servidor MCP (mcp_config)

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
   - Crie um arquivo `.env` na raiz do projeto a partir do modelo `.env.example`
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

### Usando com Bridge MCP (STDIO)

Para usar com clientes MCP que se comunicam via STDIO:

```bash
python mcp_bridge.py
```

Você também pode configurar variáveis de ambiente:
```bash
MCP_SERVER_URL=http://localhost:8000 MCP_BRIDGE_DEBUG=true python mcp_bridge.py
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

### Interfaces Disponíveis

O PipeRun MCP oferece três interfaces para acesso às ferramentas:

1. **Interface REST (compatível com GitHub MCP)**: Acessível via `/tools`
   - **GET `/tools`**: Lista todas as ferramentas disponíveis
   - **POST `/tools/{tool_name}`**: Executa uma ferramenta específica

2. **Interface JSON-RPC**: Acessível via `/jsonrpc`
   - Mais recomendada para clientes que suportam JSON-RPC
   - Método `mcp_list_tools` para listar ferramentas
   - Método `mcp_run_tool` para executar ferramentas

3. **Interface MCP (Model Context Protocol)**: Acessível via `/mcp`
   - **GET `/mcp/info`**: Retorna informações sobre o servidor MCP
   - **GET `/mcp/health`**: Verifica a saúde do servidor MCP
   - **GET `/mcp/tools`**: Lista todas as ferramentas no formato MCP
   - **POST `/mcp/tools/{tool_name}`**: Executa uma ferramenta específica

Para mais detalhes sobre a implementação MCP, consulte o [Guia do MCP](docs/mcp_guide.md).

## Integrando com Clientes MCP

Este servidor é compatível com vários clientes que implementam o Protocolo de Contexto de Modelo (MCP), incluindo:

1. **Claude Desktop App**: Configure o PipeRun MCP como servidor MCP para interagir diretamente
2. **Claude.ai**: Configure nas configurações de ferramentas personalizadas
3. **Cursor (VSCode)**: Configure nas configurações de AI
4. **Windsurf Editor**: Configure nas configurações de servidores MCP
5. **Continue**: Adicione o servidor nas configurações MCP

### Configurando o Claude Desktop App

1. Configure o arquivo de configuração do Claude Desktop:
   ```json
   {
     "mcp_servers": [
       {
         "name": "PipeRun-MCP",
         "transport": {
           "kind": "http",
           "url": "http://localhost:8000"
         }
       }
     ]
   }
   ```

2. Ou utilize o bridge STDIO:
   ```json
   {
     "mcp_servers": [
       {
         "name": "PipeRun-MCP",
         "transport": {
           "kind": "stdio",
           "command": "python /caminho/para/piperun-mcp/mcp_bridge.py"
         }
       }
     ]
   }
   ```

## Usando o Docker

Para executar o servidor MCP usando Docker:

```bash
docker build -t piperun-mcp .
docker run -p 8000:8000 -e PIPERUN_API_TOKEN=seu_token_aqui piperun-mcp
```

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