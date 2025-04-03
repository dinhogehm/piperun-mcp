/**
 * Adaptador para o SDK do MCP
 *
 * Este adaptador encapsula as importações do SDK do MCP para facilitar seu uso no projeto,
 * evitando problemas com os caminhos de importação e tornando o código mais organizado.
 *
 * Como o pacote SDK está configurado de forma específica para ESM, usamos uma abordagem
 * adaptada para garantir a compatibilidade correta com a API real do SDK.
 */
import { Logger } from '../utils/logger.js';
// Logger para o módulo adaptador
const logger = new Logger('MCPAdapter');
// Class base para compatibilidade com recursos existentes
export class ResourceTemplate {
    constructor(baseUrl, paths = {}) {
        this.baseUrl = baseUrl;
        this.paths = paths;
    }
}
/**
 * Classe que envolve o SDK MCP para simplificar o registro de ferramentas,
 * recursos e prompts usando a API correta do SDK.
 */
export class MCPServerWrapper {
    /**
     * Cria um wrapper em torno do servidor MCP
     * @param server Instância do servidor MCP
     */
    constructor(server) {
        this._tools = [];
        this._resources = [];
        this._prompts = [];
        this._server = server;
        // Registrar handlers para os métodos padrão do servidor MCP
        server.oninitialized = () => {
            logger.info('Servidor MCP inicializado com sucesso');
            this._registerAllComponents();
        };
    }
    /**
     * Registra uma ferramenta no servidor MCP
     */
    tool(name, schema, handler) {
        logger.info(`Registrando ferramenta: ${name}`);
        this._tools.push({ name, schema, handler });
        // Registramos o handler para esta ferramenta
        if (this._server.setRequestHandler) {
            try {
                this._server.setRequestHandler({ method: name, paramsSchema: schema }, handler);
                // Notificamos o cliente que a lista de ferramentas mudou
                if (this._server.sendToolListChanged) {
                    this._server.sendToolListChanged().catch((error) => {
                        logger.error(`Erro ao notificar mudança na lista de ferramentas: ${error.message}`);
                    });
                }
            }
            catch (error) {
                logger.error(`Erro ao registrar ferramenta ${name}: ${error}`);
            }
        }
    }
    /**
     * Registra um recurso no servidor MCP
     */
    resource(name, template, handler) {
        logger.info(`Registrando recurso: ${name}`);
        this._resources.push({ name, template, handler });
        // Os recursos são tratados de forma diferente, dependendo da API do SDK
        // Essa implementação é simplificada e pode precisar de ajustes
    }
    /**
     * Registra um prompt no servidor MCP
     */
    prompt(name, schema, handler) {
        logger.info(`Registrando prompt: ${name}`);
        this._prompts.push({ name, schema, handler });
        // Os prompts são tratados de forma semelhante às ferramentas
        if (this._server.setRequestHandler) {
            try {
                this._server.setRequestHandler({ method: name, paramsSchema: schema }, handler);
            }
            catch (error) {
                logger.error(`Erro ao registrar prompt ${name}: ${error}`);
            }
        }
    }
    /**
     * Conecta ao transporte fornecido
     */
    async connect(transport) {
        logger.info('Conectando ao transporte...');
        if (this._server.connect) {
            await this._server.connect(transport);
            logger.info('Conexão ao transporte estabelecida');
        }
        else {
            throw new Error('Método connect não disponível no servidor MCP');
        }
    }
    /**
     * Registra todos os componentes no servidor MCP
     * Esse método é chamado automaticamente após a inicialização
     */
    _registerAllComponents() {
        logger.info('Registrando todos os componentes no servidor MCP...');
        // Registra o handler para listar ferramentas
        if (this._server.setRequestHandler) {
            try {
                // Implementa o handler para 'tools/list'
                this._server.setRequestHandler({ method: 'tools/list' }, async () => {
                    logger.info(`Listando ${this._tools.length} ferramentas registradas`);
                    return {
                        tools: this._tools.map(tool => ({
                            name: tool.name,
                            description: `Ferramenta ${tool.name} para integração com Piperun CRM`,
                            inputSchema: tool.schema
                        }))
                    };
                });
                // Implementa o handler para 'resources/list'
                this._server.setRequestHandler({ method: 'resources/list' }, async () => {
                    logger.info(`Listando ${this._resources.length} recursos registrados`);
                    return {
                        resources: this._resources.map(resource => ({
                            name: resource.name,
                            // A implementação real dependeria de como os recursos são definidos no SDK
                            baseUrl: resource.template.baseUrl,
                            paths: resource.template.paths || {}
                        }))
                    };
                });
                // Implementa o handler para 'prompts/list'
                this._server.setRequestHandler({ method: 'prompts/list' }, async () => {
                    logger.info(`Listando ${this._prompts.length} prompts registrados`);
                    return {
                        prompts: this._prompts.map(prompt => ({
                            name: prompt.name,
                            description: `Prompt ${prompt.name} para integração com Piperun CRM`,
                            inputSchema: prompt.schema
                        }))
                    };
                });
                logger.info(`Handlers registrados para listar ferramentas, recursos e prompts`);
            }
            catch (error) {
                logger.error(`Erro ao registrar handlers para listar componentes: ${error}`);
            }
        }
        logger.info(`${this._tools.length} ferramentas, ${this._resources.length} recursos, ${this._prompts.length} prompts registrados`);
    }
}
/**
 * Inicializa o SDK MCP e cria um wrapper para facilitar seu uso
 * @param config Configuração do servidor
 * @returns Um objeto com o wrapper do servidor e funções auxiliares
 */
export async function initializeMcpSdk(config) {
    try {
        logger.info('Carregando módulos do SDK MCP...');
        // Importando módulos do SDK
        const { Server } = await import('@modelcontextprotocol/sdk/server/index.js');
        const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
        // Importando schemas Zod adequados
        const { ToolsListSchema, ResourcesListSchema, PromptsListSchema } = await import('../utils/mcp-schema.util.js');
        // Criando instância do servidor
        logger.info('Inicializando o servidor MCP...');
        const server = new Server({
            name: config.name,
            version: config.version,
            protocolVersion: 'v1'
        });
        // Criando transporte padrão
        const stdioTransport = new StdioServerTransport();
        // Criando o wrapper que facilita o uso do servidor
        const serverWrapper = new MCPServerWrapper(server);
        // Adicionamos os handlers essenciais diretamente no servidor original
        // Isso é crucial para que o cliente saiba que o servidor tem ferramentas, etc.
        try {
            // Configuramos os handlers para listar as ferramentas, recursos e prompts
            server.setRequestHandler(ToolsListSchema, async () => ({
                tools: [] // Inicialmente vazio, será preenchido pelo wrapper
            }));
            server.setRequestHandler(ResourcesListSchema, async () => ({
                resources: [] // Inicialmente vazio, será preenchido pelo wrapper
            }));
            server.setRequestHandler(PromptsListSchema, async () => ({
                prompts: [] // Inicialmente vazio, será preenchido pelo wrapper
            }));
            logger.info('Handlers básicos configurados para o servidor MCP');
        }
        catch (error) {
            logger.error(`Erro ao configurar handlers básicos: ${error instanceof Error ? error.message : String(error)}`);
        }
        return {
            server: serverWrapper,
            rawServer: server,
            stdioTransport,
            // Função auxiliar para iniciar o transporte HTTP
            async initializeHttpTransport(endpoint = '/mcp') {
                try {
                    logger.info(`Inicializando transporte HTTP com endpoint ${endpoint}...`);
                    const { SSEServerTransport } = await import('@modelcontextprotocol/sdk/server/sse.js');
                    return {
                        createTransport(res) {
                            return new SSEServerTransport(endpoint, res || {}); // Type assertion para evitar erro de tipo
                        }
                    };
                }
                catch (error) {
                    logger.error(`Erro ao inicializar transporte HTTP: ${error}`);
                    throw error;
                }
            }
        };
    }
    catch (error) {
        logger.error(`Erro ao inicializar SDK MCP: ${error}`);
        throw error;
    }
}
//# sourceMappingURL=mcp-sdk.adapter.js.map