/**
 * Ferramenta MCP para listar pipelines do Piperun
 */

import { z } from "zod";
import type { PipelinesParams, McpResponse, McpTextContent } from '../types/index.ts';
import { listPipelines } from '../services/api.ts';
import { TOOL_CONFIG } from '../config/api.ts';

/**
 * Definição da ferramenta de listagem de pipelines
 */
export const listPipelinesTool = {
  name: TOOL_CONFIG.pipelines.name,
  description: TOOL_CONFIG.pipelines.description,
  parameters: {
    page: z.number().optional().default(1).describe("Número da página para paginação"),
    show: z.number().optional().default(20).describe("Quantidade de registros por página"),
  },
  handler: async (params: PipelinesParams): Promise<McpResponse> => {
    try {
      const { page, show } = params;
      
      // Realiza a busca de pipelines
      const result = await listPipelines({ page, show });

      if (!result.data) {
        throw new Error('Nenhum resultado retornado da API');
      }

      // Constrói o texto de resposta
      let responseText = `Resultados de Pipelines:\n\n`;
      
      // Adiciona informações de paginação se disponíveis
      if (result.meta?.pagination) {
        const { total, current_page, total_pages } = result.meta.pagination;
        responseText += `Total de pipelines: ${total}\n`;
        responseText += `Página ${current_page} de ${total_pages}\n\n`;
      }

      // Adiciona dados dos pipelines
      if (result.data.length === 0) {
        responseText += `Nenhum pipeline encontrado.`;
      } else {
        // Formata cada pipeline para exibição
        result.data.forEach((pipeline, index) => {
          responseText += `${index + 1}. ID: ${pipeline.id} - ${pipeline.name}\n`;
          // Adiciona campos adicionais relevantes
          if (pipeline.description) {
            responseText += `   Descrição: ${pipeline.description}\n`;
          }
          if (pipeline.created_at) {
            responseText += `   Criado em: ${new Date(pipeline.created_at).toLocaleDateString('pt-BR')}\n`;
          }
          responseText += `\n`;
        });
      }

      const content: McpTextContent = {
        type: "text",
        text: responseText
      };

      return {
        content: [content],
      };
    } catch (error) {
      throw new Error(`Falha ao buscar pipelines: ${error.message}`);
    }
  }
};
