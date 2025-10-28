# Contributing to smart-env

Thank you for your interest in contributing to smart-env!

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/smart-env.git
cd smart-env
```

2. Install dependencies:

```bash
npm install
```

3. Run tests:

```bash
npm test
```

4. Build the project:

```bash
npm run build
```

## Code Style

This project follows strict code style rules defined in `.cursor/rules/code-rules.mdc`:

- Use **camelCase** for all identifiers
- Keep files under **90 lines** (split into modules if needed)
- Prefer **functional programming** patterns
- Maximum **2 levels of nesting**
- Write clear, self-explanatory names
- Add explanatory comments

## Testing

- All new features must include unit tests
- Run tests with `npm test`
- Aim for high test coverage
- Test files go in `test/unit/` or `test/integration/`

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following code style rules
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Build successfully: `npm run build`
7. Commit with clear, descriptive messages
8. Push to your fork and submit a pull request

## Commit Messages

Use clear, descriptive commit messages:

- `feat: add support for custom validators`
- `fix: handle undefined env values correctly`
- `docs: update README with new examples`
- `test: add integration tests for loadEnv`

## Questions?

Open an issue for discussion before starting major changes.

Thank you for contributing!
