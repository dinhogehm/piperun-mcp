/**
 * Utilitários para adaptar handlers ao formato esperado pelo SDK MCP
 * 
 * Este arquivo fornece funções para adaptar os handlers existentes para o formato
 * esperado pelo SDK do Model Context Protocol.
 */

import { z } from 'zod';

type AnyHandler = (...args: any[]) => any;

/**
 * Adapta um handler que espera parâmetros específicos para o formato de request do MCP
 * @param handler Handler original que espera parâmetros específicos
 * @returns Handler adaptado que extrai os parâmetros da requisição MCP
 */
export function adaptHandler<T extends AnyHandler>(handler: T): (request: { method: string; params?: any }) => ReturnType<T> {
  return (request: { method: string; params?: any }) => {
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
export function adaptObjectParamsHandler<T extends Record<string, any>>(
  handler: (params: T) => any
): (request: { method: string; params?: any }) => ReturnType<typeof handler> {
  return (request: { method: string; params?: any }) => {
    return handler(request.params || {} as T);
  };
}

/**
 * Adapta um handler que espera múltiplos parâmetros nomeados
 * @param handler Handler original que espera múltiplos parâmetros específicos
 * @returns Handler adaptado que extrai os parâmetros da requisição MCP
 */
export function adaptNamedParamsHandler<T extends Record<string, any>>(
  handler: (namedParams: T) => any
): (request: { method: string; params?: any }) => ReturnType<typeof handler> {
  return (request: { method: string; params?: any }) => {
    return handler(request.params || {} as T);
  };
}
