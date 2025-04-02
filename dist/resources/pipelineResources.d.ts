import { ResourceTemplate } from '@modelcontextprotocol/sdk';
/**
 * Recursos relacionados a funis (pipelines) no Piperun
 */
export declare const pipelineResources: {
    listPipelines: {
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
    listStages: {
        name: string;
        template: ResourceTemplate;
        handler: (uri: URL, params: {
            page?: string;
            show?: string;
            pipelineId?: string;
        }) => Promise<{
            contents: {
                uri: string;
                text: string;
            }[];
        }>;
    };
};
