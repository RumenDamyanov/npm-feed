# @rumenx/feed

[![CI](https://github.com/RumenDamyanov/npm-feed/actions/workflows/ci.yml/badge.svg)](https://github.com/RumenDamyanov/npm-feed/actions)
[![CodeQL](https://github.com/RumenDamyanov/npm-feed/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/RumenDamyanov/npm-feed/actions/workflows/github-code-scanning/codeql)
[![Dependabot](https://github.com/RumenDamyanov/npm-feed/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/RumenDamyanov/npm-feed/actions/workflows/dependabot/dependabot-updates)
[![codecov](https://codecov.io/gh/RumenDamyanov/npm-feed/branch/master/graph/badge.svg)](https://codecov.io/gh/RumenDamyanov/npm-feed)
[![npm version](https://img.shields.io/npm/v/@rumenx/feed.svg)](https://www.npmjs.com/package/@rumenx/feed)

A comprehensive TypeScript package for generating RSS and Atom feeds in Node.js applications.

**Framework-agnostic with built-in caching support, rich media features, and 100% type safety.**

## 💡 Multi-Language Feed Family

This package is part of a comprehensive feed generation suite created by the same author:

- 🐘 **PHP**: [RumenDamyanov/php-feed](https://github.com/RumenDamyanov/php-feed) - Composer package
- 🐹 **Go**: [RumenDamyanov/go-feed](https://github.com/RumenDamyanov/go-feed) - Go module
- 🟨 **Node.js**: This package - NPM package for JavaScript/TypeScript

All implementations share the same core philosophy and feature set with language-specific optimizations.

## ✨ Features

- 🎯 **Full TypeScript Support** - Complete type safety and IntelliSense
- 🏗️ **Modern Architecture** - ESM/CJS dual package with tree-shaking support
- 🚀 **Framework Agnostic** - Works with Express, Next.js, Fastify, or any Node.js project
- 📡 **Multiple Formats** - RSS 2.0 and Atom 1.0 support
- ⚡ **High Performance** - Optimized for large feeds with efficient memory usage
- 🔍 **Advanced Validation** - Built-in URL validation and data sanitization
- 📊 **Rich Media Support** - Images, videos, translations, and Google News
- 🎨 **Custom Views** - Template-based feed generation with framework adapters
- 🔧 **Dependency Injection** - Clean architecture with adapter pattern
- 🌍 **Internationalization** - Full multi-language and translation support
- 🧪 **Battle Tested** - Comprehensive test coverage with real-world validation
- 📦 **Zero Dependencies** - Minimal runtime footprint

## 📦 Installation

```bash
# npm
npm install @rumenx/feed

# yarn
yarn add @rumenx/feed

# pnpm
pnpm add @rumenx/feed
```

## 🚀 Quick Start

```typescript
import { Feed } from '@rumenx/feed';

// Create a new feed
const feed = new Feed();

// Configure the feed
feed
  .setTitle('My Blog Feed')
  .setDescription('Latest posts from my blog')
  .setLink('https://example.com')
  .setLanguage('en');

// Add items
feed
  .addItem({
    title: 'First Post',
    description: 'This is my first blog post',
    link: 'https://example.com/posts/first-post',
    author: 'Rumen Damyanov',
    pubdate: new Date(),
  })
  .addItem({
    title: 'Second Post',
    description: 'Another interesting post',
    link: 'https://example.com/posts/second-post',
    author: 'Rumen Damyanov',
    pubdate: new Date(),
    images: [
      {
        url: 'https://example.com/images/post-image.jpg',
        caption: 'Post featured image',
      },
    ],
  });

// Generate RSS feed
const rssXml = feed.toXML('rss');
console.log(rssXml);

// Generate Atom feed
const atomXml = feed.toXML('atom');
console.log(atomXml);
```

## 📚 Advanced Usage

### Framework Integration

#### Express.js

```typescript
import express from 'express';
import { FeedFactory } from '@rumenx/feed';

const app = express();

app.get('/feed.xml', (req, res) => {
  const feed = FeedFactory.createForExpress({
    baseUrl: 'https://example.com',
    validate: true,
  });

  feed.setTitle('My Blog').setDescription('Latest blog posts').setLink('https://example.com');

  // Add your content
  feed.addItem({
    title: 'Hello World',
    description: 'My first post',
    link: 'https://example.com/hello',
    pubdate: new Date(),
  });

  // Render and send response
  const xml = feed.render('rss');
  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

app.listen(3000);
```

#### Next.js

```typescript
// pages/api/feed.xml.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { FeedFactory } from '@rumenx/feed';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const feed = FeedFactory.createForNextjs({
    baseUrl: 'https://yoursite.com',
  });

  feed.setTitle('My Next.js Blog').setDescription('Latest posts').setLink('https://yoursite.com');

  // Add your posts
  feed.addItem({
    title: 'Next.js is Awesome',
    description: 'Why I love Next.js',
    link: 'https://yoursite.com/posts/nextjs-awesome',
    pubdate: new Date(),
  });

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(feed.toXML('rss'));
}
```

### Rich Media Feeds

```typescript
import { Feed } from '@rumenx/feed';

const feed = new Feed({
  baseUrl: 'https://example.com',
  validate: true,
  escapeContent: true,
});

// Add item with images and videos
feed.addItem({
  title: 'Amazing Travel Guide',
  description: 'Discover the best travel destinations',
  link: 'https://example.com/travel-guide',
  author: 'Travel Blogger',
  pubdate: new Date(),
  images: [
    {
      url: 'https://example.com/images/travel.jpg',
      caption: 'Beautiful mountain landscape',
      title: 'Mountain View',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      geoLocation: 'Swiss Alps',
    },
  ],
  videos: [
    {
      thumbnail_url: 'https://example.com/thumbnails/travel-video.jpg',
      title: 'Travel Video Guide',
      description: 'A comprehensive video guide to travel',
      content_url: 'https://example.com/videos/travel.mp4',
      duration: 300,
      rating: 4.8,
      view_count: 15000,
      publication_date: '2023-12-01',
      family_friendly: true,
      tags: ['travel', 'guide', 'adventure'],
    },
  ],
});
```

### Multilingual Feeds

```typescript
// Add multilingual content with translations
feed.addItem({
  title: 'Global News Update',
  description: 'Latest international news',
  link: 'https://example.com/news/global-update',
  translations: [
    { language: 'en', url: 'https://example.com/en/news/global-update' },
    { language: 'es', url: 'https://example.com/es/noticias/actualizacion-global' },
    { language: 'fr', url: 'https://example.com/fr/nouvelles/mise-a-jour-mondiale' },
    { language: 'de', url: 'https://example.com/de/nachrichten/globale-aktualisierung' },
  ],
});
```

### Google News Feeds

```typescript
// Add Google News compatible items
feed.addItem({
  title: 'Breaking: Major Discovery in Science',
  description: 'Scientists make groundbreaking discovery',
  link: 'https://example.com/news/major-discovery',
  pubdate: new Date(),
  news: {
    sitename: 'Science Daily',
    language: 'en',
    publication_date: new Date(),
    title: 'Major Discovery in Quantum Physics',
    keywords: 'science, quantum, physics, discovery',
  },
});
```

## 🛠️ Configuration Options

```typescript
interface FeedConfig {
  /** Base URL for resolving relative URLs */
  baseUrl?: string;
  /** Enable validation of URLs and data */
  validate?: boolean;
  /** Enable XML content escaping */
  escapeContent?: boolean;
  /** Pretty print XML output */
  prettyPrint?: boolean;
  /** Date format string */
  dateFormat?: string;
  /** Feed language */
  language?: string;
  /** Maximum items per feed */
  maxItems?: number;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Allowed domains for URL validation */
  allowedDomains?: string[];
}
```

## 📊 Statistics and Analysis

```typescript
// Get detailed feed statistics
const stats = feed.getStats();
console.log(stats);
// Output:
// {
//   totalItems: 25,
//   totalImages: 12,
//   totalVideos: 3,
//   totalTranslations: 75,
//   averagePriority: 0.8,
//   lastModified: '2023-12-01T10:30:00.000Z',
//   sizeEstimate: 145000
// }

// Check if feed should be split
if (feed.shouldSplit()) {
  console.log('Feed is too large and should be split into multiple feeds');
}
```

## 🔍 Validation and Error Handling

```typescript
import { ValidationError } from '@rumenx/feed';

// Validate feed content
const errors = feed.validate();
if (errors.length > 0) {
  console.error('Feed validation errors:', errors);
}

// Handle validation during configuration
const feed = new Feed({
  validate: true, // Throws errors on invalid data
});

try {
  feed.addItem({
    title: 'Invalid Item',
    description: 'This item has invalid data',
    link: 'not-a-valid-url', // Will throw validation error
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation error:', {
      field: error.field,
      type: error.type,
      message: error.message,
      value: error.value,
    });
  }
}
```

## 🧪 TypeScript Support

This package is written in TypeScript and provides complete type definitions:

```typescript
import type {
  Feed,
  FeedConfig,
  FeedItem,
  FeedItemData,
  FeedStats,
  ValidationError,
  ImageData,
  VideoData,
  NewsData,
} from '@rumenx/feed';

// Full IntelliSense support
const item: FeedItemData = {
  title: 'My Post',
  description: 'Post description',
  link: 'https://example.com/post',
  pubdate: new Date(),
  images: [
    /* Fully typed image objects */
  ],
  videos: [
    /* Fully typed video objects */
  ],
};
```

## 📈 Performance

- **Optimized for large feeds** - Efficiently handles 50,000+ items
- **Memory efficient** - Stream-friendly architecture for large datasets
- **Fast XML generation** - Optimized string building and concatenation
- **Minimal dependencies** - Zero runtime dependencies for optimal bundle size
- **Tree-shakable** - Import only what you need with modern bundlers

## 📋 Requirements

- **Node.js**: >= 18.0.0
- **TypeScript**: >= 4.5.0 (for TypeScript projects)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/RumenDamyanov/npm-feed)
- [npm Package](https://www.npmjs.com/package/@rumenx/feed)
- [Issue Tracker](https://github.com/RumenDamyanov/npm-feed/issues)
- [Changelog](CHANGELOG.md)

## ⭐ Support

If you find this package helpful, please consider:

- ⭐ Starring this repository
- 🐛 Reporting bugs and suggesting improvements
- 💻 Contributing code or documentation
- 💖 [Sponsoring the project](https://github.com/sponsors/RumenDamyanov)

---

**Built with ❤️ by [Rumen Damyanov](https://github.com/RumenDamyanov)**
