# Guia de Integração MCP para PipeRun

Este documento descreve como o PipeRun-MCP implementa o Protocolo de Contexto de Modelo (MCP) da Anthropic e como utilizá-lo efetivamente com clientes MCP compatíveis.

## O que é o MCP?

O Model Context Protocol (MCP) é um protocolo aberto desenvolvido pela Anthropic que permite que aplicações e modelos de IA se comuniquem de forma padronizada. O MCP facilita a integração de modelos como o Claude com ferramentas, recursos e prompts.

Para mais informações, consulte a [documentação oficial do MCP](https://docs.anthropic.com/claude/docs/model-context-protocol).

## Funcionalidades MCP Suportadas

O PipeRun-MCP implementa as seguintes funcionalidades do protocolo MCP:

1. **Ferramentas (Tools)**: ✅ Suporte completo
   - CRUD de empresas, contatos, negócios e mais
   - Exportação de dados e geração de relatórios
   - Diagnóstico e monitoramento do servidor

2. **Prompts**: ✅ Suporte completo
   - Templates para análise de leads
   - Templates para resumo de atividades de contatos
   - Templates para análise de funis de vendas
   - Templates para estratégias de follow-up

3. **Recursos (Resources)**: ❌ Ainda não implementado
   - Planejado para futuras versões

## Arquitetura MCP

O PipeRun-MCP implementa o protocolo MCP de três formas:

1. **Interface HTTP REST**:
   - Segue o padrão oficial do Model Context Protocol
   - Ideal para integração com clientes MCP modernos

2. **Interface JSON-RPC**:
   - Compatibilidade com clientes que utilizam JSON-RPC
   - Mantida para compatibilidade legacy

3. **Bridge STDIO**:
   - Para clientes MCP que se comunicam via stdin/stdout
   - Permite integração com editores e ambientes sem suporte HTTP

## Endpoints MCP

### Endpoints Principais

- **GET `/mcp/info`**: Retorna informações sobre o servidor MCP e suas capacidades
- **GET `/mcp/health`**: Verifica a saúde do servidor MCP
- **GET `/mcp/tools`**: Lista todas as ferramentas no formato MCP
- **POST `/mcp/tools/{tool_name}`**: Executa uma ferramenta específica no formato MCP
- **GET `/tools`**: Lista todas as ferramentas no formato compatível com GitHub
- **POST `/tools/{tool_name}`**: Executa uma ferramenta no formato compatível com GitHub
- **POST `/jsonrpc`**: Endpoint JSON-RPC para execução de ferramentas (compatibilidade legada)

### Schema das Ferramentas

Todas as ferramentas seguem o formato JSON Schema conforme especificação do MCP:

```json
{
  "name": "nome_da_ferramenta",
  "description": "Descrição da ferramenta",
  "inputSchema": {
    "type": "object",
    "properties": {
      "parametro1": {
        "type": "string",
        "description": "Descrição do parâmetro"
      }
    },
    "required": ["parametro_obrigatorio"]
  },
  "authentication": {
    "type": "none"
  }
}
```

## Integrando com Clientes MCP

### Claude Desktop

1. Abra o Claude Desktop App
2. Configure o arquivo `claude_desktop_config.json`:
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
3. Ou utilize o bridge STDIO para maior compatibilidade:
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
4. Reinicie o Claude Desktop App

### Claude.ai (Web)

No Claude.ai, você pode adicionar o PipeRun-MCP como uma ferramenta personalizada:

1. Acesse as configurações de ferramentas personalizadas
2. Adicione uma nova ferramenta
3. Configure o endpoint como `http://localhost:8000/mcp/tools`
4. Salve e use nas conversas

### Outros Clientes Compatíveis

- **Cursor**: Configure nas configurações de AI, usando o endpoint MCP
- **Windsurf Editor**: Configure nas configurações de servidores MCP
- **Continue**: Adicione na lista de servidores MCP usando o protocolo HTTP
- **Qualquer cliente compatível com MCP**: Configure usando `http://localhost:8000/mcp/tools`

## Exemplos de Uso

### Exemplo 1: Análise de Lead

```
Vou usar o PipeRun-MCP para analisar um lead.

Primeiro, vou obter os dados do contato:
<ferramenta: get_contact>
{ "contact_id": 123 }

Agora, vou gerar um prompt para análise do lead:
<ferramenta: get_lead_analysis_prompt>
{
  "contact_data": { ... dados do contato ... },
  "interactions": [ ... interações ... ],
  "deals": [ ... oportunidades ... ]
}
```

### Exemplo 2: Gerenciamento de Empresas

```
Vou listar as empresas cadastradas no PipeRun:
<ferramenta: list_companies>
{ "search": "Tecnologia", "page": 1, "show": 10 }

Agora, vou criar uma nova empresa:
<ferramenta: create_company>
{
  "name": "Empresa XYZ",
  "email": "contato@xyz.com",
  "phone": "11999999999"
}
```

### Exemplo 3: Relatórios e Estatísticas

```
Vou gerar um resumo de vendas para o mês atual:
<ferramenta: generate_sales_summary>
{ "period": "month" }

Vou obter estatísticas do funil de vendas principal:
<ferramenta: get_pipeline_statistics>
{ "pipeline_id": 1, "start_date": "2023-01-01", "end_date": "2023-12-31" }
```

## Solução de Problemas

Se encontrar problemas ao usar o PipeRun-MCP com clientes MCP, verifique:

1. **Servidor Ativo**: Confirme que o servidor está em execução com `curl http://localhost:8000/`
2. **Configuração Correta**: Verifique se o cliente MCP está apontando para o endereço correto
3. **Logs do Servidor**: Examine os logs para mensagens de erro
4. **Status da API**: Use `check_api_connection` para verificar a conexão com a API do PipeRun
5. **Portas e Firewall**: Verifique se as portas necessárias estão abertas (padrão: 8000)
6. **Token API**: Confirme que o token da API do PipeRun está configurado corretamente

## Monitoramento e Diagnóstico

O PipeRun-MCP inclui ferramentas de diagnóstico acessíveis via API:

- **GET `/mcp/health`**: Status de saúde básico
- **POST `/tools/get_diagnostics`**: Diagnóstico detalhado
- **POST `/tools/reset_metrics`**: Reinicia contadores de métricas

## Recursos Adicionais

- [Documentação Oficial do MCP](https://docs.anthropic.com/claude/docs/model-context-protocol)
- [GitHub do MCP (Especificação)](https://github.com/anthropics/anthropic-tools)
- [Documentação da API do PipeRun](https://vendas.developers.pipe.run/reference/)
- [Claude Desktop App](https://claude.ai/desktop)
