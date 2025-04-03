/**
 * Utilitários para criar schemas Zod compatíveis com o MCP
 *
 * Este arquivo fornece funções para criar schemas Zod corretamente formatados
 * para uso com o SDK do Model Context Protocol.
 */
import { z } from 'zod';
/**
 * Cria um schema para um endpoint de método específico
 * @param method Nome do método
 * @returns Schema Zod para o método
 */
export declare function createMethodSchema(method: string): z.ZodObject<z.objectUtil.extendShape<{
    method: 
    /**
     * Cria um schema para um método com parâmetros específicos
     * @param method Nome do método
     * @param paramsSchema Schema dos parâmetros
     * @returns Schema Zod para o método com parâmetros
     */
    z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, {
    method: z.ZodLiteral<string>;
}>, "strip", z.ZodTypeAny, {
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
    params?: z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
}>;
/**
 * Cria um schema para um método com parâmetros específicos
 * @param method Nome do método
 * @param paramsSchema Schema dos parâmetros
 * @returns Schema Zod para o método com parâmetros
 */
export declare function createMethodWithParamsSchema(method: string, paramsSchema: z.ZodType<any>): z.ZodObject<z.objectUtil.extendShape<{
    method: z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, {
    method: z.ZodLiteral<string>;
    params: z.ZodType<any, z.ZodTypeDef, any>;
}>, "strip", z.ZodTypeAny, {
    method: string;
    params?: any;
}, {
    method: string;
    params?: any;
}>;
/**
 * Serializa um schema Zod para uma representação JSON simplificada
 * para evitar problemas de serialização com o Claude Desktop
 * @param schema O schema Zod para serializar
 * @returns Um objeto JSON simplificado representando o schema
 */
export declare function safeSerializeSchema(schema: z.ZodType<any>): Record<string, any>;
export declare const ToolsListSchema: z.ZodObject<z.objectUtil.extendShape<{
    method: 
    /**
     * Cria um schema para um método com parâmetros específicos
     * @param method Nome do método
     * @param paramsSchema Schema dos parâmetros
     * @returns Schema Zod para o método com parâmetros
     */
    z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, {
    method: z.ZodLiteral<string>;
}>, "strip", z.ZodTypeAny, {
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
    params?: z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
}>;
export declare const ResourcesListSchema: z.ZodObject<z.objectUtil.extendShape<{
    method: 
    /**
     * Cria um schema para um método com parâmetros específicos
     * @param method Nome do método
     * @param paramsSchema Schema dos parâmetros
     * @returns Schema Zod para o método com parâmetros
     */
    z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, {
    method: z.ZodLiteral<string>;
}>, "strip", z.ZodTypeAny, {
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
    params?: z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
}>;
export declare const PromptsListSchema: z.ZodObject<z.objectUtil.extendShape<{
    method: 
    /**
     * Cria um schema para um método com parâmetros específicos
     * @param method Nome do método
     * @param paramsSchema Schema dos parâmetros
     * @returns Schema Zod para o método com parâmetros
     */
    z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough">>>;
}, {
    method: z.ZodLiteral<string>;
}>, "strip", z.ZodTypeAny, {
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
    params?: z.objectInputType<{
        _meta: z.ZodOptional<z.ZodObject<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            progressToken: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        }, z.ZodTypeAny, "passthrough">>>;
    }, z.ZodTypeAny, "passthrough"> | undefined;
}>;
