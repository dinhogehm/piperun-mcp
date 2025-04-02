import { Logger } from './logger';

/**
 * Interface para métrica de desempenho
 */
interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: Error;
  metadata?: Record<string, any>;
}

/**
 * Classe para monitoramento e telemetria do servidor MCP
 * 
 * Implementa funcionalidades para:
 * - Monitorar tempo de execução de operações
 * - Registrar métricas de desempenho
 * - Coletar estatísticas de uso
 */
export class Telemetry {
  private logger: Logger;
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics: number;
  private activeOperations: Map<string, PerformanceMetric> = new Map();
  
  /**
   * Cria uma instância da classe de telemetria
   * @param context Contexto para o logger
   * @param maxMetrics Número máximo de métricas a armazenar em memória
   */
  constructor(context: string, maxMetrics: number = 1000) {
    this.logger = new Logger(`Telemetry:${context}`);
    this.maxMetrics = maxMetrics;
  }
  
  /**
   * Inicia o monitoramento de uma operação
   * @param operation Nome da operação a monitorar
   * @param metadata Metadados adicionais sobre a operação
   * @returns ID da operação para referência
   */
  startOperation(operation: string, metadata?: Record<string, any>): string {
    const id = `${operation}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const metric: PerformanceMetric = {
      operation,
      startTime: Date.now(),
      success: false,
      metadata
    };
    
    this.activeOperations.set(id, metric);
    
    this.logger.debug(`Operação iniciada: ${operation}`, { id, metadata });
    
    return id;
  }
  
  /**
   * Finaliza o monitoramento de uma operação
   * @param id ID da operação retornado por startOperation
   * @param metadata Metadados adicionais sobre o resultado da operação
   */
  endOperation(id: string, metadata?: Record<string, any>): void {
    const metric = this.activeOperations.get(id);
    
    if (!metric) {
      this.logger.warn(`Tentativa de finalizar operação não encontrada: ${id}`);
      return;
    }
    
    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.success = metadata?.success !== false; // Sucesso por padrão, a menos que explicitamente falhe
    
    if (metadata) {
      metric.metadata = { ...metric.metadata, ...metadata };
    }
    
    this.activeOperations.delete(id);
    
    // Adicionar métrica ao histórico
    this.addMetric(metric);
    
    const durationMs = metric.duration;
    this.logger.debug(
      `Operação finalizada: ${metric.operation}`, 
      { id, duração: `${durationMs}ms`, success: metric.success, metadata }
    );
  }
  
  /**
   * Registra uma falha em uma operação
   * @param id ID da operação retornado por startOperation
   * @param error Erro ocorrido
   * @param metadata Metadados adicionais sobre o erro
   */
  failOperation(id: string, error: Error, metadata?: Record<string, any>): void {
    const metric = this.activeOperations.get(id);
    
    if (!metric) {
      this.logger.warn(`Tentativa de registrar falha em operação não encontrada: ${id}`);
      return;
    }
    
    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.success = false;
    metric.error = error;
    
    if (metadata) {
      metric.metadata = { ...metric.metadata, ...metadata };
    }
    
    this.activeOperations.delete(id);
    
    // Adicionar métrica ao histórico
    this.addMetric(metric);
    
    const durationMs = metric.duration;
    this.logger.error(
      `Operação falhou: ${metric.operation}`,
      { id, duração: `${durationMs}ms`, error: error.message, metadata }
    );
  }

  /**
   * Obtém a duração de uma operação (ativa ou finalizada)
   * @param id ID da operação retornado por startOperation
   * @returns Duração em milissegundos ou 0 se operação não encontrada
   */
  getOperationDuration(id: string): number {
    // Tentar encontrar na lista de operações ativas
    const activeMetric = this.activeOperations.get(id);
    if (activeMetric) {
      // Se ainda estiver ativa, calcular a duração até agora
      return Date.now() - activeMetric.startTime;
    }
    
    // Tentar encontrar nas métricas finalizadas
    const finishedMetric = this.metrics.find(metric => 
      metric.metadata && 'id' in metric.metadata && metric.metadata.id === id
    );
    
    if (finishedMetric && finishedMetric.duration) {
      return finishedMetric.duration;
    }
    
    return 0; // Não encontrado
  }
  
  /**
   * Adiciona uma métrica ao histórico
   * @param metric Métrica a ser adicionada
   */
  private addMetric(metric: PerformanceMetric): void {
    // Adicionar ao início do array para acesso mais rápido às métricas recentes
    this.metrics.unshift({ ...metric });
    
    // Limitar o número de métricas armazenadas
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.pop();
    }
  }
  
  /**
   * Retorna estatísticas gerais do telemetria
   */
  getStats(): Record<string, any> {
    // Contagens
    const total = this.metrics.length;
    const successful = this.metrics.filter(m => m.success).length;
    const failed = total - successful;
    const successRate = total > 0 ? (successful / total) : 0;
    
    // Operações
    const operationCounts: Record<string, number> = {};
    const operationDurations: Record<string, number[]> = {};
    
    // Agrupar métricas por operação
    this.metrics.forEach(metric => {
      const op = metric.operation;
      
      if (!operationCounts[op]) {
        operationCounts[op] = 0;
        operationDurations[op] = [];
      }
      
      operationCounts[op]++;
      
      if (metric.duration) {
        operationDurations[op].push(metric.duration);
      }
    });
    
    // Calcular duração média por operação
    const operationAvgDurations: Record<string, number> = {};
    Object.keys(operationDurations).forEach(op => {
      const durations = operationDurations[op];
      if (durations.length > 0) {
        const total = durations.reduce((sum, duration) => sum + duration, 0);
        operationAvgDurations[op] = Math.round(total / durations.length);
      } else {
        operationAvgDurations[op] = 0;
      }
    });
    
    return {
      total,
      successful,
      failed,
      successRate,
      operations: Object.keys(operationCounts).map(op => ({
        name: op,
        count: operationCounts[op],
        avgDuration: operationAvgDurations[op]
      }))
    };
  }
}
