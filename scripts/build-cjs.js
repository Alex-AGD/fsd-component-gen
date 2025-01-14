import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Читаем ESM версию
const esmCode = readFileSync(join(__dirname, '../dist/index.js'), 'utf8');

// Конвертируем в CommonJS
const cjsCode = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

${esmCode.replace('export default', 'module.exports = ')}
`;

// Сохраняем CommonJS версию
writeFileSync(join(__dirname, '../dist/index.cjs'), cjsCode); 