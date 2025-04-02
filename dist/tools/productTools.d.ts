import { z } from 'zod';
declare const searchProductsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    show: z.ZodDefault<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    show: number;
    name?: string | undefined;
}, {
    page?: number | undefined;
    show?: number | undefined;
    name?: string | undefined;
}>;
/**
 * Ferramentas relacionadas a produtos (items) no Piperun
 */
export declare const productTools: {
    listProducts: {
        name: string;
        schema: z.ZodObject<{
            page: z.ZodDefault<z.ZodNumber>;
            show: z.ZodDefault<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            show: number;
            name?: string | undefined;
        }, {
            page?: number | undefined;
            show?: number | undefined;
            name?: string | undefined;
        }>;
        handler: (params: z.infer<typeof searchProductsSchema>) => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
};
export {};
