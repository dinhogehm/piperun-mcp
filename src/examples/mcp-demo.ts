/**
 * Este é um exemplo de demonstração do servidor MCP do Piperun
 * Implementa uma versão completa do servidor para fins de produção
 */

import { env } from '../config/env.js';
import { Logger } from '../utils/logger.js';
import { dealTools } from '../tools/dealTools.js';
import { pipelineTools } from '../tools/pipelineTools.js';
import { productTools } from '../tools/productTools.js';
import { contactTools } from '../tools/contactTools.js';
import { statsTools } from '../tools/statsTools.js';
import http from 'http';
import { fileURLToPath } from 'url';

const logger = new Logger('MCPDemo');

// Interface para parâmetros de ferramentas
interface ToolParams {
  [key: string]: any;
}

// Interface para ferramenta registrada
interface RegisteredTool {
  name: string;
  schema: any;
  handler: (params: ToolParams) => Promise<any>;
}

// Simulando o servidor MCP para produção
class MCPDemoServer {
  private name: string;
  private version: string;
  private _tools: Map<string, RegisteredTool> = new Map();
  private server: http.Server | null = null;

  constructor(options: { name: string; version: string }) {
    this.name = options.name;
    this.version = options.version;
    logger.info(`Inicializando servidor MCP: ${this.name} v${this.version}`);
  }

  // Getter para obter as ferramentas registradas
  get tools(): Map<string, RegisteredTool> {
    return this._tools;
  }

  // Registrar uma ferramenta
  registerTool(name: string, schema: any, handler: any) {
    this._tools.set(name, { name, schema, handler });
    logger.info(`Ferramenta registrada: ${name}`);
  }

  // Extrair parâmetros da requisição
  private async extractParams(req: http.IncomingMessage): Promise<ToolParams> {
    // Extrair parâmetros de query
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const queryParams: ToolParams = {};
    url.searchParams.forEach((value, key) => {
      // Tentar converter para número se possível
      const numValue = Number(value);
      queryParams[key] = !isNaN(numValue) && value.trim() !== '' ? numValue : value;
    });

    // Extrair parâmetros do corpo (para POST)
    if (req.method === 'POST') {
      try {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(Buffer.from(chunk));
        }
        const data = Buffer.concat(buffers).toString();
        if (data) {
          const bodyParams = JSON.parse(data);
          return { ...queryParams, ...bodyParams };
        }
      } catch (error) {
        logger.error('Erro ao extrair parâmetros do corpo da requisição', error);
      }
    }

    return queryParams;
  }

  // Iniciar o servidor HTTP 
  async start(port: number) {
    return new Promise<void>((resolve, reject) => {
      try {
        this.server = http.createServer(async (req, res) => {
          // Definir cabeçalhos CORS
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          
          // Lidar com requisições OPTIONS (preflight)
          if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
          }

          const url = new URL(req.url || '/', `http://${req.headers.host}`);
          
          try {
            // Tratar requisições para a raiz
            if (url.pathname === '/') {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                server: this.name,
                version: this.version,
                status: 'online',
                tools: Array.from(this._tools.keys())
              }));
              return;
            }

            // API de verificação de saúde
            if (url.pathname === '/health') {
              try {
                const result = await statsTools.checkHealth.handler();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Erro ao verificar saúde do servidor' }));
              }
              return;
            }

            // API de estatísticas
            if (url.pathname === '/stats') {
              try {
                const result = await statsTools.getServerStats.handler();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
              } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Erro ao obter estatísticas do servidor' }));
              }
              return;
            }

            // Ferramentas dinâmicas
            const toolMatch = url.pathname.match(/^\/tools\/([a-zA-Z0-9-]+)$/);
            if (toolMatch) {
              const toolName = toolMatch[1];
              const tool = this._tools.get(toolName);
              
              if (tool) {
                try {
                  // Extrair parâmetros da requisição
                  const params = await this.extractParams(req);
                  
                  // Executar a ferramenta
                  const result = await tool.handler(params);
                  
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(result));
                } catch (error) {
                  const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                  logger.error(`Erro ao executar ferramenta ${toolName}`, error);
                  
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ 
                    error: `Erro ao executar ferramenta ${toolName}`,
                    message: errorMessage
                  }));
                }
                return;
              }
            }

            // Documentação das ferramentas
            if (url.pathname === '/docs') {
              const docs = Array.from(this._tools.entries()).map(([name, tool]) => ({
                name,
                schema: tool.schema
              }));
              
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                server: this.name,
                version: this.version,
                tools: docs
              }));
              return;
            }

            // Rota não encontrada
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Rota não encontrada' }));
            
          } catch (error) {
            logger.error('Erro ao processar requisição', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              error: 'Erro interno do servidor',
              message: error instanceof Error ? error.message : 'Erro desconhecido'
            }));
          }
        });

        this.server.listen(port, () => {
          logger.info(`Servidor MCP iniciado na porta ${port}`);
          logger.info(`Acesse http://localhost:${port} para interagir com o servidor`);
          resolve();
        });
        
        this.server.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Parar o servidor
  stop() {
    if (this.server) {
      this.server.close();
      logger.info('Servidor MCP foi encerrado');
    }
  }
}

// Função principal para iniciar o servidor
async function startDemo() {
  try {
    // Criar instância do servidor MCP
    const demoServer = new MCPDemoServer({
      name: env.MCP_SERVER_NAME,
      version: env.MCP_SERVER_VERSION
    });

    // Registrar ferramentas de negócios
    demoServer.registerTool(
      dealTools.listDeals.name,
      dealTools.listDeals.schema,
      dealTools.listDeals.handler
    );
    
    demoServer.registerTool(
      dealTools.getDealDetails.name,
      dealTools.getDealDetails.schema,
      dealTools.getDealDetails.handler
    );
    
    demoServer.registerTool(
      dealTools.updateDeal.name,
      dealTools.updateDeal.schema,
      dealTools.updateDeal.handler
    );

    // Registrar ferramentas de funis e estágios
    demoServer.registerTool(
      pipelineTools.listPipelines.name,
      pipelineTools.listPipelines.schema,
      pipelineTools.listPipelines.handler
    );
    
    demoServer.registerTool(
      pipelineTools.listStages.name,
      pipelineTools.listStages.schema,
      pipelineTools.listStages.handler
    );

    // Registrar ferramentas de produtos
    demoServer.registerTool(
      productTools.listProducts.name,
      productTools.listProducts.schema,
      productTools.listProducts.handler
    );

    // Registrar ferramentas de contatos
    demoServer.registerTool(
      contactTools.listContacts.name,
      contactTools.listContacts.schema,
      contactTools.listContacts.handler
    );

    // Registrar ferramentas de estatísticas
    demoServer.registerTool(
      statsTools.getServerStats.name,
      statsTools.getServerStats.schema,
      statsTools.getServerStats.handler
    );
    
    demoServer.registerTool(
      statsTools.checkHealth.name,
      statsTools.checkHealth.schema,
      statsTools.checkHealth.handler
    );

    // Iniciar o servidor na porta configurada
    await demoServer.start(env.PORT);
    
    logger.info('=== INSTRUÇÕES DE USO ===');
    logger.info(`1. Servidor base: http://localhost:${env.PORT}`);
    logger.info(`2. Documentação: http://localhost:${env.PORT}/docs`);
    logger.info(`3. Verificação de saúde: http://localhost:${env.PORT}/health`);
    logger.info(`4. Estatísticas: http://localhost:${env.PORT}/stats`);
    logger.info(`5. Ferramentas disponíveis:`);
    
    // Listar todas as ferramentas registradas
    Array.from(demoServer.tools.keys()).forEach(tool => {
      logger.info(`   - http://localhost:${env.PORT}/tools/${tool}`);
    });
    
    // Capture sinais para encerramento limpo
    process.on('SIGINT', () => {
      logger.info('Interrupção recebida, encerrando servidor...');
      demoServer.stop();
      process.exit(0);
    });

  } catch (error: any) {
    logger.error('Erro ao iniciar o servidor MCP', error);
    process.exit(1);
  }
}

// Executar o servidor
// Verificação de módulo principal em CommonJS
const isMainModule = require.main === module;
if (isMainModule) {
  startDemo().catch((error: any) => {
    logger.error(`Erro ao iniciar o servidor: ${error.message}`);
    process.exit(1);
  });
}

export { MCPDemoServer, startDemo };
