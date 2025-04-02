"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiperunApiService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const telemetry_1 = require("../utils/telemetry");
// Cliente HTTP para a API do Piperun
const api = axios_1.default.create({
    baseURL: env_1.env.PIPERUN_API_URL,
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
    config.url = `${config.url}${separator}token=${env_1.env.PIPERUN_API_KEY}`;
    return config;
});
/**
 * Serviço para interagir com a API do Piperun
 * Implementa uma interface padronizada para todas as operações da API
 */
class PiperunApiService {
    constructor() {
        this.logger = new logger_1.Logger('PiperunApiService');
        this.telemetry = new telemetry_1.Telemetry('PiperunAPI');
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
    async listDeals(params = {}) {
        const opId = this.telemetry.startOperation('listDeals', { params });
        try {
            this.logger.info('Listando negócios', { params });
            const response = await api.get('/deals', { params });
            this.telemetry.endOperation(opId, { success: true, resultCount: response.data.data.length });
            this.updateApiStats('listDeals', true, this.telemetry.getOperationDuration(opId));
            return response.data;
        }
        catch (error) {
            this.logger.error('Erro ao listar negócios', error);
            this.telemetry.endOperation(opId, { success: false, error });
            this.updateApiStats('listDeals', false, this.telemetry.getOperationDuration(opId));
            throw error;
        }
    }
    /**
     * Obtém detalhes de um negócio específico
     */
    async getDeal(dealId) {
        const opId = this.telemetry.startOperation('getDeal', { dealId });
        try {
            this.logger.info('Obtendo detalhes do negócio', { dealId });
            const response = await api.get(`/deals/${dealId}`);
            this.telemetry.endOperation(opId, { success: true });
            this.updateApiStats('getDeal', true, this.telemetry.getOperationDuration(opId));
            return response.data.data;
        }
        catch (error) {
            this.logger.error('Erro ao obter detalhes do negócio', error);
            this.telemetry.endOperation(opId, { success: false, error });
            this.updateApiStats('getDeal', false, this.telemetry.getOperationDuration(opId));
            throw error;
        }
    }
    /**
     * Atualiza um negócio existente
     */
    async updateDeal(dealId, data) {
        const opId = this.telemetry.startOperation('updateDeal', { dealId });
        try {
            this.logger.info('Atualizando negócio', { dealId, data });
            const response = await api.put(`/deals/${dealId}`, data);
            this.telemetry.endOperation(opId, { success: true });
            this.updateApiStats('updateDeal', true, this.telemetry.getOperationDuration(opId));
            return response.data.data;
        }
        catch (error) {
            this.logger.error('Erro ao atualizar negócio', error);
            this.telemetry.endOperation(opId, { success: false, error });
            this.updateApiStats('updateDeal', false, this.telemetry.getOperationDuration(opId));
            throw error;
        }
    }
    /**
     * Lista funis (pipelines) com suporte a paginação
     */
    async listPipelines(params = {}) {
        const opId = this.telemetry.startOperation('listPipelines', { params });
        try {
            this.logger.info('Listando funis', { params });
            const response = await api.get('/pipelines', { params });
            this.telemetry.endOperation(opId, { success: true, resultCount: response.data.data.length });
            this.updateApiStats('listPipelines', true, this.telemetry.getOperationDuration(opId));
            return response.data;
        }
        catch (error) {
            this.logger.error('Erro ao listar funis', error);
            this.telemetry.endOperation(opId, { success: false, error });
            this.updateApiStats('listPipelines', false, this.telemetry.getOperationDuration(opId));
            throw error;
        }
    }
    /**
     * Lista etapas (stages) com suporte a paginação e filtro por funil
     */
    async listStages(params = {}) {
        const opId = this.telemetry.startOperation('listStages', { params });
        try {
            this.logger.info('Listando etapas', { params });
            const response = await api.get('/stages', { params });
            this.telemetry.endOperation(opId, { success: true, resultCount: response.data.data.length });
            this.updateApiStats('listStages', true, this.telemetry.getOperationDuration(opId));
            return response.data;
        }
        catch (error) {
            this.logger.error('Erro ao listar etapas', error);
            this.telemetry.endOperation(opId, { success: false, error });
            this.updateApiStats('listStages', false, this.telemetry.getOperationDuration(opId));
            throw error;
        }
    }
    /**
     * Lista produtos (items) com suporte a paginação
     */
    async listProducts(params = {}) {
        const opId = this.telemetry.startOperation('listProducts', { params });
        try {
            this.logger.info('Listando produtos', { params });
            const response = await api.get('/items', { params });
            this.telemetry.endOperation(opId, { success: true, resultCount: response.data.data.length });
            this.updateApiStats('listProducts', true, this.telemetry.getOperationDuration(opId));
            return response.data;
        }
        catch (error) {
            this.logger.error('Erro ao listar produtos', error);
            this.telemetry.endOperation(opId, { success: false, error });
            this.updateApiStats('listProducts', false, this.telemetry.getOperationDuration(opId));
            throw error;
        }
    }
    /**
     * Lista contatos (people) com suporte a paginação e filtros
     */
    async listContacts(params = {}) {
        const opId = this.telemetry.startOperation('listContacts', { params });
        try {
            this.logger.info('Listando contatos', { params });
            const response = await api.get('/people', { params });
            this.telemetry.endOperation(opId, { success: true, resultCount: response.data.data.length });
            this.updateApiStats('listContacts', true, this.telemetry.getOperationDuration(opId));
            return response.data;
        }
        catch (error) {
            this.logger.error('Erro ao listar contatos', error);
            this.telemetry.endOperation(opId, { success: false, error });
            this.updateApiStats('listContacts', false, this.telemetry.getOperationDuration(opId));
            throw error;
        }
    }
    /**
     * Atualiza as estatísticas de operações da API
     */
    updateApiStats(operation, success, duration) {
        this.apiStats.totalOperations++;
        if (success) {
            this.apiStats.successfulOperations++;
        }
        else {
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
exports.PiperunApiService = PiperunApiService;
//# sourceMappingURL=piperunApi.js.map