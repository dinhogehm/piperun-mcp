import { z } from 'zod';
/**
 * Prompts relacionados a contatos (people) no Piperun
 */
export declare const contactPrompts: {
    analyzeContact: {
        name: string;
        schema: z.ZodObject<{
            contactId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            contactId: number;
        }, {
            contactId: number;
        }>;
        handler: ({ contactId }: {
            contactId: number;
        }) => {
            messages: {
                role: string;
                content: {
                    type: string;
                    text: string;
                }[];
            }[];
        };
    };
    identifyHighValueContacts: {
        name: string;
        schema: z.ZodObject<{
            minDealValue: z.ZodDefault<z.ZodNumber>;
            page: z.ZodDefault<z.ZodNumber>;
            show: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            show: number;
            minDealValue: number;
        }, {
            page?: number | undefined;
            show?: number | undefined;
            minDealValue?: number | undefined;
        }>;
        handler: ({ minDealValue, page, show }: {
            minDealValue: number;
            page: number;
            show: number;
        }) => {
            messages: {
                role: string;
                content: {
                    type: string;
                    text: string;
                }[];
            }[];
        };
    };
};
