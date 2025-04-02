/**
 * Implementação do padrão Tools do MCP para integração com Windsurf
 */

import { z, ZodType } from 'zod';

/**
 * Definição de uma ferramenta do protocolo MCP
 */
export class Tool<T = any, R = any> {
  id: string;
  name: string;
  description: string;
  parameters: ZodType<T>;
  handler: (params: T) => Promise<R>;

  constructor(options: {
    id: string;
    name: string;
    description: string;
    parameters: ZodType<T>;
    handler: (params: T) => Promise<R>;
  }) {
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.parameters = options.parameters;
    this.handler = options.handler;
  }

  /**
   * Converte o esquema Zod para formato JSON Schema
   */
  getParametersJsonSchema() {
    const properties: Record<string, any> = {};
    
    // Como o Zod não fornece acesso direto à estrutura interna
    // vamos usar uma abordagem simplificada para objetos
    if (this.parameters instanceof z.ZodObject) {
      const shape = this.parameters.shape as any;
      
      for (const [key, field] of Object.entries(shape)) {
        let property: any = {
          type: this.getJsonSchemaType(field)
        };
        
        // Adicionar description se disponível
        const zodField = field as any;
        if (zodField._def && zodField._def.description) {
          property.description = zodField._def.description;
        }
        
        // Verificar se o campo é opcional
        if (field instanceof z.ZodOptional) {
          property.required = false;
          
          // Se tiver um valor padrão
          if (zodField._def && zodField._def.defaultValue !== undefined) {
            property.default = zodField._def.defaultValue();
          }
        } else {
          property.required = true;
        }
        
        properties[key] = property;
      }
    }
    
    return { 
      type: 'object',
      properties
    };
  }
  
  /**
   * Converte os tipos do Zod para tipos JSON Schema
   */
  private getJsonSchemaType(zodField: any): string {
    if (zodField instanceof z.ZodString) return 'string';
    if (zodField instanceof z.ZodNumber) return 'number';
    if (zodField instanceof z.ZodBoolean) return 'boolean';
    if (zodField instanceof z.ZodArray) return 'array';
    if (zodField instanceof z.ZodObject) return 'object';
    if (zodField instanceof z.ZodOptional) {
      // Se for opcional, verificar o tipo interno
      return this.getJsonSchemaType(zodField._def.innerType);
    }
    
    // Padrão
    return 'string';
  }
  
  /**
   * Retorna a definição da ferramenta no formato esperado pelo Windsurf
   */
  toDefinition() {
    const schema = this.getParametersJsonSchema();
    
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      parameters: schema.properties
    };
  }
  
  /**
   * Executa a ferramenta com os parâmetros fornecidos
   */
  async execute(params: any): Promise<R> {
    try {
      // Validar parâmetros usando Zod
      const validParams = this.parameters.parse(params);
      return await this.handler(validParams);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Parâmetros inválidos: ${error.message}`);
      }
      throw error;
    }
  }
}

/**
 * Implementação simples de um servidor MCP
 */
export class McpServer {
  private tools: Map<string, Tool<any, any>> = new Map();
  
  /**
   * Registra uma ferramenta no servidor
   */
  registerTool(tool: Tool<any, any>) {
    this.tools.set(tool.id, tool);
    console.error(`Ferramenta registrada: ${tool.id}`);
  }
  
  /**
   * Obtém uma ferramenta pelo ID
   */
  getTool(id: string): Tool<any, any> | undefined {
    return this.tools.get(id);
  }
  
  /**
   * Lista todas as ferramentas registradas
   */
  getTools(): Tool<any, any>[] {
    return Array.from(this.tools.values());
  }
  
  /**
   * Lista as definições resumidas das ferramentas
   */
  getToolsDefinitions(): any[] {
    return this.getTools().map(tool => tool.toDefinition());
  }
  
  /**
   * Processa um comando JSON-RPC
   */
  async processCommand(command: string): Promise<string> {
    try {
      const request = JSON.parse(command);
      const { id, method, params } = request;
      
      console.error(`Processando comando: ${method}`, id);
      
      // Método para listar ferramentas
      if (method === 'list-tools') {
        return JSON.stringify({
          id,
          result: this.getToolsDefinitions()
        });
      }
      
      // Método para executar ferramenta
      if (method.startsWith('execute.')) {
        const toolId = method.substring('execute.'.length);
        const tool = this.getTool(toolId);
        
        if (tool) {
          console.error(`Executando ferramenta: ${toolId}`, params);
          try {
            const result = await tool.execute(params);
            return JSON.stringify({ id, result });
          } catch (error: any) {
            console.error(`Erro ao executar ferramenta ${toolId}:`, error);
            return JSON.stringify({
              id,
              error: { 
                code: -32603, 
                message: `Erro ao executar ferramenta: ${error.message}` 
              }
            });
          }
        } else {
          console.error(`Ferramenta não encontrada: ${toolId}`);
          return JSON.stringify({
            id,
            error: { 
              code: -32601, 
              message: `Ferramenta não encontrada: ${toolId}` 
            }
          });
        }
      }
      
      // Método desconhecido
      return JSON.stringify({
        id,
        error: { 
          code: -32601, 
          message: `Método desconhecido: ${method}` 
        }
      });
    } catch (error) {
      console.error('Erro ao processar comando:', error);
      return JSON.stringify({
        error: { 
          code: -32700, 
          message: 'Erro de parse JSON' 
        }
      });
    }
  }
  
  /**
   * Inicia o servidor
   */
  start() {
    console.error('Iniciando servidor MCP...');
    
    // Configurar entrada/saída
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    // Buffer para entrada
    let inputBuffer = '';
    
    // Ouvinte de dados da entrada padrão
    process.stdin.on('data', (chunk) => {
      // Adicionar dados ao buffer
      inputBuffer += chunk.toString();
      
      // Processar linhas completas
      const lines = inputBuffer.split('\n');
      
      // Processar todas as linhas completas exceto a última
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Processar comando
        this.processCommand(line).then(response => {
          // Enviar resposta
          process.stdout.write(response + '\n');
        });
      }
      
      // Guardar a última linha (possivelmente incompleta)
      inputBuffer = lines[lines.length - 1];
    });
    
    // Tratar sinais de encerramento
    process.on('SIGINT', () => {
      console.error('Servidor finalizado pelo usuário.');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      console.error('Servidor finalizado pelo sistema.');
      process.exit(0);
    });
    
    console.error('Servidor MCP pronto e aguardando comandos...');
    console.error('Ferramentas registradas:');
    
    this.getTools().forEach(tool => {
      console.error(`- ${tool.id}: ${tool.description}`);
    });
  }
}
