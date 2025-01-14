const fs = require('fs');
const path = require('path');

const esmCode = fs.readFileSync(path.join(__dirname, '../dist/index.js'), 'utf8');

const cjsCode = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

${esmCode.replace('export default', 'module.exports = ')}
`;

fs.writeFileSync(path.join(__dirname, '../dist/index.cjs'), cjsCode); 