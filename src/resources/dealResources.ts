import { ResourceTemplate } from '../adapters/mcp-sdk.adapter.js';
import { PiperunApiService } from '../services/piperunApi.js';
import { Logger } from '../utils/logger.js';

const piperunApi = new PiperunApiService();
const logger = new Logger('DealResources');

/**
 * Recursos relacionados a negócios (deals) no Piperun
 */
export const dealResources = {
  // Recurso para listar negócios
  listDeals: {
    name: 'negocios',
    template: new ResourceTemplate('piperun://negocios', { 
      list: 'piperun://negocios/lista?page={page}&show={show}'
    }),
    handler: async (uri: URL, params: { page?: string, show?: string }) => {
      const page = params.page ? parseInt(params.page, 10) : 1;
      const show = params.show ? parseInt(params.show, 10) : 10;

      try {
        logger.info('Buscando recurso de listagem de negócios', { page, show });
        const result = await piperunApi.listDeals({ page, show });
        
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
          : 'Erro desconhecido ao listar negócios';
        
        logger.error('Erro ao buscar recurso de negócios', { error });
        
        return {
          contents: [
            {
              uri: uri.href,
              text: `Erro ao listar negócios: ${errorMessage}`
            }
          ]
        };
      }
    }
  },

  // Recurso para obter detalhes de um negócio específico
  getDeal: {
    name: 'negocio',
    template: new ResourceTemplate('piperun://negocios/{dealId}', { list: undefined }),
    handler: async (uri: URL, params: { dealId: string }) => {
      const dealId = parseInt(params.dealId, 10);
      
      try {
        logger.info('Buscando recurso de detalhes do negócio', { dealId });
        const deal = await piperunApi.getDeal(dealId);
        
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify(deal, null, 2)
            }
          ]
        };
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Erro desconhecido ao obter detalhes do negócio';
        
        logger.error('Erro ao buscar recurso de detalhes do negócio', { dealId, error });
        
        return {
          contents: [
            {
              uri: uri.href,
              text: `Erro ao obter detalhes do negócio: ${errorMessage}`
            }
          ]
        };
      }
    }
  }
};
