"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealResources = void 0;
const sdk_1 = require("@modelcontextprotocol/sdk");
const piperunApi_1 = require("../services/piperunApi");
const logger_1 = require("../utils/logger");
const piperunApi = new piperunApi_1.PiperunApiService();
const logger = new logger_1.Logger('DealResources');
/**
 * Recursos relacionados a negócios (deals) no Piperun
 */
exports.dealResources = {
    // Recurso para listar negócios
    listDeals: {
        name: 'negocios',
        template: new sdk_1.ResourceTemplate('piperun://negocios', {
            list: 'piperun://negocios/lista?page={page}&show={show}'
        }),
        handler: async (uri, params) => {
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
            }
            catch (error) {
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
        template: new sdk_1.ResourceTemplate('piperun://negocios/{dealId}', { list: undefined }),
        handler: async (uri, params) => {
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
            }
            catch (error) {
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
//# sourceMappingURL=dealResources.js.map