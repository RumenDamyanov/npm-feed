# Contributing to @rumenx/feed

We love your input! We want to make contributing to @rumenx/feed as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/RumenDamyanov/npm-feed/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/RumenDamyanov/npm-feed/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People *love* thorough bug reports. I'm not even kidding.

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/RumenDamyanov/npm-feed.git
   cd npm-feed
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests to make sure everything is working:
   ```bash
   npm test
   ```

4. Start development:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and add tests if applicable.

3. Run the full test suite:
   ```bash
   npm run check
   ```

4. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```

5. Push to your fork and submit a pull request.

## Code Style

We use ESLint and Prettier to maintain code quality and consistency. Before submitting:

```bash
npm run lint        # Check for linting issues
npm run format      # Format code with Prettier
npm run typecheck   # Check TypeScript types
```

## Testing

- Write tests for any new functionality
- Ensure all existing tests pass
- Aim for high test coverage (>90%)
- Test both happy path and error conditions

```bash
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for new public APIs
- Update TypeScript definitions if needed
- Add examples for new features

## Commit Messages

Please use clear and meaningful commit messages. We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: add new feature`
- `fix: resolve issue with...`
- `docs: update documentation`
- `test: add tests for...`
- `refactor: improve code structure`
- `chore: update dependencies`

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md).