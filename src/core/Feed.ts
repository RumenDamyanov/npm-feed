/**
 * Core Feed class for RSS and Atom feed generation
 */

import type { 
  FeedConfig, 
  FeedStats, 
  ValidationError, 
  FeedFormat 
} from '../types/FeedTypes';
import type { FeedItemData } from '../types/FeedItemTypes';
import type { FeedAdapters } from '../types/AdapterTypes';
import { validateFeedItem } from '../utils/Validator';
import { getCurrentDate, formatRssDate, formatAtomDate } from '../utils/DateHelper';
import { escapeXml, formatXml } from '../utils/XmlHelper';

/**
 * Internal feed item representation
 */
export class FeedItem {
  public readonly data: FeedItemData;
  
  constructor(data: FeedItemData) {
    this.data = { ...data };
  }
  
  getTitle(): string {
    return this.data.title;
  }
  
  getDescription(): string {
    return this.data.description;
  }
  
  getLink(): string {
    return this.data.link;
  }
  
  getAuthor(): string | undefined {
    return this.data.author;
  }
  
  getPubDate(): string {
    if (!this.data.pubdate) {
      return getCurrentDate();
    }
    
    if (typeof this.data.pubdate === 'string') {
      return this.data.pubdate;
    }
    
    return this.data.pubdate.toISOString();
  }
}

/**
 * Main Feed class
 */
export class Feed {
  private config: Required<FeedConfig>;
  private items: FeedItem[] = [];
  private adapters: FeedAdapters;
  
  // Feed metadata
  private title: string = '';
  private description: string = '';
  private link: string = '';
  private language: string = 'en';
  private copyright: string = '';
  private managingEditor: string = '';
  private webMaster: string = '';
  private category: string = '';
  private generator: string = '@rumenx/feed';
  private docs: string = 'https://www.rssboard.org/rss-specification';
  private lastBuildDate: string = getCurrentDate();
  
  constructor(config: FeedConfig = {}, adapters: FeedAdapters = {}) {
    this.config = {
      baseUrl: config.baseUrl || '',
      validate: config.validate ?? false,
      escapeContent: config.escapeContent ?? true,
      prettyPrint: config.prettyPrint ?? false,
      dateFormat: config.dateFormat || 'ISO',
      language: config.language || 'en',
      maxItems: config.maxItems || 50000,
      maxFileSize: config.maxFileSize || 50 * 1024 * 1024, // 50MB
      allowedDomains: config.allowedDomains || [],
      version: config.version ?? '1.0.0',
    };
    
    this.adapters = adapters;
    this.language = this.config.language;
  }
  
  /**
   * Set feed title
   */
  setTitle(title: string): this {
    this.title = title.trim();
    return this;
  }
  
  /**
   * Get feed title
   */
  getTitle(): string {
    return this.title;
  }
  
  /**
   * Set feed description
   */
  setDescription(description: string): this {
    this.description = description.trim();
    return this;
  }
  
  /**
   * Get feed description
   */
  getDescription(): string {
    return this.description;
  }
  
  /**
   * Set feed link
   */
  setLink(link: string): this {
    this.link = link.trim();
    return this;
  }
  
  /**
   * Get feed link
   */
  getLink(): string {
    return this.link;
  }
  
  /**
   * Set feed language
   */
  setLanguage(language: string): this {
    this.language = language.trim();
    return this;
  }
  
  /**
   * Get feed language
   */
  getLanguage(): string {
    return this.language;
  }
  
  /**
   * Set copyright information
   */
  setCopyright(copyright: string): this {
    this.copyright = copyright.trim();
    return this;
  }
  
  /**
   * Set managing editor
   */
  setManagingEditor(email: string): this {
    this.managingEditor = email.trim();
    return this;
  }

  /**
   * Set feed category
   */
  setCategory(category: string): this {
    this.category = category.trim();
    return this;
  }

  /**
   * Set webmaster email
   */
  setWebMaster(email: string): this {
    this.webMaster = email.trim();
    return this;
  }
  
  /**
   * Add single item to feed
   */
  addItem(itemData: FeedItemData): this {
    if (this.config.validate) {
      const errors = validateFeedItem(itemData, this.config.allowedDomains);
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
      }
    }
    
    // Resolve relative URLs if baseUrl is provided
    const processedData = this.processItemData(itemData);
    const item = new FeedItem(processedData);
    
    this.items.push(item);
    this.lastBuildDate = getCurrentDate();
    
    return this;
  }
  
  /**
   * Add multiple items to feed
   */
  addItems(itemsData: FeedItemData[]): this {
    itemsData.forEach(itemData => this.addItem(itemData));
    return this;
  }
  
  /**
   * Get all feed items
   */
  getItems(): FeedItem[] {
    return [...this.items];
  }
  
  /**
   * Get number of items
   */
  getItemCount(): number {
    return this.items.length;
  }
  
  /**
   * Remove items based on predicate
   */
  removeItems(predicate: (item: FeedItem) => boolean): this {
    this.items = this.items.filter(item => !predicate(item));
    this.lastBuildDate = getCurrentDate();
    return this;
  }
  
  /**
   * Clear all items
   */
  clear(): this {
    this.items = [];
    this.lastBuildDate = getCurrentDate();
    return this;
  }
  
  /**
   * Validate feed and return any errors
   */
  validate(): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Validate basic feed data
    if (!this.title.trim()) {
      errors.push({
        field: 'title',
        type: 'required',
        message: 'Feed title is required',
        value: this.title,
      });
    }
    
    if (!this.description.trim()) {
      errors.push({
        field: 'description',
        type: 'required',
        message: 'Feed description is required',
        value: this.description,
      });
    }
    
    if (!this.link.trim()) {
      errors.push({
        field: 'link',
        type: 'required',
        message: 'Feed link is required',
        value: this.link,
      });
    }
    
    // Validate all items
    this.items.forEach((item, index) => {
      const itemErrors = validateFeedItem(item.data, this.config.allowedDomains);
      itemErrors.forEach(error => {
        errors.push({
          ...error,
          field: `items[${index}].${error.field}`,
        });
      });
    });
    
    return errors;
  }
  
  /**
   * Get feed statistics
   */
  getStats(): FeedStats {
    const totalImages = this.items.reduce(
      (sum, item) => sum + (item.data.images?.length || 0), 
      0
    );
    
    const totalVideos = this.items.reduce(
      (sum, item) => sum + (item.data.videos?.length || 0), 
      0
    );
    
    const totalTranslations = this.items.reduce(
      (sum, item) => sum + (item.data.translations?.length || 0), 
      0
    );
    
    const priorities = this.items
      .map(item => item.data.priority)
      .filter((p): p is number => typeof p === 'number');
    
    const averagePriority = priorities.length > 0 
      ? priorities.reduce((sum, p) => sum + p, 0) / priorities.length 
      : 0;
    
    return {
      totalItems: this.items.length,
      totalImages,
      totalVideos,
      totalTranslations,
      averagePriority,
      lastModified: this.lastBuildDate,
      sizeEstimate: this.estimateSize(),
    };
  }
  
  /**
   * Check if feed should be split due to size constraints
   */
  shouldSplit(): boolean {
    return this.items.length > this.config.maxItems || 
           this.estimateSize() > this.config.maxFileSize;
  }
  
  /**
   * Generate XML for the specified format
   */
  toXML(format: FeedFormat = 'rss'): string {
    if (format === 'rss') {
      return this.generateRSS();
    } else if (format === 'atom') {
      return this.generateAtom();
    } else {
      throw new Error(`Unsupported feed format: ${format}`);
    }
  }
  
  /**
   * Process item data (resolve relative URLs, etc.)
   */
  private processItemData(itemData: FeedItemData): FeedItemData {
    const processed = { ...itemData };
    
    // Resolve relative URLs if baseUrl is provided
    if (this.config.baseUrl) {
      processed.link = this.resolveUrl(processed.link);
      
      if (processed.images) {
        processed.images = processed.images.map(img => ({
          ...img,
          url: this.resolveUrl(img.url),
        }));
      }
      
      if (processed.videos) {
        processed.videos = processed.videos.map(video => ({
          ...video,
          thumbnail_url: this.resolveUrl(video.thumbnail_url),
          content_url: this.resolveUrl(video.content_url),
        }));
      }
      
      if (processed.translations) {
        processed.translations = processed.translations.map(trans => ({
          ...trans,
          url: this.resolveUrl(trans.url),
        }));
      }
    }
    
    return processed;
  }
  
  /**
   * Resolve relative URL against base URL
   */
  private resolveUrl(url: string): string {
    if (!this.config.baseUrl || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    const base = this.config.baseUrl.endsWith('/') 
      ? this.config.baseUrl.slice(0, -1) 
      : this.config.baseUrl;
    
    const path = url.startsWith('/') ? url : `/${url}`;
    
    return `${base}${path}`;
  }
  
  /**
   * Estimate feed size in bytes
   */
  private estimateSize(): number {
    // Rough estimation based on average item size
    const baseSize = 1000; // Base XML structure
    const averageItemSize = 2000; // Average item size in bytes
    
    return baseSize + (this.items.length * averageItemSize);
  }
  
  /**
   * Check if any items have media content
   */
  private hasMedia(): boolean {
    return this.items.some(item => 
      item.data.images && item.data.images.length > 0 || 
      item.data.videos && item.data.videos.length > 0
    );
  }

  /**
   * Check if any items have Google News content
   */
  private hasGoogleNews(): boolean {
    return this.items.some(item => item.data.news);
  }

  /**
   * Generate RSS item XML
   */
  private generateRSSItem(item: FeedItemData): string {
    let rssItem = '    <item>\n';
    
    rssItem += `      <title>${escapeXml(item.title)}</title>\n`;
    rssItem += `      <link>${escapeXml(item.link)}</link>\n`;
    rssItem += `      <description>${escapeXml(item.description)}</description>\n`;
    
    if (item.author) {
      rssItem += `      <author>${escapeXml(item.author)}</author>\n`;
    }
    
    if (item.category) {
      const categories = Array.isArray(item.category) ? item.category : [item.category];
      for (const cat of categories) {
        rssItem += `      <category>${escapeXml(cat)}</category>\n`;
      }
    }
    
    if (item.pubdate) {
      rssItem += `      <pubDate>${formatRssDate(item.pubdate)}</pubDate>\n`;
    }
    
    const guid = item.guid ?? item.link;
    rssItem += `      <guid>${escapeXml(guid)}</guid>\n`;
    
    // Add enclosure if present
    if (item.enclosure) {
      rssItem += `      <enclosure url="${escapeXml(item.enclosure.url)}" type="${escapeXml(item.enclosure.type)}"`;
      if (item.enclosure.length) {
        rssItem += ` length="${item.enclosure.length}"`;
      }
      rssItem += '/>\n';
    }
    
    // Add media content
    if (item.images && item.images.length > 0) {
      for (const image of item.images) {
        rssItem += `      <media:content url="${escapeXml(image.url)}"`;
        if (image.type) rssItem += ` type="${escapeXml(image.type)}"`;
        if (image.width) rssItem += ` width="${image.width}"`;
        if (image.height) rssItem += ` height="${image.height}"`;
        rssItem += '/>\n';
      }
    }
    
    if (item.videos && item.videos.length > 0) {
      for (const video of item.videos) {
        rssItem += `      <media:content url="${escapeXml(video.content_url)}" type="video"`;
        if (video.duration) rssItem += ` duration="${video.duration}"`;
        rssItem += '>\n';
        rssItem += `        <media:thumbnail url="${escapeXml(video.thumbnail_url)}"/>\n`;
        rssItem += '      </media:content>\n';
      }
    }
    
    // Add Google News tags
    if (item.news?.keywords) {
      rssItem += `      <news:keywords>${escapeXml(item.news.keywords)}</news:keywords>\n`;
    }
    
    rssItem += '    </item>\n';
    
    return rssItem;
  }

  /**
   * Generate RSS 2.0 XML
   */
  private generateRSS(): string {
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
    
    let rss = '<rss version="2.0"';
    
    // Add namespaces
    if (this.hasMedia()) {
      rss += ' xmlns:media="http://search.yahoo.com/mrss/"';
    }
    if (this.hasGoogleNews()) {
      rss += ' xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"';
    }
    
    rss += '>\n';
    rss += '  <channel>\n';
    
    // Required channel elements
    rss += `    <title>${escapeXml(this.title)}</title>\n`;
    rss += `    <link>${escapeXml(this.link)}</link>\n`;
    rss += `    <description>${escapeXml(this.description)}</description>\n`;
    
    // Optional channel elements
    if (this.language) {
      rss += `    <language>${escapeXml(this.language)}</language>\n`;
    }
    
    if (this.managingEditor) {
      rss += `    <managingEditor>${escapeXml(this.managingEditor)}</managingEditor>\n`;
    }
    
    if (this.webMaster) {
      rss += `    <webMaster>${escapeXml(this.webMaster)}</webMaster>\n`;
    }
    
    if (this.category) {
      rss += `    <category>${escapeXml(this.category)}</category>\n`;
    }
    
    if (this.copyright) {
      rss += `    <copyright>${escapeXml(this.copyright)}</copyright>\n`;
    }
    
    rss += `    <lastBuildDate>${formatRssDate(this.lastBuildDate)}</lastBuildDate>\n`;
    rss += `    <generator>@rumenx/feed v${this.config.version || '1.0.0'}</generator>\n`;
    
    // Add items
    for (const feedItem of this.items) {
      rss += this.generateRSSItem(feedItem.data);
    }
    
    rss += '  </channel>\n';
    rss += '</rss>';
    
    return formatXml(`${xmlDeclaration}\n${rss}`);
  }
  
  /**
   * Generate Atom 1.0 XML
   */
  private generateAtom(): string {
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
    
    let atom = '<feed xmlns="http://www.w3.org/2005/Atom">\n';
    
    // Required feed elements
    atom += `  <title>${escapeXml(this.title)}</title>\n`;
    atom += `  <link href="${escapeXml(this.link)}"/>\n`;
    atom += `  <id>${escapeXml(this.link)}</id>\n`;
    atom += `  <updated>${formatAtomDate(this.lastBuildDate)}</updated>\n`;
    
    // Optional feed elements
    if (this.description) {
      atom += `  <subtitle>${escapeXml(this.description)}</subtitle>\n`;
    }
    
    if (this.managingEditor) {
      atom += `  <author>\n`;
      atom += `    <email>${escapeXml(this.managingEditor)}</email>\n`;
      atom += `  </author>\n`;
    }
    
    if (this.copyright) {
      atom += `  <rights>${escapeXml(this.copyright)}</rights>\n`;
    }
    
    atom += `  <generator>@rumenx/feed v${this.config.version || '1.0.0'}</generator>\n`;
    
    // Add entries
    for (const feedItem of this.items) {
      atom += this.generateAtomEntry(feedItem.data);
    }
    
    atom += '</feed>';
    
    return formatXml(`${xmlDeclaration}\n${atom}`);
  }

  /**
   * Generate Atom entry XML
   */
  private generateAtomEntry(item: FeedItemData): string {
    let entry = '  <entry>\n';
    
    entry += `    <title>${escapeXml(item.title)}</title>\n`;
    entry += `    <link href="${escapeXml(item.link)}"/>\n`;
    
    const id = item.guid ?? item.link;
    entry += `    <id>${escapeXml(id)}</id>\n`;
    
    if (item.pubdate) {
      entry += `    <updated>${formatAtomDate(item.pubdate)}</updated>\n`;
    }
    
    // Content/summary
    entry += `    <summary>${escapeXml(item.description)}</summary>\n`;
    
    if (item.author) {
      entry += `    <author>\n`;
      entry += `      <name>${escapeXml(item.author)}</name>\n`;
      entry += `    </author>\n`;
    }
    
    if (item.category) {
      const categories = Array.isArray(item.category) ? item.category : [item.category];
      for (const cat of categories) {
        entry += `    <category term="${escapeXml(cat)}"/>\n`;
      }
    }
    
    entry += '  </entry>\n';
    
    return entry;
  }
}