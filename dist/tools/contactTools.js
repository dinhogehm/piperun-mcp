import { z } from 'zod';
import { PiperunApiService } from '../services/piperunApi.js';
const piperunApi = new PiperunApiService();
// Esquema para pesquisa de contatos
const searchContactsSchema = z.object({
    page: z.number().default(1),
    show: z.number().default(10),
    name: z.string().optional(),
    email: z.string().optional(),
});
/**
 * Ferramentas relacionadas a contatos (people) no Piperun
 */
export const contactTools = {
    // Ferramenta para listar contatos
    listContacts: {
        name: 'listar-contatos',
        schema: searchContactsSchema,
        handler: async (params) => {
            try {
                const result = await piperunApi.listContacts(params);
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
                    : 'Erro desconhecido ao listar contatos';
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Erro ao listar contatos: ${errorMessage}`
                        }
                    ]
                };
            }
        }
    }
};
//# sourceMappingURL=contactTools.js.map