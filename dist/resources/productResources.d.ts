import { ResourceTemplate } from '../adapters/mcp-sdk.adapter.js';
/**
 * Recursos relacionados a produtos (items) no Piperun
 */
export declare const productResources: {
    listProducts: {
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
};
