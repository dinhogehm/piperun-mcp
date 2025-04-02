"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactResources = void 0;
const sdk_1 = require("@modelcontextprotocol/sdk");
const piperunApi_1 = require("../services/piperunApi");
const logger_1 = require("../utils/logger");
const piperunApi = new piperunApi_1.PiperunApiService();
const logger = new logger_1.Logger('ContactResources');
/**
 * Recursos relacionados a contatos (people) no Piperun
 */
exports.contactResources = {
    // Recurso para listar contatos
    listContacts: {
        name: 'contatos',
        template: new sdk_1.ResourceTemplate('piperun://contatos', {
            list: 'piperun://contatos/lista?page={page}&show={show}'
        }),
        handler: async (uri, params) => {
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
            }
            catch (error) {
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
//# sourceMappingURL=contactResources.js.map