import { ResourceTemplate } from '@modelcontextprotocol/sdk';
import { PiperunApiService } from '../services/piperunApi';
import { Logger } from '../utils/logger';

const piperunApi = new PiperunApiService();
const logger = new Logger('ProductResources');

/**
 * Recursos relacionados a produtos (items) no Piperun
 */
export const productResources = {
  // Recurso para listar produtos
  listProducts: {
    name: 'produtos',
    template: new ResourceTemplate('piperun://produtos', { 
      list: 'piperun://produtos/lista?page={page}&show={show}'
    }),
    handler: async (uri: URL, params: { page?: string, show?: string }) => {
      const page = params.page ? parseInt(params.page, 10) : 1;
      const show = params.show ? parseInt(params.show, 10) : 10;

      try {
        logger.info('Buscando recurso de listagem de produtos', { page, show });
        const result = await piperunApi.listProducts({ page, show });
        
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
          : 'Erro desconhecido ao listar produtos';
        
        logger.error('Erro ao buscar recurso de produtos', { error });
        
        return {
          contents: [
            {
              uri: uri.href,
              text: `Erro ao listar produtos: ${errorMessage}`
            }
          ]
        };
      }
    }
  }
};
