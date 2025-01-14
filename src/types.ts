export interface PlopGeneratorConfig {
  templatesPath?: string;
  customTemplates?: {
    [key: string]: string;
  };
  layerChoices?: string[];
  defaultMemo?: boolean;
}
