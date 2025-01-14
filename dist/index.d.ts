import type { NodePlopAPI } from 'plop';
interface PlopGeneratorConfig {
    templatesPath?: string;
    customTemplates?: {
        [key: string]: string;
    };
    layerChoices?: string[];
    defaultMemo?: boolean;
}
export default function (plop: NodePlopAPI, config?: Partial<PlopGeneratorConfig>): void;
export {};
