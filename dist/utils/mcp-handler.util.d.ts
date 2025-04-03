/**
 * Utilitários para adaptar handlers ao formato esperado pelo SDK MCP
 *
 * Este arquivo fornece funções para adaptar os handlers existentes para o formato
 * esperado pelo SDK do Model Context Protocol.
 */
type AnyHandler = (...args: any[]) => any;
/**
 * Adapta um handler que espera parâmetros específicos para o formato de request do MCP
 * @param handler Handler original que espera parâmetros específicos
 * @returns Handler adaptado que extrai os parâmetros da requisição MCP
 */
export declare function adaptHandler<T extends AnyHandler>(handler: T): (request: {
    method: string;
    params?: any;
}) => ReturnType<T>;
/**
 * Adapta um handler que espera um objeto de parâmetros específico
 * @param handler Handler original que espera um objeto de parâmetros
 * @returns Handler adaptado que extrai os parâmetros da requisição MCP
 */
export declare function adaptObjectParamsHandler<T extends Record<string, any>>(handler: (params: T) => any): (request: {
    method: string;
    params?: any;
}) => ReturnType<typeof handler>;
/**
 * Adapta um handler que espera múltiplos parâmetros nomeados
 * @param handler Handler original que espera múltiplos parâmetros específicos
 * @returns Handler adaptado que extrai os parâmetros da requisição MCP
 */
export declare function adaptNamedParamsHandler<T extends Record<string, any>>(handler: (namedParams: T) => any): (request: {
    method: string;
    params?: any;
}) => ReturnType<typeof handler>;
export {};
