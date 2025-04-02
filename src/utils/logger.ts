/**
 * Utilitário para logs padronizados
 * 
 * Implementa um logger simples e consistente para o servidor MCP
 */
export class Logger {
  private context: string;
  
  /**
   * Cria uma instância do logger
   * @param context Contexto do logger (geralmente o nome da classe ou módulo)
   */
  constructor(context: string) {
    this.context = context;
  }
  
  /**
   * Formata a mensagem de log com data, hora e contexto
   * @param level Nível do log (info, warn, error)
   * @param message Mensagem de log
   * @returns Mensagem formatada
   */
  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`;
  }
  
  /**
   * Registra uma mensagem de log de depuração
   * @param message Mensagem a ser registrada
   * @param data Dados adicionais (opcional)
   */
  debug(message: string, data?: any): void {
    const formattedMessage = this.format('debug', message);
    if (data) {
      console.debug(formattedMessage, data);
    } else {
      console.debug(formattedMessage);
    }
  }
  
  /**
   * Registra uma mensagem de log informativa
   * @param message Mensagem a ser registrada
   * @param data Dados adicionais (opcional)
   */
  info(message: string, data?: any): void {
    const formattedMessage = this.format('info', message);
    if (data) {
      console.log(formattedMessage, data);
    } else {
      console.log(formattedMessage);
    }
  }
  
  /**
   * Registra uma mensagem de alerta
   * @param message Mensagem a ser registrada
   * @param data Dados adicionais (opcional)
   */
  warn(message: string, data?: any): void {
    const formattedMessage = this.format('warn', message);
    if (data) {
      console.warn(formattedMessage, data);
    } else {
      console.warn(formattedMessage);
    }
  }
  
  /**
   * Registra uma mensagem de erro
   * @param message Mensagem a ser registrada
   * @param error Objeto de erro ou dados adicionais (opcional)
   */
  error(message: string, error?: any): void {
    const formattedMessage = this.format('error', message);
    if (error) {
      console.error(formattedMessage, error);
    } else {
      console.error(formattedMessage);
    }
  }
}
