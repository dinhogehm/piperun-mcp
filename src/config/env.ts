import dotenv from 'dotenv';
import { z } from 'zod';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Define o esquema de validação para as variáveis de ambiente
const envSchema = z.object({
  // Credenciais da API do Piperun
  PIPERUN_API_KEY: z.string().min(1, 'PIPERUN_API_KEY é obrigatório'),
  PIPERUN_API_URL: z.string().url('PIPERUN_API_URL deve ser uma URL válida'),
  
  // Configurações do servidor MCP
  MCP_SERVER_NAME: z.string().default('PiperunMCP'),
  MCP_SERVER_VERSION: z.string().default('1.0.0'),
  PORT: z.coerce.number().default(3000),
});

// Valida e exporta as variáveis de ambiente
export const env = envSchema.parse({
  PIPERUN_API_KEY: process.env.PIPERUN_API_KEY,
  PIPERUN_API_URL: process.env.PIPERUN_API_URL,
  MCP_SERVER_NAME: process.env.MCP_SERVER_NAME,
  MCP_SERVER_VERSION: process.env.MCP_SERVER_VERSION,
  PORT: process.env.PORT,
});
