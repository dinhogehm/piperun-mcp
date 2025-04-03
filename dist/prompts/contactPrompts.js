import { z } from 'zod';
/**
 * Prompts relacionados a contatos (people) no Piperun
 */
export const contactPrompts = {
    // Prompt para analisar contato
    analyzeContact: {
        name: 'analisar-contato',
        schema: z.object({
            contactId: z.number()
        }),
        handler: ({ contactId }) => ({
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Por favor, analise o contato com ID ${contactId} e forneça:
              
1. Dados principais do contato (nome, email, telefone)
2. Negócios associados a este contato
3. Valor total de todos os negócios deste contato
4. Histórico de interações (se disponível)
5. Recomendações para próximos passos com este contato

Use os recursos e ferramentas do Piperun para buscar todas as informações relevantes.`
                        }
                    ]
                }
            ]
        })
    },
    // Prompt para identificar contatos de alto valor
    identifyHighValueContacts: {
        name: 'identificar-contatos-alto-valor',
        schema: z.object({
            minDealValue: z.number().default(10000),
            page: z.number().default(1),
            show: z.number().default(10)
        }),
        handler: ({ minDealValue, page, show }) => ({
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Por favor, identifique contatos de alto valor no Piperun.

Um contato de alto valor é aquele que tem pelo menos um negócio com valor igual ou superior a R$ ${minDealValue.toLocaleString('pt-BR')}.

Para cada contato identificado, forneça:
1. Nome e informações de contato
2. Número total de negócios
3. Valor total de todos os seus negócios
4. Negócio de maior valor
5. Estágio atual dos seus negócios

Organize os contatos por valor total de negócios, do maior para o menor.
Utilize paginação (página ${page}, com ${show} itens por página) conforme necessário.

Use os recursos e ferramentas do Piperun para buscar todas as informações relevantes.`
                        }
                    ]
                }
            ]
        })
    }
};
//# sourceMappingURL=contactPrompts.js.map