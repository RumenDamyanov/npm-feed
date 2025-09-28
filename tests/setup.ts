/**
 * Jest setup file for @rumenx/feed tests
 */

// Global test timeout
jest.setTimeout(10000);

// Custom matchers for better testing experience
expect.extend({
  toBeValidXML(received: string) {
    try {
      // Basic XML validation - check for balanced tags
      const tagPattern = /<([^>]+)>/g;
      const tags: string[] = [];
      let match;
      
      while ((match = tagPattern.exec(received)) !== null) {
        const tag = match[1];
        
        // Skip XML declarations, processing instructions, and comments
        if (tag.startsWith('?') || tag.startsWith('!')) {
          continue;
        }
        
        if (tag.startsWith('/')) {
          // Closing tag
          const tagName = tag.substring(1);
          const lastTag = tags.pop();
          if (lastTag !== tagName) {
            return {
              message: () => `Expected valid XML, but found unmatched closing tag: ${tag}`,
              pass: false,
            };
          }
        } else if (!tag.endsWith('/')) {
          // Opening tag (not self-closing)
          const tagName = tag.split(' ')[0];
          tags.push(tagName);
        }
      }
      
      if (tags.length > 0) {
        return {
          message: () => `Expected valid XML, but found unclosed tags: ${tags.join(', ')}`,
          pass: false,
        };
      }
      
      return {
        message: () => 'Expected invalid XML',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `Expected valid XML, but parsing failed: ${error}`,
        pass: false,
      };
    }
  },
  
  toContainXMLElement(received: string, elementName: string) {
    const pattern = new RegExp(`<${elementName}[^>]*>.*?</${elementName}>`, 's');
    const pass = pattern.test(received);
    
    return {
      message: () => 
        pass 
          ? `Expected XML not to contain element ${elementName}`
          : `Expected XML to contain element ${elementName}`,
      pass,
    };
  }
});

// Declare custom matcher types for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidXML(): R;
      toContainXMLElement(elementName: string): R;
    }
  }
}

// Export empty object to make this a module
export {};