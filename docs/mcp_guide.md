# Guia de Integração MCP para PipeRun

Este documento descreve como o PipeRun-MCP implementa o Protocolo de Contexto de Modelo (MCP) e como utilizá-lo efetivamente com clientes MCP compatíveis.

## O que é o MCP?

O Model Context Protocol (MCP) é um protocolo aberto desenvolvido pela Anthropic que permite que aplicações e modelos de IA se comuniquem de forma padronizada. O MCP facilita a integração de modelos como o Claude com ferramentas, recursos e prompts.

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

## Endpoints MCP

### Endpoints Principais

- **GET `/mcp/info`**: Retorna informações sobre o servidor MCP e suas capacidades
- **GET `/mcp/health`**: Verifica a saúde do servidor MCP
- **GET `/tools`**: Lista todas as ferramentas disponíveis
- **POST `/tools/{tool_name}`**: Executa uma ferramenta específica
- **POST `/jsonrpc`**: Endpoint JSON-RPC para execução de ferramentas (compatibilidade legada)

### Ferramentas de Diagnóstico

- **POST `/tools/get_server_health`**: Verifica o estado de saúde do servidor MCP
- **POST `/tools/get_diagnostics`**: Obtém informações de diagnóstico detalhadas
- **POST `/tools/reset_metrics`**: Reinicia todas as métricas coletadas pelo servidor
- **POST `/tools/check_api_connection`**: Verifica a conexão com a API do PipeRun

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
3. Reinicie o Claude Desktop App
4. Agora você pode acessar as ferramentas do PipeRun-MCP diretamente nas conversas

### Outros Clientes Compatíveis

- **Cursor**: Configure nas configurações de AI
- **Windsurf Editor**: Configure nas configurações de servidores MCP
- **Continue**: Adicione na lista de servidores MCP

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

### Exemplo 2: Acessando Métricas do Servidor

```
Vou verificar a saúde do servidor PipeRun-MCP:
<ferramenta: get_server_health>
{}

Agora, vou obter métricas detalhadas:
<ferramenta: get_diagnostics>
{}
```

## Solução de Problemas

Se encontrar problemas ao usar o PipeRun-MCP com clientes MCP, verifique:

1. **Servidor Ativo**: Confirme que o servidor está em execução com `curl http://localhost:8000/`
2. **Configuração Correta**: Verifique se o cliente MCP está apontando para o endereço correto
3. **Logs do Servidor**: Examine os logs para mensagens de erro
4. **Status da API**: Use `check_api_connection` para verificar a conexão com a API do PipeRun

## Recursos Adicionais

- [Documentação Oficial do MCP](https://modelcontextprotocol.io/)
- [GitHub do MCP](https://github.com/modelcontextprotocol/specification)
- [Lista de Clientes Compatíveis](https://modelcontextprotocol.io/clients)
