/**
 * Utilitários para adaptar handlers ao formato esperado pelo SDK MCP
 *
 * Este arquivo fornece funções para adaptar os handlers existentes para o formato
 * esperado pelo SDK do Model Context Protocol.
 */
/**
 * Adapta um handler que espera parâmetros específicos para o formato de request do MCP
 * @param handler Handler original que espera parâmetros específicos
 * @returns Handler adaptado que extrai os parâmetros da requisição MCP
 */
export function adaptHandler(handler) {
    return (request) => {
        // Extrai os parâmetros da requisição e passa para o handler original
        if (!request.params) {
            // @ts-ignore - Ignora erro de tipo se o handler não esperar parâmetros
            return handler();
        }
        return handler(request.params);
    };
}
/**
 * Adapta um handler que espera um objeto de parâmetros específico
 * @param handler Handler original que espera um objeto de parâmetros
 * @returns Handler adaptado que extrai os parâmetros da requisição MCP
 */
export function adaptObjectParamsHandler(handler) {
    return (request) => {
        return handler(request.params || {});
    };
}
/**
 * Adapta um handler que espera múltiplos parâmetros nomeados
 * @param handler Handler original que espera múltiplos parâmetros específicos
 * @returns Handler adaptado que extrai os parâmetros da requisição MCP
 */
export function adaptNamedParamsHandler(handler) {
    return (request) => {
        return handler(request.params || {});
    };
}
//# sourceMappingURL=mcp-handler.util.js.map