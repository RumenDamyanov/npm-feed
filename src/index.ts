/**
 * @rumenx/feed - RSS and Atom feed generator
 */

// Core classes
export { Feed, FeedItem } from './core/Feed';

// Types
export type {
  FeedConfig,
  FeedStats,
  ValidationError,
  FeedFormat,
  ChangeFrequency,
} from './types/FeedTypes';

export type {
  FeedItemData,
  ImageData,
  VideoData,
  NewsData,
  TranslationData,
  EnclosureData,
} from './types/FeedItemTypes';

export type {
  FeedAdapters,
  FeedCacheInterface,
  FeedConfigInterface,
  FeedResponseInterface,
  FeedViewInterface,
} from './types/AdapterTypes';

// Utilities
export {
  isValidUrl,
  isAllowedDomain,
  isValidEmail,
  isValidLanguageCode,
  isValidPriority,
  validateRequiredString,
  validateUrl,
  validateFeedItem,
} from './utils/Validator';

export {
  formatDate,
  formatRssDate,
  formatAtomDate,
  isValidFeedDate,
  getCurrentDate,
} from './utils/DateHelper';

export {
  escapeXml,
  createCdata,
  isValidXmlTagName,
  createElement,
  formatXml,
} from './utils/XmlHelper';