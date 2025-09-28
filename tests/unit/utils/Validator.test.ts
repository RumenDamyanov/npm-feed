/**
 * Tests for validation utility functions
 */

import {
  isValidUrl,
  isAllowedDomain,
  isValidEmail,
  isValidLanguageCode,
  isValidPriority,
  validateRequiredString,
  validateUrl,
  validateFeedItem,
} from '../../../src/utils/Validator';

describe('Validator', () => {
  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com:8080/path?query=value')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('   ')).toBe(false);
    });

    it('should handle non-string inputs', () => {
      expect(isValidUrl(null as any)).toBe(false);
      expect(isValidUrl(undefined as any)).toBe(false);
      expect(isValidUrl(123 as any)).toBe(false);
    });
  });

  describe('isAllowedDomain', () => {
    it('should allow all domains when no restrictions', () => {
      expect(isAllowedDomain('https://example.com')).toBe(true);
      expect(isAllowedDomain('https://any-domain.com', [])).toBe(true);
    });

    it('should validate allowed domains', () => {
      const allowedDomains = ['example.com', 'test.org'];
      
      expect(isAllowedDomain('https://example.com', allowedDomains)).toBe(true);
      expect(isAllowedDomain('https://test.org/path', allowedDomains)).toBe(true);
      expect(isAllowedDomain('https://sub.example.com', allowedDomains)).toBe(true);
    });

    it('should reject non-allowed domains', () => {
      const allowedDomains = ['example.com'];
      
      expect(isAllowedDomain('https://other.com', allowedDomains)).toBe(false);
      expect(isAllowedDomain('https://fake-example.com', allowedDomains)).toBe(false);
    });

    it('should handle malformed URLs', () => {
      expect(isAllowedDomain('not-a-url', ['example.com'])).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.email@domain.org')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('   ')).toBe(false);
    });
  });

  describe('isValidLanguageCode', () => {
    it('should validate correct language codes', () => {
      expect(isValidLanguageCode('en')).toBe(true);
      expect(isValidLanguageCode('en-US')).toBe(true);
      expect(isValidLanguageCode('fr-FR')).toBe(true);
      expect(isValidLanguageCode('zh-CN')).toBe(true);
    });

    it('should reject invalid language codes', () => {
      expect(isValidLanguageCode('eng')).toBe(false); // Too long
      expect(isValidLanguageCode('e')).toBe(false); // Too short
      expect(isValidLanguageCode('en-usa')).toBe(false); // Country code too long
      expect(isValidLanguageCode('EN')).toBe(false); // Wrong case
      expect(isValidLanguageCode('')).toBe(false);
    });
  });

  describe('isValidPriority', () => {
    it('should validate priority values in range 0-1', () => {
      expect(isValidPriority(0)).toBe(true);
      expect(isValidPriority(0.5)).toBe(true);
      expect(isValidPriority(1)).toBe(true);
      expect(isValidPriority(0.9)).toBe(true);
    });

    it('should reject priority values outside range', () => {
      expect(isValidPriority(-0.1)).toBe(false);
      expect(isValidPriority(1.1)).toBe(false);
      expect(isValidPriority(2)).toBe(false);
    });

    it('should reject non-numeric values', () => {
      expect(isValidPriority('0.5' as any)).toBe(false);
      expect(isValidPriority(null as any)).toBe(false);
      expect(isValidPriority(undefined as any)).toBe(false);
    });
  });

  describe('validateRequiredString', () => {
    it('should pass for valid strings', () => {
      expect(validateRequiredString('Valid string', 'field')).toBeNull();
      expect(validateRequiredString('  Trimmed  ', 'field')).toBeNull();
    });

    it('should fail for empty or invalid strings', () => {
      const error1 = validateRequiredString('', 'title');
      expect(error1).toEqual({
        field: 'title',
        type: 'required',
        message: 'title is required and must be a non-empty string',
        value: '',
      });

      const error2 = validateRequiredString('   ', 'description');
      expect(error2?.field).toBe('description');
      expect(error2?.type).toBe('required');

      const error3 = validateRequiredString(null, 'field');
      expect(error3?.type).toBe('required');
    });
  });

  describe('validateUrl', () => {
    it('should pass for valid URLs', () => {
      expect(validateUrl('https://example.com', 'link')).toBeNull();
      expect(validateUrl('http://test.org/path', 'url')).toBeNull();
    });

    it('should fail for invalid URLs', () => {
      const error = validateUrl('not-a-url', 'link');
      expect(error?.field).toBe('link');
      expect(error?.type).toBe('invalid_url');
    });

    it('should fail for non-allowed domains', () => {
      const error = validateUrl('https://blocked.com', 'link', ['example.com']);
      expect(error?.field).toBe('link');
      expect(error?.type).toBe('domain_not_allowed');
    });
  });

  describe('validateFeedItem', () => {
    const validItem = {
      title: 'Test Item',
      description: 'Test description',
      link: 'https://example.com/item',
    };

    it('should pass for valid feed items', () => {
      const errors = validateFeedItem(validItem);
      expect(errors).toHaveLength(0);
    });

    it('should fail for missing required fields', () => {
      const errors = validateFeedItem({} as any);
      expect(errors).toHaveLength(3); // title, description, link
      
      const fields = errors.map(e => e.field);
      expect(fields).toContain('title');
      expect(fields).toContain('description');
      expect(fields).toContain('link');
    });

    it('should validate priority', () => {
      const errors = validateFeedItem({
        ...validItem,
        priority: 2, // Invalid priority
      });
      
      expect(errors).toHaveLength(1);
      expect(errors[0]?.field).toBe('priority');
      expect(errors[0]?.type).toBe('invalid_range');
    });

    it('should validate images', () => {
      const errors = validateFeedItem({
        ...validItem,
        images: [{ url: 'not-a-url' }],
      });
      
      expect(errors).toHaveLength(1);
      expect(errors[0]?.field).toBe('images[0].url');
      expect(errors[0]?.type).toBe('invalid_url');
    });

    it('should validate videos', () => {
      const errors = validateFeedItem({
        ...validItem,
        videos: [{
          thumbnail_url: 'https://example.com/thumb.jpg',
          content_url: 'not-a-url', // Invalid URL
          title: 'Video Title',
          description: 'Video description',
        }],
      });
      
      expect(errors).toHaveLength(1);
      expect(errors[0]?.field).toBe('videos[0].content_url');
    });

    it('should validate translations', () => {
      const errors = validateFeedItem({
        ...validItem,
        translations: [
          { language: 'invalid-lang', url: 'https://example.com/es' },
          { language: 'fr', url: 'not-a-url' },
        ],
      });
      
      expect(errors).toHaveLength(2);
      
      const fields = errors.map(e => e.field);
      expect(fields).toContain('translations[0].language');
      expect(fields).toContain('translations[1].url');
    });

    it('should respect allowed domains', () => {
      const errors = validateFeedItem(validItem, ['other.com']);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]?.field).toBe('link');
      expect(errors[0]?.type).toBe('domain_not_allowed');
    });
  });
});