// Importações essenciais
const { McpServer } = require('@modelcontextprotocol/sdk/dist/cjs/server/index.js');
const { WebSocketServerTransport } = require('@modelcontextprotocol/sdk/dist/cjs/server/transports/websocket');
const axios = require('axios');
const { z } = require('zod');
const dotenv = require('dotenv');
const WS = require('ws');

// Configurações
dotenv.config();
const apiToken = process.env.PIPERUN_API_TOKEN;
const apiUrl = process.env.PIPERUN_API_URL || 'https://api.piperun.com/v1';
const apiConfig = {
  headers: {
    'Authorization': `Bearer ${apiToken}`
  }
};

if (!apiToken) {
  console.error('Token da API Piperun não configurado! Defina a variável de ambiente PIPERUN_API_TOKEN.');
  process.exit(1);
}

console.log('Conectando à API Piperun:', apiUrl);

// Interfaces
interface PaginationParams {
  page?: number;
  show?: number;
}

interface DealsParams extends PaginationParams {
  pipeline_id?: number;
  stage_id?: number;
  person_id?: number;
}

interface StagesParams extends PaginationParams {
  pipeline_id?: number;
}

interface IdParam {
  dealId: number;
}

interface PersonIdParam {
  personId: number;
}

interface OrganizationIdParam {
  organizationId: number;
}

interface PipelineIdParam {
  pipelineId: number;
}

// Utilitários
function getErrorMessage(error: any): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Funções para interação com a API Piperun
async function list_deals({ page = 1, show = 100, pipeline_id, stage_id, person_id }: DealsParams) {
  try {
    console.log(`Listando negócios: página ${page}, itens por página ${show}`);
    
    // Construir parâmetros da consulta
    const params: Record<string, any> = { page, show };
    if (pipeline_id) params.pipeline_id = pipeline_id;
    if (stage_id) params.stage_id = stage_id;
    if (person_id) params.person_id = person_id;
    
    const response = await axios.get(`${apiUrl}/deals`, { 
      params, 
      headers: apiConfig.headers 
    });
    
    console.log(`Dados retornados: ${response.data.data.length} negócios`);
    return { 
      deals: response.data.data,
      meta: response.data.meta
    };
  } catch (error) {
    console.error('Erro ao listar negócios:', getErrorMessage(error));
    throw new Error(`Falha ao listar negócios: ${getErrorMessage(error)}`);
  }
}

async function get_deal({ dealId }: IdParam) {
  try {
    console.log(`Obtendo detalhes do negócio ID: ${dealId}`);
    const response = await axios.get(`${apiUrl}/deals/${dealId}`, { 
      headers: apiConfig.headers 
    });
    
    console.log(`Dados do negócio ID ${dealId} recuperados com sucesso`);
    return response.data.data;
  } catch (error) {
    console.error(`Erro ao obter negócio ID ${dealId}:`, getErrorMessage(error));
    throw new Error(`Falha ao obter negócio ID ${dealId}: ${getErrorMessage(error)}`);
  }
}

async function list_persons({ page = 1, show = 100 }: PaginationParams) {
  try {
    console.log(`Listando pessoas: página ${page}, itens por página ${show}`);
    const response = await axios.get(`${apiUrl}/people`, { 
      params: { page, show }, 
      headers: apiConfig.headers 
    });
    
    console.log(`Dados retornados: ${response.data.data.length} pessoas`);
    return { 
      persons: response.data.data,
      meta: response.data.meta
    };
  } catch (error) {
    console.error('Erro ao listar pessoas:', getErrorMessage(error));
    throw new Error(`Falha ao listar pessoas: ${getErrorMessage(error)}`);
  }
}

async function get_person({ personId }: PersonIdParam) {
  try {
    console.log(`Obtendo detalhes da pessoa ID: ${personId}`);
    const response = await axios.get(`${apiUrl}/people/${personId}`, { 
      headers: apiConfig.headers 
    });
    
    console.log(`Dados da pessoa ID ${personId} recuperados com sucesso`);
    return response.data.data;
  } catch (error) {
    console.error(`Erro ao obter pessoa ID ${personId}:`, getErrorMessage(error));
    throw new Error(`Falha ao obter pessoa ID ${personId}: ${getErrorMessage(error)}`);
  }
}

async function list_organizations({ page = 1, show = 100 }: PaginationParams) {
  try {
    console.log(`Listando organizações: página ${page}, itens por página ${show}`);
    const response = await axios.get(`${apiUrl}/organizations`, { 
      params: { page, show }, 
      headers: apiConfig.headers 
    });
    
    console.log(`Dados retornados: ${response.data.data.length} organizações`);
    return { 
      organizations: response.data.data,
      meta: response.data.meta
    };
  } catch (error) {
    console.error('Erro ao listar organizações:', getErrorMessage(error));
    throw new Error(`Falha ao listar organizações: ${getErrorMessage(error)}`);
  }
}

async function get_organization({ organizationId }: OrganizationIdParam) {
  try {
    console.log(`Obtendo detalhes da organização ID: ${organizationId}`);
    const response = await axios.get(`${apiUrl}/organizations/${organizationId}`, { 
      headers: apiConfig.headers 
    });
    
    console.log(`Dados da organização ID ${organizationId} recuperados com sucesso`);
    return response.data.data;
  } catch (error) {
    console.error(`Erro ao obter organização ID ${organizationId}:`, getErrorMessage(error));
    throw new Error(`Falha ao obter organização ID ${organizationId}: ${getErrorMessage(error)}`);
  }
}

async function list_pipelines({ page = 1, show = 100 }: PaginationParams) {
  try {
    console.log(`Listando pipelines: página ${page}, itens por página ${show}`);
    const response = await axios.get(`${apiUrl}/pipelines`, { 
      params: { page, show }, 
      headers: apiConfig.headers 
    });
    
    console.log(`Dados retornados: ${response.data.data.length} pipelines`);
    return { 
      pipelines: response.data.data,
      meta: response.data.meta
    };
  } catch (error) {
    console.error('Erro ao listar pipelines:', getErrorMessage(error));
    throw new Error(`Falha ao listar pipelines: ${getErrorMessage(error)}`);
  }
}

async function get_pipeline({ pipelineId }: PipelineIdParam) {
  try {
    console.log(`Obtendo detalhes do pipeline ID: ${pipelineId}`);
    const response = await axios.get(`${apiUrl}/pipelines/${pipelineId}`, { 
      headers: apiConfig.headers 
    });
    
    console.log(`Dados do pipeline ID ${pipelineId} recuperados com sucesso`);
    return response.data.data;
  } catch (error) {
    console.error(`Erro ao obter pipeline ID ${pipelineId}:`, getErrorMessage(error));
    throw new Error(`Falha ao obter pipeline ID ${pipelineId}: ${getErrorMessage(error)}`);
  }
}

async function list_stages({ page = 1, show = 100, pipeline_id }: StagesParams) {
  try {
    console.log(`Listando estágios: página ${page}, itens por página ${show}`);
    
    // Construir parâmetros da consulta
    const params: Record<string, any> = { page, show };
    if (pipeline_id) params.pipeline_id = pipeline_id;
    
    const response = await axios.get(`${apiUrl}/stages`, { 
      params, 
      headers: apiConfig.headers 
    });
    
    console.log(`Dados retornados: ${response.data.data.length} estágios`);
    return { 
      stages: response.data.data,
      meta: response.data.meta
    };
  } catch (error) {
    console.error('Erro ao listar estágios:', getErrorMessage(error));
    throw new Error(`Falha ao listar estágios: ${getErrorMessage(error)}`);
  }
}

async function list_products({ page = 1, show = 100 }: PaginationParams) {
  try {
    console.log(`Listando produtos: página ${page}, itens por página ${show}`);
    const response = await axios.get(`${apiUrl}/items`, { 
      params: { page, show }, 
      headers: apiConfig.headers 
    });
    
    console.log(`Dados retornados: ${response.data.data.length} produtos`);
    return { 
      products: response.data.data,
      meta: response.data.meta
    };
  } catch (error) {
    console.error('Erro ao listar produtos:', getErrorMessage(error));
    throw new Error(`Falha ao listar produtos: ${getErrorMessage(error)}`);
  }
}

// Definição do Schema Zod para validação de parâmetros
const PaginationSchema = z.object({
  page: z.number().optional().default(1),
  show: z.number().optional().default(100)
});

const DealsQuerySchema = PaginationSchema.extend({
  pipeline_id: z.number().optional(),
  stage_id: z.number().optional(),
  person_id: z.number().optional()
});

const StagesQuerySchema = PaginationSchema.extend({
  pipeline_id: z.number().optional()
});

const IdSchema = z.object({
  dealId: z.number()
});

const PersonIdSchema = z.object({
  personId: z.number()
});

const OrganizationIdSchema = z.object({
  organizationId: z.number()
});

const PipelineIdSchema = z.object({
  pipelineId: z.number()
});

// Configuração do servidor MCP
console.log("Iniciando servidor MCP para integração com o Piperun...");

// Criar uma instância básica do servidor MCP
const server = new McpServer();

// Registrar funções no servidor MCP
server.addTool(
  "list-deals",
  "Lista os negócios (deals) do Piperun com suporte a paginação e filtros",
  DealsQuerySchema,
  list_deals
);

server.addTool(
  "get-deal",
  "Obtém os detalhes de um negócio específico pelo ID",
  IdSchema,
  get_deal
);

server.addTool(
  "list-persons",
  "Lista as pessoas (contatos) do Piperun com suporte a paginação",
  PaginationSchema,
  list_persons
);

server.addTool(
  "get-person",
  "Obtém os detalhes de uma pessoa (contato) específica pelo ID",
  PersonIdSchema,
  get_person
);

server.addTool(
  "list-organizations",
  "Lista as organizações do Piperun com suporte a paginação",
  PaginationSchema,
  list_organizations
);

server.addTool(
  "get-organization",
  "Obtém os detalhes de uma organização específica pelo ID",
  OrganizationIdSchema,
  get_organization
);

server.addTool(
  "list-pipelines",
  "Lista os pipelines do Piperun com suporte a paginação",
  PaginationSchema,
  list_pipelines
);

server.addTool(
  "get-pipeline",
  "Obtém os detalhes de um pipeline específico pelo ID",
  PipelineIdSchema,
  get_pipeline
);

server.addTool(
  "list-stages",
  "Lista os estágios do Piperun com suporte a paginação e filtro por pipeline",
  StagesQuerySchema,
  list_stages
);

server.addTool(
  "list-products",
  "Lista os produtos (items) do Piperun com suporte a paginação",
  PaginationSchema,
  list_products
);

// Usar o transporte WebSocket padrão do SDK
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
console.log(`Iniciando servidor na porta ${port}`);

// Criar instância do servidor WebSocket
const wss = new WS.Server({ port });
console.log(`Servidor WebSocket iniciado na porta ${port}`);

// Iniciar o servidor
server.start();
console.log("Servidor MCP iniciado com sucesso");

// Gerenciar conexões WebSocket
wss.on('connection', (ws: any) => {
  console.log('Novo cliente conectado');
  
  // Enviar mensagem de confirmação
  ws.send(JSON.stringify({ type: 'connection', status: 'connected', timestamp: new Date().toISOString() }));
  
  ws.on('message', (message: any) => {
    try {
      console.log('Mensagem recebida:', message.toString().substring(0, 150));
      const data = JSON.parse(message.toString());
      
      server.handleMessage(data, (response: any) => {
        try {
          console.log('Enviando resposta:', JSON.stringify(response).substring(0, 150));
          ws.send(JSON.stringify(response));
        } catch (error) {
          console.error('Erro ao enviar resposta:', getErrorMessage(error));
        }
      });
    } catch (error) {
      console.error('Erro ao processar mensagem:', getErrorMessage(error));
      
      // Enviar resposta de erro formatada
      const errorResponse = {
        jsonrpc: "2.0",
        error: {
          code: -32700,
          message: `Erro no processamento: ${getErrorMessage(error)}`
        },
        id: null
      };
      
      try {
        ws.send(JSON.stringify(errorResponse));
      } catch (sendError) {
        console.error('Erro ao enviar resposta de erro:', getErrorMessage(sendError));
      }
    }
  });
  
  ws.on('close', (code: number, reason: string) => {
    console.log(`Cliente desconectado. Código: ${code}, Motivo: ${reason || 'Não especificado'}`);
  });
  
  ws.on('error', (error: any) => {
    console.error('Erro na conexão WebSocket:', getErrorMessage(error));
  });
});
