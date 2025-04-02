"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipelineTools = void 0;
const zod_1 = require("zod");
const piperunApi_1 = require("../services/piperunApi");
const piperunApi = new piperunApi_1.PiperunApiService();
// Esquema para pesquisa de funis
const searchPipelinesSchema = zod_1.z.object({
    page: zod_1.z.number().default(1),
    show: zod_1.z.number().default(10),
});
/**
 * Ferramentas relacionadas a funis (pipelines) no Piperun
 */
exports.pipelineTools = {
    // Ferramenta para listar funis
    listPipelines: {
        name: 'listar-funis',
        schema: searchPipelinesSchema,
        handler: async (params) => {
            try {
                const result = await piperunApi.listPipelines(params);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'Erro desconhecido ao listar funis';
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Erro ao listar funis: ${errorMessage}`
                        }
                    ]
                };
            }
        }
    },
    // Ferramenta para listar estágios de um funil específico
    listStages: {
        name: 'listar-estagios',
        schema: zod_1.z.object({
            pipeline_id: zod_1.z.number().optional(),
            page: zod_1.z.number().default(1),
            show: zod_1.z.number().default(10),
        }),
        handler: async (params) => {
            try {
                const result = await piperunApi.listStages(params);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'Erro desconhecido ao listar estágios';
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Erro ao listar estágios: ${errorMessage}`
                        }
                    ]
                };
            }
        }
    }
};
//# sourceMappingURL=pipelineTools.js.map