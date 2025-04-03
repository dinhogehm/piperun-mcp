interface PiperunResponse<T> {
    data: T;
    meta: {
        pagination: {
            total: number;
            count: number;
            per_page: number;
            current_page: number;
            total_pages: number;
        };
    };
}
/**
 * Serviço para interagir com a API do Piperun
 * Implementa uma interface padronizada para todas as operações da API
 */
export declare class PiperunApiService {
    private logger;
    private telemetry;
    private apiStats;
    constructor();
    /**
     * Retorna as estatísticas da API
     */
    getApiStats(): {
        totalOperations: number;
        successfulOperations: number;
        failedOperations: number;
        successRate: number;
        operationStats: Record<string, {
            count: number;
            averageDuration: number;
        }>;
    };
    /**
     * Lista negócios (deals) com suporte a paginação e filtros
     */
    listDeals(params?: {
        page?: number;
        show?: number;
        person_id?: number;
        [key: string]: any;
    }): Promise<PiperunResponse<any[]>>;
    /**
     * Obtém detalhes de um negócio específico
     */
    getDeal(dealId: number): Promise<any>;
    /**
     * Atualiza um negócio existente
     */
    updateDeal(dealId: number, data: any): Promise<any>;
    /**
     * Lista funis (pipelines) com suporte a paginação
     */
    listPipelines(params?: {
        page?: number;
        show?: number;
        [key: string]: any;
    }): Promise<PiperunResponse<any[]>>;
    /**
     * Lista etapas (stages) com suporte a paginação e filtro por funil
     */
    listStages(params?: {
        pipeline_id?: number;
        page?: number;
        show?: number;
        [key: string]: any;
    }): Promise<PiperunResponse<any[]>>;
    /**
     * Lista produtos (items) com suporte a paginação
     */
    listProducts(params?: {
        page?: number;
        show?: number;
        name?: string;
        [key: string]: any;
    }): Promise<PiperunResponse<any[]>>;
    /**
     * Lista contatos (people) com suporte a paginação e filtros
     */
    listContacts(params?: {
        page?: number;
        show?: number;
        name?: string;
        email?: string;
        [key: string]: any;
    }): Promise<PiperunResponse<any[]>>;
    /**
     * Lista usuários da conta Piperun com suporte a paginação e filtros
     */
    listUsers(params?: {
        page?: number;
        show?: number;
        [key: string]: any;
    }): Promise<PiperunResponse<any[]>>;
    /**
     * Atualiza as estatísticas de operações da API
     */
    private updateApiStats;
}
export {};
