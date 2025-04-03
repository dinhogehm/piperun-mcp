import { z } from 'zod';
/**
 * Prompts relacionados a funis (pipelines) e estágios (stages) no Piperun
 */
export const pipelinePrompts = {
    // Prompt para analisar desempenho de funil
    analyzePipeline: {
        name: 'analisar-funil',
        schema: z.object({
            pipelineId: z.number()
        }),
        handler: ({ pipelineId }) => ({
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Por favor, analise o funil com ID ${pipelineId} e forneça:
              
1. Uma visão geral do funil: nome, descrição e número de etapas
2. Distribuição de negócios por etapa
3. Valor total dos negócios em cada etapa
4. Taxa de conversão entre etapas (se possível calcular)
5. Recomendações para melhorar o desempenho do funil

Use os recursos e ferramentas do Piperun para buscar todas as informações relevantes.`
                        }
                    ]
                }
            ]
        })
    },
    // Prompt para comparar estágios de um funil
    compareStages: {
        name: 'comparar-etapas',
        schema: z.object({
            pipelineId: z.number(),
        }),
        handler: ({ pipelineId }) => ({
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Por favor, compare as diferentes etapas do funil com ID ${pipelineId}.

Para cada etapa, forneça:
1. Nome da etapa
2. Quantidade de negócios na etapa
3. Valor total dos negócios na etapa
4. Tempo médio que os negócios permanecem nesta etapa (se possível calcular)

Identifique:
- Etapa com maior número de negócios
- Etapa com maior valor acumulado
- Possíveis gargalos no funil
- Sugestões para otimizar a conversão entre etapas

Use os recursos e ferramentas do Piperun para buscar todas as informações relevantes.`
                        }
                    ]
                }
            ]
        })
    }
};
//# sourceMappingURL=pipelinePrompts.js.map