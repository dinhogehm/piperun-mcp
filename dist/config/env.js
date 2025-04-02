"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Carrega as variáveis de ambiente do arquivo .env
dotenv_1.default.config();
// Define o esquema de validação para as variáveis de ambiente
const envSchema = zod_1.z.object({
    // Credenciais da API do Piperun
    PIPERUN_API_KEY: zod_1.z.string().min(1, 'PIPERUN_API_KEY é obrigatório'),
    PIPERUN_API_URL: zod_1.z.string().url('PIPERUN_API_URL deve ser uma URL válida'),
    // Configurações do servidor MCP
    MCP_SERVER_NAME: zod_1.z.string().default('PiperunMCP'),
    MCP_SERVER_VERSION: zod_1.z.string().default('1.0.0'),
    PORT: zod_1.z.coerce.number().default(3000),
});
// Valida e exporta as variáveis de ambiente
exports.env = envSchema.parse({
    PIPERUN_API_KEY: process.env.PIPERUN_API_KEY,
    PIPERUN_API_URL: process.env.PIPERUN_API_URL,
    MCP_SERVER_NAME: process.env.MCP_SERVER_NAME,
    MCP_SERVER_VERSION: process.env.MCP_SERVER_VERSION,
    PORT: process.env.PORT,
});
//# sourceMappingURL=env.js.map