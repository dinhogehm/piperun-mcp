/**
 * Ferramenta MCP para listar produtos no Piperun
 */

import { z } from "zod";
import type { ProductsParams, McpResponse, McpTextContent } from '../types/index.ts';
import { listProducts } from '../services/api.ts';
import { TOOL_CONFIG } from '../config/api.ts';

/**
 * Definição da ferramenta de listagem de produtos
 */
export const listProductsTool = {
  name: TOOL_CONFIG.products.name,
  description: TOOL_CONFIG.products.description,
  parameters: {
    name: z.string().optional().describe("Nome do produto para filtrar"),
    page: z.number().optional().default(1).describe("Número da página para paginação"),
    show: z.number().optional().default(20).describe("Quantidade de registros por página"),
  },
  handler: async (params: ProductsParams): Promise<McpResponse> => {
    try {
      const { name, page, show } = params;
      
      // Realiza a busca de produtos
      const result = await listProducts({ 
        name, 
        page, 
        show 
      });

      if (!result.data) {
        throw new Error('Nenhum resultado retornado da API');
      }

      // Constrói o texto de resposta
      let responseText = `Resultados de Produtos:\n\n`;
      
      // Adiciona informações de paginação se disponíveis
      if (result.meta?.pagination) {
        const { total, current_page, total_pages } = result.meta.pagination;
        responseText += `Total de produtos: ${total}\n`;
        responseText += `Página ${current_page} de ${total_pages}\n\n`;
      }

      // Adiciona dados dos produtos
      if (result.data.length === 0) {
        responseText += `Nenhum produto encontrado com os filtros fornecidos.`;
      } else {
        // Formata cada produto para exibição
        result.data.forEach((product, index) => {
          responseText += `${index + 1}. ID: ${product.id} - ${product.name}\n`;
          responseText += `   Preço: ${formatCurrency(product.price || 0)}\n`;
          
          // Adiciona campos adicionais relevantes
          if (product.description) {
            responseText += `   Descrição: ${product.description}\n`;
          }
          if (product.code) {
            responseText += `   Código: ${product.code}\n`;
          }
          if (product.created_at) {
            responseText += `   Criado em: ${new Date(product.created_at).toLocaleDateString('pt-BR')}\n`;
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
      throw new Error(`Falha ao buscar produtos: ${error.message}`);
    }
  }
};

/**
 * Função auxiliar para formatação de valores monetários
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
