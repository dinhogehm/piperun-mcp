/**
 * Adaptador para o SDK do Model Context Protocol
 * Este arquivo resolve problemas de compatibilidade entre ESM e CommonJS
 */
declare const getMcpModules: () => Promise<{
    McpServer: typeof import("@modelcontextprotocol/sdk").McpServer;
    StdioServerTransport: typeof import("@modelcontextprotocol/sdk").StdioServerTransport;
    HttpServerTransport: typeof import("@modelcontextprotocol/sdk").HttpServerTransport;
}>;
export default getMcpModules;
