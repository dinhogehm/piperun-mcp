import { z } from 'zod';
declare const updateDealSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodNumber>;
    stage_id: z.ZodOptional<z.ZodNumber>;
    person_id: z.ZodOptional<z.ZodNumber>;
    user_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    value?: number | undefined;
    person_id?: number | undefined;
    title?: string | undefined;
    stage_id?: number | undefined;
    user_id?: number | undefined;
}, {
    value?: number | undefined;
    person_id?: number | undefined;
    title?: string | undefined;
    stage_id?: number | undefined;
    user_id?: number | undefined;
}>;
declare const searchDealsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    show: z.ZodDefault<z.ZodNumber>;
    person_id: z.ZodOptional<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
    pipeline_id: z.ZodOptional<z.ZodNumber>;
    stage_id: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    show: number;
    person_id?: number | undefined;
    pipeline_id?: number | undefined;
    title?: string | undefined;
    stage_id?: number | undefined;
}, {
    page?: number | undefined;
    show?: number | undefined;
    person_id?: number | undefined;
    pipeline_id?: number | undefined;
    title?: string | undefined;
    stage_id?: number | undefined;
}>;
/**
 * Ferramentas relacionadas a negócios (deals) no Piperun
 */
export declare const dealTools: {
    listDeals: {
        name: string;
        schema: z.ZodObject<{
            page: z.ZodDefault<z.ZodNumber>;
            show: z.ZodDefault<z.ZodNumber>;
            person_id: z.ZodOptional<z.ZodNumber>;
            title: z.ZodOptional<z.ZodString>;
            pipeline_id: z.ZodOptional<z.ZodNumber>;
            stage_id: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            show: number;
            person_id?: number | undefined;
            pipeline_id?: number | undefined;
            title?: string | undefined;
            stage_id?: number | undefined;
        }, {
            page?: number | undefined;
            show?: number | undefined;
            person_id?: number | undefined;
            pipeline_id?: number | undefined;
            title?: string | undefined;
            stage_id?: number | undefined;
        }>;
        handler: (params: z.infer<typeof searchDealsSchema>) => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
    getDealDetails: {
        name: string;
        schema: z.ZodObject<{
            deal_id: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            deal_id: number;
        }, {
            deal_id: number;
        }>;
        handler: ({ deal_id }: {
            deal_id: number;
        }) => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
    updateDeal: {
        name: string;
        schema: z.ZodObject<{
            deal_id: z.ZodNumber;
            data: z.ZodObject<{
                title: z.ZodOptional<z.ZodString>;
                value: z.ZodOptional<z.ZodNumber>;
                stage_id: z.ZodOptional<z.ZodNumber>;
                person_id: z.ZodOptional<z.ZodNumber>;
                user_id: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                value?: number | undefined;
                person_id?: number | undefined;
                title?: string | undefined;
                stage_id?: number | undefined;
                user_id?: number | undefined;
            }, {
                value?: number | undefined;
                person_id?: number | undefined;
                title?: string | undefined;
                stage_id?: number | undefined;
                user_id?: number | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            data: {
                value?: number | undefined;
                person_id?: number | undefined;
                title?: string | undefined;
                stage_id?: number | undefined;
                user_id?: number | undefined;
            };
            deal_id: number;
        }, {
            data: {
                value?: number | undefined;
                person_id?: number | undefined;
                title?: string | undefined;
                stage_id?: number | undefined;
                user_id?: number | undefined;
            };
            deal_id: number;
        }>;
        handler: ({ deal_id, data }: {
            deal_id: number;
            data: z.infer<typeof updateDealSchema>;
        }) => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
};
export {};
