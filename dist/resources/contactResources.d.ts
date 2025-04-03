import { ResourceTemplate } from '../adapters/mcp-sdk.adapter.js';
/**
 * Recursos relacionados a contatos (people) no Piperun
 */
export declare const contactResources: {
    listContacts: {
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
