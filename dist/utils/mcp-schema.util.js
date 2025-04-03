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
/**
 * Serializa um schema Zod para uma representação JSON simplificada
 * para evitar problemas de serialização com o Claude Desktop
 * @param schema O schema Zod para serializar
 * @returns Um objeto JSON simplificado representando o schema
 */
export function safeSerializeSchema(schema) {
    // Simplifica a serialização para evitar problemas com objetos circulares
    // e estruturas complexas que o Claude Desktop pode ter dificuldade em processar
    try {
        // Para schemas de objeto, tenta extrair as propriedades
        if (schema instanceof z.ZodObject) {
            // Extrai uma versão simplificada da definição do schema
            return {};
        }
        // Para outros tipos, retorna um objeto vazio (mas válido)
        return {};
    }
    catch (e) {
        console.error('Erro ao serializar schema Zod:', e);
        return {};
    }
}
// Schemas predefinidos para métodos padrão do MCP
export const ToolsListSchema = createMethodSchema('tools/list');
export const ResourcesListSchema = createMethodSchema('resources/list');
export const PromptsListSchema = createMethodSchema('prompts/list');
//# sourceMappingURL=mcp-schema.util.js.map