/**
 * Ferramenta MCP para listar contatos no Piperun
 */

import { z } from "zod";
import type { ContactsParams, McpResponse, McpTextContent } from '../types/index.ts';
import { listContacts } from '../services/api.ts';
import { TOOL_CONFIG } from '../config/api.ts';

/**
 * Definição da ferramenta de listagem de contatos
 */
export const listContactsTool = {
  name: TOOL_CONFIG.contacts.name,
  description: TOOL_CONFIG.contacts.description,
  parameters: {
    name: z.string().optional().describe("Nome do contato para filtrar"),
    email: z.string().optional().describe("Email do contato para filtrar"),
    page: z.number().optional().default(1).describe("Número da página para paginação"),
    show: z.number().optional().default(20).describe("Quantidade de registros por página"),
  },
  handler: async (params: ContactsParams): Promise<McpResponse> => {
    try {
      const { name, email, page, show } = params;
      
      // Realiza a busca de contatos
      const result = await listContacts({ 
        name, 
        email, 
        page, 
        show 
      });

      if (!result.data) {
        throw new Error('Nenhum resultado retornado da API');
      }

      // Constrói o texto de resposta
      let responseText = `Resultados de Contatos:\n\n`;
      
      // Adiciona informações de paginação se disponíveis
      if (result.meta?.pagination) {
        const { total, current_page, total_pages } = result.meta.pagination;
        responseText += `Total de contatos: ${total}\n`;
        responseText += `Página ${current_page} de ${total_pages}\n\n`;
      }

      // Adiciona dados dos contatos
      if (result.data.length === 0) {
        responseText += `Nenhum contato encontrado com os filtros fornecidos.`;
      } else {
        // Formata cada contato para exibição
        result.data.forEach((contact, index) => {
          responseText += `${index + 1}. ID: ${contact.id} - ${contact.name}\n`;
          
          // Adiciona campos adicionais relevantes
          if (contact.email) {
            responseText += `   Email: ${contact.email}\n`;
          }
          if (contact.phone) {
            responseText += `   Telefone: ${contact.phone}\n`;
          }
          if (contact.mobile) {
            responseText += `   Celular: ${contact.mobile}\n`;
          }
          if (contact.company) {
            responseText += `   Empresa: ${contact.company}\n`;
          }
          if (contact.position) {
            responseText += `   Cargo: ${contact.position}\n`;
          }
          if (contact.created_at) {
            responseText += `   Criado em: ${new Date(contact.created_at).toLocaleDateString('pt-BR')}\n`;
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
      throw new Error(`Falha ao buscar contatos: ${error.message}`);
    }
  }
};
