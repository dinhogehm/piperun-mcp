/**
 * Ferramentas para gerenciar usuários no CRM Piperun
 *
 * Este módulo implementa ferramentas para consultar e gerenciar usuários
 * no CRM Piperun através da API MCP.
 */
import { z } from 'zod';
declare const searchUsersSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    show: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    show: number;
}, {
    page?: number | undefined;
    show?: number | undefined;
}>;
export declare const userTools: {
    listUsers: {
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
        handler: (params: z.infer<typeof searchUsersSchema>) => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
};
export {};
