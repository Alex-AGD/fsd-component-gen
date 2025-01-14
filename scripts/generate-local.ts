import { Plop, run } from 'plop';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(__dirname, '..');

// Запускаем plop локально
Plop.prepare({
  cwd: projectDir,
  configPath: resolve(projectDir, 'plopfile.js'),
  preload: undefined,
  completion: undefined
}, env => run(env, undefined, true));
