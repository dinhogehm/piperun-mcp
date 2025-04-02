"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsTools = void 0;
const zod_1 = require("zod");
const piperunApi_1 = require("../services/piperunApi");
const logger_1 = require("../utils/logger");
const piperunApi = new piperunApi_1.PiperunApiService();
const logger = new logger_1.Logger('StatsTools');
/**
 * Ferramentas relacionadas a estatísticas e telemetria
 */
exports.statsTools = {
    // Ferramenta para obter estatísticas do servidor MCP
    getServerStats: {
        name: 'estatisticas-servidor',
        schema: zod_1.z.object({}),
        handler: async () => {
            try {
                logger.info('Obtendo estatísticas do servidor');
                // Obter estatísticas da API do Piperun
                const apiStats = piperunApi.getApiStats();
                // Obter estatísticas de uso de memória
                const memoryUsage = process.memoryUsage();
                // Formatar estatísticas de uso de memória em MB
                const formattedMemoryUsage = {
                    rss: Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100,
                    heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100,
                    heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100,
                    external: Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100,
                };
                // Calcular tempo de atividade do servidor
                const uptimeSeconds = process.uptime();
                const uptimeFormatted = formatUptime(uptimeSeconds);
                const stats = {
                    servidor: {
                        uptime: uptimeFormatted,
                        memoria: formattedMemoryUsage,
                        versaoNode: process.version,
                    },
                    api: apiStats
                };
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(stats, null, 2)
                        }
                    ]
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'Erro desconhecido ao obter estatísticas';
                logger.error('Erro ao obter estatísticas do servidor', error);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Erro ao obter estatísticas do servidor: ${errorMessage}`
                        }
                    ]
                };
            }
        }
    },
    // Ferramenta para verificar a saúde e conectividade do servidor
    checkHealth: {
        name: 'verificar-saude',
        schema: zod_1.z.object({}),
        handler: async () => {
            try {
                logger.info('Verificando saúde do servidor');
                // Verificar conectividade com a API do Piperun
                const startTime = Date.now();
                await piperunApi.listPipelines({ page: 1, show: 1 });
                const responseTime = Date.now() - startTime;
                const health = {
                    status: 'online',
                    conectividade: {
                        piperun: 'conectado',
                        tempoResposta: `${responseTime}ms`
                    },
                    memoria: {
                        usada: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100}MB`,
                        limite: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100}MB`
                    },
                    timestamp: new Date().toISOString()
                };
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(health, null, 2)
                        }
                    ]
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'Erro desconhecido ao verificar saúde';
                logger.error('Erro ao verificar saúde do servidor', error);
                const health = {
                    status: 'falha',
                    erro: errorMessage,
                    timestamp: new Date().toISOString()
                };
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(health, null, 2)
                        }
                    ]
                };
            }
        }
    }
};
/**
 * Formata segundos em uma string legível de tempo de atividade
 * @param seconds Tempo em segundos
 * @returns String formatada (ex: "2 dias, 3 horas, 45 minutos, 10 segundos")
 */
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    let uptime = '';
    if (days > 0) {
        uptime += `${days} dia${days > 1 ? 's' : ''}, `;
    }
    if (hours > 0 || days > 0) {
        uptime += `${hours} hora${hours > 1 ? 's' : ''}, `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        uptime += `${minutes} minuto${minutes > 1 ? 's' : ''}, `;
    }
    uptime += `${seconds} segundo${seconds > 1 ? 's' : ''}`;
    return uptime;
}
//# sourceMappingURL=statsTools.js.map