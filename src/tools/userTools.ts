/**
 * Ferramentas para gerenciar usuários no CRM Piperun
 * 
 * Este módulo implementa ferramentas para consultar e gerenciar usuários
 * no CRM Piperun através da API MCP.
 */

import { z } from 'zod';
import { PiperunApiService } from '../services/piperunApi.js';
import { Logger } from '../utils/logger.js';

// Serviço de API do Piperun para gerenciar usuários
const piperunApi = new PiperunApiService();
const logger = new Logger('UserTools');

// Schema para pesquisa de usuários
const searchUsersSchema = z.object({
  page: z.number().default(1),
  show: z.number().default(20)
});

/**
 * Ferramenta para listar os usuários da conta Piperun
 */
const listUsers = {
  name: 'mcp0_listar-usuarios',
  schema: searchUsersSchema,
  handler: async (params: z.infer<typeof searchUsersSchema>) => {
    logger.info('Executando ferramenta para listar usuários', { params });
    
    try {
      const result = await piperunApi.listUsers(params);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      logger.error('Erro ao listar usuários', error);
      return {
        content: [
          {
            type: 'text',
            text: `Erro ao listar usuários: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
};

// Exportação das ferramentas de usuários
export const userTools = {
  listUsers
};
