/**
 * Servidor MCP para o CRM Piperun
 *
 * Este arquivo implementa o servidor Model Context Protocol (MCP) para integração
 * com o CRM Piperun, permitindo acesso aos recursos e ferramentas do sistema.
 *
 * Usando o formato ESM para compatibilidade com o SDK do Model Context Protocol.
 */
import { z } from 'zod';
/**
 * Inicia o servidor MCP para o Piperun
 * Utiliza importações dinâmicas para o SDK do MCP
 */
declare function startPiperunMcpServer(): Promise<import("@modelcontextprotocol/sdk/server/index.js").Server<{
    method: string;
    params?: z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
}, {
    method: string;
    params?: z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
}, z.objectOutputType<{
    _meta: z.ZodOptional<z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>>;
}, z.ZodTypeAny, "passthrough">>>;
export { startPiperunMcpServer };
