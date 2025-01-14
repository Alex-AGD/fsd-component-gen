module.exports = function (plop) {
  plop.setGenerator('component', {
    description: 'Создание нового компонента с FSD архитектурой',
    prompts: [
      {
        type: 'list',
        name: 'layer',
        message: 'В какой слой добавить компонент?',
        choices: ['pages', 'features', 'shared', 'widgets', 'entities'],
      },
      {
        type: 'input',
        name: 'name',
        message: 'Имя компонента:',
      },
      {
        type: 'confirm',
        name: 'withByID',
        message: 'Нужен ли второй компонент с ID (byID)?',
        when: (answers) => answers.layer === 'pages', // Показывать только для 'pages'
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
      const actions = [];

      // Структура для 'features'
      if (data.layer === 'features') {
        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/ui/{{pascalCase name}}Features.tsx',
          templateFile: data.useMemo ? 'plop-templates/memoComponent.hbs' : 'plop-templates/component.hbs',
        });

        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/model/{{camelCase name}}Model.ts',
          templateFile: 'plop-templates/model.hbs',
        });

        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/schema/{{camelCase name}}Schema.ts',
          templateFile: 'plop-templates/schema.hbs',
        });

        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/index.ts',
          templateFile: 'plop-templates/indexNoLazy.hbs',
        });
      }

      // Структура для 'shared'
      else if (data.layer === 'shared') {
        actions.push(
          {
            type: 'add',
            path: 'src/shared/components/{{camelCase name}}/ui/{{pascalCase name}}.tsx',
            templateFile: data.useMemo ? 'plop-templates/memoComponent.hbs' : 'plop-templates/component.hbs',
          },
          {
            type: 'add',
            path: 'src/shared/index.js',
            templateFile: 'plop-templates/indexShared.hbs',
            skipIfExists: true,
          }
        );

        actions.push({
          type: 'append',
          path: 'src/shared/index.js',
          pattern: /(export \* from '.*';\n|$)/,
          template: `export * from './components/{{camelCase name}}/ui/{{pascalCase name}}';\n`,
        });
      }

      // Структура для 'entities'
      else if (data.layer === 'entities') {
        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/model/selectors/selectors.ts',
          templateFile: 'plop-templates/selectors.hbs',
        });

        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/model/slice/slice.ts',
          templateFile: 'plop-templates/slice.hbs',
        });

        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/types/index.ts',
          templateFile: 'plop-templates/types.hbs',
        });

        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/ui/{{pascalCase name}}.tsx',
          templateFile: data.useMemo ? 'plop-templates/memoComponent.hbs' : 'plop-templates/component.hbs',
        });

        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/index.ts',
          templateFile: 'plop-templates/indexEntity.hbs',
        });
      }

      // Общая структура для остальных слоёв
      else {
        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/ui/{{pascalCase name}}.tsx',
          templateFile: data.useMemo ? 'plop-templates/memoComponent.hbs' : 'plop-templates/componentPages.hbs',
        });

        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/model/{{camelCase name}}Model.ts',
          templateFile: 'plop-templates/model.hbs',
        });

        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/schema/{{camelCase name}}Schema.ts',
          templateFile: 'plop-templates/schema.hbs',
        });

        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/index.ts',
          templateFile: 'plop-templates/index.hbs',
        });
      }

      // Создание компонента byID для pages
      if (data.withByID) {
        actions.push({
          type: 'add',
          path: 'src/pages/{{camelCase name}}/ui/{{pascalCase name}}ByID.tsx',
          templateFile: 'plop-templates/componentByID.hbs',
        });

        actions.push({
          type: 'append',
          path: 'src/pages/{{camelCase name}}/index.ts',
          pattern: /;/,
          template: `export const {{pascalCase name}}ByIDAsync = lazy(() => import('./ui/{{pascalCase name}}ByID'));\nexport { {{pascalCase name}}ByIDAsync as {{pascalCase name}}ByID };`,
        });
      }

      return actions;
    },
  });
};
