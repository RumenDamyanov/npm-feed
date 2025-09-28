/**
 * Example test file structure for @rumenx/feed
 * This file demonstrates the testing patterns and can be used as a template
 */

describe('@rumenx/feed', () => {
  describe('Package Structure', () => {
    it('should have proper package.json configuration', () => {
      const packageJson = require('../../package.json');

      expect(packageJson.name).toBe('@rumenx/feed');
      expect(packageJson.author.name).toBe('Rumen Damyanov');
      expect(packageJson.author.email).toBe('contact@rumenx.com');
      expect(packageJson.license).toBe('MIT');
    });

    it('should have proper exports configuration', () => {
      const packageJson = require('../../package.json');

      expect(packageJson.exports).toBeDefined();
      expect(packageJson.exports['.']).toBeDefined();
      expect(packageJson.exports['.'].import).toBe('./dist/esm/index.js');
      expect(packageJson.exports['.'].require).toBe('./dist/cjs/index.js');
      expect(packageJson.exports['.'].types).toBe('./dist/types/index.d.ts');
    });

    it('should have proper development scripts', () => {
      const packageJson = require('../../package.json');

      expect(packageJson.scripts.build).toBeDefined();
      expect(packageJson.scripts.test).toBeDefined();
      expect(packageJson.scripts.lint).toBeDefined();
      expect(packageJson.scripts.typecheck).toBeDefined();
    });
  });

  describe('Custom Jest Matchers', () => {
    it('should validate XML structure with toBeValidXML matcher', () => {
      const validXML = '<?xml version="1.0"?><root><item>content</item></root>';
      const invalidXML = '<root><item>content</root>'; // Missing closing tag

      expect(validXML).toBeValidXML();
      expect(invalidXML).not.toBeValidXML();
    });

    it('should check XML elements with toContainXMLElement matcher', () => {
      const xmlWithTitle = '<feed><title>My Feed</title></feed>';
      const xmlWithoutTitle = '<feed><description>My Feed</description></feed>';

      expect(xmlWithTitle).toContainXMLElement('title');
      expect(xmlWithoutTitle).not.toContainXMLElement('title');
    });
  });

  describe('Project Configuration', () => {
    it('should have TypeScript configuration files', () => {
      const fs = require('fs');
      const path = require('path');

      const projectRoot = path.resolve(__dirname, '../..');

      expect(fs.existsSync(path.join(projectRoot, 'tsconfig.json'))).toBe(true);
      expect(fs.existsSync(path.join(projectRoot, 'tsconfig.esm.json'))).toBe(true);
      expect(fs.existsSync(path.join(projectRoot, 'tsconfig.cjs.json'))).toBe(true);
      expect(fs.existsSync(path.join(projectRoot, 'tsconfig.types.json'))).toBe(true);
    });

    it('should have development configuration files', () => {
      const fs = require('fs');
      const path = require('path');

      const projectRoot = path.resolve(__dirname, '../..');

      expect(fs.existsSync(path.join(projectRoot, 'jest.config.cjs'))).toBe(true);
      expect(fs.existsSync(path.join(projectRoot, 'eslint.config.cjs'))).toBe(true);
      expect(fs.existsSync(path.join(projectRoot, '.prettierrc.json'))).toBe(true);
    });

    it('should have proper documentation files', () => {
      const fs = require('fs');
      const path = require('path');

      const projectRoot = path.resolve(__dirname, '../..');

      expect(fs.existsSync(path.join(projectRoot, 'README.md'))).toBe(true);
      expect(fs.existsSync(path.join(projectRoot, 'LICENSE.md'))).toBe(true);
      expect(fs.existsSync(path.join(projectRoot, 'CHANGELOG.md'))).toBe(true);
      expect(fs.existsSync(path.join(projectRoot, 'CONTRIBUTING.md'))).toBe(true);
    });
  });
});
