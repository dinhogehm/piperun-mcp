"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importações do MCP SDK adaptadas para a estrutura ESM
const sdk_1 = require("@modelcontextprotocol/sdk");
const sdk_2 = require("@modelcontextprotocol/sdk");
const sdk_3 = require("@modelcontextprotocol/sdk");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
// Importação das ferramentas
const dealTools_1 = require("./tools/dealTools");
const pipelineTools_1 = require("./tools/pipelineTools");
const productTools_1 = require("./tools/productTools");
const contactTools_1 = require("./tools/contactTools");
const statsTools_1 = require("./tools/statsTools");
// Importação dos recursos
const dealResources_1 = require("./resources/dealResources");
const pipelineResources_1 = require("./resources/pipelineResources");
const productResources_1 = require("./resources/productResources");
const contactResources_1 = require("./resources/contactResources");
// Importação dos prompts
const dealPrompts_1 = require("./prompts/dealPrompts");
const pipelinePrompts_1 = require("./prompts/pipelinePrompts");
const contactPrompts_1 = require("./prompts/contactPrompts");
/**
 * Configura e inicializa o servidor MCP para o Piperun
 */
async function startServer() {
    const logger = new logger_1.Logger('Server');
    logger.info('Iniciando servidor MCP para o Piperun...');
    // Criando uma instância do servidor MCP
    const server = new sdk_1.McpServer({
        name: env_1.env.MCP_SERVER_NAME,
        version: env_1.env.MCP_SERVER_VERSION
    });
    // Registrando as ferramentas de negócios
    server.tool(dealTools_1.dealTools.listDeals.name, dealTools_1.dealTools.listDeals.schema, dealTools_1.dealTools.listDeals.handler);
    server.tool(dealTools_1.dealTools.getDealDetails.name, dealTools_1.dealTools.getDealDetails.schema, dealTools_1.dealTools.getDealDetails.handler);
    server.tool(dealTools_1.dealTools.updateDeal.name, dealTools_1.dealTools.updateDeal.schema, dealTools_1.dealTools.updateDeal.handler);
    // Registrando as ferramentas de funis e estágios
    server.tool(pipelineTools_1.pipelineTools.listPipelines.name, pipelineTools_1.pipelineTools.listPipelines.schema, pipelineTools_1.pipelineTools.listPipelines.handler);
    server.tool(pipelineTools_1.pipelineTools.listStages.name, pipelineTools_1.pipelineTools.listStages.schema, pipelineTools_1.pipelineTools.listStages.handler);
    // Registrando as ferramentas de produtos
    server.tool(productTools_1.productTools.listProducts.name, productTools_1.productTools.listProducts.schema, productTools_1.productTools.listProducts.handler);
    // Registrando as ferramentas de contatos
    server.tool(contactTools_1.contactTools.listContacts.name, contactTools_1.contactTools.listContacts.schema, contactTools_1.contactTools.listContacts.handler);
    // Registrando as ferramentas de estatísticas e monitoramento
    server.tool(statsTools_1.statsTools.getServerStats.name, statsTools_1.statsTools.getServerStats.schema, statsTools_1.statsTools.getServerStats.handler);
    server.tool(statsTools_1.statsTools.checkHealth.name, statsTools_1.statsTools.checkHealth.schema, statsTools_1.statsTools.checkHealth.handler);
    // Registrando os recursos de negócios
    server.resource(dealResources_1.dealResources.listDeals.name, dealResources_1.dealResources.listDeals.template, dealResources_1.dealResources.listDeals.handler);
    server.resource(dealResources_1.dealResources.getDeal.name, dealResources_1.dealResources.getDeal.template, dealResources_1.dealResources.getDeal.handler);
    // Registrando os recursos de funis e estágios
    server.resource(pipelineResources_1.pipelineResources.listPipelines.name, pipelineResources_1.pipelineResources.listPipelines.template, pipelineResources_1.pipelineResources.listPipelines.handler);
    server.resource(pipelineResources_1.pipelineResources.listStages.name, pipelineResources_1.pipelineResources.listStages.template, pipelineResources_1.pipelineResources.listStages.handler);
    // Registrando os recursos de produtos
    server.resource(productResources_1.productResources.listProducts.name, productResources_1.productResources.listProducts.template, productResources_1.productResources.listProducts.handler);
    // Registrando os recursos de contatos
    server.resource(contactResources_1.contactResources.listContacts.name, contactResources_1.contactResources.listContacts.template, contactResources_1.contactResources.listContacts.handler);
    // Registrando os prompts de negócios
    server.prompt(dealPrompts_1.dealPrompts.analyzeDeal.name, dealPrompts_1.dealPrompts.analyzeDeal.schema, dealPrompts_1.dealPrompts.analyzeDeal.handler);
    server.prompt(dealPrompts_1.dealPrompts.summarizeDeals.name, dealPrompts_1.dealPrompts.summarizeDeals.schema, dealPrompts_1.dealPrompts.summarizeDeals.handler);
    // Registrando os prompts de funis
    server.prompt(pipelinePrompts_1.pipelinePrompts.analyzePipeline.name, pipelinePrompts_1.pipelinePrompts.analyzePipeline.schema, pipelinePrompts_1.pipelinePrompts.analyzePipeline.handler);
    server.prompt(pipelinePrompts_1.pipelinePrompts.compareStages.name, pipelinePrompts_1.pipelinePrompts.compareStages.schema, pipelinePrompts_1.pipelinePrompts.compareStages.handler);
    // Registrando os prompts de contatos
    server.prompt(contactPrompts_1.contactPrompts.analyzeContact.name, contactPrompts_1.contactPrompts.analyzeContact.schema, contactPrompts_1.contactPrompts.analyzeContact.handler);
    server.prompt(contactPrompts_1.contactPrompts.identifyHighValueContacts.name, contactPrompts_1.contactPrompts.identifyHighValueContacts.schema, contactPrompts_1.contactPrompts.identifyHighValueContacts.handler);
    try {
        // Verificando qual transporte utilizar
        if (process.env.MCP_TRANSPORT === 'http') {
            // Usar transporte HTTP/SSE
            const port = env_1.env.PORT;
            const httpTransport = new sdk_3.HttpServerTransport({ port });
            await server.connect(httpTransport);
            logger.info(`Servidor MCP iniciado em HTTP na porta ${port}`);
            logger.info(`Acesse http://localhost:${port} para interagir com o servidor`);
            logger.info('Use a ferramenta "verificar-saude" para verificar o status do servidor');
        }
        else {
            // Usar transporte padrão stdio
            const stdioTransport = new sdk_2.StdioServerTransport();
            await server.connect(stdioTransport);
            logger.info('Servidor MCP iniciado no modo stdio');
            logger.info('Use a ferramenta "verificar-saude" para verificar o status do servidor');
        }
    }
    catch (error) {
        logger.error('Erro ao iniciar o servidor MCP', error);
        process.exit(1);
    }
}
// Iniciar o servidor
startServer().catch(error => {
    const logger = new logger_1.Logger('Server');
    logger.error('Erro fatal ao iniciar o servidor MCP', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map