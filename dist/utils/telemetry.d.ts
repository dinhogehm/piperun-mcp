/**
 * Classe para monitoramento e telemetria do servidor MCP
 *
 * Implementa funcionalidades para:
 * - Monitorar tempo de execução de operações
 * - Registrar métricas de desempenho
 * - Coletar estatísticas de uso
 */
export declare class Telemetry {
    private logger;
    private metrics;
    private readonly maxMetrics;
    private activeOperations;
    /**
     * Cria uma instância da classe de telemetria
     * @param context Contexto para o logger
     * @param maxMetrics Número máximo de métricas a armazenar em memória
     */
    constructor(context: string, maxMetrics?: number);
    /**
     * Inicia o monitoramento de uma operação
     * @param operation Nome da operação a monitorar
     * @param metadata Metadados adicionais sobre a operação
     * @returns ID da operação para referência
     */
    startOperation(operation: string, metadata?: Record<string, any>): string;
    /**
     * Finaliza o monitoramento de uma operação
     * @param id ID da operação retornado por startOperation
     * @param metadata Metadados adicionais sobre o resultado da operação
     */
    endOperation(id: string, metadata?: Record<string, any>): void;
    /**
     * Registra uma falha em uma operação
     * @param id ID da operação retornado por startOperation
     * @param error Erro ocorrido
     * @param metadata Metadados adicionais sobre o erro
     */
    failOperation(id: string, error: Error, metadata?: Record<string, any>): void;
    /**
     * Obtém a duração de uma operação (ativa ou finalizada)
     * @param id ID da operação retornado por startOperation
     * @returns Duração em milissegundos ou 0 se operação não encontrada
     */
    getOperationDuration(id: string): number;
    /**
     * Adiciona uma métrica ao histórico
     * @param metric Métrica a ser adicionada
     */
    private addMetric;
    /**
     * Retorna estatísticas gerais do telemetria
     */
    getStats(): Record<string, any>;
}
