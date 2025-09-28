/**
 * Feed item type definitions for @rumenx/feed
 */

/**
 * Feed item data structure
 */
export interface FeedItemData {
  /** Item title (required) */
  title: string;
  /** Item description or content (required) */
  description: string;
  /** Item URL (required) */
  link: string;
  /** Item author */
  author?: string;
  /** Publication date */
  pubdate?: Date | string;
  /** Unique identifier for the item */
  guid?: string;
  /** Item category/categories */
  category?: string | string[];
  /** Media enclosure */
  enclosure?: EnclosureData;
  /** Associated images */
  images?: ImageData[];
  /** Associated videos */
  videos?: VideoData[];
  /** Multi-language translations */
  translations?: TranslationData[];
  /** Google News specific data */
  news?: NewsData;
  /** Priority for sitemap-style feeds (0.0 to 1.0) */
  priority?: number;
  /** Change frequency hint */
  changefreq?: import('./FeedTypes').ChangeFrequency;
}

/**
 * Media enclosure data
 */
export interface EnclosureData {
  /** URL of the enclosure */
  url: string;
  /** MIME type of the enclosure */
  type: string;
  /** Size in bytes */
  length?: number;
}

/**
 * Image data for feed items
 */
export interface ImageData {
  /** Image URL (required) */
  url: string;
  /** Image title */
  title?: string;
  /** Image caption or description */
  caption?: string;
  /** MIME type (for RSS media content) */
  type?: string;
  /** Image width in pixels (for RSS media content) */
  width?: number;
  /** Image height in pixels (for RSS media content) */
  height?: number;
  /** License URL */
  license?: string;
  /** Geographic location */
  geoLocation?: string;
}

/**
 * Video data for feed items
 */
export interface VideoData {
  /** Video thumbnail URL (required) */
  thumbnail_url: string;
  /** Video title (required) */
  title: string;
  /** Video description (required) */
  description: string;
  /** Video content URL (required) */
  content_url: string;
  /** Video duration in seconds */
  duration?: number;
  /** Video rating (0.0 to 5.0) */
  rating?: number;
  /** View count */
  view_count?: number;
  /** Publication date */
  publication_date?: string;
  /** Family friendly flag */
  family_friendly?: boolean;
  /** Video tags */
  tags?: string[];
}

/**
 * Translation data for multilingual support
 */
export interface TranslationData {
  /** Language code (RFC 3066) */
  language: string;
  /** Translated URL */
  url: string;
}

/**
 * Google News specific data
 */
export interface NewsData {
  /** Publication name (required) */
  sitename: string;
  /** Language code (required) */
  language: string;
  /** Publication date (required) */
  publication_date: Date | string;
  /** Article title (required) */
  title: string;
  /** Keywords */
  keywords?: string;
}