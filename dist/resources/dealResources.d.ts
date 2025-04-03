import { ResourceTemplate } from '../adapters/mcp-sdk.adapter.js';
/**
 * Recursos relacionados a negócios (deals) no Piperun
 */
export declare const dealResources: {
    listDeals: {
        name: string;
        template: ResourceTemplate;
        handler: (uri: URL, params: {
            page?: string;
            show?: string;
        }) => Promise<{
            contents: {
                uri: string;
                text: string;
            }[];
        }>;
    };
    getDeal: {
        name: string;
        template: ResourceTemplate;
        handler: (uri: URL, params: {
            dealId: string;
        }) => Promise<{
            contents: {
                uri: string;
                text: string;
            }[];
        }>;
    };
};
