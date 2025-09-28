/**
 * Validation utility functions for feed generation
 */

import type { ValidationError } from '../types/FeedTypes';
import type { FeedItemData } from '../types/FeedItemTypes';

/**
 * Validate URL format using a simple regex pattern
 */
export function isValidUrl(url: string): boolean {
  if (typeof url !== 'string' || !url.trim()) {
    return false;
  }
  
  // Simple URL validation pattern
  const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url.trim());
}

/**
 * Validate URL against allowed domains
 */
export function isAllowedDomain(url: string, allowedDomains?: string[]): boolean {
  if (!allowedDomains || allowedDomains.length === 0) {
    return true;
  }
  
  // Extract hostname from URL using regex
  const hostnameMatch = url.match(/^https?:\/\/([^/]+)/i);
  if (!hostnameMatch) {
    return false;
  }
  
  const hostname = hostnameMatch[1]?.toLowerCase();
  if (!hostname) {
    return false;
  }
  
  return allowedDomains.some(domain => {
    const normalizedDomain = domain.toLowerCase();
    return hostname === normalizedDomain || hostname.endsWith(`.${normalizedDomain}`);
  });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string' || !email.trim()) {
    return false;
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Validate language code (basic RFC 3066 check)
 */
export function isValidLanguageCode(lang: string): boolean {
  if (typeof lang !== 'string' || !lang.trim()) {
    return false;
  }
  
  // Basic pattern: 2-letter language code, optionally followed by country code
  const langPattern = /^[a-z]{2}(-[A-Z]{2})?$/;
  return langPattern.test(lang);
}

/**
 * Validate priority value (0.0 to 1.0)
 */
export function isValidPriority(priority: number): boolean {
  return typeof priority === 'number' && priority >= 0 && priority <= 1;
}

/**
 * Validate required string field
 */
export function validateRequiredString(value: any, fieldName: string): ValidationError | null {
  if (typeof value !== 'string' || !value.trim()) {
    return {
      field: fieldName,
      type: 'required',
      message: `${fieldName} is required and must be a non-empty string`,
      value,
    };
  }
  return null;
}

/**
 * Validate URL field
 */
export function validateUrl(url: any, fieldName: string, allowedDomains?: string[]): ValidationError | null {
  const stringError = validateRequiredString(url, fieldName);
  if (stringError) return stringError;
  
  if (!isValidUrl(url)) {
    return {
      field: fieldName,
      type: 'invalid_url',
      message: `${fieldName} must be a valid HTTP or HTTPS URL`,
      value: url,
    };
  }
  
  if (!isAllowedDomain(url, allowedDomains)) {
    return {
      field: fieldName,
      type: 'domain_not_allowed',
      message: `${fieldName} domain is not in the allowed domains list`,
      value: url,
    };
  }
  
  return null;
}

/**
 * Validate feed item data
 */
export function validateFeedItem(item: FeedItemData, allowedDomains?: string[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Validate required fields
  const titleError = validateRequiredString(item.title, 'title');
  if (titleError) errors.push(titleError);
  
  const descriptionError = validateRequiredString(item.description, 'description');
  if (descriptionError) errors.push(descriptionError);
  
  const linkError = validateUrl(item.link, 'link', allowedDomains);
  if (linkError) errors.push(linkError);
  
  // Validate optional fields
  if (item.author !== undefined) {
    const authorError = validateRequiredString(item.author, 'author');
    if (authorError) errors.push(authorError);
  }
  
  if (item.priority !== undefined && !isValidPriority(item.priority)) {
    errors.push({
      field: 'priority',
      type: 'invalid_range',
      message: 'priority must be a number between 0.0 and 1.0',
      value: item.priority,
    });
  }
  
  // Validate images
  if (item.images) {
    item.images.forEach((image, index) => {
      const imageUrlError = validateUrl(image.url, `images[${index}].url`, allowedDomains);
      if (imageUrlError) errors.push(imageUrlError);
    });
  }
  
  // Validate videos
  if (item.videos) {
    item.videos.forEach((video, index) => {
      const thumbnailError = validateUrl(video.thumbnail_url, `videos[${index}].thumbnail_url`, allowedDomains);
      if (thumbnailError) errors.push(thumbnailError);
      
      const contentError = validateUrl(video.content_url, `videos[${index}].content_url`, allowedDomains);
      if (contentError) errors.push(contentError);
      
      const titleError = validateRequiredString(video.title, `videos[${index}].title`);
      if (titleError) errors.push(titleError);
      
      const descError = validateRequiredString(video.description, `videos[${index}].description`);
      if (descError) errors.push(descError);
    });
  }
  
  // Validate translations
  if (item.translations) {
    item.translations.forEach((translation, index) => {
      const langError = validateRequiredString(translation.language, `translations[${index}].language`);
      if (langError) errors.push(langError);
      
      if (!isValidLanguageCode(translation.language)) {
        errors.push({
          field: `translations[${index}].language`,
          type: 'invalid_language',
          message: 'language must be a valid RFC 3066 language code',
          value: translation.language,
        });
      }
      
      const urlError = validateUrl(translation.url, `translations[${index}].url`, allowedDomains);
      if (urlError) errors.push(urlError);
    });
  }
  
  return errors;
}