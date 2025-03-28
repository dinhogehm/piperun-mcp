# PipeRun MCP (Model Context Protocol)

Este projeto implementa ferramentas para o Model Context Protocol (MCP) da Anthropic, permitindo que modelos de IA interajam com a API do CRM PipeRun.

## Estrutura do Projeto

```
piperun-mcp/
├── README.md
├── requirements.txt
├── src/
│   ├── __init__.py
│   ├── config.py
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

### Testando o projeto

Você pode testar as ferramentas MCP de duas maneiras:

#### 1. Usando os exemplos prontos

Execute o arquivo de exemplos para ver como as ferramentas funcionam:

```bash
python -m examples.usage_examples
```

Este script demonstra como usar várias ferramentas para interagir com o CRM.

#### 2. Criando seus próprios testes

Você pode criar um script personalizado para testar as funcionalidades específicas:

```python
# teste_personalizado.py
from dotenv import load_dotenv
from src.tools import list_companies, get_company, create_company

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Lista as primeiras 5 empresas
resultado = list_companies(per_page=5)
print(f"Empresas encontradas: {len(resultado.get('items', []))}")

# Criar uma nova empresa (exemplo)
nova_empresa = create_company(
    name="Teste Empresa",
    phone="(11) 99999-9999",
    email="teste@empresa.com"
)
print(f"Empresa criada: {nova_empresa.get('success')}")
```

Execute seu script:
```bash
python teste_personalizado.py
```

### Integração com o Model Context Protocol (MCP)

Para integrar com modelos da Anthropic usando MCP, consulte a documentação específica da Anthropic sobre como registrar e utilizar ferramentas externas.

## Referências

- [Documentação da API do PipeRun](https://vendas.developers.pipe.run/reference)
