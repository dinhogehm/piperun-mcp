/**
 * Implementação oficial do protocolo MCP (Model Context Protocol)
 * Para integração com Windsurf
 */

import * as fs from 'fs';
import * as readline from 'readline';

// Definições de tipos para o protocolo MCP
interface McpTool {
  id: string;
  name: string;
  description: string;
  parameters?: Record<string, McpParameter>;
}

interface McpParameter {
  type: string;
  description: string;
  required: boolean;
  default?: any;
}

interface McpRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params?: any;
}

interface McpResponse {
  jsonrpc: string;
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Servidor MCP
 */
export class McpServer {
  private tools: McpTool[] = [];
  private handlers: Record<string, Function> = {};
  private reader: readline.Interface;
  private writer: NodeJS.WritableStream;

  constructor(
    reader: NodeJS.ReadableStream = process.stdin,
    writer: NodeJS.WritableStream = process.stdout
  ) {
    this.reader = readline.createInterface({
      input: reader,
      terminal: false
    });
    this.writer = writer;
  }

  /**
   * Registra uma ferramenta no servidor MCP
   */
  registerTool(
    tool: McpTool,
    handler: Function
  ): void {
    console.error(`Registrando ferramenta: ${tool.id}`);
    this.tools.push(tool);
    this.handlers[tool.id] = handler;
  }

  /**
   * Inicia o servidor MCP
   */
  start(): void {
    console.error('Iniciando servidor MCP...');
    console.error(`Total de ferramentas registradas: ${this.tools.length}`);
    
    this.reader.on('line', async (line) => {
      if (!line.trim()) return;
      
      try {
        console.error(`Recebendo: ${line}`);
        const request: McpRequest = JSON.parse(line);
        const response = await this.handleRequest(request);
        const responseStr = JSON.stringify(response);
        console.error(`Respondendo: ${responseStr}`);
        this.writer.write(responseStr + '\n');
      } catch (error) {
        console.error('Erro no processamento:', error);
        const errorResponse: McpResponse = {
          jsonrpc: '2.0',
          id: 'error',
          error: {
            code: -32700,
            message: `Erro ao processar a mensagem: ${error}`
          }
        };
        this.writer.write(JSON.stringify(errorResponse) + '\n');
      }
    });

    // Indicar que o servidor está pronto
    console.error('Servidor MCP iniciado com sucesso');
  }

  /**
   * Processa requisições recebidas
   */
  private async handleRequest(request: McpRequest): Promise<McpResponse> {
    const { id, method, params } = request;
    
    try {
      // Listar ferramentas disponíveis
      if (method === 'mcp.listTools') {
        console.error('Listando ferramentas disponíveis');
        return {
          jsonrpc: '2.0',
          id,
          result: this.tools
        };
      }
      
      // Executar uma ferramenta específica
      if (method === 'mcp.runTool') {
        const { tool, parameters } = params;
        const handler = this.handlers[tool];
        
        if (!handler) {
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Ferramenta não encontrada: ${tool}`
            }
          };
        }
        
        console.error(`Executando ferramenta: ${tool}`, parameters);
        const result = await handler(parameters);
        console.error(`Resultado:`, result);
        
        return {
          jsonrpc: '2.0',
          id,
          result
        };
      }
      
      // Método não reconhecido
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Método não reconhecido: ${method}`
        }
      };
    } catch (error: any) {
      // Erro durante o processamento
      console.error('Erro no processamento:', error);
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: error.message || 'Erro interno do servidor'
        }
      };
    }
  }
}

export default McpServer;
