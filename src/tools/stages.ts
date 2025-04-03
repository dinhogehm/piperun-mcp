/**
 * Ferramenta MCP para listar etapas (stages) de um pipeline no Piperun
 */

import { z } from "zod";
import type { StagesParams, McpResponse, McpTextContent } from '../types/index.ts';
import { listStages } from '../services/api.ts';
import { TOOL_CONFIG } from '../config/api.ts';

/**
 * Definição da ferramenta de listagem de etapas
 */
export const listStagesTool = {
  name: TOOL_CONFIG.stages.name,
  description: TOOL_CONFIG.stages.description,
  parameters: {
    pipeline_id: z.number().describe("ID do pipeline para listar etapas"),
    page: z.number().optional().default(1).describe("Número da página para paginação"),
    show: z.number().optional().default(20).describe("Quantidade de registros por página"),
  },
  handler: async (params: StagesParams): Promise<McpResponse> => {
    try {
      const { pipeline_id, page, show } = params;
      
      // Realiza a busca de etapas do pipeline
      const result = await listStages({ 
        pipeline_id, 
        page, 
        show 
      });

      if (!result.data) {
        throw new Error('Nenhum resultado retornado da API');
      }

      // Constrói o texto de resposta
      let responseText = `Etapas do Pipeline ${pipeline_id}:\n\n`;
      
      // Adiciona informações de paginação se disponíveis
      if (result.meta?.pagination) {
        const { total, current_page, total_pages } = result.meta.pagination;
        responseText += `Total de etapas: ${total}\n`;
        responseText += `Página ${current_page} de ${total_pages}\n\n`;
      }

      // Adiciona dados das etapas
      if (result.data.length === 0) {
        responseText += `Nenhuma etapa encontrada para o pipeline ${pipeline_id}.`;
      } else {
        // Ordena as etapas por posição
        const sortedStages = [...result.data].sort((a, b) => 
          (a.position || 0) - (b.position || 0)
        );
        
        // Formata cada etapa para exibição
        sortedStages.forEach((stage, index) => {
          responseText += `${index + 1}. ID: ${stage.id} - ${stage.name}\n`;
          responseText += `   Posição: ${stage.position || 'N/A'}\n`;
          if (stage.description) {
            responseText += `   Descrição: ${stage.description}\n`;
          }
          if (stage.created_at) {
            responseText += `   Criado em: ${new Date(stage.created_at).toLocaleDateString('pt-BR')}\n`;
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
      throw new Error(`Falha ao buscar etapas: ${error.message}`);
    }
  }
};
