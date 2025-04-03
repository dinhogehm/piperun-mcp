import axios from 'axios';
import { env } from '../config/env.js';
import { Logger } from '../utils/logger.js';
import { Telemetry } from '../utils/telemetry.js';

// Cliente HTTP para a API do Piperun
const api = axios.create({
  baseURL: env.PIPERUN_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Adicionar token de API em cada requisição seguindo exatamente o formato esperado pelo Piperun
api.interceptors.request.use(config => {
  // Remover qualquer trailing slash da URL base para garantir consistência
  if (config.url?.endsWith('/')) {
    config.url = config.url.slice(0, -1);
  }
  
  // Adicionar o token como parâmetro na URL usando o parâmetro correto "token"
  const separator = config.url?.includes('?') ? '&' : '?';
  config.url = `${config.url}${separator}token=${env.PIPERUN_API_KEY}`;
  
  return config;
});

// Interface genérica para respostas da API do Piperun
interface PiperunResponse<T> {
  data: T;
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    }
  }
}

/**
 * Serviço para interagir com a API do Piperun
 * Implementa uma interface padronizada para todas as operações da API
 */
export class PiperunApiService {
  private logger: Logger;
  private telemetry: Telemetry;
  private apiStats: {
    totalOperations: number;
    successfulOperations: number;
    failedOperations: number;
    successRate: number;
    operationStats: Record<string, { count: number; averageDuration: number }>;
  };
  
  constructor() {
    this.logger = new Logger('PiperunApiService');
    this.telemetry = new Telemetry('PiperunAPI');
    this.apiStats = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      successRate: 0,
      operationStats: {}
    };
  }

  /**
   * Retorna as estatísticas da API
   */
  getApiStats() {
    return { ...this.apiStats };
  }

  /**
   * Lista negócios (deals) com suporte a paginação e filtros
   */
  async listDeals(params: {
    page?: number;
    show?: number;
    person_id?: number;
    [key: string]: any;
  } = {}) {
    const opId = this.telemetry.startOperation('listDeals', { params });
    
    try {
      this.logger.info('Listando negócios', { params });
      
      const response = await api.get<PiperunResponse<any[]>>('/deals', { params });
      
      this.telemetry.endOperation(opId, { success: true, resultCount: response.data.data.length });
      this.updateApiStats('listDeals', true, this.telemetry.getOperationDuration(opId));
      
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao listar negócios', error);
      this.telemetry.endOperation(opId, { success: false, error });
      this.updateApiStats('listDeals', false, this.telemetry.getOperationDuration(opId));
      throw error;
    }
  }

  /**
   * Obtém detalhes de um negócio específico
   */
  async getDeal(dealId: number) {
    const opId = this.telemetry.startOperation('getDeal', { dealId });
    
    try {
      this.logger.info('Obtendo detalhes do negócio', { dealId });
      
      const response = await api.get(`/deals/${dealId}`);
      
      this.telemetry.endOperation(opId, { success: true });
      this.updateApiStats('getDeal', true, this.telemetry.getOperationDuration(opId));
      
      return response.data.data;
    } catch (error) {
      this.logger.error('Erro ao obter detalhes do negócio', error);
      this.telemetry.endOperation(opId, { success: false, error });
      this.updateApiStats('getDeal', false, this.telemetry.getOperationDuration(opId));
      throw error;
    }
  }

  /**
   * Atualiza um negócio existente
   */
  async updateDeal(dealId: number, data: any) {
    const opId = this.telemetry.startOperation('updateDeal', { dealId });
    
    try {
      this.logger.info('Atualizando negócio', { dealId, data });
      
      const response = await api.put(`/deals/${dealId}`, data);
      
      this.telemetry.endOperation(opId, { success: true });
      this.updateApiStats('updateDeal', true, this.telemetry.getOperationDuration(opId));
      
      return response.data.data;
    } catch (error) {
      this.logger.error('Erro ao atualizar negócio', error);
      this.telemetry.endOperation(opId, { success: false, error });
      this.updateApiStats('updateDeal', false, this.telemetry.getOperationDuration(opId));
      throw error;
    }
  }

  /**
   * Lista funis (pipelines) com suporte a paginação
   */
  async listPipelines(params: {
    page?: number;
    show?: number;
    [key: string]: any;
  } = {}) {
    const opId = this.telemetry.startOperation('listPipelines', { params });
    
    try {
      this.logger.info('Listando funis', { params });
      
      const response = await api.get<PiperunResponse<any[]>>('/pipelines', { params });
      
      this.telemetry.endOperation(opId, { success: true, resultCount: response.data.data.length });
      this.updateApiStats('listPipelines', true, this.telemetry.getOperationDuration(opId));
      
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao listar funis', error);
      this.telemetry.endOperation(opId, { success: false, error });
      this.updateApiStats('listPipelines', false, this.telemetry.getOperationDuration(opId));
      throw error;
    }
  }

  /**
   * Lista etapas (stages) com suporte a paginação e filtro por funil
   */
  async listStages(params: {
    pipeline_id?: number;
    page?: number;
    show?: number;
    [key: string]: any;
  } = {}) {
    const opId = this.telemetry.startOperation('listStages', { params });
    
    try {
      this.logger.info('Listando etapas', { params });
      
      const response = await api.get<PiperunResponse<any[]>>('/stages', { params });
      
      this.telemetry.endOperation(opId, { success: true, resultCount: response.data.data.length });
      this.updateApiStats('listStages', true, this.telemetry.getOperationDuration(opId));
      
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao listar etapas', error);
      this.telemetry.endOperation(opId, { success: false, error });
      this.updateApiStats('listStages', false, this.telemetry.getOperationDuration(opId));
      throw error;
    }
  }

  /**
   * Lista produtos (items) com suporte a paginação
   */
  async listProducts(params: {
    page?: number;
    show?: number;
    name?: string;
    [key: string]: any;
  } = {}) {
    const opId = this.telemetry.startOperation('listProducts', { params });
    
    try {
      this.logger.info('Listando produtos', { params });
      
      const response = await api.get<PiperunResponse<any[]>>('/items', { params });
      
      this.telemetry.endOperation(opId, { success: true, resultCount: response.data.data.length });
      this.updateApiStats('listProducts', true, this.telemetry.getOperationDuration(opId));
      
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao listar produtos', error);
      this.telemetry.endOperation(opId, { success: false, error });
      this.updateApiStats('listProducts', false, this.telemetry.getOperationDuration(opId));
      throw error;
    }
  }

  /**
   * Lista contatos (people) com suporte a paginação e filtros
   */
  async listContacts(params: {
    page?: number;
    show?: number;
    name?: string;
    email?: string;
    [key: string]: any;
  } = {}) {
    const opId = this.telemetry.startOperation('listContacts', { params });
    
    try {
      this.logger.info('Listando contatos', { params });
      
      const response = await api.get<PiperunResponse<any[]>>('/people', { params });
      
      this.telemetry.endOperation(opId, { success: true, resultCount: response.data.data.length });
      this.updateApiStats('listContacts', true, this.telemetry.getOperationDuration(opId));
      
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao listar contatos', error);
      this.telemetry.endOperation(opId, { success: false, error });
      this.updateApiStats('listContacts', false, this.telemetry.getOperationDuration(opId));
      throw error;
    }
  }

  /**
   * Atualiza as estatísticas de operações da API
   */
  private updateApiStats(operation: string, success: boolean, duration: number) {
    this.apiStats.totalOperations++;
    
    if (success) {
      this.apiStats.successfulOperations++;
    } else {
      this.apiStats.failedOperations++;
    }
    
    this.apiStats.successRate = this.apiStats.successfulOperations / this.apiStats.totalOperations;
    
    if (!this.apiStats.operationStats[operation]) {
      this.apiStats.operationStats[operation] = {
        count: 0,
        averageDuration: 0
      };
    }
    
    const stats = this.apiStats.operationStats[operation];
    stats.count++;
    
    // Recalcular a duração média
    stats.averageDuration = 
      ((stats.averageDuration * (stats.count - 1)) + duration) / stats.count;
  }
}
