# Security Policy

## Supported Versions

We provide security updates for the following versions of @rumenx/feed:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :x:                |
| < 1.0   | :x:                |

1.1.x requires Node.js **22.23.4+**, **24.22.1+**, or **26.12.1+**. Node.js 18 and 20 are end of life and do not receive the October 2026 Brotli decoder fix ([CVE-2026-111497](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)). This package does not decompress Brotli itself. The runtime that installs and runs it still has to be a patched release.

## Reporting a Vulnerability

The @rumenx/feed team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

To report a security issue, please use the GitHub Security Advisory ["Report a Vulnerability"](https://github.com/RumenDamyanov/npm-feed/security/advisories/new) tab.

The @rumenx/feed team will send a response indicating the next steps in handling your report. After the initial reply to your report, the security team will keep you informed of the progress towards a fix and full announcement, and may ask for additional information or guidance.

Report security bugs in third-party modules to the person or team maintaining the module.

## Security Considerations

When using @rumenx/feed, please consider the following security guidelines:

### Input Validation

- Always validate and sanitize user input before adding it to feeds
- Use the built-in validation features by setting `validate: true` in the configuration
- Be cautious with URLs and ensure they point to trusted domains

### XML Generation

- The package automatically escapes XML content when `escapeContent: true` is set
- Avoid generating feeds with unescaped user content
- Use allowedDomains configuration to restrict URL domains

### Dependencies

- @rumenx/feed has zero runtime dependencies to minimize security risks
- Regularly update development dependencies to their latest versions
- Run `npm audit` to check for vulnerabilities in development dependencies

### Caching

- If implementing custom cache adapters, ensure proper access controls
- Don't cache sensitive information in feed content
- Implement appropriate cache invalidation strategies

## Disclosure Policy

When the security team receives a security bug report, they will assign it to a primary handler. This person will coordinate the fix and release process, involving the following steps:

- Confirm the problem and determine the affected versions
- Audit code to find any potential similar problems
- Prepare fixes for all releases still under maintenance
- These fixes will be released as fast as possible

## Comments on This Policy

If you have suggestions on how this process could be improved please submit a pull request.
