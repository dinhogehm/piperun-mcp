"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactTools = void 0;
const zod_1 = require("zod");
const piperunApi_1 = require("../services/piperunApi");
const piperunApi = new piperunApi_1.PiperunApiService();
// Esquema para pesquisa de contatos
const searchContactsSchema = zod_1.z.object({
    page: zod_1.z.number().default(1),
    show: zod_1.z.number().default(10),
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
});
/**
 * Ferramentas relacionadas a contatos (people) no Piperun
 */
exports.contactTools = {
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