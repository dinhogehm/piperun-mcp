import { z } from 'zod';
declare const searchPipelinesSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    show: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    show: number;
}, {
    page?: number | undefined;
    show?: number | undefined;
}>;
/**
 * Ferramentas relacionadas a funis (pipelines) no Piperun
 */
export declare const pipelineTools: {
    listPipelines: {
        name: string;
        schema: z.ZodObject<{
            page: z.ZodDefault<z.ZodNumber>;
            show: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            show: number;
        }, {
            page?: number | undefined;
            show?: number | undefined;
        }>;
        handler: (params: z.infer<typeof searchPipelinesSchema>) => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
    listStages: {
        name: string;
        schema: z.ZodObject<{
            pipeline_id: z.ZodOptional<z.ZodNumber>;
            page: z.ZodDefault<z.ZodNumber>;
            show: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            show: number;
            pipeline_id?: number | undefined;
        }, {
            page?: number | undefined;
            show?: number | undefined;
            pipeline_id?: number | undefined;
        }>;
        handler: (params: {
            pipeline_id?: number;
            page: number;
            show: number;
        }) => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
};
export {};
