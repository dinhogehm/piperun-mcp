// Importações simplificadas usando apenas o módulo principal
const { Server } = require('@modelcontextprotocol/sdk/dist/cjs/server/index.js');
const { z } = require('zod');
const axios = require('axios');
const dotenv = require('dotenv');
const WebSocket = require('ws');

// Type for error handling
interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return String(error);
}

// Tipo para a resposta padrão da API PipeRun
interface PiperunResponse<T> {
  status: boolean;
  message: string;
  data: T;
  meta?: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {
        previous?: string;
        next?: string;
      };
    };
  };
}

// Load environment variables
dotenv.config();

// Verificar variáveis de ambiente apenas ao executar operações, não ao iniciar o servidor
// Isso permite o lazy loading necessário para o Smithery.ai
const getApiToken = (): string => {
  if (!process.env.PIPERUN_API_TOKEN) {
    throw new Error("PIPERUN_API_TOKEN environment variable is required");
  }
  return process.env.PIPERUN_API_TOKEN;
};

const getApiUrl = (): string => {
  if (!process.env.PIPERUN_API_URL) {
    return "https://api.piperun.com/v1"; // URL padrão se não estiver configurada
  }
  return process.env.PIPERUN_API_URL;
};

// Funções utilitárias para interação com a API do Piperun
async function list_deals(page: number = 1, show: number = 100, pipeline_id?: number, stage_id?: number, person_id?: number): Promise<any> {
  try {
    console.log(`Fetching deals with page=${page}, show=${show}, pipeline_id=${pipeline_id}, stage_id=${stage_id}, person_id=${person_id}`);
    
    const params: Record<string, any> = {
      page,
      show,
    };
    
    if (pipeline_id) params.pipeline_id = pipeline_id;
    if (stage_id) params.stage_id = stage_id;
    if (person_id) params.person_id = person_id;
    
    const apiToken = getApiToken();
    const apiUrl = getApiUrl();
    
    const response = await axios.get(`${apiUrl}/deals`, {
      params: {
        ...params,
        token: apiToken
      }
    });
    
    console.log(`Successfully fetched ${response.data?.data?.length || 0} deals`);
    return response.data;
  } catch (error) {
    console.error('Error fetching deals:', getErrorMessage(error));
    throw error;
  }
}

async function list_pipelines(page: number = 1, show: number = 100): Promise<any> {
  try {
    console.log(`Fetching pipelines with page=${page}, show=${show}`);
    
    const apiToken = getApiToken();
    const apiUrl = getApiUrl();
    
    const response = await axios.get(`${apiUrl}/pipelines`, {
      params: {
        page,
        show,
        token: apiToken
      }
    });
    
    console.log(`Successfully fetched ${response.data?.data?.length || 0} pipelines`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pipelines:', getErrorMessage(error));
    throw error;
  }
}

async function list_stages(page: number = 1, show: number = 100, pipeline_id?: number): Promise<any> {
  try {
    console.log(`Fetching stages with page=${page}, show=${show}, pipeline_id=${pipeline_id}`);
    
    const params: Record<string, any> = {
      page,
      show,
    };
    
    if (pipeline_id) params.pipeline_id = pipeline_id;
    
    const apiToken = getApiToken();
    const apiUrl = getApiUrl();
    
    const response = await axios.get(`${apiUrl}/stages`, {
      params: {
        ...params,
        token: apiToken
      }
    });
    
    console.log(`Successfully fetched ${response.data?.data?.length || 0} stages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stages:', getErrorMessage(error));
    throw error;
  }
}

async function list_products(page: number = 1, show: number = 100): Promise<any> {
  try {
    console.log(`Fetching products with page=${page}, show=${show}`);
    
    const apiToken = getApiToken();
    const apiUrl = getApiUrl();
    
    const response = await axios.get(`${apiUrl}/items`, {
      params: {
        page,
        show,
        token: apiToken
      }
    });
    
    console.log(`Successfully fetched ${response.data?.data?.length || 0} products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', getErrorMessage(error));
    throw error;
  }
}

async function list_persons(page: number = 1, show: number = 100): Promise<any> {
  try {
    console.log(`Fetching persons with page=${page}, show=${show}`);
    
    const apiToken = getApiToken();
    const apiUrl = getApiUrl();
    
    const response = await axios.get(`${apiUrl}/people`, {
      params: {
        page,
        show,
        token: apiToken
      }
    });
    
    console.log(`Successfully fetched ${response.data?.data?.length || 0} persons`);
    return response.data;
  } catch (error) {
    console.error('Error fetching persons:', getErrorMessage(error));
    throw error;
  }
}

async function list_organizations(page: number = 1, show: number = 100): Promise<any> {
  try {
    console.log(`Fetching organizations with page=${page}, show=${show}`);
    
    const apiToken = getApiToken();
    const apiUrl = getApiUrl();
    
    const response = await axios.get(`${apiUrl}/organizations`, {
      params: {
        page,
        show,
        token: apiToken
      }
    });
    
    console.log(`Successfully fetched ${response.data?.data?.length || 0} organizations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching organizations:', getErrorMessage(error));
    throw error;
  }
}

// Não verificamos as variáveis de ambiente no início, permitindo que o servidor inicie
// e que as ferramentas sejam listadas sem autenticação
// As verificações ocorrem apenas quando as ferramentas são chamadas

// Create MCP server
const server = new Server({
  name: "piperun-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {}
  }
});

// === TOOLS ===

// Get all deals
server.tool(
  "get-deals",
  "Get all deals from Piperun including custom fields",
  {
    page: z.number().optional().describe("Page number"),
    show: z.number().optional().describe("Number of items per page"),
    pipeline_id: z.number().optional().describe("Pipeline ID"),
    stage_id: z.number().optional().describe("Stage ID"),
    person_id: z.number().optional().describe("Person ID")
  },
  async ({ page = 1, show = 100, pipeline_id, stage_id, person_id }: { page?: number, show?: number, pipeline_id?: number, stage_id?: number, person_id?: number }) => {
    try {
      const response = await list_deals(page, show, pipeline_id, stage_id, person_id);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error("Error fetching deals:", error);
      return {
        content: [{
          type: "text",
          text: `Error fetching deals: ${getErrorMessage(error)}`
        }],
        isError: true
      };
    }
  }
);

// Get deal by ID
server.tool(
  "get-deal",
  "Get a specific deal by ID including custom fields",
  {
    dealId: z.number().describe("Piperun deal ID")
  },
  async ({ dealId }: { dealId: number }) => {
    try {
      const apiToken = getApiToken();
      const apiUrl = getApiUrl();
      
      const response = await axios.get(`${apiUrl}/deals/${dealId}`, {
        params: {
          token: apiToken
        }
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    } catch (error) {
      console.error(`Error fetching deal ${dealId}:`, error);
      return {
        content: [{
          type: "text",
          text: `Error fetching deal ${dealId}: ${getErrorMessage(error)}`
        }],
        isError: true
      };
    }
  }
);

// Get all persons
server.tool(
  "get-persons",
  "Get all persons from Piperun including custom fields",
  {
    page: z.number().optional().describe("Page number"),
    show: z.number().optional().describe("Number of items per page")
  },
  async ({ page = 1, show = 100 }: { page?: number, show?: number }) => {
    try {
      const response = await list_persons(page, show);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error("Error fetching persons:", error);
      return {
        content: [{
          type: "text",
          text: `Error fetching persons: ${getErrorMessage(error)}`
        }],
        isError: true
      };
    }
  }
);

// Get person by ID
server.tool(
  "get-person",
  "Get a specific person by ID including custom fields",
  {
    personId: z.number().describe("Piperun person ID")
  },
  async ({ personId }: { personId: number }) => {
    try {
      const apiToken = getApiToken();
      const apiUrl = getApiUrl();
      
      const response = await axios.get(`${apiUrl}/people/${personId}`, {
        params: {
          token: apiToken
        }
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    } catch (error) {
      console.error(`Error fetching person ${personId}:`, error);
      return {
        content: [{
          type: "text",
          text: `Error fetching person ${personId}: ${getErrorMessage(error)}`
        }],
        isError: true
      };
    }
  }
);

// Get all organizations
server.tool(
  "get-organizations",
  "Get all organizations from Piperun including custom fields",
  {
    page: z.number().optional().describe("Page number"),
    show: z.number().optional().describe("Number of items per page")
  },
  async ({ page = 1, show = 100 }: { page?: number, show?: number }) => {
    try {
      const response = await list_organizations(page, show);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error("Error fetching organizations:", error);
      return {
        content: [{
          type: "text",
          text: `Error fetching organizations: ${getErrorMessage(error)}`
        }],
        isError: true
      };
    }
  }
);

// Get organization by ID
server.tool(
  "get-organization",
  "Get a specific organization by ID including custom fields",
  {
    organizationId: z.number().describe("Piperun organization ID")
  },
  async ({ organizationId }: { organizationId: number }) => {
    try {
      const apiToken = getApiToken();
      const apiUrl = getApiUrl();
      
      const response = await axios.get(`${apiUrl}/organizations/${organizationId}`, {
        params: {
          token: apiToken
        }
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    } catch (error) {
      console.error(`Error fetching organization ${organizationId}:`, error);
      return {
        content: [{
          type: "text",
          text: `Error fetching organization ${organizationId}: ${getErrorMessage(error)}`
        }],
        isError: true
      };
    }
  }
);

// Get all pipelines
server.tool(
  "get-pipelines",
  "Get all pipelines from Piperun",
  {
    page: z.number().optional().describe("Page number"),
    show: z.number().optional().describe("Number of items per page")
  },
  async ({ page = 1, show = 100 }: { page?: number, show?: number }) => {
    try {
      const response = await list_pipelines(page, show);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error("Error fetching pipelines:", error);
      return {
        content: [{
          type: "text",
          text: `Error fetching pipelines: ${getErrorMessage(error)}`
        }],
        isError: true
      };
    }
  }
);

// Get pipeline by ID
server.tool(
  "get-pipeline",
  "Get a specific pipeline by ID",
  {
    pipelineId: z.number().describe("Piperun pipeline ID")
  },
  async ({ pipelineId }: { pipelineId: number }) => {
    try {
      const apiToken = getApiToken();
      const apiUrl = getApiUrl();
      
      const response = await axios.get(`${apiUrl}/pipelines/${pipelineId}`, {
        params: {
          token: apiToken
        }
      });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response.data, null, 2)
        }]
      };
    } catch (error) {
      console.error(`Error fetching pipeline ${pipelineId}:`, error);
      return {
        content: [{
          type: "text",
          text: `Error fetching pipeline ${pipelineId}: ${getErrorMessage(error)}`
        }],
        isError: true
      };
    }
  }
);

// Get all stages
server.tool(
  "get-stages",
  "Get all stages from Piperun",
  {
    page: z.number().optional().describe("Page number"),
    show: z.number().optional().describe("Number of items per page"),
    pipeline_id: z.number().optional().describe("Pipeline ID")
  },
  async ({ page = 1, show = 100, pipeline_id }: { page?: number, show?: number, pipeline_id?: number }) => {
    try {
      const response = await list_stages(page, show, pipeline_id);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error("Error fetching stages:", error);
      return {
        content: [{
          type: "text",
          text: `Error fetching stages: ${getErrorMessage(error)}`
        }],
        isError: true
      };
    }
  }
);

// Get all products
server.tool(
  "get-products",
  "Get all products from Piperun",
  {
    page: z.number().optional().describe("Page number"),
    show: z.number().optional().describe("Number of items per page")
  },
  async ({ page = 1, show = 100 }: { page?: number, show?: number }) => {
    try {
      const response = await list_products(page, show);
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(response, null, 2)
        }]
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        content: [{
          type: "text",
          text: `Error fetching products: ${getErrorMessage(error)}`
        }],
        isError: true
      };
    }
  }
);

// === PROMPTS ===

// Prompt for getting all deals
server.prompt(
  "list-all-deals",
  "List all deals in Piperun",
  {},
  () => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: "Por favor, liste todos os negócios na minha conta do Piperun, mostrando o título, valor, status e etapa."
      }
    }]
  })
);

// Prompt for getting all persons
server.prompt(
  "list-all-persons",
  "List all persons in Piperun",
  {},
  () => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: "Por favor, liste todas as pessoas na minha conta do Piperun, mostrando o nome, e-mail, telefone e organização."
      }
    }]
  })
);

// Prompt for getting all pipelines
server.prompt(
  "list-all-pipelines",
  "List all pipelines in Piperun",
  {},
  () => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: "Por favor, liste todos os funis na minha conta do Piperun, mostrando o nome e as etapas."
      }
    }]
  })
);

// Prompt for analyzing deals
server.prompt(
  "analyze-deals",
  "Analyze deals by stage",
  {},
  () => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: "Por favor, analise os negócios na minha conta do Piperun, agrupando-os por etapa e fornecendo o valor total para cada etapa."
      }
    }]
  })
);

// Prompt for analyzing contacts
server.prompt(
  "analyze-contacts",
  "Analyze contacts by organization",
  {},
  () => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: "Por favor, analise as pessoas na minha conta do Piperun, agrupando-as por organização e fornecendo uma contagem para cada organização."
      }
    }]
  })
);

// Prompt for pipeline comparison
server.prompt(
  "compare-pipelines",
  "Compare different pipelines and their stages",
  {},
  () => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: "Por favor, liste todos os funis na minha conta do Piperun e compare-os mostrando as etapas em cada funil."
      }
    }]
  })
);

// Prompt for product analysis
server.prompt(
  "analyze-products",
  "Analyze products by category",
  {},
  () => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: "Por favor, liste todos os produtos na minha conta do Piperun e agrupe-os por categoria, mostrando o preço total para cada categoria."
      }
    }]
  })
);

// Modificar o início do servidor para usar WebSocket sempre no Smithery
// Start the server with WebSocket transport for Smithery.ai
console.log("Starting MCP server for Piperun integration");

// No ambiente Smithery, o servidor precisa escutar na porta fornecida pelo ambiente
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
console.log(`Starting server on port ${port}`);

// Instanciar o servidor WebSocket diretamente
const wss = new WebSocket.Server({ port });
server.start({
  onRequest: (req) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(req));
      }
    });
  }
});

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      server.handleMessage(data, (response) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(response));
        }
      });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
