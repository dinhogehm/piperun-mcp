"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealTools = void 0;
const zod_1 = require("zod");
const piperunApi_1 = require("../services/piperunApi");
const piperunApi = new piperunApi_1.PiperunApiService();
// Esquema para atualização de negócio
const updateDealSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    value: zod_1.z.number().optional(),
    stage_id: zod_1.z.number().optional(),
    person_id: zod_1.z.number().optional(),
    user_id: zod_1.z.number().optional(),
});
// Esquema para pesquisa de negócios
const searchDealsSchema = zod_1.z.object({
    page: zod_1.z.number().default(1),
    show: zod_1.z.number().default(10),
    person_id: zod_1.z.number().optional(),
    title: zod_1.z.string().optional(),
    pipeline_id: zod_1.z.number().optional(),
    stage_id: zod_1.z.number().optional(),
});
/**
 * Ferramentas relacionadas a negócios (deals) no Piperun
 */
exports.dealTools = {
    // Ferramenta para listar negócios
    listDeals: {
        name: 'listar-negocios',
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
        name: 'detalhes-negocio',
        schema: zod_1.z.object({
            deal_id: zod_1.z.number()
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
        name: 'atualizar-negocio',
        schema: zod_1.z.object({
            deal_id: zod_1.z.number(),
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