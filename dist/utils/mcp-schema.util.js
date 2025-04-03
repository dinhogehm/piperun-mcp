/**
 * Utilitários para criar schemas Zod compatíveis com o MCP
 *
 * Este arquivo fornece funções para criar schemas Zod corretamente formatados
 * para uso com o SDK do Model Context Protocol.
 */
import { z } from 'zod';
import { RequestSchema } from '@modelcontextprotocol/sdk/types.js';
/**
 * Cria um schema para um endpoint de método específico
 * @param method Nome do método
 * @returns Schema Zod para o método
 */
export function createMethodSchema(method) {
    return RequestSchema.extend({
        method: z.literal(method)
    });
}
/**
 * Cria um schema para um método com parâmetros específicos
 * @param method Nome do método
 * @param paramsSchema Schema dos parâmetros
 * @returns Schema Zod para o método com parâmetros
 */
export function createMethodWithParamsSchema(method, paramsSchema) {
    return RequestSchema.extend({
        method: z.literal(method),
        params: paramsSchema
    });
}
// Schemas predefinidos para métodos padrão do MCP
export const ToolsListSchema = createMethodSchema('tools/list');
export const ResourcesListSchema = createMethodSchema('resources/list');
export const PromptsListSchema = createMethodSchema('prompts/list');
//# sourceMappingURL=mcp-schema.util.js.map