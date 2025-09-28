/**
 * Tests for XML utility functions
 */

import {
  escapeXml,
  createCdata,
  formatXml,
  isValidXmlTagName,
  createElement,
} from '../../../src/utils/XmlHelper';

describe('XmlHelper', () => {
  describe('escapeXml', () => {
    it('should escape XML special characters', () => {
      expect(escapeXml('Hello & World')).toBe('Hello &amp; World');
      expect(escapeXml('<tag>content</tag>')).toBe('&lt;tag&gt;content&lt;/tag&gt;');
      expect(escapeXml('Quote "this" text')).toBe('Quote &quot;this&quot; text');
      expect(escapeXml("Single 'quote' test")).toBe('Single &#39;quote&#39; test');
    });

    it('should handle empty and special inputs', () => {
      expect(escapeXml('')).toBe('');
      expect(escapeXml('Normal text')).toBe('Normal text');
      expect(escapeXml('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&#39;');
    });

    it('should convert non-string values to strings', () => {
      expect(escapeXml(123 as any)).toBe('123');
      expect(escapeXml(null as any)).toBe('null');
      expect(escapeXml(undefined as any)).toBe('undefined');
    });
  });

  describe('createCdata', () => {
    it('should wrap content in CDATA section', () => {
      expect(createCdata('Hello World')).toBe('<![CDATA[Hello World]]>');
      expect(createCdata('<p>HTML content</p>')).toBe('<![CDATA[<p>HTML content</p>]]>');
    });

    it('should escape CDATA end markers', () => {
      expect(createCdata('Text with ]]> marker')).toBe('<![CDATA[Text with ]]]]><![CDATA[> marker]]>');
    });

    it('should handle non-string inputs', () => {
      expect(createCdata(123 as any)).toBe('<![CDATA[123]]>');
    });
  });

  describe('isValidXmlTagName', () => {
    it('should validate correct XML tag names', () => {
      expect(isValidXmlTagName('div')).toBe(true);
      expect(isValidXmlTagName('_private')).toBe(true);
      expect(isValidXmlTagName('my-tag')).toBe(true);
      expect(isValidXmlTagName('tag123')).toBe(true);
      expect(isValidXmlTagName('ns:tag')).toBe(false); // Colon not allowed in basic validation
    });

    it('should reject invalid XML tag names', () => {
      expect(isValidXmlTagName('123tag')).toBe(false); // Can't start with number
      expect(isValidXmlTagName('-tag')).toBe(false); // Can't start with hyphen
      expect(isValidXmlTagName('tag with spaces')).toBe(false);
      expect(isValidXmlTagName('')).toBe(false);
    });
  });

  describe('createElement', () => {
    it('should create simple XML elements', () => {
      expect(createElement('title', 'Hello World')).toBe('<title>Hello World</title>');
      expect(createElement('description', 'Test content')).toBe('<description>Test content</description>');
    });

    it('should create self-closing elements', () => {
      expect(createElement('br')).toBe('<br/>');
      expect(createElement('img', '', { src: 'test.jpg' })).toBe('<img src="test.jpg"/>');
    });

    it('should handle attributes', () => {
      expect(createElement('link', '', { href: 'https://example.com' }))
        .toBe('<link href="https://example.com"/>');
      
      expect(createElement('a', 'Click here', { href: 'https://example.com', target: '_blank' }))
        .toBe('<a href="https://example.com" target="_blank">Click here</a>');
    });

    it('should escape content and attributes', () => {
      expect(createElement('title', 'Hello & World')).toBe('<title>Hello &amp; World</title>');
      expect(createElement('link', '', { href: 'https://example.com?a=1&b=2' }))
        .toBe('<link href="https://example.com?a=1&amp;b=2"/>');
    });

    it('should handle unescaped content', () => {
      expect(createElement('description', '<![CDATA[HTML content]]>', {}, false))
        .toBe('<description><![CDATA[HTML content]]></description>');
    });

    it('should throw error for invalid tag names', () => {
      expect(() => createElement('123invalid', 'content')).toThrow('Invalid XML tag name: 123invalid');
    });
  });

  describe('formatXml', () => {
    it('should format simple XML with indentation', () => {
      const xml = '<root><item>content</item></root>';
      const formatted = formatXml(xml);
      
      expect(formatted).toContain('<root>');
      expect(formatted).toContain('  <item>content</item>');
      expect(formatted).toContain('</root>');
    });

    it('should preserve XML declaration', () => {
      const xml = '<?xml version="1.0"?><root><item>test</item></root>';
      const formatted = formatXml(xml);
      
      expect(formatted).toMatch(/^<\?xml version="1\.0"\?>/);
    });

    it('should handle self-closing tags', () => {
      const xml = '<root><item/><other>content</other></root>';
      const formatted = formatXml(xml);
      
      expect(formatted).toContain('  <item/>');
      expect(formatted).toContain('  <other>content</other>');
    });

    it('should use custom indentation', () => {
      const xml = '<root><item>content</item></root>';
      const formatted = formatXml(xml, '    '); // 4 spaces
      
      expect(formatted).toContain('    <item>content</item>');
    });
  });
});