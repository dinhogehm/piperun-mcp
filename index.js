// Este é o arquivo de entrada principal para o Smithery
// Ele importa e executa o servidor Model Context Protocol (MCP)

import server from './src/mcp-server.js';

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor PipeRun MCP rodando na porta ${PORT}`);
  console.log('Endpoints MCP disponíveis: /tools/list e /tools/execute');
});

