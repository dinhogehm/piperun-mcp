import axios from 'axios';
import * as dotenv from 'dotenv';
import { z } from 'zod';

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
 * Implementação das ferramentas
 */

// Listar Negócios
async function list_deals(params: any) {
  try {
    console.error('Listando negócios com parâmetros:', params);
    return await apiClient.get('/deals', params);
  } catch (error) {
    console.error('Erro ao listar negócios:', error);
    throw error;
  }
}

// Obter Negócio
async function get_deal(params: any) {
  try {
    console.error(`Obtendo negócio ID: ${params.dealId}`);
    return await apiClient.get(`/deals/${params.dealId}`);
  } catch (error) {
    console.error(`Erro ao obter negócio ID ${params.dealId}:`, error);
    throw error;
  }
}

// Listar Pessoas
async function list_persons(params: any) {
  try {
    console.error('Listando pessoas com parâmetros:', params);
    return await apiClient.get('/persons', params);
  } catch (error) {
    console.error('Erro ao listar pessoas:', error);
    throw error;
  }
}

// Obter Pessoa
async function get_person(params: any) {
  try {
    console.error(`Obtendo pessoa ID: ${params.personId}`);
    return await apiClient.get(`/persons/${params.personId}`);
  } catch (error) {
    console.error(`Erro ao obter pessoa ID ${params.personId}:`, error);
    throw error;
  }
}

// Listar Organizações
async function list_organizations(params: any) {
  try {
    console.error('Listando organizações com parâmetros:', params);
    return await apiClient.get('/organizations', params);
  } catch (error) {
    console.error('Erro ao listar organizações:', error);
    throw error;
  }
}

// Obter Organização
async function get_organization(params: any) {
  try {
    console.error(`Obtendo organização ID: ${params.organizationId}`);
    return await apiClient.get(`/organizations/${params.organizationId}`);
  } catch (error) {
    console.error(`Erro ao obter organização ID ${params.organizationId}:`, error);
    throw error;
  }
}

// Listar Pipelines
async function list_pipelines(params: any) {
  try {
    console.error('Listando pipelines com parâmetros:', params);
    return await apiClient.get('/pipelines', params);
  } catch (error) {
    console.error('Erro ao listar pipelines:', error);
    throw error;
  }
}

// Obter Pipeline
async function get_pipeline(params: any) {
  try {
    console.error(`Obtendo pipeline ID: ${params.pipelineId}`);
    return await apiClient.get(`/pipelines/${params.pipelineId}`);
  } catch (error) {
    console.error(`Erro ao obter pipeline ID ${params.pipelineId}:`, error);
    throw error;
  }
}

// Listar Estágios
async function list_stages(params: any) {
  try {
    console.error('Listando estágios com parâmetros:', params);
    return await apiClient.get('/stages', params);
  } catch (error) {
    console.error('Erro ao listar estágios:', error);
    throw error;
  }
}

// Listar Produtos
async function list_products(params: any) {
  try {
    console.error('Listando produtos com parâmetros:', params);
    return await apiClient.get('/items', params); // Endpoint correto: /items
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    throw error;
  }
}

/**
 * Mapeamento de ferramentas para funções
 */
const toolHandlers: Record<string, Function> = {
  'list-deals': list_deals,
  'get-deal': get_deal,
  'list-persons': list_persons,
  'get-person': get_person,
  'list-organizations': list_organizations,
  'get-organization': get_organization,
  'list-pipelines': list_pipelines,
  'get-pipeline': get_pipeline,
  'list-stages': list_stages,
  'list-products': list_products
};

/**
 * Processador de comandos JSON-RPC
 */
async function processCommand(command: string) {
  try {
    // Converter string para JSON
    const request = JSON.parse(command);
    const { id, method, params } = request;

    console.error(`Processando comando: ${method}`, id);

    // Procurar o método no formato execute.{ferramenta}
    if (method.startsWith('execute.')) {
      const toolId = method.substring('execute.'.length);
      const handler = toolHandlers[toolId];

      if (handler) {
        console.error(`Executando ferramenta: ${toolId}`, params);
        const result = await handler(params);
        return JSON.stringify({ id, result });
      } else {
        console.error(`Ferramenta não encontrada: ${toolId}`);
        return JSON.stringify({
          id,
          error: { code: -32601, message: `Ferramenta não encontrada: ${toolId}` }
        });
      }
    }

    // Método desconhecido
    return JSON.stringify({
      id,
      error: { code: -32601, message: `Método desconhecido: ${method}` }
    });
  } catch (error) {
    console.error('Erro ao processar comando:', error);
    return JSON.stringify({
      error: { code: -32700, message: 'Erro de parse JSON' }
    });
  }
}

/**
 * Configuração da entrada/saída
 */
process.stdin.resume();
process.stdin.setEncoding('utf8');

// Buffer para entrada
let inputBuffer = '';

// Ouvinte de dados da entrada padrão
process.stdin.on('data', (chunk) => {
  // Adicionar dados ao buffer
  inputBuffer += chunk.toString();
  
  // Processar linhas completas
  const lines = inputBuffer.split('\n');
  
  // Processar todas as linhas completas exceto a última
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Processar comando
    processCommand(line).then(response => {
      // Enviar resposta
      process.stdout.write(response + '\n');
    });
  }
  
  // Guardar a última linha (possivelmente incompleta)
  inputBuffer = lines[lines.length - 1];
});

console.error('Servidor Piperun MCP iniciado e aguardando comandos...');
