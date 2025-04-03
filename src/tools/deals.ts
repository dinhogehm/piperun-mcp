/**
 * Ferramenta MCP para listar negócios (deals) do Piperun
 */

import { z } from "zod";
import type { DealsParams, McpResponse, McpTextContent } from '../types/index.ts';
import { listDeals } from '../services/api.ts';
import { TOOL_CONFIG } from '../config/api.ts';

/**
 * Definição da ferramenta de listagem de negócios
 */
export const listDealsTool = {
  name: TOOL_CONFIG.deals.name,
  description: TOOL_CONFIG.deals.description,
  parameters: {
    pipeline_id: z.number().optional().describe("ID do pipeline para filtrar negócios"),
    stage_id: z.number().optional().describe("ID da etapa para filtrar negócios"),
    person_id: z.number().optional().describe("ID do contato para filtrar negócios"),
    title: z.string().optional().describe("Título do negócio para filtrar"),
    status: z.enum(["open", "won", "lost"]).optional().describe("Status do negócio (aberto, ganho, perdido)"),
    page: z.number().optional().default(1).describe("Número da página para paginação"),
    show: z.number().optional().default(20).describe("Quantidade de registros por página"),
  },
  handler: async (params: DealsParams): Promise<McpResponse> => {
    try {
      const { pipeline_id, stage_id, person_id, title, status, page, show } = params;
      
      // Realiza a busca de negócios
      const result = await listDeals({ 
        pipeline_id, 
        stage_id, 
        person_id, 
        title, 
        status, 
        page, 
        show 
      });

      if (!result.data) {
        throw new Error('Nenhum resultado retornado da API');
      }

      // Constrói o texto de resposta
      let responseText = `Resultados de Negócios:\n\n`;
      
      // Adiciona informações de paginação se disponíveis
      if (result.meta?.pagination) {
        const { total, current_page, total_pages } = result.meta.pagination;
        responseText += `Total de negócios: ${total}\n`;
        responseText += `Página ${current_page} de ${total_pages}\n\n`;
      }

      // Adiciona dados dos negócios
      if (result.data.length === 0) {
        responseText += `Nenhum negócio encontrado com os filtros fornecidos.`;
      } else {
        // Formata cada negócio para exibição
        result.data.forEach((deal, index) => {
          responseText += `${index + 1}. ID: ${deal.id} - ${deal.title}\n`;
          responseText += `   Valor: ${deal.value || 'N/A'}\n`;
          responseText += `   Status: ${deal.status || 'N/A'}\n`;
          responseText += `   Pipeline: ${deal.pipeline_id}\n`;
          responseText += `   Etapa: ${deal.stage_id}\n`;
          if (deal.person_id) {
            responseText += `   Contato: ${deal.person_id}\n`;
          }
          responseText += `   Criado em: ${new Date(deal.created_at).toLocaleDateString('pt-BR')}\n`;
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
      throw new Error(`Falha ao buscar negócios: ${error.message}`);
    }
  }
};
