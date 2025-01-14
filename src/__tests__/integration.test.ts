import { NodePlopAPI } from 'plop';
import fs from 'fs/promises';
import path from 'path';
import generateComponent from '../index';
import { PlopGeneratorConfig } from '../types';

// В начале файла добавим интерфейс для действий
interface PlopAction {
  type: string;
  path?: string;
  template?: string;
  templateFile?: string;
  pattern?: RegExp;
}

describe('Component Generation', () => {
  const testDir = path.join(process.cwd(), 'test-output');
  let mockPlop: jest.Mocked<NodePlopAPI>;
  let setGeneratorMock: jest.Mock;
  let runActionsMock: jest.Mock;

  beforeEach(async () => {
    // Очищаем тестовую директорию
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (e) {
      // Игнорируем ошибку если директория не существует
    }
    await fs.mkdir(testDir, { recursive: true });

    // Создаем моки
    runActionsMock = jest.fn().mockResolvedValue({ changes: [], failures: [] });
    setGeneratorMock = jest.fn();

    mockPlop = {
      setGenerator: setGeneratorMock,
      getGenerator: jest.fn().mockReturnValue({ runActions: runActionsMock }),
      setHelper: jest.fn(),
      setPartial: jest.fn(),
      setActionType: jest.fn(),
      setPrompt: jest.fn(),
      getHelper: jest.fn(),
      getPartial: jest.fn(),
      getActionType: jest.fn(),
      setWelcomeMessage: jest.fn(),
      getGeneratorList: jest.fn(),
      setPlopfilePath: jest.fn(),
      getPlopfilePath: jest.fn(),
      getDestBasePath: jest.fn(),
      setDefaultInclude: jest.fn(),
      getDefaultInclude: jest.fn(),
      renderString: jest.fn(),
    } satisfies Partial<NodePlopAPI> as unknown as jest.Mocked<NodePlopAPI>;
  });

  it('should register component generator with correct configuration', () => {
    const config: PlopGeneratorConfig = {
      templatesPath: path.join(process.cwd(), 'plop-templates'),
      layerChoices: ['pages', 'features'],
    };

    generateComponent(mockPlop, config);

    expect(setGeneratorMock).toHaveBeenCalledWith(
      'component',
      expect.objectContaining({
        description: expect.any(String),
        prompts: expect.any(Array),
        actions: expect.any(Function),
      })
    );
  });

  it('should generate files for features layer', async () => {
    generateComponent(mockPlop);

    const generator = setGeneratorMock.mock.calls[0][1];
    const actions = generator.actions({
      layer: 'features',
      name: 'TestComponent',
      useMemo: false,
    });

    expect(actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/ui/{{pascalCase name}}Features.tsx',
        }),
        expect.objectContaining({
          type: 'add',
          path: 'src/{{layer}}/{{camelCase name}}/model/{{camelCase name}}Model.ts',
        }),
      ])
    );
  });

  it('should handle byID component generation for pages', async () => {
    generateComponent(mockPlop);

    const generator = setGeneratorMock.mock.calls[0][1];
    const actions = generator.actions({
      layer: 'pages',
      name: 'TestPage',
      withByID: true,
      useMemo: false,
    });

    const byIDAction = actions.find(
      (action: PlopAction) =>
        action.path?.includes('ByID.tsx') ||
        (action.type === 'append' && action.template?.includes('ByIDAsync'))
    );

    expect(byIDAction).toBeTruthy();
    expect(byIDAction).toMatchObject({
      type: expect.stringMatching(/^(add|append)$/),
      path: expect.stringContaining('pages/{{camelCase name}}/ui/{{pascalCase name}}ByID.tsx'),
    });
  });

  it('should validate component name in prompts', () => {
    generateComponent(mockPlop);

    const generator = setGeneratorMock.mock.calls[0][1];
    const namePrompt = generator.prompts.find((p: any) => p.name === 'name');

    expect(namePrompt.validate('invalidname')).toBe(
      'Имя компонента должно начинаться с заглавной буквы'
    );
    expect(namePrompt.validate('ValidName')).toBe(true);
  });

  it('should show byID prompt only for pages layer', () => {
    generateComponent(mockPlop);

    const generator = setGeneratorMock.mock.calls[0][1];
    const byIDPrompt = generator.prompts.find((p: any) => p.name === 'withByID');

    expect(byIDPrompt.when({ layer: 'pages' })).toBe(true);
    expect(byIDPrompt.when({ layer: 'features' })).toBe(false);
  });
});
