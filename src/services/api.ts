/**
 * Serviço para comunicação com a API do Piperun
 */

import axios from 'axios';
import { API_BASE_URL, AUTH_CONFIG } from '../config/api.ts';
import type { 
  PiperunResponse, 
  Deal, 
  Pipeline, 
  Stage, 
  Product,
  Contact,
  StatusResponse
} from '../types/index.ts';

// Configuração do cliente HTTP
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use((config) => {
  if (AUTH_CONFIG.apiKey) {
    config.params = { ...config.params, token: AUTH_CONFIG.apiKey };
  }
  return config;
});

/**
 * Função para listar negócios (deals) com filtragem opcional
 */
export async function listDeals(params: {
  pipeline_id?: number;
  stage_id?: number;
  person_id?: number;
  title?: string;
  status?: string;
  page?: number;
  show?: number;
}): Promise<PiperunResponse<Deal>> {
  try {
    console.log('Buscando negócios com parâmetros:', params);
    const response = await apiClient.get('/deals', { params });
    console.log(`Encontrados ${response.data.data?.length || 0} negócios`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar negócios:', error);
    throw new Error(`Falha ao buscar negócios: ${error.message}`);
  }
}

/**
 * Função para listar pipelines
 */
export async function listPipelines(params: {
  page?: number;
  show?: number;
}): Promise<PiperunResponse<Pipeline>> {
  try {
    console.log('Buscando pipelines com parâmetros:', params);
    const response = await apiClient.get('/pipelines', { params });
    console.log(`Encontrados ${response.data.data?.length || 0} pipelines`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pipelines:', error);
    throw new Error(`Falha ao buscar pipelines: ${error.message}`);
  }
}

/**
 * Função para listar etapas (stages) de um pipeline
 */
export async function listStages(params: {
  pipeline_id: number;
  page?: number;
  show?: number;
}): Promise<PiperunResponse<Stage>> {
  try {
    console.log('Buscando etapas com parâmetros:', params);
    const { pipeline_id, ...queryParams } = params;
    const response = await apiClient.get(`/pipelines/${pipeline_id}/stages`, { params: queryParams });
    console.log(`Encontradas ${response.data.data?.length || 0} etapas`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar etapas:', error);
    throw new Error(`Falha ao buscar etapas: ${error.message}`);
  }
}

/**
 * Função para listar produtos
 */
export async function listProducts(params: {
  name?: string;
  page?: number;
  show?: number;
}): Promise<PiperunResponse<Product>> {
  try {
    console.log('Buscando produtos com parâmetros:', params);
    const response = await apiClient.get('/items', { params });
    console.log(`Encontrados ${response.data.data?.length || 0} produtos`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error(`Falha ao buscar produtos: ${error.message}`);
  }
}

/**
 * Função para listar contatos
 */
export async function listContacts(params: {
  name?: string;
  email?: string;
  page?: number;
  show?: number;
}): Promise<PiperunResponse<Contact>> {
  try {
    console.log('Buscando contatos com parâmetros:', params);
    const response = await apiClient.get('/contacts', { params });
    console.log(`Encontrados ${response.data.data?.length || 0} contatos`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    throw new Error(`Falha ao buscar contatos: ${error.message}`);
  }
}

/**
 * Função para verificar status da API
 */
export async function checkApiStatus(): Promise<StatusResponse> {
  try {
    console.log('Verificando status da API do Piperun');
    const response = await apiClient.get('/');
    return {
      status: 'success',
      message: 'API do Piperun está online e respondendo'
    };
  } catch (error) {
    console.error('Erro ao verificar status da API:', error);
    return {
      status: 'error',
      message: `API do Piperun não está respondendo: ${error.message}`
    };
  }
}
