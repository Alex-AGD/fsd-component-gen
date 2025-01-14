import type { NodePlopAPI } from 'plop';
export declare function validateComponentName(name: string): boolean;
export declare function validateLayer(layer: string, allowedLayers: string[]): boolean;
export declare class PlopLogger {
    static info(message: string): void;
    static error(error: Error): void;
}
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
