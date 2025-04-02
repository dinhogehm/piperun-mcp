import { z } from 'zod';
/**
 * Ferramentas relacionadas a estatísticas e telemetria
 */
export declare const statsTools: {
    getServerStats: {
        name: string;
        schema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        handler: () => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
    checkHealth: {
        name: string;
        schema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        handler: () => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
};
