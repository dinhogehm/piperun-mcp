import { z } from 'zod';
/**
 * Prompts relacionados a negócios (deals) no Piperun
 */
export declare const dealPrompts: {
    analyzeDeal: {
        name: string;
        schema: z.ZodObject<{
            dealId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            dealId: number;
        }, {
            dealId: number;
        }>;
        handler: ({ dealId }: {
            dealId: number;
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
    summarizeDeals: {
        name: string;
        schema: z.ZodObject<{
            pipelineId: z.ZodOptional<z.ZodNumber>;
            stageId: z.ZodOptional<z.ZodNumber>;
            page: z.ZodDefault<z.ZodNumber>;
            show: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            show: number;
            pipelineId?: number | undefined;
            stageId?: number | undefined;
        }, {
            page?: number | undefined;
            show?: number | undefined;
            pipelineId?: number | undefined;
            stageId?: number | undefined;
        }>;
        handler: ({ pipelineId, stageId, page, show }: {
            pipelineId?: number;
            stageId?: number;
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
