// Implementação do servidor MCP (Model Context Protocol)
import { createServer } from '@modelcontextprotocol/sdk';
import { getListDeals, getListPipelines, getListStages, getListProducts } from './piperun.js';

// Configuração das ferramentas disponíveis no MCP
const tools = [
  {
    name: 'listDeals',
    description: 'Lista negociações do PipeRun',
    parameters: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Número da página (inicia em 1)',
        },
        show: {
          type: 'number',
          description: 'Quantidade de registros por página',
        },
        person_id: {
          type: 'string',
          description: 'ID da pessoa para filtrar negociações',
        },
      },
      required: [],
    },
    async handler(params, context) {
      const apiKey = context.headers['x-api-key'];
      if (!apiKey) {
        throw new Error('API Key é necessária');
      }
      
      const page = params.page || 1;
      const show = params.show || 20;
      const person_id = params.person_id;
      
      try {
        const result = await getListDeals(apiKey, { page, show, person_id });
        return result;
      } catch (error) {
        console.error('Erro ao listar negociações:', error);
        throw new Error(`Erro ao listar negociações: ${error.message || error}`);
      }
    },
  },
  {
    name: 'listPipelines',
    description: 'Lista pipelines do PipeRun',
    parameters: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Número da página (inicia em 1)',
        },
        show: {
          type: 'number',
          description: 'Quantidade de registros por página',
        },
      },
      required: [],
    },
    async handler(params, context) {
      const apiKey = context.headers['x-api-key'];
      if (!apiKey) {
        throw new Error('API Key é necessária');
      }
      
      const page = params.page || 1;
      const show = params.show || 20;
      
      try {
        const result = await getListPipelines(apiKey, { page, show });
        return result;
      } catch (error) {
        console.error('Erro ao listar pipelines:', error);
        throw new Error(`Erro ao listar pipelines: ${error.message || error}`);
      }
    },
  },
  {
    name: 'listStages',
    description: 'Lista estágios do PipeRun',
    parameters: {
      type: 'object',
      properties: {
        pipeline_id: {
          type: 'string',
          description: 'ID do pipeline para filtrar estágios',
        },
        page: {
          type: 'number',
          description: 'Número da página (inicia em 1)',
        },
        show: {
          type: 'number',
          description: 'Quantidade de registros por página',
        },
      },
      required: [],
    },
    async handler(params, context) {
      const apiKey = context.headers['x-api-key'];
      if (!apiKey) {
        throw new Error('API Key é necessária');
      }
      
      const page = params.page || 1;
      const show = params.show || 20;
      const pipeline_id = params.pipeline_id;
      
      try {
        const result = await getListStages(apiKey, { page, show, pipeline_id });
        return result;
      } catch (error) {
        console.error('Erro ao listar estágios:', error);
        throw new Error(`Erro ao listar estágios: ${error.message || error}`);
      }
    },
  },
  {
    name: 'listProducts',
    description: 'Lista produtos do PipeRun',
    parameters: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Número da página (inicia em 1)',
        },
        show: {
          type: 'number',
          description: 'Quantidade de registros por página',
        },
      },
      required: [],
    },
    async handler(params, context) {
      const apiKey = context.headers['x-api-key'];
      if (!apiKey) {
        throw new Error('API Key é necessária');
      }
      
      const page = params.page || 1;
      const show = params.show || 20;
      
      try {
        const result = await getListProducts(apiKey, { page, show });
        return result;
      } catch (error) {
        console.error('Erro ao listar produtos:', error);
        throw new Error(`Erro ao listar produtos: ${error.message || error}`);
      }
    },
  },
];

// Configuração do servidor MCP
const serverConfig = {
  name: 'piperun-mcp',
  description: 'Integração do PipeRun com Model Context Protocol',
  version: '1.0.0',
  tools,
};

// Criar o servidor MCP
const server = createServer(serverConfig);

// Middleware para logging de requisições
server.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rota de informações gerais
server.get('/', (req, res) => {
  res.json({
    name: serverConfig.name,
    description: serverConfig.description,
    version: serverConfig.version,
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description
    }))
  });
});

// Exportar o servidor
export default server;
