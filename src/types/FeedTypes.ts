/**
 * Core type definitions for @rumenx/feed
 */

/**
 * Feed configuration options
 */
export interface FeedConfig {
  /** Base URL for resolving relative URLs */
  baseUrl?: string;
  /** Enable validation of URLs and data */
  validate?: boolean;
  /** Enable XML content escaping */
  escapeContent?: boolean;
  /** Pretty print XML output */
  prettyPrint?: boolean;
  /** Date format string (ISO 8601 by default) */
  dateFormat?: string;
  /** Feed language (RFC 3066) */
  language?: string;
  /** Maximum items per feed */
  maxItems?: number;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Allowed domains for URL validation */
  allowedDomains?: string[];
  /** Package version for generator field */
  version?: string;
}

/**
 * Feed statistics information
 */
export interface FeedStats {
  /** Total number of items in the feed */
  totalItems: number;
  /** Total number of images across all items */
  totalImages: number;
  /** Total number of videos across all items */
  totalVideos: number;
  /** Total number of translations across all items */
  totalTranslations: number;
  /** Average priority of all items */
  averagePriority: number;
  /** Last modification date */
  lastModified: string;
  /** Estimated feed size in bytes */
  sizeEstimate: number;
}

/**
 * Validation error information
 */
export interface ValidationError {
  /** Field that failed validation */
  field: string;
  /** Type of validation error */
  type: string;
  /** Human-readable error message */
  message: string;
  /** The value that failed validation */
  value: unknown;
}

/**
 * Supported feed formats
 */
export type FeedFormat = 'rss' | 'atom';

/**
 * Change frequency for feed items
 */
export type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';
