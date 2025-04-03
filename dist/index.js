/**
 * Servidor MCP para o CRM Piperun
 *
 * Este arquivo implementa o servidor Model Context Protocol (MCP) para integração
 * com o CRM Piperun, permitindo acesso aos recursos e ferramentas do sistema.
 *
 * Usando o formato ESM para compatibilidade com o SDK do Model Context Protocol.
 */
// Importações de dependências do projeto
import { env } from './config/env.js';
import { Logger } from './utils/logger.js';
// Importação das ferramentas
import { dealTools } from './tools/dealTools.js';
import { pipelineTools } from './tools/pipelineTools.js';
import { productTools } from './tools/productTools.js';
import { contactTools } from './tools/contactTools.js';
import { statsTools } from './tools/statsTools.js';
import { userTools } from './tools/userTools.js';
// Importação dos recursos
import { dealResources } from './resources/dealResources.js';
import { pipelineResources } from './resources/pipelineResources.js';
import { productResources } from './resources/productResources.js';
import { contactResources } from './resources/contactResources.js';
// Importação dos prompts
import { dealPrompts } from './prompts/dealPrompts.js';
import { pipelinePrompts } from './prompts/pipelinePrompts.js';
import { contactPrompts } from './prompts/contactPrompts.js';
// Importação de utilitários
import { PromptsListSchema, ResourcesListSchema, ToolsListSchema, createMethodWithParamsSchema } from './utils/mcp-schema.util.js';
import { adaptHandler, adaptNamedParamsHandler, adaptObjectParamsHandler } from './utils/mcp-handler.util.js';
// Logger central do servidor
const logger = new Logger('PiperunMCP');
/**
 * Inicia o servidor MCP para o Piperun
 * Utiliza importações dinâmicas para o SDK do MCP
 */
async function startPiperunMcpServer() {
    try {
        logger.info('Carregando SDK do Model Context Protocol...');
        // 1. Importações dinâmicas do SDK
        const serverModule = await import('@modelcontextprotocol/sdk/server/index.js');
        const stdioModule = await import('@modelcontextprotocol/sdk/server/stdio.js');
        const sseModule = await import('@modelcontextprotocol/sdk/server/sse.js');
        // 2. Extraímos os componentes necessários
        const { Server } = serverModule;
        const { StdioServerTransport } = stdioModule;
        const { SSEServerTransport } = sseModule;
        logger.info('SDK carregado com sucesso');
        // 3. Configuramos o servidor
        const server = new Server({
            name: env.MCP_SERVER_NAME || 'piperun-mcp',
            version: env.MCP_SERVER_VERSION || '1.0.0',
            protocolVersion: 'v1'
        });
        // 4. Registramos as ferramentas como handlers de requisição
        logger.info('Registrando ferramentas do CRM Piperun...');
        // Handler para listar as ferramentas
        server.setRequestHandler(ToolsListSchema, async () => {
            logger.info('Cliente solicitou lista de ferramentas');
            return {
                tools: [
                    {
                        name: dealTools.listDeals.name,
                        description: 'Lista os negócios do CRM Piperun',
                        inputSchema: dealTools.listDeals.schema
                    },
                    {
                        name: dealTools.getDealDetails.name,
                        description: 'Obtém detalhes de um negócio específico',
                        inputSchema: dealTools.getDealDetails.schema
                    },
                    {
                        name: dealTools.updateDeal.name,
                        description: 'Atualiza um negócio existente',
                        inputSchema: dealTools.updateDeal.schema
                    },
                    {
                        name: pipelineTools.listPipelines.name,
                        description: 'Lista os funis de vendas',
                        inputSchema: pipelineTools.listPipelines.schema
                    },
                    {
                        name: pipelineTools.listStages.name,
                        description: 'Lista os estágios de um funil',
                        inputSchema: pipelineTools.listStages.schema
                    },
                    {
                        name: productTools.listProducts.name,
                        description: 'Lista os produtos disponíveis',
                        inputSchema: productTools.listProducts.schema
                    },
                    {
                        name: contactTools.listContacts.name,
                        description: 'Lista os contatos cadastrados',
                        inputSchema: contactTools.listContacts.schema
                    },
                    {
                        name: userTools.listUsers.name,
                        description: 'Lista os usuários da conta',
                        inputSchema: userTools.listUsers.schema
                    },
                    {
                        name: statsTools.getServerStats.name,
                        description: 'Obtém estatísticas do servidor',
                        inputSchema: statsTools.getServerStats.schema
                    },
                    {
                        name: statsTools.checkHealth.name,
                        description: 'Verifica a saúde do servidor',
                        inputSchema: statsTools.checkHealth.schema
                    }
                ]
            };
        });
        // Registra recursos como handler de requisição
        server.setRequestHandler(ResourcesListSchema, async () => {
            logger.info('Cliente solicitou lista de recursos');
            return {
                resources: [
                    {
                        name: dealResources.listDeals.name,
                        baseUrl: dealResources.listDeals.template.baseUrl,
                        paths: dealResources.listDeals.template.paths
                    },
                    {
                        name: dealResources.getDeal.name,
                        baseUrl: dealResources.getDeal.template.baseUrl,
                        paths: dealResources.getDeal.template.paths
                    },
                    {
                        name: pipelineResources.listPipelines.name,
                        baseUrl: pipelineResources.listPipelines.template.baseUrl,
                        paths: pipelineResources.listPipelines.template.paths
                    },
                    {
                        name: pipelineResources.listStages.name,
                        baseUrl: pipelineResources.listStages.template.baseUrl,
                        paths: pipelineResources.listStages.template.paths
                    },
                    {
                        name: productResources.listProducts.name,
                        baseUrl: productResources.listProducts.template.baseUrl,
                        paths: productResources.listProducts.template.paths
                    },
                    {
                        name: contactResources.listContacts.name,
                        baseUrl: contactResources.listContacts.template.baseUrl,
                        paths: contactResources.listContacts.template.paths
                    }
                ]
            };
        });
        // Registramos os prompts
        server.setRequestHandler(PromptsListSchema, async () => {
            logger.info('Cliente solicitou lista de prompts');
            return {
                prompts: [
                    {
                        name: dealPrompts.analyzeDeal.name,
                        description: 'Analisa um negócio',
                        inputSchema: dealPrompts.analyzeDeal.schema
                    },
                    {
                        name: dealPrompts.summarizeDeals.name,
                        description: 'Resume uma lista de negócios',
                        inputSchema: dealPrompts.summarizeDeals.schema
                    },
                    {
                        name: pipelinePrompts.analyzePipeline.name,
                        description: 'Analisa um funil de vendas',
                        inputSchema: pipelinePrompts.analyzePipeline.schema
                    },
                    {
                        name: pipelinePrompts.compareStages.name,
                        description: 'Compara estágios de um funil',
                        inputSchema: pipelinePrompts.compareStages.schema
                    },
                    {
                        name: contactPrompts.analyzeContact.name,
                        description: 'Analisa um contato',
                        inputSchema: contactPrompts.analyzeContact.schema
                    },
                    {
                        name: contactPrompts.identifyHighValueContacts.name,
                        description: 'Identifica contatos de alto valor',
                        inputSchema: contactPrompts.identifyHighValueContacts.schema
                    }
                ]
            };
        });
        // 5. Registramos os handlers para cada ferramenta individualmente
        logger.info('Registrando handlers para ferramentas individuais...');
        // Deal tools
        server.setRequestHandler(createMethodWithParamsSchema(dealTools.listDeals.name, dealTools.listDeals.schema), adaptObjectParamsHandler(dealTools.listDeals.handler));
        server.setRequestHandler(createMethodWithParamsSchema(dealTools.getDealDetails.name, dealTools.getDealDetails.schema), adaptNamedParamsHandler(dealTools.getDealDetails.handler));
        server.setRequestHandler(createMethodWithParamsSchema(dealTools.updateDeal.name, dealTools.updateDeal.schema), adaptNamedParamsHandler(dealTools.updateDeal.handler));
        // Pipeline tools
        server.setRequestHandler(createMethodWithParamsSchema(pipelineTools.listPipelines.name, pipelineTools.listPipelines.schema), adaptObjectParamsHandler(pipelineTools.listPipelines.handler));
        server.setRequestHandler(createMethodWithParamsSchema(pipelineTools.listStages.name, pipelineTools.listStages.schema), adaptObjectParamsHandler(pipelineTools.listStages.handler));
        // Product tools
        server.setRequestHandler(createMethodWithParamsSchema(productTools.listProducts.name, productTools.listProducts.schema), adaptObjectParamsHandler(productTools.listProducts.handler));
        // Contact tools
        server.setRequestHandler(createMethodWithParamsSchema(contactTools.listContacts.name, contactTools.listContacts.schema), adaptObjectParamsHandler(contactTools.listContacts.handler));
        // User tools
        server.setRequestHandler(createMethodWithParamsSchema(userTools.listUsers.name, userTools.listUsers.schema), adaptObjectParamsHandler(userTools.listUsers.handler));
        // Stats tools
        server.setRequestHandler(createMethodWithParamsSchema(statsTools.getServerStats.name, statsTools.getServerStats.schema), adaptHandler(statsTools.getServerStats.handler));
        server.setRequestHandler(createMethodWithParamsSchema(statsTools.checkHealth.name, statsTools.checkHealth.schema), adaptHandler(statsTools.checkHealth.handler));
        // 6. Registramos os handlers para todos os prompts
        logger.info('Registrando handlers para prompts...');
        // Deal prompts
        server.setRequestHandler(createMethodWithParamsSchema(dealPrompts.analyzeDeal.name, dealPrompts.analyzeDeal.schema), adaptNamedParamsHandler(dealPrompts.analyzeDeal.handler));
        server.setRequestHandler(createMethodWithParamsSchema(dealPrompts.summarizeDeals.name, dealPrompts.summarizeDeals.schema), adaptObjectParamsHandler(dealPrompts.summarizeDeals.handler));
        // Pipeline prompts
        server.setRequestHandler(createMethodWithParamsSchema(pipelinePrompts.analyzePipeline.name, pipelinePrompts.analyzePipeline.schema), adaptNamedParamsHandler(pipelinePrompts.analyzePipeline.handler));
        server.setRequestHandler(createMethodWithParamsSchema(pipelinePrompts.compareStages.name, pipelinePrompts.compareStages.schema), adaptNamedParamsHandler(pipelinePrompts.compareStages.handler));
        // Contact prompts
        server.setRequestHandler(createMethodWithParamsSchema(contactPrompts.analyzeContact.name, contactPrompts.analyzeContact.schema), adaptNamedParamsHandler(contactPrompts.analyzeContact.handler));
        server.setRequestHandler(createMethodWithParamsSchema(contactPrompts.identifyHighValueContacts.name, contactPrompts.identifyHighValueContacts.schema), adaptNamedParamsHandler(contactPrompts.identifyHighValueContacts.handler));
        // 7. Iniciar o servidor com o transporte apropriado
        const portStr = env.PORT || '3000';
        const port = parseInt(String(portStr), 10);
        // Sempre iniciar com STDIO primeiro - é o mais confiável para testes
        logger.info('Iniciando servidor no modo STDIO...');
        // Criar o transporte STDIO
        const stdioTransport = new StdioServerTransport();
        // Conectar o servidor ao transporte STDIO
        await server.connect(stdioTransport);
        logger.info('Servidor MCP iniciado com transporte STDIO com sucesso');
        // Se requisitado, também iniciar o HTTP (mas manter o STDIO)
        if (env.MCP_TRANSPORT === 'http') {
            try {
                logger.info(`Iniciando servidor também no modo HTTP na porta ${portStr}...`);
                // Desabilitando temporariamente o transporte HTTP direto até resolvermos os problemas
                // Quando implementarmos de fato, precisaremos criar um servidor HTTP
                // e passar o objeto response correto para o SSEServerTransport
                logger.warn('Transporte HTTP foi temporariamente desabilitado até correção');
                // Código a ser implementado posteriormente:
                // const http = await import('http');
                // const server = http.createServer((req, res) => {
                //   if (req.url?.startsWith('/mcp')) {
                //     const httpTransport = new SSEServerTransport('/mcp', res);
                //     server.connect(httpTransport);
                //   }
                // });
                // server.listen(port);
                logger.info(`Para utilizar HTTP, será necessário implementar o servidor HTTP completo`);
            }
            catch (error) {
                logger.error(`Erro ao iniciar transporte HTTP: ${error instanceof Error ? error.message : String(error)}`);
                logger.warn('Continuando apenas com o transporte STDIO');
            }
        }
        logger.info('Servidor MCP pronto para atender solicitações!');
        return server;
    }
    catch (error) {
        logger.error(`Erro ao iniciar o servidor MCP: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}
// Executa o servidor quando executado diretamente
startPiperunMcpServer().catch((error) => {
    logger.error(`Erro fatal ao iniciar o servidor: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
});
// Exporta a função principal para uso em outros módulos
export { startPiperunMcpServer };
//# sourceMappingURL=index.js.map