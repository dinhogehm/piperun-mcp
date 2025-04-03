/**
 * Servidor MCP para a API do Piperun
 * 
 * Este arquivo inicializa o servidor MCP e registra todas as ferramentas
 * para interação com a API do CRM Piperun.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "dotenv";
import { SERVER_CONFIG } from './config/api.ts';
import { listDealsTool } from './tools/deals.ts';
import { listPipelinesTool } from './tools/pipelines.ts';
import { listStagesTool } from './tools/stages.ts';
import { listProductsTool } from './tools/products.ts';
import { listContactsTool } from './tools/contacts.ts';
import { checkStatusTool } from './tools/status.ts';

// Carrega variáveis de ambiente do arquivo .env
config();

/**
 * Inicializa o servidor MCP e registra todas as ferramentas
 */
async function inicializarServidor() {
  // Verifica se a chave de API está definida
  if (!process.env.PIPERUN_API_KEY) {
    console.error("ERRO: Chave de API do Piperun não encontrada. Defina a variável de ambiente PIPERUN_API_KEY.");
    process.exit(1);
  }

  // Cria a instância do servidor
  const servidor = new McpServer({
    name: SERVER_CONFIG.name,
    version: SERVER_CONFIG.version,
    description: SERVER_CONFIG.description,
  });

  // Registra todas as ferramentas
  servidor.tool(
    listDealsTool.name,
    listDealsTool.description,
    listDealsTool.parameters,
    listDealsTool.handler
  );

  servidor.tool(
    listPipelinesTool.name,
    listPipelinesTool.description,
    listPipelinesTool.parameters,
    listPipelinesTool.handler
  );

  servidor.tool(
    listStagesTool.name,
    listStagesTool.description,
    listStagesTool.parameters,
    listStagesTool.handler
  );

  servidor.tool(
    listProductsTool.name,
    listProductsTool.description,
    listProductsTool.parameters,
    listProductsTool.handler
  );

  servidor.tool(
    listContactsTool.name,
    listContactsTool.description,
    listContactsTool.parameters,
    listContactsTool.handler
  );

  servidor.tool(
    checkStatusTool.name,
    checkStatusTool.description,
    checkStatusTool.parameters,
    checkStatusTool.handler
  );

  return servidor;
}

/**
 * Ponto de entrada principal
 */
async function main() {
  try {
    // Inicializa o servidor
    const servidor = await inicializarServidor();
    
    // Conecta ao transporte stdio
    const transporte = new StdioServerTransport();
    await servidor.connect(transporte);
    
    // Usado console.error para que não seja processado como saída do MCP
    console.error("Servidor MCP da API do Piperun rodando no stdio");
  } catch (erro) {
    console.error("Erro fatal em main():", erro);
    process.exit(1);
  }
}

// Inicia o servidor
main();
