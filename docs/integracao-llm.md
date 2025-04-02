# Integração com Modelos de Linguagem (LLMs)

Este documento descreve como integrar o servidor MCP do Piperun com diferentes modelos de linguagem.

## Visão Geral

O servidor MCP (Model Context Protocol) expõe dados e funcionalidades do Piperun de forma padronizada para uso com LLMs. A integração pode ser feita de diferentes formas, dependendo do LLM e da plataforma que você está utilizando.

## Integração com OpenAI

### Usando Ferramentas com a API da OpenAI

As ferramentas (tools) do servidor MCP podem ser mapeadas para Function Calling na API da OpenAI:

```javascript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Conectar ao servidor MCP
const mcpClient = await McpClient.connectToServer('http://localhost:3000');

// Obter a definição das ferramentas do servidor MCP
const mcpTools = mcpClient.tools.map(tool => ({
  type: 'function',
  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters
  }
}));

// Chamar o modelo com as ferramentas do MCP
const response = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [
    { role: "system", content: "Você é um assistente para o CRM Piperun." },
    { role: "user", content: "Liste os 5 negócios mais recentes." }
  ],
  tools: mcpTools
});

// Processar a resposta e executar a ferramenta escolhida pelo modelo
if (response.choices[0].message.tool_calls) {
  for (const toolCall of response.choices[0].message.tool_calls) {
    const toolName = toolCall.function.name;
    const toolParams = JSON.parse(toolCall.function.arguments);
    
    // Executar a ferramenta no servidor MCP
    const toolResult = await mcpClient.executeTool(toolName, toolParams);
    
    // Fornecer o resultado da ferramenta de volta para o modelo
    // ...
  }
}
```

## Integração com LangChain

O [LangChain](https://js.langchain.com/) é uma biblioteca popular para construir aplicações com LLMs. Você pode integrar o servidor MCP com LangChain usando o conceito de ferramentas (tools):

```javascript
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { McpClient } from "@modelcontextprotocol/sdk";
import { DynamicTool } from "langchain/tools";

// Criar o cliente MCP
const mcpClient = await McpClient.connectToServer('http://localhost:3000');

// Mapear as ferramentas MCP para ferramentas LangChain
const mcpLangChainTools = mcpClient.tools.map(mcpTool => 
  new DynamicTool({
    name: mcpTool.name,
    description: mcpTool.description || `Ferramenta para ${mcpTool.name}`,
    func: async (input) => {
      const params = JSON.parse(input);
      const result = await mcpClient.executeTool(mcpTool.name, params);
      return result.content[0].text;
    }
  })
);

// Criar o modelo e o agente
const model = new ChatOpenAI({ temperature: 0 });
const agent = await createOpenAIFunctionsAgent({
  llm: model,
  tools: mcpLangChainTools,
  // Outras configurações...
});

const agentExecutor = new AgentExecutor({
  agent,
  tools: mcpLangChainTools,
  // Outras configurações...
});

// Executar o agente
const result = await agentExecutor.invoke({
  input: "Liste os 5 negócios mais valiosos no Piperun."
});
```

## Integração com Hugging Face

Para integrar com modelos do Hugging Face que suportam Function Calling (como o Mistral AI):

```python
import requests
from transformers import AutoTokenizer, pipeline

# Conectar ao servidor MCP (usando um cliente Python para MCP)
# Assumindo que você tem um cliente Python para MCP
mcp_client = McpClient("http://localhost:3000")

# Obter as ferramentas do servidor MCP
mcp_tools = mcp_client.get_tools()

# Configurar o modelo
tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.2")
model = pipeline("text-generation", model="mistralai/Mistral-7B-Instruct-v0.2")

# Criar um prompt com as ferramentas disponíveis
tools_description = "\n".join([f"- {tool.name}: {tool.description}" for tool in mcp_tools])
prompt = f"""
Você é um assistente para o CRM Piperun.
Você tem acesso às seguintes ferramentas:
{tools_description}

Por favor, responda à seguinte pergunta: Liste os negócios criados esta semana.
"""

# Gerar uma resposta
response = model(prompt, max_length=500)

# Analisar a resposta para identificar chamadas de ferramentas (depende do formato de saída do modelo)
# Executar a ferramenta no servidor MCP conforme necessário
```

## Melhores Práticas

1. **Caching de Respostas**: Considere implementar cache para as respostas das ferramentas e recursos do MCP para melhorar o desempenho.

2. **Tratamento de Erros**: Sempre forneça tratamento de erros adequado para lidar com falhas de conexão com o servidor MCP.

3. **Contexto Limitado**: Lembre-se que os LLMs têm limite de contexto. Use os recursos do MCP de forma seletiva para não exceder esse limite.

4. **Prompts Personalizados**: Utilize os prompts predefinidos do servidor MCP para gerar interações estruturadas com o LLM.

5. **Autenticação**: Implemente autenticação adequada para proteger o acesso ao servidor MCP em ambientes de produção.

## Exemplos Práticos

Para exemplos práticos de uso, consulte o diretório `/examples` no repositório.
