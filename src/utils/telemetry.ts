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
    
    this.metrics.push(metric);
    
    // Limitar o número de métricas armazenadas
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
    
    return id;
  }
  
  /**
   * Finaliza o monitoramento de uma operação com sucesso
   * @param id ID da operação
   * @param additionalMetadata Metadados adicionais para registrar
   */
  endOperation(id: string, additionalMetadata?: Record<string, any>): void {
    const operationIndex = this.getOperationIndex(id);
    if (operationIndex === -1) {
      this.logger.warn(`Operação com ID ${id} não encontrada`);
      return;
    }
    
    const metric = this.metrics[operationIndex];
    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.success = true;
    
    if (additionalMetadata) {
      metric.metadata = {
        ...metric.metadata,
        ...additionalMetadata
      };
    }
    
    // Registrar métricas para operações lentas (> 1000ms)
    if (metric.duration > 1000) {
      this.logger.warn(`Operação lenta detectada: ${metric.operation}`, {
        duration: metric.duration,
        metadata: metric.metadata
      });
    }
  }
  
  /**
   * Registra uma falha em uma operação
   * @param id ID da operação
   * @param error Erro ocorrido
   * @param additionalMetadata Metadados adicionais para registrar
   */
  failOperation(id: string, error: Error, additionalMetadata?: Record<string, any>): void {
    const operationIndex = this.getOperationIndex(id);
    if (operationIndex === -1) {
      this.logger.warn(`Operação com ID ${id} não encontrada`);
      return;
    }
    
    const metric = this.metrics[operationIndex];
    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.success = false;
    metric.error = error;
    
    if (additionalMetadata) {
      metric.metadata = {
        ...metric.metadata,
        ...additionalMetadata
      };
    }
    
    this.logger.error(`Falha na operação: ${metric.operation}`, {
      duration: metric.duration,
      error: error.message,
      metadata: metric.metadata
    });
  }
  
  /**
   * Obtém estatísticas de desempenho
   * @returns Estatísticas de desempenho
   */
  getStats(): Record<string, any> {
    // Contagem total de operações
    const totalOperations = this.metrics.length;
    
    // Contagem de operações bem-sucedidas
    const successfulOperations = this.metrics.filter(m => m.success).length;
    
    // Contagem de operações com falha
    const failedOperations = totalOperations - successfulOperations;
    
    // Taxa de sucesso
    const successRate = totalOperations > 0 
      ? (successfulOperations / totalOperations) * 100
      : 0;
    
    // Agrupar métricas por tipo de operação
    const operationTypes = new Set(this.metrics.map(m => m.operation));
    const operationStats: Record<string, { count: number, averageDuration: number }> = {};
    
    for (const operation of operationTypes) {
      const operationMetrics = this.metrics.filter(m => m.operation === operation && m.duration !== undefined);
      const count = operationMetrics.length;
      
      const totalDuration = operationMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
      const averageDuration = count > 0 ? totalDuration / count : 0;
      
      operationStats[operation] = {
        count,
        averageDuration
      };
    }
    
    return {
      totalOperations,
      successfulOperations,
      failedOperations,
      successRate,
      operationStats
    };
  }
  
  /**
   * Obtém o índice de uma operação pelo ID
   * @param id ID da operação
   * @returns Índice da operação ou -1 se não encontrada
   */
  private getOperationIndex(id: string): number {
    const parts = id.split('-');
    const operation = parts[0];
    const timestamp = parseInt(parts[1], 10);
    
    // Encontrar a métrica correspondente
    // Buscamos pela combinação de operação e timestamp
    return this.metrics.findIndex(m => 
      m.operation === operation && 
      Math.abs(m.startTime - timestamp) < 100 // Tolerância de tempo
    );
  }
}
