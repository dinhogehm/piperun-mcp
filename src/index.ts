import { McpServer } from '@modelcontextprotocol/sdk';
import { StdioServerTransport } from '@modelcontextprotocol/sdk';
import { HttpServerTransport } from '@modelcontextprotocol/sdk';
import { env } from './config/env';
import { Logger } from './utils/logger';

// Importação das ferramentas
import { dealTools } from './tools/dealTools';
import { pipelineTools } from './tools/pipelineTools';
import { productTools } from './tools/productTools';
import { contactTools } from './tools/contactTools';
import { statsTools } from './tools/statsTools';

// Importação dos recursos
import { dealResources } from './resources/dealResources';
import { pipelineResources } from './resources/pipelineResources';
import { productResources } from './resources/productResources';
import { contactResources } from './resources/contactResources';

// Importação dos prompts
import { dealPrompts } from './prompts/dealPrompts';
import { pipelinePrompts } from './prompts/pipelinePrompts';
import { contactPrompts } from './prompts/contactPrompts';

/**
 * Configura e inicializa o servidor MCP para o Piperun
 */
async function startServer() {
  const logger = new Logger('Server');
  logger.info('Iniciando servidor MCP para o Piperun...');

  // Criando uma instância do servidor MCP
  const server = new McpServer({
    name: env.MCP_SERVER_NAME,
    version: env.MCP_SERVER_VERSION
  });

  // Registrando as ferramentas de negócios
  server.tool(
    dealTools.listDeals.name,
    dealTools.listDeals.schema,
    dealTools.listDeals.handler
  );
  
  server.tool(
    dealTools.getDealDetails.name,
    dealTools.getDealDetails.schema,
    dealTools.getDealDetails.handler
  );
  
  server.tool(
    dealTools.updateDeal.name,
    dealTools.updateDeal.schema,
    dealTools.updateDeal.handler
  );

  // Registrando as ferramentas de funis e estágios
  server.tool(
    pipelineTools.listPipelines.name,
    pipelineTools.listPipelines.schema,
    pipelineTools.listPipelines.handler
  );
  
  server.tool(
    pipelineTools.listStages.name,
    pipelineTools.listStages.schema,
    pipelineTools.listStages.handler
  );

  // Registrando as ferramentas de produtos
  server.tool(
    productTools.listProducts.name,
    productTools.listProducts.schema,
    productTools.listProducts.handler
  );

  // Registrando as ferramentas de contatos
  server.tool(
    contactTools.listContacts.name,
    contactTools.listContacts.schema,
    contactTools.listContacts.handler
  );

  // Registrando as ferramentas de estatísticas e monitoramento
  server.tool(
    statsTools.getServerStats.name,
    statsTools.getServerStats.schema,
    statsTools.getServerStats.handler
  );
  
  server.tool(
    statsTools.checkHealth.name,
    statsTools.checkHealth.schema,
    statsTools.checkHealth.handler
  );

  // Registrando os recursos de negócios
  server.resource(
    dealResources.listDeals.name,
    dealResources.listDeals.template,
    dealResources.listDeals.handler
  );
  
  server.resource(
    dealResources.getDeal.name,
    dealResources.getDeal.template,
    dealResources.getDeal.handler
  );

  // Registrando os recursos de funis e estágios
  server.resource(
    pipelineResources.listPipelines.name,
    pipelineResources.listPipelines.template,
    pipelineResources.listPipelines.handler
  );
  
  server.resource(
    pipelineResources.listStages.name,
    pipelineResources.listStages.template,
    pipelineResources.listStages.handler
  );

  // Registrando os recursos de produtos
  server.resource(
    productResources.listProducts.name,
    productResources.listProducts.template,
    productResources.listProducts.handler
  );

  // Registrando os recursos de contatos
  server.resource(
    contactResources.listContacts.name,
    contactResources.listContacts.template,
    contactResources.listContacts.handler
  );

  // Registrando os prompts de negócios
  server.prompt(
    dealPrompts.analyzeDeal.name,
    dealPrompts.analyzeDeal.schema,
    dealPrompts.analyzeDeal.handler
  );

  server.prompt(
    dealPrompts.summarizeDeals.name,
    dealPrompts.summarizeDeals.schema,
    dealPrompts.summarizeDeals.handler
  );

  // Registrando os prompts de funis
  server.prompt(
    pipelinePrompts.analyzePipeline.name,
    pipelinePrompts.analyzePipeline.schema,
    pipelinePrompts.analyzePipeline.handler
  );

  server.prompt(
    pipelinePrompts.compareStages.name,
    pipelinePrompts.compareStages.schema,
    pipelinePrompts.compareStages.handler
  );

  // Registrando os prompts de contatos
  server.prompt(
    contactPrompts.analyzeContact.name,
    contactPrompts.analyzeContact.schema,
    contactPrompts.analyzeContact.handler
  );

  server.prompt(
    contactPrompts.identifyHighValueContacts.name,
    contactPrompts.identifyHighValueContacts.schema,
    contactPrompts.identifyHighValueContacts.handler
  );

  try {
    // Verificando qual transporte utilizar
    if (process.env.MCP_TRANSPORT === 'http') {
      // Usar transporte HTTP/SSE
      const port = env.PORT;
      const httpTransport = new HttpServerTransport({ port });
      
      await server.connect(httpTransport);
      logger.info(`Servidor MCP iniciado em HTTP na porta ${port}`);
      logger.info(`Acesse http://localhost:${port} para interagir com o servidor`);
      logger.info('Use a ferramenta "verificar-saude" para verificar o status do servidor');
    } else {
      // Usar transporte padrão stdio
      const stdioTransport = new StdioServerTransport();
      
      await server.connect(stdioTransport);
      logger.info('Servidor MCP iniciado no modo stdio');
      logger.info('Use a ferramenta "verificar-saude" para verificar o status do servidor');
    }
  } catch (error) {
    logger.error('Erro ao iniciar o servidor MCP', error);
    process.exit(1);
  }
}

// Iniciar o servidor
startServer().catch(error => {
  const logger = new Logger('Server');
  logger.error('Erro fatal ao iniciar o servidor MCP', error);
  process.exit(1);
});
