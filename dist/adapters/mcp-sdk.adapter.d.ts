/**
 * Adaptador para o SDK do MCP
 *
 * Este adaptador encapsula as importações do SDK do MCP para facilitar seu uso no projeto,
 * evitando problemas com os caminhos de importação e tornando o código mais organizado.
 *
 * Como o pacote SDK está configurado de forma específica para ESM, usamos uma abordagem
 * adaptada para garantir a compatibilidade correta com a API real do SDK.
 */
export type McpServer = any;
export type McpTool = any;
export type McpResource = any;
export type McpPrompt = any;
export declare class ResourceTemplate {
    baseUrl: string;
    paths: Record<string, string | undefined>;
    constructor(baseUrl: string, paths?: Record<string, string | undefined>);
}
export interface ToolDefinition {
    name: string;
    schema: any;
    handler: (...args: any[]) => Promise<any>;
}
export interface ResourceDefinition {
    name: string;
    template: ResourceTemplate;
    handler: (...args: any[]) => Promise<any>;
}
export interface PromptDefinition {
    name: string;
    schema: any;
    handler: (...args: any[]) => Promise<any>;
}
/**
 * Classe que envolve o SDK MCP para simplificar o registro de ferramentas,
 * recursos e prompts usando a API correta do SDK.
 */
export declare class MCPServerWrapper {
    private _server;
    private _tools;
    private _resources;
    private _prompts;
    /**
     * Cria um wrapper em torno do servidor MCP
     * @param server Instância do servidor MCP
     */
    constructor(server: any);
    /**
     * Registra uma ferramenta no servidor MCP
     */
    tool(name: string, schema: any, handler: (...args: any[]) => Promise<any>): void;
    /**
     * Registra um recurso no servidor MCP
     */
    resource(name: string, template: ResourceTemplate, handler: (...args: any[]) => Promise<any>): void;
    /**
     * Registra um prompt no servidor MCP
     */
    prompt(name: string, schema: any, handler: (...args: any[]) => Promise<any>): void;
    /**
     * Conecta ao transporte fornecido
     */
    connect(transport: any): Promise<void>;
    /**
     * Registra todos os componentes no servidor MCP
     * Esse método é chamado automaticamente após a inicialização
     */
    private _registerAllComponents;
}
/**
 * Inicializa o SDK MCP e cria um wrapper para facilitar seu uso
 * @param config Configuração do servidor
 * @returns Um objeto com o wrapper do servidor e funções auxiliares
 */
export declare function initializeMcpSdk(config: {
    name: string;
    version: string;
}): Promise<{
    server: MCPServerWrapper;
    rawServer: import("@modelcontextprotocol/sdk/server/index.js").Server<{
        method: string;
        params?: import("zod").objectOutputType<{
            _meta: import("zod").ZodOptional<import("zod").ZodObject<{
                progressToken: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
            }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                progressToken: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
            }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                progressToken: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
            }, import("zod").ZodTypeAny, "passthrough">>>;
        }, import("zod").ZodTypeAny, "passthrough"> | undefined;
    }, {
        method: string;
        params?: import("zod").objectOutputType<{
            _meta: import("zod").ZodOptional<import("zod").ZodObject<{}, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{}, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{}, import("zod").ZodTypeAny, "passthrough">>>;
        }, import("zod").ZodTypeAny, "passthrough"> | undefined;
    }, import("zod").objectOutputType<{
        _meta: import("zod").ZodOptional<import("zod").ZodObject<{}, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{}, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{}, import("zod").ZodTypeAny, "passthrough">>>;
    }, import("zod").ZodTypeAny, "passthrough">>;
    stdioTransport: import("@modelcontextprotocol/sdk/server/stdio.js").StdioServerTransport;
    initializeHttpTransport(endpoint?: string): Promise<{
        createTransport(res?: any): any;
    }>;
}>;
