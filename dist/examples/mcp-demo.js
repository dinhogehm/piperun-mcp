"use strict";
/**
 * Este é um exemplo de demonstração do servidor MCP do Piperun
 * Implementa uma versão completa do servidor para fins de produção
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPDemoServer = void 0;
exports.startDemo = startDemo;
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const dealTools_1 = require("../tools/dealTools");
const pipelineTools_1 = require("../tools/pipelineTools");
const productTools_1 = require("../tools/productTools");
const contactTools_1 = require("../tools/contactTools");
const statsTools_1 = require("../tools/statsTools");
const http_1 = __importDefault(require("http"));
const logger = new logger_1.Logger('MCPDemo');
// Simulando o servidor MCP para produção
class MCPDemoServer {
    constructor(options) {
        this._tools = new Map();
        this.server = null;
        this.name = options.name;
        this.version = options.version;
        logger.info(`Inicializando servidor MCP: ${this.name} v${this.version}`);
    }
    // Getter para obter as ferramentas registradas
    get tools() {
        return this._tools;
    }
    // Registrar uma ferramenta
    registerTool(name, schema, handler) {
        this._tools.set(name, { name, schema, handler });
        logger.info(`Ferramenta registrada: ${name}`);
    }
    // Extrair parâmetros da requisição
    async extractParams(req) {
        // Extrair parâmetros de query
        const url = new URL(req.url || '/', `http://${req.headers.host}`);
        const queryParams = {};
        url.searchParams.forEach((value, key) => {
            // Tentar converter para número se possível
            const numValue = Number(value);
            queryParams[key] = !isNaN(numValue) && value.trim() !== '' ? numValue : value;
        });
        // Extrair parâmetros do corpo (para POST)
        if (req.method === 'POST') {
            try {
                const buffers = [];
                for await (const chunk of req) {
                    buffers.push(Buffer.from(chunk));
                }
                const data = Buffer.concat(buffers).toString();
                if (data) {
                    const bodyParams = JSON.parse(data);
                    return { ...queryParams, ...bodyParams };
                }
            }
            catch (error) {
                logger.error('Erro ao extrair parâmetros do corpo da requisição', error);
            }
        }
        return queryParams;
    }
    // Iniciar o servidor HTTP 
    async start(port) {
        return new Promise((resolve, reject) => {
            try {
                this.server = http_1.default.createServer(async (req, res) => {
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
                                const result = await statsTools_1.statsTools.checkHealth.handler();
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify(result));
                            }
                            catch (error) {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Erro ao verificar saúde do servidor' }));
                            }
                            return;
                        }
                        // API de estatísticas
                        if (url.pathname === '/stats') {
                            try {
                                const result = await statsTools_1.statsTools.getServerStats.handler();
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify(result));
                            }
                            catch (error) {
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
                                }
                                catch (error) {
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
                    }
                    catch (error) {
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
            }
            catch (error) {
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
exports.MCPDemoServer = MCPDemoServer;
// Função principal para iniciar o servidor
async function startDemo() {
    try {
        // Criar instância do servidor MCP
        const demoServer = new MCPDemoServer({
            name: env_1.env.MCP_SERVER_NAME,
            version: env_1.env.MCP_SERVER_VERSION
        });
        // Registrar ferramentas de negócios
        demoServer.registerTool(dealTools_1.dealTools.listDeals.name, dealTools_1.dealTools.listDeals.schema, dealTools_1.dealTools.listDeals.handler);
        demoServer.registerTool(dealTools_1.dealTools.getDealDetails.name, dealTools_1.dealTools.getDealDetails.schema, dealTools_1.dealTools.getDealDetails.handler);
        demoServer.registerTool(dealTools_1.dealTools.updateDeal.name, dealTools_1.dealTools.updateDeal.schema, dealTools_1.dealTools.updateDeal.handler);
        // Registrar ferramentas de funis e estágios
        demoServer.registerTool(pipelineTools_1.pipelineTools.listPipelines.name, pipelineTools_1.pipelineTools.listPipelines.schema, pipelineTools_1.pipelineTools.listPipelines.handler);
        demoServer.registerTool(pipelineTools_1.pipelineTools.listStages.name, pipelineTools_1.pipelineTools.listStages.schema, pipelineTools_1.pipelineTools.listStages.handler);
        // Registrar ferramentas de produtos
        demoServer.registerTool(productTools_1.productTools.listProducts.name, productTools_1.productTools.listProducts.schema, productTools_1.productTools.listProducts.handler);
        // Registrar ferramentas de contatos
        demoServer.registerTool(contactTools_1.contactTools.listContacts.name, contactTools_1.contactTools.listContacts.schema, contactTools_1.contactTools.listContacts.handler);
        // Registrar ferramentas de estatísticas
        demoServer.registerTool(statsTools_1.statsTools.getServerStats.name, statsTools_1.statsTools.getServerStats.schema, statsTools_1.statsTools.getServerStats.handler);
        demoServer.registerTool(statsTools_1.statsTools.checkHealth.name, statsTools_1.statsTools.checkHealth.schema, statsTools_1.statsTools.checkHealth.handler);
        // Iniciar o servidor na porta configurada
        await demoServer.start(env_1.env.PORT);
        logger.info('=== INSTRUÇÕES DE USO ===');
        logger.info(`1. Servidor base: http://localhost:${env_1.env.PORT}`);
        logger.info(`2. Documentação: http://localhost:${env_1.env.PORT}/docs`);
        logger.info(`3. Verificação de saúde: http://localhost:${env_1.env.PORT}/health`);
        logger.info(`4. Estatísticas: http://localhost:${env_1.env.PORT}/stats`);
        logger.info(`5. Ferramentas disponíveis:`);
        // Listar todas as ferramentas registradas
        Array.from(demoServer.tools.keys()).forEach(tool => {
            logger.info(`   - http://localhost:${env_1.env.PORT}/tools/${tool}`);
        });
        // Capture sinais para encerramento limpo
        process.on('SIGINT', () => {
            logger.info('Interrupção recebida, encerrando servidor...');
            demoServer.stop();
            process.exit(0);
        });
    }
    catch (error) {
        logger.error('Erro ao iniciar o servidor MCP', error);
        process.exit(1);
    }
}
// Executar o servidor
if (require.main === module) {
    startDemo();
}
//# sourceMappingURL=mcp-demo.js.map