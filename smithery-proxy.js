#!/usr/bin/env node

import readline from 'readline';

// Cria uma interface para ler do stdin e escrever no stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// URL do servidor Smithery.ai (para referência)
const SMITHERY_URL = 'https://smithery.ai/server/@dinhogehm/piperun-mcp/api';

// Definição das ferramentas disponíveis
const tools = {
  'tools/list': {
    description: 'Lista as ferramentas disponíveis',
    handler: () => ({
      tools: [
        {
          name: 'mcp0_listar-negocios',
          description: 'Lista os negócios do CRM Piperun',
          inputSchema: {
            type: 'object',
            properties: {
              page: { type: 'number', default: 1 },
              show: { type: 'number', default: 20 },
              person_id: { type: 'number' }
            }
          }
        },
        {
          name: 'mcp0_detalhes-negocio',
          description: 'Obtém detalhes de um negócio específico',
          inputSchema: {
            type: 'object',
            properties: {
              deal_id: { type: 'number', required: true }
            }
          }
        },
        {
          name: 'mcp0_atualizar-negocio',
          description: 'Atualiza um negócio existente',
          inputSchema: {
            type: 'object',
            properties: {
              deal_id: { type: 'number', required: true },
              data: { type: 'object', required: true }
            }
          }
        },
        {
          name: 'mcp0_listar-funis',
          description: 'Lista os funis de vendas',
          inputSchema: {
            type: 'object',
            properties: {
              page: { type: 'number', default: 1 },
              show: { type: 'number', default: 20 }
            }
          }
        },
        {
          name: 'mcp0_listar-estagios',
          description: 'Lista os estágios de um funil',
          inputSchema: {
            type: 'object',
            properties: {
              pipeline_id: { type: 'number' },
              page: { type: 'number', default: 1 },
              show: { type: 'number', default: 20 }
            }
          }
        },
        {
          name: 'mcp0_listar-produtos',
          description: 'Lista os produtos disponíveis',
          inputSchema: {
            type: 'object',
            properties: {
              page: { type: 'number', default: 1 },
              show: { type: 'number', default: 20 },
              name: { type: 'string' }
            }
          }
        },
        {
          name: 'mcp0_listar-contatos',
          description: 'Lista os contatos cadastrados',
          inputSchema: {
            type: 'object',
            properties: {
              page: { type: 'number', default: 1 },
              show: { type: 'number', default: 20 },
              name: { type: 'string' },
              email: { type: 'string' }
            }
          }
        },
        {
          name: 'mcp0_listar-usuarios',
          description: 'Lista os usuários da conta',
          inputSchema: {
            type: 'object',
            properties: {
              page: { type: 'number', default: 1 },
              show: { type: 'number', default: 20 }
            }
          }
        },
        {
          name: 'mcp0_estatisticas-servidor',
          description: 'Obtém estatísticas do servidor',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'mcp0_verificar-saude',
          description: 'Verifica a saúde do servidor',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ]
    })
  },
  'mcp0_listar-usuarios': {
    description: 'Lista os usuários da conta',
    handler: (params = {}) => ({
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: "success",
          data: [
            { id: 1, name: "Osvaldo Gehm", email: "osvaldo@exemplo.com", role: "Admin" },
            { id: 2, name: "João Silva", email: "joao@exemplo.com", role: "Vendedor" },
            { id: 3, name: "Maria Santos", email: "maria@exemplo.com", role: "Gestor" }
          ],
          total: 3,
          page: params.page || 1,
          per_page: params.show || 20
        }, null, 2)
      }]
    })
  },
  'mcp0_listar-negocios': {
    description: 'Lista os negócios do CRM Piperun',
    handler: (params = {}) => ({
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: "success",
          data: [
            { id: 101, title: "Venda de Software A", value: 15000, stage: "Proposta", responsible: "João Silva" },
            { id: 102, title: "Consultoria B", value: 25000, stage: "Negociação", responsible: "Maria Santos" },
            { id: 103, title: "Implementação C", value: 50000, stage: "Fechamento", responsible: "Osvaldo Gehm" }
          ],
          total: 3,
          page: params.page || 1,
          per_page: params.show || 20
        }, null, 2)
      }]
    })
  },
  'mcp0_verificar-saude': {
    description: 'Verifica a saúde do servidor',
    handler: () => ({
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: "success",
          message: "Servidor funcionando normalmente",
          uptime: "2 dias, 5 horas",
          memory: "120 MB",
          cpu: "2%"
        }, null, 2)
      }]
    })
  }
};

// Para todos os métodos não implementados explicitamente, usamos um handler genérico
const defaultToolIds = [
  'mcp0_detalhes-negocio',
  'mcp0_atualizar-negocio',
  'mcp0_listar-funis',
  'mcp0_listar-estagios',
  'mcp0_listar-produtos',
  'mcp0_listar-contatos',
  'mcp0_estatisticas-servidor'
];

defaultToolIds.forEach(id => {
  if (!tools[id]) {
    tools[id] = {
      description: tools['tools/list'].handler().tools.find(t => t.name === id)?.description || `Ferramenta ${id}`,
      handler: (params = {}) => ({
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: "success",
            message: `Operação ${id} simulada com sucesso`,
            params
          }, null, 2)
        }]
      })
    };
  }
});

// Processar as linhas de entrada
rl.on('line', (line) => {
  try {
    // Parsear a linha como JSON
    const request = JSON.parse(line);
    
    // Registrar a requisição recebida (apenas para debug)
    console.error('Requisição recebida:', JSON.stringify(request, null, 2));
    
    // Processar com base no método
    if (request.method === 'initialize') {
      // Resposta para inicialização do MCP
      const response = {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          capabilities: {
            tools: {},
            resources: {},
            prompts: {}
          },
          serverInfo: {
            name: 'piperun-smithery-proxy',
            version: '1.0.0'
          }
        }
      };
      console.log(JSON.stringify(response));
    } else if (request.method === 'shutdown') {
      // Resposta para desligamento do MCP
      const response = {
        jsonrpc: '2.0',
        id: request.id,
        result: null
      };
      console.log(JSON.stringify(response));
      process.exit(0);
    } else {
      // Tratar outros métodos
      const method = request.method;
      const params = request.params || {};
      
      if (tools[method]) {
        const result = tools[method].handler(params);
        const response = {
          jsonrpc: '2.0',
          id: request.id,
          result
        };
        console.log(JSON.stringify(response));
      } else {
        // Método não encontrado
        const response = {
          jsonrpc: '2.0',
          id: request.id,
          error: {
            code: -32601,
            message: `Método não encontrado: ${method}`
          }
        };
        console.log(JSON.stringify(response));
      }
    }
  } catch (error) {
    // Erro ao processar a requisição
    console.error('Erro ao processar requisição:', error);
    
    try {
      const errorResponse = {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: `Erro ao processar requisição: ${error.message}`
        }
      };
      console.log(JSON.stringify(errorResponse));
    } catch (e) {
      // Erro ao enviar resposta de erro
      console.error('Erro ao enviar resposta de erro:', e);
    }
  }
});

// Tratar encerramento
process.on('SIGINT', () => {
  console.error('Servidor encerrado pelo usuário');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Servidor encerrado pelo sistema');
  process.exit(0);
});

console.error('Servidor proxy MCP iniciado e aguardando comandos...');
