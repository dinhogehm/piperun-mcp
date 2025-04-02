import { z } from 'zod';
/**
 * Prompts relacionados a funis (pipelines) e estágios (stages) no Piperun
 */
export declare const pipelinePrompts: {
    analyzePipeline: {
        name: string;
        schema: z.ZodObject<{
            pipelineId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            pipelineId: number;
        }, {
            pipelineId: number;
        }>;
        handler: ({ pipelineId }: {
            pipelineId: number;
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
    compareStages: {
        name: string;
        schema: z.ZodObject<{
            pipelineId: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            pipelineId: number;
        }, {
            pipelineId: number;
        }>;
        handler: ({ pipelineId }: {
            pipelineId: number;
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
