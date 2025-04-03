import { z } from 'zod';
import { PiperunApiService } from '../services/piperunApi.js';
const piperunApi = new PiperunApiService();
// Esquema para pesquisa de funis
const searchPipelinesSchema = z.object({
    page: z.number().default(1),
    show: z.number().default(10),
});
/**
 * Ferramentas relacionadas a funis (pipelines) no Piperun
 */
export const pipelineTools = {
    // Ferramenta para listar funis
    listPipelines: {
        name: 'mcp0_listar-funis',
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
        name: 'mcp0_listar-estagios',
        schema: z.object({
            pipeline_id: z.number().optional(),
            page: z.number().default(1),
            show: z.number().default(10),
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