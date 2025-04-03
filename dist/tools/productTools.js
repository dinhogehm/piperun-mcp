import { z } from 'zod';
import { PiperunApiService } from '../services/piperunApi.js';
const piperunApi = new PiperunApiService();
// Esquema para pesquisa de produtos
const searchProductsSchema = z.object({
    page: z.number().default(1),
    show: z.number().default(10),
    name: z.string().optional(),
});
/**
 * Ferramentas relacionadas a produtos (items) no Piperun
 */
export const productTools = {
    // Ferramenta para listar produtos
    listProducts: {
        name: 'listar-produtos',
        schema: searchProductsSchema,
        handler: async (params) => {
            try {
                const result = await piperunApi.listProducts(params);
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
                    : 'Erro desconhecido ao listar produtos';
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Erro ao listar produtos: ${errorMessage}`
                        }
                    ]
                };
            }
        }
    }
};
//# sourceMappingURL=productTools.js.map