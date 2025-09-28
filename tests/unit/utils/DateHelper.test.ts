/**
 * Tests for date utility functions
 */

import {
  formatDate,
  formatRssDate,
  formatAtomDate,
  isValidFeedDate,
  getCurrentDate,
} from '../../../src/utils/DateHelper';

describe('DateHelper', () => {
  describe('formatDate', () => {
    it('should format Date objects to ISO string', () => {
      const date = new Date('2023-12-01T10:30:00.000Z');
      expect(formatDate(date)).toBe('2023-12-01T10:30:00.000Z');
    });

    it('should format date strings to ISO string', () => {
      expect(formatDate('2023-12-01')).toBe('2023-12-01T00:00:00.000Z');
      expect(formatDate('2023-12-01T10:30:00Z')).toBe('2023-12-01T10:30:00.000Z');
    });

    it('should format timestamps to ISO string', () => {
      const timestamp = Date.UTC(2023, 11, 1, 10, 30, 0); // December 1, 2023
      expect(formatDate(timestamp)).toBe('2023-12-01T10:30:00.000Z');
    });

    it('should return current date for falsy values', () => {
      const before = Date.now();
      const result = new Date(formatDate(null as any)).getTime();
      const after = Date.now();
      
      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
    });

    it('should throw error for invalid date strings', () => {
      expect(() => formatDate('invalid-date')).toThrow('Invalid date string: invalid-date');
    });

    it('should throw error for invalid Date objects', () => {
      expect(() => formatDate(new Date('invalid'))).toThrow('Invalid Date object');
    });

    it('should throw error for unsupported types', () => {
      expect(() => formatDate({} as any)).toThrow('Unsupported date type: object');
    });
  });

  describe('formatRssDate', () => {
    it('should format dates in RFC 822 format', () => {
      const date = new Date('2023-12-01T10:30:00.000Z');
      const rssDate = formatRssDate(date);
      
      expect(rssDate).toMatch(/^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/);
      expect(rssDate).toBe('Fri, 01 Dec 2023 10:30:00 GMT');
    });

    it('should handle string dates', () => {
      const rssDate = formatRssDate('2023-12-01T10:30:00.000Z');
      expect(rssDate).toBe('Fri, 01 Dec 2023 10:30:00 GMT');
    });

    it('should handle timestamps', () => {
      const timestamp = Date.UTC(2023, 11, 1, 10, 30, 0);
      const rssDate = formatRssDate(timestamp);
      expect(rssDate).toBe('Fri, 01 Dec 2023 10:30:00 GMT');
    });
  });

  describe('formatAtomDate', () => {
    it('should format dates in ISO 8601 format (RFC 3339)', () => {
      const date = new Date('2023-12-01T10:30:00.000Z');
      expect(formatAtomDate(date)).toBe('2023-12-01T10:30:00.000Z');
    });

    it('should handle string dates', () => {
      expect(formatAtomDate('2023-12-01')).toBe('2023-12-01T00:00:00.000Z');
    });
  });

  describe('isValidFeedDate', () => {
    it('should validate reasonable dates', () => {
      const now = new Date();
      const recentDate = new Date(now.getFullYear() - 1, 0, 1);
      const futureDate = new Date(now.getFullYear(), 11, 31);
      
      expect(isValidFeedDate(now)).toBe(true);
      expect(isValidFeedDate(recentDate)).toBe(true);
      expect(isValidFeedDate(futureDate)).toBe(true);
    });

    it('should reject dates too far in the past', () => {
      const veryOldDate = new Date(1900, 0, 1);
      expect(isValidFeedDate(veryOldDate)).toBe(false);
    });

    it('should reject dates too far in the future', () => {
      const farFutureDate = new Date(2030, 0, 1);
      expect(isValidFeedDate(farFutureDate)).toBe(false);
    });

    it('should handle custom date ranges', () => {
      const testDate = new Date(2020, 0, 1);
      
      expect(isValidFeedDate(testDate, 10, 5)).toBe(true); // Within 10 years past, 5 years future
      expect(isValidFeedDate(testDate, 2, 5)).toBe(false); // Outside 2 years past
    });

    it('should handle invalid dates', () => {
      expect(isValidFeedDate('invalid-date')).toBe(false);
      expect(isValidFeedDate(new Date('invalid'))).toBe(false);
    });
  });

  describe('getCurrentDate', () => {
    it('should return current date in ISO format', () => {
      const before = Date.now();
      const current = getCurrentDate();
      const after = Date.now();
      
      const currentTime = new Date(current).getTime();
      
      expect(currentTime).toBeGreaterThanOrEqual(before);
      expect(currentTime).toBeLessThanOrEqual(after);
      expect(current).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});