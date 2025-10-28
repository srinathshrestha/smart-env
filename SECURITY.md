# Security Policy

## Supported Versions

We actively support the following versions of smart-env:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in smart-env, please report it responsibly:

1. **DO NOT** create a public GitHub issue
2. Email security details to: [me@srinathshrestha.xyz](mailto:me@srinathshrestha.xyz)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Features

smart-env includes several security-focused features:

### Secret Protection

- **Secret Masking**: Sensitive values are automatically masked in error messages
- **Process Environment Scrubbing**: Optional removal of loaded keys from `process.env`
- **Immutable Configuration**: Returned objects are frozen to prevent accidental mutation

### Input Validation

- **Schema Validation**: All environment variables are validated against defined schemas
- **Type Safety**: Strong TypeScript types prevent type-related security issues
- **Required Field Validation**: Ensures critical environment variables are present

### Best Practices

- **No Global State**: Avoids common pitfalls of global environment variable access
- **Explicit Dependencies**: Clear dependency on `dotenv` for file loading
- **Minimal Attack Surface**: Small codebase with focused functionality

## Security Considerations

### Environment Variable Security

- Store sensitive data in environment variables, not in code
- Use strong, unique values for secrets
- Rotate secrets regularly
- Never commit `.env` files to version control

### Schema Design

- Define strict schemas for all environment variables
- Use appropriate validation rules (min/max lengths, formats)
- Mark sensitive fields as required
- Use enums for controlled values

### Runtime Security

- Enable `scrubProcessEnv` in production
- Use `strict: true` mode for validation
- Monitor for missing or invalid environment variables
- Log security events appropriately

## Dependencies

smart-env has minimal dependencies to reduce attack surface:

- **dotenv**: For loading `.env` files (peer dependency)
- **zod**: For schema validation (optional peer dependency)

Both dependencies are well-maintained and regularly updated for security patches.

## Disclosure Timeline

- **Day 0**: Vulnerability reported
- **Day 1**: Acknowledgment and initial assessment
- **Day 3**: Detailed analysis and fix development
- **Day 7**: Fix released (if applicable)
- **Day 14**: Public disclosure (if applicable)

## Security Updates

Security updates are released as patch versions (e.g., 0.1.6 → 0.1.7) and are backward compatible when possible.

Subscribe to GitHub releases to be notified of security updates.
