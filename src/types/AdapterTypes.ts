/**
 * Adapter interface definitions for @rumenx/feed
 */

/**
 * Cache adapter interface for feed caching
 */
export interface FeedCacheInterface {
  /**
   * Get cached value by key
   */
  get(key: string): Promise<string | null>;
  
  /**
   * Set cached value with optional TTL
   */
  set(key: string, value: string, ttl?: number): Promise<void>;
  
  /**
   * Check if key exists in cache
   */
  has(key: string): Promise<boolean>;
  
  /**
   * Delete cached value by key
   */
  delete(key: string): Promise<void>;
  
  /**
   * Clear all cached values
   */
  clear(): Promise<void>;
}

/**
 * Configuration adapter interface
 */
export interface FeedConfigInterface {
  /**
   * Get configuration value by key
   */
  get(key: string, defaultValue?: any): any;
  
  /**
   * Check if configuration key exists
   */
  has(key: string): boolean;
  
  /**
   * Get all configuration values
   */
  all(): Record<string, any>;
}

/**
 * Response adapter interface for framework integration
 */
export interface FeedResponseInterface {
  /**
   * Send response with content and content type
   */
  send(content: string, contentType: string): any;
  
  /**
   * Set response header
   */
  setHeader(name: string, value: string): void;
  
  /**
   * Set response status code
   */
  setStatus(status: number): void;
}

/**
 * View adapter interface for template rendering
 */
export interface FeedViewInterface {
  /**
   * Render template with data
   */
  render(template: string, data: any): Promise<string>;
  
  /**
   * Check if template exists
   */
  exists(template: string): boolean;
}

/**
 * Complete adapter collection
 */
export interface FeedAdapters {
  cache?: FeedCacheInterface;
  config?: FeedConfigInterface;
  response?: FeedResponseInterface;
  view?: FeedViewInterface;
}