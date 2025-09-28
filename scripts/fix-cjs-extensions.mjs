#!/usr/bin/env node

/**
 * Fix CommonJS extensions after TypeScript compilation
 * This script ensures proper .js extensions are used in require() statements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix relative imports without extensions
  const originalContent = content;
  
  // Fix CommonJS require() statements
  content = content.replace(
    /require\(["'](\.\.?\/[^"']+?)["']\)/g,
    (match, importPath) => {
      if (!importPath.endsWith('.js')) {
        return `require("${importPath}.js")`;
      }
      return match;
    }
  );
  
  // Fix ESM import statements
  content = content.replace(
    /from\s+["'](\.\.?\/[^"']+?)["']/g,
    (match, importPath) => {
      if (!importPath.endsWith('.js')) {
        return `from "${importPath}.js"`;
      }
      return match;
    }
  );
  
  // Fix dynamic import() statements
  content = content.replace(
    /import\(["'](\.\.?\/[^"']+?)["']\)/g,
    (match, importPath) => {
      if (!importPath.endsWith('.js')) {
        return `import("${importPath}.js")`;
      }
      return match;
    }
  );
  
  if (content !== originalContent) {
    console.log(`Fixed imports in: ${filePath}`);
  }
  
  fs.writeFileSync(filePath, content);
}

const cjsDir = path.join(__dirname, '..', 'dist', 'cjs');
const esmDir = path.join(__dirname, '..', 'dist', 'esm');

if (fs.existsSync(cjsDir)) {
  console.log('Fixing CommonJS extensions...');
  processDirectory(cjsDir);
  console.log('CommonJS extensions fixed.');
} else {
  console.log('CommonJS dist directory not found, skipping...');
}

if (fs.existsSync(esmDir)) {
  console.log('Fixing ESM extensions...');
  processDirectory(esmDir);
  console.log('ESM extensions fixed.');
} else {
  console.log('ESM dist directory not found, skipping...');
}