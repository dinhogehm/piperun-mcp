"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productResources = void 0;
const sdk_1 = require("@modelcontextprotocol/sdk");
const piperunApi_1 = require("../services/piperunApi");
const logger_1 = require("../utils/logger");
const piperunApi = new piperunApi_1.PiperunApiService();
const logger = new logger_1.Logger('ProductResources');
/**
 * Recursos relacionados a produtos (items) no Piperun
 */
exports.productResources = {
    // Recurso para listar produtos
    listProducts: {
        name: 'produtos',
        template: new sdk_1.ResourceTemplate('piperun://produtos', {
            list: 'piperun://produtos/lista?page={page}&show={show}'
        }),
        handler: async (uri, params) => {
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
            }
            catch (error) {
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
//# sourceMappingURL=productResources.js.map