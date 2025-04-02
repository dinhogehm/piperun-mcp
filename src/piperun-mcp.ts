/**
 * Servidor MCP Piperun - Implementação com nossa própria classe Tool
 * Para integração com Windsurf
 */

import axios from 'axios';
import * as dotenv from 'dotenv';
import { z } from 'zod';
import { Tool } from './mcp-tools';

// Carregar variáveis de ambiente
dotenv.config();
const PIPERUN_API_URL = process.env.PIPERUN_API_URL || 'https://api.piperun.com/v1';
const PIPERUN_API_TOKEN = process.env.PIPERUN_API_TOKEN;

if (!PIPERUN_API_TOKEN) {
  console.error('Erro: PIPERUN_API_TOKEN não configurado');
  process.exit(1);
}

console.error(`Conectando à API Piperun: ${PIPERUN_API_URL}`);

/**
 * Cliente HTTP para a API do Piperun
 */
class PiperunApiClient {
  private baseUrl: string;
  private apiToken: string;

  constructor(baseUrl: string, apiToken: string) {
    this.baseUrl = baseUrl;
    this.apiToken = apiToken;
  }

  async get(endpoint: string, params?: Record<string, any>) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.error(`Fazendo requisição GET para: ${url} com parâmetros:`, params);
      
      const response = await axios.get(url, {
        params: {
          ...params,
          api_token: this.apiToken,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Erro na requisição GET para ${endpoint}:`, error);
      throw error;
    }
  }
}

const apiClient = new PiperunApiClient(PIPERUN_API_URL, PIPERUN_API_TOKEN);

/**
 * Definição das ferramentas usando nossa própria classe Tool
 */

// Ferramenta: Listar Negócios
export const listDealsTool = new Tool({
  id: 'list-deals',
  name: 'Listar Negócios',
  description: 'Lista os negócios (deals) do Piperun com suporte a paginação e filtros',
  parameters: z.object({
    page: z.number().optional().default(1).describe('Número da página'),
    show: z.number().optional().default(100).describe('Quantidade de itens por página'),
    pipeline_id: z.number().optional().describe('ID do pipeline para filtrar'),
    stage_id: z.number().optional().describe('ID do estágio para filtrar'),
    person_id: z.number().optional().describe('ID da pessoa (contato) para filtrar')
  }),
  handler: async (params) => {
    console.error('Listando negócios com parâmetros:', params);
    return await apiClient.get('/deals', params);
  }
});

// Ferramenta: Obter Negócio
export const getDealTool = new Tool({
  id: 'get-deal',
  name: 'Obter Negócio',
  description: 'Obtém os detalhes de um negócio específico pelo ID',
  parameters: z.object({
    dealId: z.number().describe('ID do negócio no Piperun')
  }),
  handler: async (params) => {
    console.error(`Obtendo negócio ID: ${params.dealId}`);
    return await apiClient.get(`/deals/${params.dealId}`);
  }
});

// Ferramenta: Listar Pessoas
export const listPersonsTool = new Tool({
  id: 'list-persons',
  name: 'Listar Pessoas',
  description: 'Lista as pessoas (contatos) do Piperun com suporte a paginação',
  parameters: z.object({
    page: z.number().optional().default(1).describe('Número da página'),
    show: z.number().optional().default(100).describe('Quantidade de itens por página')
  }),
  handler: async (params) => {
    console.error('Listando pessoas com parâmetros:', params);
    return await apiClient.get('/persons', params);
  }
});

// Ferramenta: Obter Pessoa
export const getPersonTool = new Tool({
  id: 'get-person',
  name: 'Obter Pessoa',
  description: 'Obtém os detalhes de uma pessoa (contato) específica pelo ID',
  parameters: z.object({
    personId: z.number().describe('ID da pessoa no Piperun')
  }),
  handler: async (params) => {
    console.error(`Obtendo pessoa ID: ${params.personId}`);
    return await apiClient.get(`/persons/${params.personId}`);
  }
});

// Ferramenta: Listar Organizações
export const listOrganizationsTool = new Tool({
  id: 'list-organizations',
  name: 'Listar Organizações',
  description: 'Lista as organizações do Piperun com suporte a paginação',
  parameters: z.object({
    page: z.number().optional().default(1).describe('Número da página'),
    show: z.number().optional().default(100).describe('Quantidade de itens por página')
  }),
  handler: async (params) => {
    console.error('Listando organizações com parâmetros:', params);
    return await apiClient.get('/organizations', params);
  }
});

// Ferramenta: Obter Organização
export const getOrganizationTool = new Tool({
  id: 'get-organization',
  name: 'Obter Organização',
  description: 'Obtém os detalhes de uma organização específica pelo ID',
  parameters: z.object({
    organizationId: z.number().describe('ID da organização no Piperun')
  }),
  handler: async (params) => {
    console.error(`Obtendo organização ID: ${params.organizationId}`);
    return await apiClient.get(`/organizations/${params.organizationId}`);
  }
});

// Ferramenta: Listar Pipelines
export const listPipelinesTool = new Tool({
  id: 'list-pipelines',
  name: 'Listar Pipelines',
  description: 'Lista os pipelines do Piperun com suporte a paginação',
  parameters: z.object({
    page: z.number().optional().default(1).describe('Número da página'),
    show: z.number().optional().default(100).describe('Quantidade de itens por página')
  }),
  handler: async (params) => {
    console.error('Listando pipelines com parâmetros:', params);
    return await apiClient.get('/pipelines', params);
  }
});

// Ferramenta: Obter Pipeline
export const getPipelineTool = new Tool({
  id: 'get-pipeline',
  name: 'Obter Pipeline',
  description: 'Obtém os detalhes de um pipeline específico pelo ID',
  parameters: z.object({
    pipelineId: z.number().describe('ID do pipeline no Piperun')
  }),
  handler: async (params) => {
    console.error(`Obtendo pipeline ID: ${params.pipelineId}`);
    return await apiClient.get(`/pipelines/${params.pipelineId}`);
  }
});

// Ferramenta: Listar Estágios
export const listStagesTool = new Tool({
  id: 'list-stages',
  name: 'Listar Estágios',
  description: 'Lista os estágios do Piperun com suporte a paginação e filtro por pipeline',
  parameters: z.object({
    page: z.number().optional().default(1).describe('Número da página'),
    show: z.number().optional().default(100).describe('Quantidade de itens por página'),
    pipeline_id: z.number().optional().describe('ID do pipeline para filtrar estágios')
  }),
  handler: async (params) => {
    console.error('Listando estágios com parâmetros:', params);
    return await apiClient.get('/stages', params);
  }
});

// Ferramenta: Listar Produtos
export const listProductsTool = new Tool({
  id: 'list-products',
  name: 'Listar Produtos',
  description: 'Lista os produtos (items) do Piperun com suporte a paginação',
  parameters: z.object({
    page: z.number().optional().default(1).describe('Número da página'),
    show: z.number().optional().default(100).describe('Quantidade de itens por página')
  }),
  handler: async (params) => {
    console.error('Listando produtos com parâmetros:', params);
    return await apiClient.get('/items', params); // Endpoint correto: /items
  }
});

// Lista com todas as ferramentas
export const tools = [
  listDealsTool,
  getDealTool,
  listPersonsTool,
  getPersonTool,
  listOrganizationsTool,
  getOrganizationTool,
  listPipelinesTool,
  getPipelineTool,
  listStagesTool,
  listProductsTool
];
