import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { setupTools } from "./tools.js";
import { setupPipeRunTools } from "./piperun-tools.js";

/**
 * Configura o servidor MCP para o PipeRun
 * @param server Instância do servidor MCP para configurar
 */
export async function setupPipeRunServer(server: McpServer): Promise<void> {
  // Configura as ferramentas padrão
  setupTools(server);
  
  // Configura as ferramentas específicas do PipeRun
  setupPipeRunTools(server);
  
  console.error("PipeRun MCP configurado com sucesso");
}
