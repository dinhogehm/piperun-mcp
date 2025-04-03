/**
 * Ferramenta MCP para verificar o status da API do Piperun
 */

import { z } from "zod";
import type { StatusParams, McpResponse, McpTextContent } from '../types/index.ts';
import { checkApiStatus } from '../services/api.ts';
import { TOOL_CONFIG } from '../config/api.ts';

/**
 * Definição da ferramenta de verificação de status
 */
export const checkStatusTool = {
  name: TOOL_CONFIG.status.name,
  description: TOOL_CONFIG.status.description,
  parameters: {},
  handler: async (_params: StatusParams): Promise<McpResponse> => {
    try {
      // Verifica o status da API
      const result = await checkApiStatus();

      // Constrói o texto de resposta
      const responseText = `Status da API do Piperun:\n\n${result.status === 'success' ? '✅' : '❌'} ${result.message}`;

      const content: McpTextContent = {
        type: "text",
        text: responseText
      };

      return {
        content: [content],
      };
    } catch (error) {
      throw new Error(`Falha ao verificar status da API: ${error.message}`);
    }
  }
};
