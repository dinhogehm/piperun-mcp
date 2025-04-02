import { z } from 'zod';

/**
 * Prompts relacionados a negócios (deals) no Piperun
 */
export const dealPrompts = {
  // Prompt para analisar negócio
  analyzeDeal: {
    name: 'analisar-negocio',
    schema: z.object({
      dealId: z.number()
    }),
    handler: ({ dealId }: { dealId: number }) => ({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Por favor, analise o negócio com ID ${dealId} e forneça insights sobre:
              
1. Os dados principais do negócio
2. Em qual etapa do funil ele está
3. Possíveis próximos passos para avançar este negócio
4. Quaisquer riscos ou oportunidades que você identifique

Use os recursos do Piperun para buscar todas as informações relevantes.`
            }
          ]
        }
      ]
    })
  },
  
  // Prompt para resumir negócios
  summarizeDeals: {
    name: 'resumir-negocios',
    schema: z.object({
      pipelineId: z.number().optional(),
      stageId: z.number().optional(),
      page: z.number().default(1),
      show: z.number().default(10)
    }),
    handler: ({ pipelineId, stageId, page, show }: { 
      pipelineId?: number, 
      stageId?: number, 
      page: number, 
      show: number 
    }) => {
      let promptText = `Por favor, gere um resumo dos negócios atuais`;
      
      if (pipelineId) {
        promptText += ` no funil com ID ${pipelineId}`;
        
        if (stageId) {
          promptText += ` e na etapa com ID ${stageId}`;
        }
      }
      
      promptText += `.

Para cada negócio, informe:
1. Nome do negócio
2. Valor
3. Etapa atual
4. Cliente associado
5. Data de criação

Organize os negócios por valor, do maior para o menor, e destaque qualquer negócio com valor acima de R$ 10.000,00.

Use os recursos e ferramentas do Piperun para buscar essas informações. Utilize paginação (página ${page}, com ${show} itens por página) conforme necessário.`;
      
      return {
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: promptText
              }
            ]
          }
        ]
      };
    }
  }
};
