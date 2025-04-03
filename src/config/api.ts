/**
 * Configurações da API do Piperun
 */

// URL base da API do Piperun
export const API_BASE_URL = 'https://app.piperun.com/api/v1';

// Configuração para autenticação
export const AUTH_CONFIG = {
  apiKey: process.env.PIPERUN_API_KEY || '',
};

// Configurações das ferramentas disponíveis no MCP
export const TOOL_CONFIG = {
  deals: {
    name: "list_deals",
    description: "Lista negócios (deals) do Piperun com opções de filtragem e paginação."
  },
  pipelines: {
    name: "list_pipelines",
    description: "Lista pipelines disponíveis no Piperun."
  },
  stages: {
    name: "list_stages",
    description: "Lista as etapas (stages) de um pipeline específico."
  },
  products: {
    name: "list_products",
    description: "Lista os produtos disponíveis no Piperun."
  },
  contacts: {
    name: "list_contacts",
    description: "Lista os contatos cadastrados no Piperun."
  },
  status: {
    name: "check_status",
    description: "Verifica se a API do Piperun está respondendo."
  }
};

// Configuração do servidor MCP
export const SERVER_CONFIG = {
  name: "piperun-api-service",
  version: "1.0.0",
  description: "Serviço que fornece acesso à API do CRM Piperun, incluindo negócios, pipelines, etapas, produtos e contatos.",
};
