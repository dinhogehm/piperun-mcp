/**
 * Utilitário para logs padronizados
 *
 * Implementa um logger simples e consistente para o servidor MCP
 */
export declare class Logger {
    private context;
    /**
     * Cria uma instância do logger
     * @param context Contexto do logger (geralmente o nome da classe ou módulo)
     */
    constructor(context: string);
    /**
     * Formata a mensagem de log com data, hora e contexto
     * @param level Nível do log (info, warn, error)
     * @param message Mensagem de log
     * @returns Mensagem formatada
     */
    private format;
    /**
     * Registra uma mensagem de log de depuração
     * @param message Mensagem a ser registrada
     * @param data Dados adicionais (opcional)
     */
    debug(message: string, data?: any): void;
    /**
     * Registra uma mensagem de log informativa
     * @param message Mensagem a ser registrada
     * @param data Dados adicionais (opcional)
     */
    info(message: string, data?: any): void;
    /**
     * Registra uma mensagem de alerta
     * @param message Mensagem a ser registrada
     * @param data Dados adicionais (opcional)
     */
    warn(message: string, data?: any): void;
    /**
     * Registra uma mensagem de erro
     * @param message Mensagem a ser registrada
     * @param error Objeto de erro ou dados adicionais (opcional)
     */
    error(message: string, error?: any): void;
}
