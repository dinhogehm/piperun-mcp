import { z } from 'zod';
declare const searchContactsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    show: z.ZodDefault<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    show: number;
    name?: string | undefined;
    email?: string | undefined;
}, {
    page?: number | undefined;
    show?: number | undefined;
    name?: string | undefined;
    email?: string | undefined;
}>;
/**
 * Ferramentas relacionadas a contatos (people) no Piperun
 */
export declare const contactTools: {
    listContacts: {
        name: string;
        schema: z.ZodObject<{
            page: z.ZodDefault<z.ZodNumber>;
            show: z.ZodDefault<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            page: number;
            show: number;
            name?: string | undefined;
            email?: string | undefined;
        }, {
            page?: number | undefined;
            show?: number | undefined;
            name?: string | undefined;
            email?: string | undefined;
        }>;
        handler: (params: z.infer<typeof searchContactsSchema>) => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
};
export {};
