"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelineResources = void 0;
const sdk_1 = require("@modelcontextprotocol/sdk");
const piperunApi_1 = require("../services/piperunApi");
const logger_1 = require("../utils/logger");
const piperunApi = new piperunApi_1.PiperunApiService();
const logger = new logger_1.Logger('PipelineResources');
/**
 * Recursos relacionados a funis (pipelines) no Piperun
 */
exports.pipelineResources = {
    // Recurso para listar funis
    listPipelines: {
        name: 'funis',
        template: new sdk_1.ResourceTemplate('piperun://funis', {
            list: 'piperun://funis/lista?page={page}&show={show}'
        }),
        handler: async (uri, params) => {
            const page = params.page ? parseInt(params.page, 10) : 1;
            const show = params.show ? parseInt(params.show, 10) : 10;
            try {
                logger.info('Buscando recurso de listagem de funis', { page, show });
                const result = await piperunApi.listPipelines({ page, show });
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
                    : 'Erro desconhecido ao listar funis';
                logger.error('Erro ao buscar recurso de funis', { error });
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: `Erro ao listar funis: ${errorMessage}`
                        }
                    ]
                };
            }
        }
    },
    // Recurso para listar estágios
    listStages: {
        name: 'estagios',
        template: new sdk_1.ResourceTemplate('piperun://estagios', {
            list: 'piperun://estagios/lista?page={page}&show={show}&pipeline_id={pipelineId}'
        }),
        handler: async (uri, params) => {
            const page = params.page ? parseInt(params.page, 10) : 1;
            const show = params.show ? parseInt(params.show, 10) : 10;
            const pipeline_id = params.pipelineId ? parseInt(params.pipelineId, 10) : undefined;
            try {
                logger.info('Buscando recurso de listagem de estágios', { page, show, pipeline_id });
                const result = await piperunApi.listStages({ page, show, pipeline_id });
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
                    : 'Erro desconhecido ao listar estágios';
                logger.error('Erro ao buscar recurso de estágios', { pipeline_id, error });
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: `Erro ao listar estágios: ${errorMessage}`
                        }
                    ]
                };
            }
        }
    }
};
//# sourceMappingURL=pipelineResources.js.map