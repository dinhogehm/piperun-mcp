import { z } from 'zod';
import { PiperunApiService } from '../services/piperunApi.js';
const piperunApi = new PiperunApiService();
// Esquema para atualização de negócio
const updateDealSchema = z.object({
    title: z.string().optional(),
    value: z.number().optional(),
    stage_id: z.number().optional(),
    person_id: z.number().optional(),
    user_id: z.number().optional(),
});
// Esquema para pesquisa de negócios
const searchDealsSchema = z.object({
    page: z.number().default(1),
    show: z.number().default(10),
    person_id: z.number().optional(),
    title: z.string().optional(),
    pipeline_id: z.number().optional(),
    stage_id: z.number().optional(),
});
/**
 * Ferramentas relacionadas a negócios (deals) no Piperun
 */
export const dealTools = {
    // Ferramenta para listar negócios
    listDeals: {
        name: 'mcp0_listar-negocios',
        schema: searchDealsSchema,
        handler: async (params) => {
            try {
                const result = await piperunApi.listDeals(params);
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
                    : 'Erro desconhecido ao listar negócios';
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Erro ao listar negócios: ${errorMessage}`
                        }
                    ]
                };
            }
        }
    },
    // Ferramenta para obter detalhes de um negócio
    getDealDetails: {
        name: 'mcp0_detalhes-negocio',
        schema: z.object({
            deal_id: z.number()
        }),
        handler: async ({ deal_id }) => {
            try {
                const deal = await piperunApi.getDeal(deal_id);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(deal, null, 2)
                        }
                    ]
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'Erro desconhecido ao obter detalhes do negócio';
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Erro ao obter detalhes do negócio: ${errorMessage}`
                        }
                    ]
                };
            }
        }
    },
    // Ferramenta para atualizar um negócio
    updateDeal: {
        name: 'mcp0_atualizar-negocio',
        schema: z.object({
            deal_id: z.number(),
            data: updateDealSchema
        }),
        handler: async ({ deal_id, data }) => {
            try {
                const updatedDeal = await piperunApi.updateDeal(deal_id, data);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Negócio atualizado com sucesso: ${JSON.stringify(updatedDeal, null, 2)}`
                        }
                    ]
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'Erro desconhecido ao atualizar negócio';
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Erro ao atualizar negócio: ${errorMessage}`
                        }
                    ]
                };
            }
        }
    },
};
//# sourceMappingURL=dealTools.js.map