import axios from 'axios';
import { env } from '../config/env';
import { Logger } from '../utils/logger';
import { Telemetry } from '../utils/telemetry';

// Cliente HTTP para a API do Piperun
const api = axios.create({
  baseURL: env.PIPERUN_API_URL,
  params: {
    api_token: env.PIPERUN_API_KEY
  }
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
  
  constructor() {
    this.logger = new Logger('PiperunApiService');
    this.telemetry = new Telemetry('PiperunAPI');
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
      this.logger.info('Buscando negócios', { params });
      const response = await api.get<PiperunResponse<any[]>>('/deals', { params });
      this.logger.info(`Encontrados ${response.data.data.length} negócios`);
      
      this.telemetry.endOperation(opId, { 
        count: response.data.data.length,
        total: response.data.meta.pagination?.total || 0
      });
      
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao listar negócios', error);
      this.telemetry.failOperation(opId, error instanceof Error ? error : new Error('Erro desconhecido'));
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
      this.logger.info('Buscando funis', { params });
      const response = await api.get<PiperunResponse<any[]>>('/pipelines', { params });
      this.logger.info(`Encontrados ${response.data.data.length} funis`);
      
      this.telemetry.endOperation(opId, { 
        count: response.data.data.length,
        total: response.data.meta.pagination?.total || 0
      });
      
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao listar funis', error);
      this.telemetry.failOperation(opId, error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    }
  }

  /**
   * Lista etapas (stages) com suporte a paginação e filtros
   */
  async listStages(params: {
    page?: number;
    show?: number;
    pipeline_id?: number;
    [key: string]: any;
  } = {}) {
    const opId = this.telemetry.startOperation('listStages', { params });
    
    try {
      this.logger.info('Buscando etapas', { params });
      const response = await api.get<PiperunResponse<any[]>>('/stages', { params });
      this.logger.info(`Encontradas ${response.data.data.length} etapas`);
      
      this.telemetry.endOperation(opId, { 
        count: response.data.data.length,
        total: response.data.meta.pagination?.total || 0,
        pipeline_id: params.pipeline_id
      });
      
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao listar etapas', error);
      this.telemetry.failOperation(opId, error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    }
  }

  /**
   * Lista produtos (items) com suporte a paginação
   */
  async listProducts(params: {
    page?: number;
    show?: number;
    [key: string]: any;
  } = {}) {
    const opId = this.telemetry.startOperation('listProducts', { params });
    
    try {
      this.logger.info('Buscando produtos', { params });
      const response = await api.get<PiperunResponse<any[]>>('/items', { params });
      this.logger.info(`Encontrados ${response.data.data.length} produtos`);
      
      this.telemetry.endOperation(opId, { 
        count: response.data.data.length,
        total: response.data.meta.pagination?.total || 0
      });
      
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao listar produtos', error);
      this.telemetry.failOperation(opId, error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    }
  }

  /**
   * Lista contatos (people) com suporte a paginação e filtros
   */
  async listContacts(params: {
    page?: number;
    show?: number;
    [key: string]: any;
  } = {}) {
    const opId = this.telemetry.startOperation('listContacts', { params });
    
    try {
      this.logger.info('Buscando contatos', { params });
      const response = await api.get<PiperunResponse<any[]>>('/people', { params });
      this.logger.info(`Encontrados ${response.data.data.length} contatos`);
      
      this.telemetry.endOperation(opId, { 
        count: response.data.data.length,
        total: response.data.meta.pagination?.total || 0
      });
      
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao listar contatos', error);
      this.telemetry.failOperation(opId, error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    }
  }

  /**
   * Obtém detalhes de um negócio específico
   */
  async getDeal(dealId: number) {
    const opId = this.telemetry.startOperation('getDeal', { dealId });
    
    try {
      this.logger.info(`Buscando detalhes do negócio ${dealId}`);
      const response = await api.get<{ data: any }>(`/deals/${dealId}`);
      this.logger.info(`Detalhes do negócio ${dealId} obtidos com sucesso`);
      
      this.telemetry.endOperation(opId);
      
      return response.data.data;
    } catch (error) {
      this.logger.error(`Erro ao obter negócio ${dealId}`, error);
      this.telemetry.failOperation(opId, error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    }
  }

  /**
   * Atualiza um negócio específico
   */
  async updateDeal(dealId: number, data: any) {
    const opId = this.telemetry.startOperation('updateDeal', { dealId, data });
    
    try {
      this.logger.info(`Atualizando negócio ${dealId}`, { dados: data });
      const response = await api.put<{ data: any }>(`/deals/${dealId}`, data);
      this.logger.info(`Negócio ${dealId} atualizado com sucesso`);
      
      this.telemetry.endOperation(opId);
      
      return response.data.data;
    } catch (error) {
      this.logger.error(`Erro ao atualizar negócio ${dealId}`, error);
      this.telemetry.failOperation(opId, error instanceof Error ? error : new Error('Erro desconhecido'));
      throw error;
    }
  }
  
  /**
   * Obtém estatísticas de desempenho da API
   */
  getApiStats() {
    return this.telemetry.getStats();
  }
}
