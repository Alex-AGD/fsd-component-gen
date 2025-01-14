import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// Validators
function validateComponentName(name) {
    return /^[A-Z][a-zA-Z0-9]*$/.test(name);
}
function validateLayer(layer, allowedLayers) {
    return allowedLayers.includes(layer);
}
// Logger
class PlopLogger {
    static info(message) {
        console.log(`[plop-generate-component] ${message}`);
    }
    static error(error) {
        console.error(`[plop-generate-component] Error: ${error.message}`);
    }
}
const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONFIG = {
    templatesPath: resolve(__dirname, '../plop-templates'),
    layerChoices: ['pages', 'features', 'shared', 'widgets', 'entities'],
    defaultMemo: false,
};
export default function (plop, config = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    PlopLogger.info('Initializing component generator...');
    plop.setGenerator('component', {
        description: 'Создание нового компонента с FSD архитектурой',
        prompts: [
            {
                type: 'list',
                name: 'layer',
                message: 'В какой слой добавить компонент?',
                choices: finalConfig.layerChoices,
                validate: (input) => validateLayer(input, finalConfig.layerChoices) || 'Неверный слой',
            },
            {
                type: 'input',
                name: 'name',
                message: 'Имя компонента:',
                validate: (input) => validateComponentName(input) || 'Имя компонента должно начинаться с заглавной буквы',
            },
            {
                type: 'confirm',
                name: 'withByID',
                message: 'Нужен ли второй компонент с ID (byID)?',
                when: (answers) => answers.layer === 'pages',
                default: false,
            },
            {
                type: 'confirm',
                name: 'useMemo',
                message: 'Использовать memo для компонента?',
                default: false,
            },
        ],
        actions: function (data) {
            try {
                const actions = [];
                // Структура для 'features'
                if (data?.layer === 'features') {
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/ui/{{pascalCase name}}Features.tsx',
                        templateFile: resolve(finalConfig.templatesPath, data.useMemo ? 'memoComponent.hbs' : 'component.hbs'),
                    });
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/model/{{camelCase name}}Model.ts',
                        templateFile: resolve(finalConfig.templatesPath, 'model.hbs'),
                    });
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/schema/{{camelCase name}}Schema.ts',
                        templateFile: resolve(finalConfig.templatesPath, 'schema.hbs'),
                    });
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/index.ts',
                        templateFile: resolve(finalConfig.templatesPath, 'indexNoLazy.hbs'),
                    });
                }
                // Структура для 'shared'
                else if (data?.layer === 'shared') {
                    actions.push({
                        type: 'add',
                        path: 'src/shared/components/{{camelCase name}}/ui/{{pascalCase name}}.tsx',
                        templateFile: resolve(finalConfig.templatesPath, data.useMemo ? 'memoComponent.hbs' : 'component.hbs'),
                    }, {
                        type: 'add',
                        path: 'src/shared/index.js',
                        templateFile: resolve(finalConfig.templatesPath, 'indexShared.hbs'),
                        skipIfExists: true,
                    });
                    actions.push({
                        type: 'append',
                        path: 'src/shared/index.js',
                        pattern: /(export \* from '.*';\n|$)/,
                        template: `export * from './components/{{camelCase name}}/ui/{{pascalCase name}}';\n`,
                    });
                }
                // Структура для 'entities'
                else if (data?.layer === 'entities') {
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/model/selectors/selectors.ts',
                        templateFile: resolve(finalConfig.templatesPath, 'selectors.hbs'),
                    });
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/model/slice/slice.ts',
                        templateFile: resolve(finalConfig.templatesPath, 'slice.hbs'),
                    });
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/types/index.ts',
                        templateFile: resolve(finalConfig.templatesPath, 'types.hbs'),
                    });
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/ui/{{pascalCase name}}.tsx',
                        templateFile: resolve(finalConfig.templatesPath, data.useMemo ? 'memoComponent.hbs' : 'component.hbs'),
                    });
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/index.ts',
                        templateFile: resolve(finalConfig.templatesPath, 'indexEntity.hbs'),
                    });
                }
                // Общая структура для остальных слоёв
                else {
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/ui/{{pascalCase name}}.tsx',
                        templateFile: resolve(finalConfig.templatesPath, data?.useMemo ? 'memoComponent.hbs' : 'componentPages.hbs'),
                    });
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/model/{{camelCase name}}Model.ts',
                        templateFile: resolve(finalConfig.templatesPath, 'model.hbs'),
                    });
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/schema/{{camelCase name}}Schema.ts',
                        templateFile: resolve(finalConfig.templatesPath, 'schema.hbs'),
                    });
                    actions.push({
                        type: 'add',
                        path: 'src/{{layer}}/{{camelCase name}}/index.ts',
                        templateFile: resolve(finalConfig.templatesPath, 'index.hbs'),
                    });
                }
                // Создание компонента byID для pages
                if (data?.withByID) {
                    actions.push({
                        type: 'add',
                        path: 'src/pages/{{camelCase name}}/ui/{{pascalCase name}}ByID.tsx',
                        templateFile: resolve(finalConfig.templatesPath, 'componentByID.hbs'),
                    });
                    actions.push({
                        type: 'append',
                        path: 'src/pages/{{camelCase name}}/index.ts',
                        pattern: /;/,
                        template: `export const {{pascalCase name}}ByIDAsync = lazy(() => import('./ui/{{pascalCase name}}ByID'));\nexport { {{pascalCase name}}ByIDAsync as {{pascalCase name}}ByID };`,
                    });
                }
                PlopLogger.info(`Generating component ${data?.name} in layer ${data?.layer}`);
                return actions;
            }
            catch (error) {
                PlopLogger.error(error);
                throw error;
            }
        },
    });
}
