/**
 * Adaptador para o SDK do Model Context Protocol
 * Este arquivo resolve problemas de compatibilidade entre ESM e CommonJS
 */

// Usa dynamic import para carregar o módulo ESM
const getMcpModules = async () => {
  try {
    // Usando import dinâmico que funciona tanto em ESM quanto CommonJS
    const mcpModule = await import('@modelcontextprotocol/sdk');
    return {
      McpServer: mcpModule.McpServer,
      StdioServerTransport: mcpModule.StdioServerTransport,
      HttpServerTransport: mcpModule.HttpServerTransport
    };
  } catch (error) {
    console.error('Erro ao importar o SDK MCP:', error);
    throw error;
  }
};

export default getMcpModules;
