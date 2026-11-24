#!/usr/bin/env node

/**
 * Install the packed tarball in a clean project and load both entry points.
 */

import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const packedName = execFileSync('npm', ['pack', '--ignore-scripts'], {
  cwd: root,
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .pop();

if (!packedName || !/^[@\w.-]+\.tgz$/.test(packedName)) {
  throw new Error('npm pack did not report a tarball name');
}

const tarball = path.join(root, packedName);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'npm-feed-smoke-'));

try {
  fs.writeFileSync(
    path.join(temp, 'package.json'),
    `${JSON.stringify({ name: 'feed-smoke', private: true, version: '1.0.0' }, null, 2)}\n`
  );
  execFileSync('npm', ['install', '--ignore-scripts', '--no-save', '--no-package-lock', tarball], {
    cwd: temp,
    stdio: 'inherit',
  });

  fs.writeFileSync(
    path.join(temp, 'check-cjs.cjs'),
    [
      "const assert = require('assert');",
      "const mod = require('@rumenx/feed');",
      "assert.strictEqual(typeof mod.Feed, 'function');",
      "assert.strictEqual(typeof mod.FeedItem, 'function');",
      "console.log('cjs', typeof mod.Feed);",
      '',
    ].join('\n')
  );
  fs.writeFileSync(
    path.join(temp, 'check-esm.mjs'),
    [
      "import assert from 'node:assert';",
      "import * as mod from '@rumenx/feed';",
      "assert.strictEqual(typeof mod.Feed, 'function');",
      "assert.strictEqual(typeof mod.FeedItem, 'function');",
      "console.log('esm', typeof mod.Feed);",
      '',
    ].join('\n')
  );

  for (const args of [
    ['check-cjs.cjs'],
    ['check-esm.mjs'],
    ['--no-experimental-detect-module', 'check-cjs.cjs'],
    ['--no-experimental-detect-module', 'check-esm.mjs'],
  ]) {
    execFileSync('node', args, { cwd: temp, stdio: 'inherit' });
  }
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
  fs.rmSync(tarball, { force: true });
}
