const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist');

// Убедимся, что директория dist существует
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

const esmCode = fs.readFileSync(path.join(distPath, 'index.js'), 'utf8');

const cjsCode = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

${esmCode
  .replace(/import\s+{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/g, 'const { $1 } = require("$2")')
  .replace('export default', 'module.exports =')
  .replace(/export\s+function\s+(\w+)/g, 'exports.$1 = function $1')
  .replace(/export\s+class\s+(\w+)/g, 'exports.$1 = class $1')
}
`;

fs.writeFileSync(path.join(distPath, 'index.cjs'), cjsCode);
