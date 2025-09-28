/**
 * Tests for Feed class
 */

import { Feed } from '../../../src/core/Feed';
import type { FeedItemData } from '../../../src/types/FeedItemTypes';

describe('Feed', () => {
  let feed: Feed;

  beforeEach(() => {
    feed = new Feed();
  });

  describe('Basic Feed Operations', () => {
    it('should create a feed with default configuration', () => {
      expect(feed).toBeInstanceOf(Feed);
      expect(feed.getTitle()).toBe('');
      expect(feed.getDescription()).toBe('');
      expect(feed.getLink()).toBe('');
      expect(feed.getLanguage()).toBe('en');
    });

    it('should set and get feed metadata', () => {
      feed
        .setTitle('Test Feed')
        .setDescription('A test RSS feed')
        .setLink('https://example.com')
        .setLanguage('en-US')
        .setCopyright('Copyright 2024')
        .setManagingEditor('editor@example.com')
        .setCategory('Technology');

      expect(feed.getTitle()).toBe('Test Feed');
      expect(feed.getDescription()).toBe('A test RSS feed');
      expect(feed.getLink()).toBe('https://example.com');
      expect(feed.getLanguage()).toBe('en-US');
    });

    it('should chain setter methods', () => {
      const result = feed
        .setTitle('Test')
        .setDescription('Description')
        .setLink('https://example.com');

      expect(result).toBe(feed);
    });
  });

  describe('Item Management', () => {
    const sampleItem: FeedItemData = {
      title: 'Test Article',
      description: 'This is a test article',
      link: 'https://example.com/test-article',
      author: 'John Doe',
      pubdate: new Date('2024-01-01T12:00:00Z'),
      category: 'Technology',
    };

    it('should add single item to feed', () => {
      feed.addItem(sampleItem);

      expect(feed.getItemCount()).toBe(1);
      expect(feed.getItems()).toHaveLength(1);
      expect(feed.getItems()[0].getTitle()).toBe('Test Article');
    });

    it('should access FeedItem methods', () => {
      feed.addItem(sampleItem);

      const item = feed.getItems()[0];
      expect(item.getTitle()).toBe('Test Article');
      expect(item.getDescription()).toBe('This is a test article');
      expect(item.getLink()).toBe('https://example.com/test-article');
      expect(item.getAuthor()).toBe('John Doe');
      expect(item.getPubDate()).toContain('2024-01-01');
    });

    it('should handle items without pubdate', () => {
      const itemWithoutDate: FeedItemData = {
        title: 'No Date Article',
        description: 'Article without publication date',
        link: 'https://example.com/no-date',
      };

      feed.addItem(itemWithoutDate);
      const item = feed.getItems()[0];

      // Should return current date when no pubdate provided
      expect(item.getPubDate()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should handle string pubdate', () => {
      const itemWithStringDate: FeedItemData = {
        title: 'String Date Article',
        description: 'Article with string date',
        link: 'https://example.com/string-date',
        pubdate: '2024-01-01T12:00:00Z',
      };

      feed.addItem(itemWithStringDate);
      const item = feed.getItems()[0];

      expect(item.getPubDate()).toBe('2024-01-01T12:00:00Z');
    });

    it('should add multiple items to feed', () => {
      const items: FeedItemData[] = [
        sampleItem,
        {
          title: 'Second Article',
          description: 'Another test article',
          link: 'https://example.com/second-article',
        },
      ];

      feed.addItems(items);

      expect(feed.getItemCount()).toBe(2);
      expect(feed.getItems()).toHaveLength(2);
    });

    it('should clear all items', () => {
      feed.addItem(sampleItem);
      expect(feed.getItemCount()).toBe(1);

      feed.clear();
      expect(feed.getItemCount()).toBe(0);
      expect(feed.getItems()).toHaveLength(0);
    });

    it('should remove items based on predicate', () => {
      feed.addItems([
        sampleItem,
        {
          title: 'Another Article',
          description: 'Another test article',
          link: 'https://example.com/another-article',
          category: 'Science',
        },
      ]);

      expect(feed.getItemCount()).toBe(2);

      // Remove items with 'Technology' category
      feed.removeItems(item => {
        const category = item.data.category;
        return category === 'Technology';
      });

      expect(feed.getItemCount()).toBe(1);
      expect(feed.getItems()[0].getTitle()).toBe('Another Article');
    });

    it('should handle items with complex data', () => {
      const complexItem: FeedItemData = {
        title: 'Complex Article',
        description: 'Article with media',
        link: 'https://example.com/complex',
        images: [
          {
            url: 'https://example.com/image.jpg',
            title: 'Sample Image',
            caption: 'A sample image for testing',
          },
        ],
        videos: [
          {
            content_url: 'https://example.com/video.mp4',
            thumbnail_url: 'https://example.com/thumb.jpg',
            title: 'Sample Video',
            description: 'A sample video for testing',
            duration: 120,
          },
        ],
        news: {
          sitename: 'Example News',
          language: 'en',
          publication_date: new Date(),
          title: 'Breaking News',
          keywords: 'breaking, news, important',
        },
      };

      feed.addItem(complexItem);

      expect(feed.getItemCount()).toBe(1);
      const addedItem = feed.getItems()[0];
      expect(addedItem.data.images).toHaveLength(1);
      expect(addedItem.data.videos).toHaveLength(1);
      expect(addedItem.data.news?.keywords).toBe('breaking, news, important');
    });
  });

  describe('Validation', () => {
    it('should validate feed metadata when enabled', () => {
      const validatingFeed = new Feed({ validate: true });

      expect(() => {
        validatingFeed.addItem({
          title: '',
          description: 'Test',
          link: 'not-a-url',
        });
      }).toThrow();
    });

    it('should skip validation when disabled', () => {
      const nonValidatingFeed = new Feed({ validate: false });

      expect(() => {
        nonValidatingFeed.addItem({
          title: '',
          description: 'Test',
          link: 'not-a-url',
        });
      }).not.toThrow();
    });

    it('should return validation errors for feed', () => {
      feed.setTitle('').setDescription('').setLink('');

      const errors = feed.validate();
      expect(errors).toHaveLength(3);
      expect(errors.some(e => e.field === 'title')).toBe(true);
      expect(errors.some(e => e.field === 'description')).toBe(true);
      expect(errors.some(e => e.field === 'link')).toBe(true);
    });

    it('should return validation errors for invalid items', () => {
      feed
        .setTitle('Valid Feed')
        .setDescription('Valid description')
        .setLink('https://example.com');

      // Add invalid item
      feed.addItem({
        title: '',
        description: 'Test',
        link: 'invalid-url',
      });

      const errors = feed.validate();
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.field.includes('items[0]'))).toBe(true);
    });

    it('should pass validation for valid feed', () => {
      feed
        .setTitle('Valid Feed')
        .setDescription('A valid feed description')
        .setLink('https://example.com');

      const errors = feed.validate();
      expect(errors).toHaveLength(0);
    });
  });

  describe('Statistics', () => {
    beforeEach(() => {
      const items: FeedItemData[] = [
        {
          title: 'Article 1',
          description: 'First article',
          link: 'https://example.com/1',
          images: [{ url: 'https://example.com/img1.jpg', title: 'Test Image' }],
          priority: 0.8,
        },
        {
          title: 'Article 2',
          description: 'Second article',
          link: 'https://example.com/2',
          videos: [
            {
              content_url: 'https://example.com/vid.mp4',
              thumbnail_url: 'https://example.com/thumb.jpg',
              title: 'Test Video',
              description: 'A test video',
            },
          ],
          priority: 0.6,
          translations: [{ url: 'https://example.com/es/2', language: 'es' }],
        },
      ];

      feed.addItems(items);
    });

    it('should calculate feed statistics', () => {
      const stats = feed.getStats();

      expect(stats.totalItems).toBe(2);
      expect(stats.totalImages).toBe(1);
      expect(stats.totalVideos).toBe(1);
      expect(stats.totalTranslations).toBe(1);
      expect(stats.averagePriority).toBe(0.7);
      expect(stats.sizeEstimate).toBeGreaterThan(0);
    });

    it('should handle empty feed statistics', () => {
      const emptyFeed = new Feed();
      const stats = emptyFeed.getStats();

      expect(stats.totalItems).toBe(0);
      expect(stats.totalImages).toBe(0);
      expect(stats.totalVideos).toBe(0);
      expect(stats.totalTranslations).toBe(0);
      expect(stats.averagePriority).toBe(0);
    });
  });

  describe('Feed Size Management', () => {
    it('should check if feed should be split', () => {
      // Add many items to trigger size limit
      const items: FeedItemData[] = [];
      for (let i = 0; i < 100; i++) {
        items.push({
          title: `Article ${i}`,
          description: `Description for article ${i}`,
          link: `https://example.com/${i}`,
        });
      }

      feed.addItems(items);

      // Should not split with default limits
      expect(feed.shouldSplit()).toBe(false);
    });

    it('should detect when split is needed due to item count', () => {
      const limitedFeed = new Feed({ maxItems: 2 });

      limitedFeed.addItems([
        { title: 'Article 1', description: 'Test 1', link: 'https://example.com/1' },
        { title: 'Article 2', description: 'Test 2', link: 'https://example.com/2' },
        { title: 'Article 3', description: 'Test 3', link: 'https://example.com/3' },
      ]);

      expect(limitedFeed.shouldSplit()).toBe(true);
    });

    it('should estimate feed size', () => {
      feed.addItem({
        title: 'Test Article',
        description: 'A test article',
        link: 'https://example.com/test',
      });

      const stats = feed.getStats();
      expect(stats.sizeEstimate).toBeGreaterThan(1000); // Should have some base size
    });
  });

  describe('RSS Generation', () => {
    beforeEach(() => {
      feed
        .setTitle('Test RSS Feed')
        .setDescription('A test RSS feed for unit testing')
        .setLink('https://example.com')
        .setLanguage('en')
        .setCopyright('Copyright 2024 Test')
        .setManagingEditor('editor@example.com')
        .setCategory('Technology');

      feed.addItem({
        title: 'Test Article',
        description: 'This is a test article for RSS generation',
        link: 'https://example.com/test-article',
        author: 'John Doe',
        pubdate: new Date('2024-01-01T12:00:00Z'),
        category: ['Technology', 'Testing'],
      });
    });

    it('should generate valid RSS XML', () => {
      const rssXml = feed.toXML('rss');

      expect(rssXml).toBeValidXML();
      expect(rssXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(rssXml).toContain('<rss version="2.0">');
      expect(rssXml).toContain('<title>Test RSS Feed</title>');
      expect(rssXml).toContain('<description>A test RSS feed for unit testing</description>');
      expect(rssXml).toContain('<link>https://example.com</link>');
      expect(rssXml).toContain('<item>');
      expect(rssXml).toContain('<title>Test Article</title>');
    });

    it('should include media namespaces when items have media', () => {
      feed.addItem({
        title: 'Media Article',
        description: 'Article with media content',
        link: 'https://example.com/media',
        images: [{ url: 'https://example.com/image.jpg', type: 'image/jpeg' }],
      });

      const rssXml = feed.toXML('rss');
      expect(rssXml).toContain('xmlns:media=');
    });

    it('should include Google News namespaces when items have news data', () => {
      feed.addItem({
        title: 'News Article',
        description: 'A news article',
        link: 'https://example.com/news',
        news: {
          sitename: 'Test News',
          language: 'en',
          publication_date: new Date(),
          title: 'Breaking News',
          keywords: 'breaking, news',
        },
      });

      const rssXml = feed.toXML('rss');
      expect(rssXml).toContain('xmlns:news=');
      expect(rssXml).toContain('<news:keywords>breaking, news</news:keywords>');
    });

    it('should include enclosures in RSS items', () => {
      feed.addItem({
        title: 'Podcast Episode',
        description: 'A podcast episode',
        link: 'https://example.com/podcast',
        enclosure: {
          url: 'https://example.com/episode.mp3',
          type: 'audio/mpeg',
          length: 1024000,
        },
      });

      const rssXml = feed.toXML('rss');
      expect(rssXml).toContain(
        '<enclosure url="https://example.com/episode.mp3" type="audio/mpeg" length="1024000"/>'
      );
    });

    it('should handle enclosures without length', () => {
      feed.addItem({
        title: 'File Download',
        description: 'A file download',
        link: 'https://example.com/download',
        enclosure: {
          url: 'https://example.com/file.pdf',
          type: 'application/pdf',
        },
      });

      const rssXml = feed.toXML('rss');
      expect(rssXml).toContain(
        '<enclosure url="https://example.com/file.pdf" type="application/pdf"/>'
      );
      expect(rssXml).not.toContain('length=');
    });

    it('should handle videos with duration', () => {
      feed.addItem({
        title: 'Video with Duration',
        description: 'A video with duration info',
        link: 'https://example.com/video',
        videos: [
          {
            content_url: 'https://example.com/video.mp4',
            thumbnail_url: 'https://example.com/thumb.jpg',
            title: 'Test Video',
            description: 'A test video',
            duration: 300,
          },
        ],
      });

      const rssXml = feed.toXML('rss');
      expect(rssXml).toContain('duration="300"');
    });

    it('should handle videos without duration', () => {
      feed.addItem({
        title: 'Video without Duration',
        description: 'A video without duration info',
        link: 'https://example.com/video2',
        videos: [
          {
            content_url: 'https://example.com/video2.mp4',
            thumbnail_url: 'https://example.com/thumb2.jpg',
            title: 'Test Video 2',
            description: 'Another test video',
          },
        ],
      });

      const rssXml = feed.toXML('rss');
      expect(rssXml).not.toContain('duration=');
    });

    it('should include webMaster in RSS when set', () => {
      feed
        .setTitle('Test Feed')
        .setDescription('Test Description')
        .setLink('https://example.com')
        .setWebMaster('webmaster@example.com');

      const rssXml = feed.toXML('rss');
      expect(rssXml).toContain('<webMaster>webmaster@example.com</webMaster>');
    });

    it('should handle multiple categories in RSS items', () => {
      const rssXml = feed.toXML('rss');

      expect(rssXml).toContain('<category>Technology</category>');
      expect(rssXml).toContain('<category>Testing</category>');
    });

    it('should format RSS with proper indentation', () => {
      const rssXml = feed.toXML('rss');

      expect(rssXml).toContain('  <channel>');
      expect(rssXml).toContain('    <title>');
      expect(rssXml).toContain('    <item>');
    });
  });

  describe('Atom Generation', () => {
    beforeEach(() => {
      feed
        .setTitle('Test Atom Feed')
        .setDescription('A test Atom feed for unit testing')
        .setLink('https://example.com')
        .setLanguage('en')
        .setCopyright('Copyright 2024 Test')
        .setManagingEditor('editor@example.com');

      feed.addItem({
        title: 'Test Entry',
        description: 'This is a test entry for Atom generation',
        link: 'https://example.com/test-entry',
        author: 'Jane Doe',
        pubdate: new Date('2024-01-01T12:00:00Z'),
        category: 'Technology',
      });
    });

    it('should generate valid Atom XML', () => {
      const atomXml = feed.toXML('atom');

      expect(atomXml).toBeValidXML();
      expect(atomXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(atomXml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
      expect(atomXml).toContain('<title>Test Atom Feed</title>');
      expect(atomXml).toContain('<subtitle>A test Atom feed for unit testing</subtitle>');
      expect(atomXml).toContain('<entry>');
      expect(atomXml).toContain('<title>Test Entry</title>');
    });

    it('should include author information in Atom feed', () => {
      const atomXml = feed.toXML('atom');

      expect(atomXml).toContain('<author>');
      expect(atomXml).toContain('<email>editor@example.com</email>');
    });

    it('should include entry author information', () => {
      const atomXml = feed.toXML('atom');

      expect(atomXml).toContain('<author>');
      expect(atomXml).toContain('<name>Jane Doe</name>');
    });

    it('should handle categories in Atom entries', () => {
      const atomXml = feed.toXML('atom');

      expect(atomXml).toContain('<category term="Technology"/>');
    });

    it('should format Atom with proper indentation', () => {
      const atomXml = feed.toXML('atom');

      expect(atomXml).toContain('  <title>');
      expect(atomXml).toContain('  <entry>');
      expect(atomXml).toContain('    <title>');
    });
  });

  describe('URL Processing', () => {
    it('should resolve relative URLs when baseUrl is provided', () => {
      const feedWithBase = new Feed({ baseUrl: 'https://example.com' });

      feedWithBase.addItem({
        title: 'Relative URL Test',
        description: 'Testing relative URL resolution',
        link: '/relative-path',
        images: [{ url: '/image.jpg', title: 'Test Image' }],
      });

      const items = feedWithBase.getItems();
      expect(items[0].data.link).toBe('https://example.com/relative-path');
      expect(items[0].data.images?.[0].url).toBe('https://example.com/image.jpg');
    });

    it('should resolve relative URLs for videos and translations', () => {
      const feedWithBase = new Feed({ baseUrl: 'https://example.com' });

      feedWithBase.addItem({
        title: 'Media URL Test',
        description: 'Testing media URL resolution',
        link: '/media-test',
        videos: [
          {
            content_url: '/video.mp4',
            thumbnail_url: '/thumb.jpg',
            title: 'Test Video',
            description: 'A test video',
          },
        ],
        translations: [
          {
            url: '/es/media-test',
            language: 'es',
          },
        ],
      });

      const items = feedWithBase.getItems();
      expect(items[0].data.videos?.[0].content_url).toBe('https://example.com/video.mp4');
      expect(items[0].data.videos?.[0].thumbnail_url).toBe('https://example.com/thumb.jpg');
      expect(items[0].data.translations?.[0].url).toBe('https://example.com/es/media-test');
    });

    it('should leave absolute URLs unchanged', () => {
      const feedWithBase = new Feed({ baseUrl: 'https://example.com' });

      feedWithBase.addItem({
        title: 'Absolute URL Test',
        description: 'Testing absolute URL handling',
        link: 'https://other.com/absolute-path',
      });

      const items = feedWithBase.getItems();
      expect(items[0].data.link).toBe('https://other.com/absolute-path');
    });

    it('should handle baseUrl with trailing slash', () => {
      const feedWithBase = new Feed({ baseUrl: 'https://example.com/' });

      feedWithBase.addItem({
        title: 'Trailing Slash Test',
        description: 'Testing baseUrl with trailing slash',
        link: '/test-path',
      });

      const items = feedWithBase.getItems();
      expect(items[0].data.link).toBe('https://example.com/test-path');
    });

    it('should handle path without leading slash', () => {
      const feedWithBase = new Feed({ baseUrl: 'https://example.com' });

      feedWithBase.addItem({
        title: 'No Leading Slash Test',
        description: 'Testing path without leading slash',
        link: 'no-leading-slash',
      });

      const items = feedWithBase.getItems();
      expect(items[0].data.link).toBe('https://example.com/no-leading-slash');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for unsupported feed format', () => {
      expect(() => {
        feed.toXML('invalid' as any);
      }).toThrow('Unsupported feed format: invalid');
    });

    it('should handle validation errors gracefully', () => {
      const validatingFeed = new Feed({ validate: true });
      validatingFeed
        .setTitle('Valid Feed')
        .setDescription('Valid description')
        .setLink('https://example.com');

      expect(() => {
        validatingFeed.addItem({
          title: '',
          description: 'Test',
          link: 'invalid-url',
        });
      }).toThrow('Validation failed:');
    });

    it('should handle Date objects in pubdate conversion', () => {
      feed.addItem({
        title: 'Date Test',
        description: 'Testing Date objects',
        link: 'https://example.com/date-test',
        pubdate: new Date('2024-01-01T12:00:00Z'),
      });

      const item = feed.getItems()[0];
      expect(item.getPubDate()).toContain('2024-01-01T12:00:00.000Z');
    });
  });

  describe('Configuration Options', () => {
    it('should respect escapeContent configuration', () => {
      const noEscapeFeed = new Feed({ escapeContent: false });
      noEscapeFeed
        .setTitle('Test Feed')
        .setDescription('Test Description')
        .setLink('https://example.com');

      // This should work without throwing errors
      expect(noEscapeFeed.getTitle()).toBe('Test Feed');
    });

    it('should respect allowed domains configuration', () => {
      const restrictedFeed = new Feed({
        validate: true,
        allowedDomains: ['example.com'],
      });

      restrictedFeed
        .setTitle('Restricted Feed')
        .setDescription('Feed with domain restrictions')
        .setLink('https://example.com');

      // Should allow example.com
      expect(() => {
        restrictedFeed.addItem({
          title: 'Allowed Article',
          description: 'From allowed domain',
          link: 'https://example.com/article',
        });
      }).not.toThrow();

      // Should reject other domains
      expect(() => {
        restrictedFeed.addItem({
          title: 'Blocked Article',
          description: 'From blocked domain',
          link: 'https://blocked.com/article',
        });
      }).toThrow();
    });
  });
});
