/**
 * Servidor MCP Piperun - Programa principal
 * Para integração com Windsurf
 */

import { McpServer } from './mcp-tools';
import { tools } from './piperun-mcp';

// Criar e configurar o servidor MCP
const server = new McpServer();

// Registrar todas as ferramentas
tools.forEach(tool => {
  server.registerTool(tool);
});

// Iniciar o servidor
server.start();
