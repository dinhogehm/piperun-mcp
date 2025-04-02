/**
 * Exemplo de cliente para o servidor MCP do Piperun
 * 
 * Este arquivo demonstra como um cliente pode interagir com o servidor MCP
 * do Piperun utilizando as ferramentas e recursos disponíveis.
 * 
 * Para executar este exemplo:
 * 1. Inicie o servidor MCP em outro terminal: `MCP_TRANSPORT=http npm start`
 * 2. Execute este cliente: `ts-node examples/client-example.ts`
 */

import { McpClient } from '@modelcontextprotocol/sdk';
// Observação: Aqui estamos assumindo que você está usando o SDK MCP em um projeto cliente

async function main() {
  try {
    console.log('Iniciando cliente MCP para o Piperun...');
    
    // Conectar ao servidor MCP (assumindo que está rodando em HTTP)
    const client = await McpClient.connectToServer('http://localhost:3000');
    
    console.log('Conectado ao servidor MCP!');
    console.log(`Nome do servidor: ${client.serverInfo.name}`);
    console.log(`Versão do servidor: ${client.serverInfo.version}`);

    // Listar as ferramentas disponíveis
    console.log('\n=== Ferramentas disponíveis ===');
    for (const tool of client.tools) {
      console.log(`- ${tool.name}`);
    }

    // Listar os recursos disponíveis
    console.log('\n=== Recursos disponíveis ===');
    for (const resource of client.resources) {
      console.log(`- ${resource.name}`);
    }

    // Listar os prompts disponíveis
    console.log('\n=== Prompts disponíveis ===');
    for (const prompt of client.prompts) {
      console.log(`- ${prompt.name}`);
    }

    // Exemplo de uso de uma ferramenta: listar negócios
    console.log('\n=== Exemplo de uso: Listar negócios ===');
    try {
      const dealsResult = await client.executeTool('listar-negocios', {
        page: 1,
        show: 5
      });
      
      console.log('Negócios obtidos:');
      console.log(dealsResult.content[0].text);
    } catch (error) {
      console.error('Erro ao listar negócios:', error);
    }

    // Exemplo de uso de um recurso: carregar detalhes de um funil
    console.log('\n=== Exemplo de uso: Carregar lista de funis ===');
    try {
      const pipelinesResource = await client.loadResource('piperun://funis/lista?page=1&show=5');
      
      console.log('Funis obtidos:');
      for (const content of pipelinesResource.contents) {
        console.log(content.text);
      }
    } catch (error) {
      console.error('Erro ao carregar funis:', error);
    }

    // Exemplo de uso de um prompt: análise de negócio
    console.log('\n=== Exemplo de uso: Prompt para analisar negócio ===');
    try {
      const prompt = await client.getPrompt('analisar-negocio', {
        dealId: 123 // Substitua por um ID de negócio válido
      });
      
      console.log('Prompt gerado:');
      console.log(JSON.stringify(prompt, null, 2));
      
      // Em uma aplicação real, este prompt seria enviado para um LLM
      console.log('Em uma aplicação real, este prompt seria enviado para um LLM');
    } catch (error) {
      console.error('Erro ao gerar prompt:', error);
    }

    console.log('\nExemplo concluído!');
  } catch (error) {
    console.error('Erro durante a execução do cliente:', error);
  }
}

main();
