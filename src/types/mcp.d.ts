/**
 * Definições de tipos para o SDK MCP
 * 
 * Este arquivo é uma solução temporária para os problemas de importação
 * do SDK MCP. Idealmente, esses tipos seriam fornecidos pelo próprio SDK.
 */

declare module '@modelcontextprotocol/sdk' {
  export class McpServer {
    constructor(options: { name: string; version: string });
    
    tool(name: string, schema: any, handler: (params: any) => Promise<any>): void;
    resource(name: string, template: any, handler: (uri: URL, params: any) => Promise<any>): void;
    prompt(name: string, schema: any, handler: (params: any) => any): void;
    connect(transport: any): Promise<void>;
  }

  export class ResourceTemplate {
    constructor(template: string, options: { list: string | undefined });
  }

  export class StdioServerTransport {
    constructor();
  }

  export class HttpServerTransport {
    constructor(options: { port: number });
  }
}
