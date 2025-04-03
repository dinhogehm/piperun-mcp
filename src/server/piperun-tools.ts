import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

// Interface para configurações do PipeRun
interface PipeRunConfig {
  apiKey: string;
  baseUrl: string;
}

// Resposta padrão da API PipeRun
interface PipeRunApiResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      total?: number;
      count?: number;
      per_page?: number;
      current_page?: number;
      total_pages?: number;
    };
  };
}

// Configuração padrão (deve ser sobrescrita com valores reais)
const defaultConfig: PipeRunConfig = {
  apiKey: process.env.PIPERUN_API_KEY || "",
  baseUrl: process.env.PIPERUN_BASE_URL || "https://app.piperun.com/api/v1"
};

/**
 * Função auxiliar para fazer requisições à API do PipeRun
 * @param endpoint Endpoint da API
 * @param params Parâmetros da requisição
 * @param config Configuração do PipeRun
 * @returns Dados da resposta
 */
async function makeApiRequest<T>(endpoint: string, params: Record<string, any> = {}, config: PipeRunConfig = defaultConfig): Promise<{ data: T[], meta: any }> {
  try {
    console.error(`Fazendo requisição para ${endpoint} com params:`, params);
    
    const url = `${config.baseUrl}${endpoint}`;
    const response = await axios.get<PipeRunApiResponse<T>>(url, {
      params: {
        api_token: config.apiKey,
        ...params
      }
    });
    
    console.error(`Resposta recebida de ${endpoint} com status:`, response.status);
    
    // Verifica se a resposta contém os dados esperados
    if (response.data && response.data.data) {
      return {
        data: response.data.data,
        meta: response.data.meta || {}
      };
    }
    
    throw new Error(`Resposta da API não contém o formato esperado: ${JSON.stringify(response.data)}`);
  } catch (error: any) {
    console.error(`Erro ao fazer requisição para ${endpoint}:`, error.message);
    throw new Error(`Falha na requisição para ${endpoint}: ${error.message}`);
  }
}

/**
 * Configura as ferramentas específicas do PipeRun no servidor MCP
 * @param server Instância do servidor MCP
 */
export function setupPipeRunTools(server: McpServer): void {
  // Interface para deal (negócio)
  interface Deal {
    id: string;
    title: string;
    [key: string]: any; // Para outros campos que possam existir
  }

  // Ferramenta para listar negócios (deals)
  server.tool(
    "list_deals",
    "Lista negócios (deals) do PipeRun",
    {
      pipeline_id: z.string().optional().describe("ID do pipeline para filtrar"),
      stage_id: z.string().optional().describe("ID do estágio para filtrar"),
      person_id: z.string().optional().describe("ID da pessoa/contato para filtrar"),
      show: z.number().optional().describe("Quantidade de registros a retornar por página"),
      page: z.number().optional().describe("Número da página para paginar resultados"),
      query: z.string().optional().describe("Termo de busca para filtrar os resultados")
    },
    async ({ pipeline_id, stage_id, person_id, show, page, query }: { 
      pipeline_id?: string;
      stage_id?: string;
      person_id?: string;
      show?: number;
      page?: number;
      query?: string;
    }) => {
      try {
        const params: Record<string, any> = {};
        
        // Adiciona os parâmetros apenas se estiverem definidos
        if (pipeline_id) params.pipeline_id = pipeline_id;
        if (stage_id) params.stage_id = stage_id;
        if (person_id) params.person_id = person_id;
        if (show) params.show = show;
        if (page) params.page = page;
        if (query) params.query = query;
        
        const result = await makeApiRequest<Deal>("/deals", params);
        
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Erro ao listar negócios: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // Interface para pipeline
  interface Pipeline {
    id: string;
    name: string;
    [key: string]: any; // Para outros campos que possam existir
  }

  // Ferramenta para listar pipelines
  server.tool(
    "list_pipelines",
    "Lista pipelines do PipeRun",
    {
      show: z.number().optional().describe("Quantidade de registros a retornar por página"),
      page: z.number().optional().describe("Número da página para paginar resultados")
    },
    async ({ show, page }: { 
      show?: number;
      page?: number;
    }) => {
      try {
        const params: Record<string, any> = {};
        
        if (show) params.show = show;
        if (page) params.page = page;
        
        const result = await makeApiRequest<Pipeline>("/pipelines", params);
        
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Erro ao listar pipelines: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // Interface para estágio (stage)
  interface Stage {
    id: string;
    name: string;
    pipeline_id: string;
    [key: string]: any; // Para outros campos que possam existir
  }

  // Interface para produto (item)
  interface Product {
    id: string;
    name: string;
    price?: number;
    [key: string]: any; // Para outros campos que possam existir
  }

  // Ferramenta para listar estágios (stages)
  server.tool(
    "list_stages",
    "Lista estágios (stages) de um pipeline no PipeRun",
    {
      pipeline_id: z.string().describe("ID do pipeline para listar seus estágios"),
      show: z.number().optional().describe("Quantidade de registros a retornar por página"),
      page: z.number().optional().describe("Número da página para paginar resultados")
    },
    async ({ pipeline_id, show, page }: {
      pipeline_id: string;
      show?: number;
      page?: number;
    }) => {
      try {
        const params: Record<string, any> = {
          pipeline_id
        };
        
        if (show) params.show = show;
        if (page) params.page = page;
        
        const result = await makeApiRequest<Stage>("/stages", params);
        
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Erro ao listar estágios: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // Ferramenta para listar produtos (items)
  server.tool(
    "list_products",
    "Lista produtos (items) do PipeRun",
    {
      show: z.number().optional().describe("Quantidade de registros a retornar por página"),
      page: z.number().optional().describe("Número da página para paginar resultados"),
      query: z.string().optional().describe("Termo de busca para filtrar os resultados")
    },
    async ({ show, page, query }: {
      show?: number;
      page?: number;
      query?: string;
    }) => {
      try {
        const params: Record<string, any> = {};
        
        if (show) params.show = show;
        if (page) params.page = page;
        if (query) params.query = query;
        
        const result = await makeApiRequest<Product>("/items", params);
        
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Erro ao listar produtos: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // Ferramenta para configurar a API do PipeRun
  server.tool(
    "configure_piperun",
    "Configura as credenciais e URL para acessar a API do PipeRun",
    {
      api_key: z.string().describe("Chave da API do PipeRun"),
      base_url: z.string().optional().describe("URL base da API (opcional)")
    },
    async ({ api_key, base_url }: {
      api_key: string;
      base_url?: string;
    }) => {
      try {
        // Atualiza a configuração global
        defaultConfig.apiKey = api_key;
        if (base_url) defaultConfig.baseUrl = base_url;
        
        return {
          content: [{ 
            type: "text", 
            text: `Configuração do PipeRun atualizada com sucesso.\nAPI Key: ${api_key.substring(0, 5)}...\nURL Base: ${defaultConfig.baseUrl}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Erro ao configurar PipeRun: ${error.message}` }],
          isError: true
        };
      }
    }
  );
}
