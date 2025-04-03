#!/usr/bin/env node

/**
 * Proxy para Claude Desktop se comunicar com o servidor MCP do Piperun
 * 
 * Este script funciona como intermediário entre o Claude Desktop e o servidor MCP,
 * corrigindo possíveis problemas de serialização e formatação de mensagens JSON.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuração do proxy
const PIPERUN_MCP_PATH = path.join(__dirname, 'dist/index.js');
const DEBUG = true;

// Função para logar mensagens (quando DEBUG está ativado)
function log(message, data = null) {
  if (!DEBUG) return;
  
  const timestamp = new Date().toISOString();
  const logMessage = data 
    ? `${timestamp} [PROXY] ${message}: ${JSON.stringify(data)}`
    : `${timestamp} [PROXY] ${message}`;
  
  console.error(logMessage);
}

// Inicia o servidor MCP real como um processo filho
log(`Iniciando servidor MCP: ${PIPERUN_MCP_PATH}`);
const mcpServer = spawn('node', [PIPERUN_MCP_PATH], {
  env: {
    ...process.env,
    PIPERUN_API_KEY: 'e9c00ac9c6120c6afdbcba7d0db61fa9',
    PIPERUN_API_URL: 'https://api.pipe.run/v1/',
    MCP_SERVER_NAME: 'PiperunMCP',
    MCP_SERVER_VERSION: '1.0.0',
    MCP_TRANSPORT: 'stdio'
  }
});

// Manipula saída do servidor MCP
mcpServer.stdout.on('data', (data) => {
  try {
    // Tenta limpar e reformatar o JSON, se necessário
    const message = data.toString().trim();
    
    // Loga o que recebeu do servidor para debug
    log('Mensagem recebida do servidor MCP', { raw: message });
    
    // Verifica se é um JSON válido
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
      
      // Normaliza a forma de serializar objetos do Zod
      if (parsedMessage.result && parsedMessage.result.tools) {
        parsedMessage.result.tools = parsedMessage.result.tools.map(tool => ({
          ...tool,
          inputSchema: {}  // Simplifica os schemas para evitar problemas de serialização
        }));
      }
      
      if (parsedMessage.result && parsedMessage.result.prompts) {
        parsedMessage.result.prompts = parsedMessage.result.prompts.map(prompt => ({
          ...prompt,
          inputSchema: {}  // Simplifica os schemas para evitar problemas de serialização
        }));
      }
      
      // Reenvia para o Claude com o JSON formatado
      const formattedMessage = JSON.stringify(parsedMessage);
      log('Enviando mensagem formatada para o Claude', { formatted: formattedMessage });
      process.stdout.write(formattedMessage + '\n');
    } catch (e) {
      // Se não for um JSON válido, repassa diretamente
      log('Erro ao processar JSON do servidor', { error: e.message });
      process.stdout.write(message + '\n');
    }
  } catch (error) {
    log('Erro ao processar mensagem do servidor', { error: error.message });
    process.stdout.write(data);
  }
});

// Passa mensagens de erro do servidor MCP diretamente para o stderr
mcpServer.stderr.on('data', (data) => {
  const message = data.toString();
  log('Erro do servidor MCP', { stderr: message });
  // Não repassamos erros para não confundir o Claude
});

// Manipula erro do processo filho
mcpServer.on('error', (error) => {
  log('Erro ao executar servidor MCP', { error: error.message });
  process.exit(1);
});

// Manipula término do processo filho
mcpServer.on('close', (code) => {
  log(`Servidor MCP encerrado com código ${code}`);
  process.exit(code);
});

// Lê mensagens da entrada padrão (do Claude Desktop)
process.stdin.on('data', (data) => {
  try {
    const message = data.toString().trim();
    log('Mensagem recebida do Claude', { message });
    
    // Passa a mensagem para o servidor MCP
    mcpServer.stdin.write(message + '\n');
  } catch (error) {
    log('Erro ao processar mensagem do Claude', { error: error.message });
  }
});

// Manipula fechamento do processo
process.on('SIGINT', () => {
  log('Recebido sinal SIGINT, encerrando proxy');
  mcpServer.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Recebido sinal SIGTERM, encerrando proxy');
  mcpServer.kill();
  process.exit(0);
});

log('Proxy inicializado e pronto para processar mensagens');
