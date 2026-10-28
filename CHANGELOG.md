# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-28

### Security

- Require Node.js 22.23.4+, 24.22.1+, or 26.12.1+. Node.js 18 and 20 do not receive the October 2026 Brotli decoder fix.
- Strip characters that XML 1.0 forbids, reject attribute names that can change a tag, and validate feed URLs with the URL parser so a user-info trick cannot bypass an allowed domain.

## [Unreleased]

### Added

- Initial project setup and architecture
- TypeScript configuration with ESM/CJS dual build
- Comprehensive testing framework with Jest
- Development workflow with ESLint and Prettier
- CI/CD pipeline with GitHub Actions
- Project documentation and contributing guidelines

## [1.0.0] - TBD

### Added

- Core Feed class with RSS 2.0 and Atom 1.0 support
- Framework-agnostic design with adapter pattern
- Rich media support (images, videos, news)
- Multilingual and translation support
- Built-in validation and error handling
- Comprehensive TypeScript definitions
- Express.js and Next.js adapters
- Performance optimizations for large feeds
- Zero runtime dependencies
- Complete documentation and examples

[Unreleased]: https://github.com/RumenDamyanov/npm-feed/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/RumenDamyanov/npm-feed/releases/tag/v1.0.0
