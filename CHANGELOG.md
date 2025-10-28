# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial implementation of smart-env
- Core `loadEnv()` function with Zod schema support
- Internal DSL via `defineSchema()` for non-Zod users
- Type-safe, frozen config objects
- Validation with clear, actionable error messages
- Support for defaults and required fields
- Type coercion for string, number, and boolean values
- Secret masking in error output
- Optional `scrubProcessEnv` to remove keys after loading
- ESM and CJS dual build support
- Comprehensive test suite (26 tests)
- CI/CD workflow via GitHub Actions
- Complete documentation and examples

## [0.1.0] - TBD

Initial release.
