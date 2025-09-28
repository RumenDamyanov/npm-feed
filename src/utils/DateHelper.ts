/**
 * Date utility functions for feed generation
 */

/**
 * Convert various date inputs to ISO 8601 string
 */
export function formatDate(date: Date | string | number): string {
  if (!date) {
    return new Date().toISOString();
  }
  
  if (typeof date === 'string') {
    // Try to parse the string as a date
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date string: ${date}`);
    }
    return parsed.toISOString();
  }
  
  if (typeof date === 'number') {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date number: ${date}`);
    }
    return parsed.toISOString();
  }
  
  if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date object');
    }
    return date.toISOString();
  }
  
  throw new Error(`Unsupported date type: ${typeof date}`);
}

/**
 * Format date for RSS feeds (RFC 822)
 */
export function formatRssDate(date: Date | string | number): string {
  const isoDate = formatDate(date);
  const dateObj = new Date(isoDate);
  
  // RFC 822 format: "Wed, 02 Oct 2002 13:00:00 GMT"
  return dateObj.toUTCString();
}

/**
 * Format date for Atom feeds (RFC 3339)
 */
export function formatAtomDate(date: Date | string | number): string {
  return formatDate(date);
}

/**
 * Validate if a date is reasonable (not too far in past/future)
 */
export function isValidFeedDate(date: Date | string | number, maxYearsInPast: number = 50, maxYearsInFuture: number = 1): boolean {
  try {
    const dateObj = new Date(formatDate(date));
    const now = new Date();
    const minDate = new Date(now.getFullYear() - maxYearsInPast, 0, 1);
    const maxDate = new Date(now.getFullYear() + maxYearsInFuture, 11, 31);
    
    return dateObj >= minDate && dateObj <= maxDate;
  } catch {
    return false;
  }
}

/**
 * Get current date in ISO format
 */
export function getCurrentDate(): string {
  return new Date().toISOString();
}