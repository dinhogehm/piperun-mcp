/**
 * Este é um exemplo de demonstração do servidor MCP do Piperun
 * Implementa uma versão completa do servidor para fins de produção
 */
interface ToolParams {
    [key: string]: any;
}
interface RegisteredTool {
    name: string;
    schema: any;
    handler: (params: ToolParams) => Promise<any>;
}
declare class MCPDemoServer {
    private name;
    private version;
    private _tools;
    private server;
    constructor(options: {
        name: string;
        version: string;
    });
    get tools(): Map<string, RegisteredTool>;
    registerTool(name: string, schema: any, handler: any): void;
    private extractParams;
    start(port: number): Promise<void>;
    stop(): void;
}
declare function startDemo(): Promise<void>;
export { MCPDemoServer, startDemo };
