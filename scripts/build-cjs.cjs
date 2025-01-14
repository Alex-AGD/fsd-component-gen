const fs = require('fs');
const path = require('path');

const esmCode = fs.readFileSync(path.join(__dirname, '../dist/index.js'), 'utf8');

const cjsCode = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const path = require('path');

${esmCode
  .replace(/import\s+{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/g, 'const { $1 } = require("$2")')
  .replace('export default', 'module.exports =')
  .replace(/export\s+function\s+(\w+)/g, 'exports.$1 = function $1')
  .replace(/export\s+class\s+(\w+)/g, 'exports.$1 = class $1')
  .replace(/export \* from/g, 'Object.assign(exports, require')
  .replace(/['"]\.\/utils\/paths['"]/g, "'./utils'")
}
`;

fs.writeFileSync(path.join(__dirname, '../dist/index.cjs'), cjsCode); 