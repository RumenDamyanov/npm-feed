/**
 * XML utility functions for feed generation
 */

const xmlName = /^[A-Za-z_][A-Za-z0-9:._-]*$/;

/**
 * Remove characters that XML 1.0 forbids in text. Tab, line feed, and carriage return stay.
 */
export function stripIllegalXmlChars(text: string): string {
  let result = '';
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    const illegal =
      code <= 0x08 || code === 0x0b || code === 0x0c || (code >= 0x0e && code <= 0x1f);
    if (!illegal) {
      result += text.charAt(index);
    }
  }
  return result;
}

/**
 * Escape XML special characters
 */
export function escapeXml(text: string): string {
  const value = typeof text === 'string' ? text : String(text);

  return stripIllegalXmlChars(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Create CDATA section for content that might contain HTML
 */
export function createCdata(content: string): string {
  if (typeof content !== 'string') {
    return `<![CDATA[${String(content)}]]>`;
  }

  // Escape any CDATA end markers within the content
  const escapedContent = content.replace(/]]>/g, ']]]]><![CDATA[>');
  return `<![CDATA[${escapedContent}]]>`;
}

/**
 * Format XML with proper indentation
 */
export function formatXml(xml: string, indent: string = '  '): string {
  const tokens = xml.split(/(<[^>]*>)/);
  let result = '';
  let level = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]?.trim();

    if (!token) continue;

    if (token.startsWith('<?xml')) {
      // XML declaration
      result += `${token}\n`;
    } else if (token.startsWith('</')) {
      // Closing tag
      level--;

      // Check if previous token was text content (inline content)
      const prevToken = i > 0 ? tokens[i - 1]?.trim() : '';
      const isInlineContent = prevToken && !prevToken.startsWith('<');

      if (!isInlineContent) {
        result += indent.repeat(level);
      }
      result += token;
      if (i < tokens.length - 1) {
        result += '\n';
      }
    } else if (token.startsWith('<') && !token.endsWith('/>')) {
      // Opening tag
      result += indent.repeat(level);
      result += token;

      // Check if this will be simple inline content
      const nextToken = i + 1 < tokens.length ? tokens[i + 1]?.trim() : '';
      const tokenAfter = i + 2 < tokens.length ? tokens[i + 2]?.trim() : '';
      const isSimpleInline =
        nextToken && !nextToken.startsWith('<') && tokenAfter?.startsWith('</');

      if (!isSimpleInline) {
        result += '\n';
      }
      level++;
    } else if (token.endsWith('/>')) {
      // Self-closing tag
      result += indent.repeat(level);
      result += `${token}\n`;
    } else {
      // Text content
      const nextToken = i + 1 < tokens.length ? tokens[i + 1]?.trim() : '';
      const isInlineContent = nextToken?.startsWith('</');

      if (isInlineContent) {
        // Keep inline
        result += token;
      } else {
        // Block content
        result += `${indent.repeat(level)}${token}\n`;
      }
    }
  }

  return result.trim();
}

/**
 * Validate XML tag name
 */
export function isValidXmlTagName(name: string): boolean {
  // XML tag names must start with a letter or underscore
  // and contain only letters, digits, hyphens, periods, and underscores
  const xmlNamePattern = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/;
  return xmlNamePattern.test(name);
}

/**
 * Create XML element with attributes and content
 */
export function createElement(
  tagName: string,
  content: string = '',
  attributes: Record<string, string> = {},
  escapeContent: boolean = true
): string {
  if (!isValidXmlTagName(tagName)) {
    throw new Error(`Invalid XML tag name: ${tagName}`);
  }

  const attrs = Object.entries(attributes)
    .map(([key, value]) => {
      if (!xmlName.test(key)) {
        throw new Error(`Invalid XML attribute name: ${key}`);
      }
      return `${key}="${escapeXml(value)}"`;
    })
    .join(' ');

  const attrString = attrs ? ` ${attrs}` : '';
  const processedContent = escapeContent ? escapeXml(content) : content;

  if (!content) {
    return `<${tagName}${attrString}/>`;
  }

  return `<${tagName}${attrString}>${processedContent}</${tagName}>`;
}
