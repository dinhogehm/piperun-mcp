import { ResourceTemplate } from '@modelcontextprotocol/sdk';
import { PiperunApiService } from '../services/piperunApi';
import { Logger } from '../utils/logger';

const piperunApi = new PiperunApiService();
const logger = new Logger('ContactResources');

/**
 * Recursos relacionados a contatos (people) no Piperun
 */
export const contactResources = {
  // Recurso para listar contatos
  listContacts: {
    name: 'contatos',
    template: new ResourceTemplate('piperun://contatos', { 
      list: 'piperun://contatos/lista?page={page}&show={show}'
    }),
    handler: async (uri: URL, params: { page?: string, show?: string }) => {
      const page = params.page ? parseInt(params.page, 10) : 1;
      const show = params.show ? parseInt(params.show, 10) : 10;

      try {
        logger.info('Buscando recurso de listagem de contatos', { page, show });
        const result = await piperunApi.listContacts({ page, show });
        
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Erro desconhecido ao listar contatos';
        
        logger.error('Erro ao buscar recurso de contatos', { error });
        
        return {
          contents: [
            {
              uri: uri.href,
              text: `Erro ao listar contatos: ${errorMessage}`
            }
          ]
        };
      }
    }
  }
};
