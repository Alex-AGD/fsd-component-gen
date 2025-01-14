import { resolve } from 'path';

export function getTemplatesPath() {
  return resolve(process.cwd(), 'plop-templates');
}
