# smart-env

[![npm version](https://img.shields.io/npm/v/@srinath-shrestha/smart-env.svg)](https://www.npmjs.com/package/@srinath-shrestha/smart-env)
[![npm downloads](https://img.shields.io/npm/dm/@srinath-shrestha/smart-env.svg)](https://www.npmjs.com/package/@srinath-shrestha/smart-env)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Secure .env loader with schema validation, type safety, defaults, and helpful error reporting. Minimal runtime overhead. Works out-of-the-box for Node + TypeScript.

**📦 [View on npm](https://www.npmjs.com/package/@srinath-shrestha/smart-env)**

## Why smart-env?

Traditional `.env` loaders like `dotenv` only load environment variables into `process.env` without any validation, type safety, or defaults. This leads to:

- Runtime errors when required variables are missing
- Type coercion bugs (e.g., `"false"` is truthy)
- Secrets leaked via logs or mutable `process.env`
- Inconsistent defaults across environments

**smart-env** solves these problems by:

- Validating env vars at boot time with clear error messages
- Providing strong TypeScript types inferred from your schema
- Returning frozen config objects (immutable)
- Supporting defaults in one place
- Optionally scrubbing secrets from `process.env`

## Installation

```bash
npm install @srinath-shrestha/smart-env zod
# or
pnpm add @srinath-shrestha/smart-env zod
# or
yarn add @srinath-shrestha/smart-env zod
```

> **Note**: `zod` is a peer dependency. If you prefer not to use Zod, you can use the built-in DSL (see below).

## Quick Start

### Using Zod (Recommended)

```typescript
import { loadEnv } from "@srinath-shrestha/smart-env";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  API_KEY: z.string().min(1),
  ENABLE_CACHE: z.coerce.boolean().default(false),
});

const env = loadEnv(schema, { strict: true, scrubProcessEnv: true });

// env.PORT is number
// env.API_KEY is string
// env.ENABLE_CACHE is boolean
```

### Using Built-in DSL (No Zod)

```typescript
import { defineSchema, loadEnv } from "@srinath-shrestha/smart-env";

const schema = defineSchema({
  PORT: { type: "number", default: 3000 },
  API_KEY: { type: "string", required: true },
  ENABLE_CACHE: { type: "boolean", default: false },
});

const env = loadEnv(schema);
```

## API

### `loadEnv(schema, options?)`

Loads and validates environment variables.

**Options:**

- `strict: boolean` - Default `true`. Throw on validation errors. Set to `false` to log warnings instead.
- `scrubProcessEnv: boolean` - Default `false`. Remove loaded keys from `process.env` after reading.
- `maskSecrets: boolean` - Default `true`. Mask secret values in error messages.
- `allowUnknownKeys: boolean` - Default `true`. Allow extra env vars not in schema.
- `sourceFiles: string[]` - Default `['.env']`. Env files to load.

**Returns:** Frozen, type-safe config object.

### `defineSchema(schema)`

Define a schema using the built-in DSL (for non-Zod users).

**Schema format:**

```typescript
{
  KEY_NAME: {
    type: "string" | "number" | "boolean",
    required?: boolean,
    default?: any
  }
}
```

## Error Messages

When validation fails in strict mode, you get clear, actionable errors:

```
❌ smart-env: 2 problem(s) found
  • API_KEY — missing (required). Add: API_KEY=your_api_key_here
  • PORT — invalid type. Expected number, got "abc"
```

## Migration from dotenv

**Before:**

```typescript
import dotenv from "dotenv";
dotenv.config();

const port = Number(process.env.PORT) || 3000;
const apiKey = process.env.API_KEY; // might be undefined
```

**After:**

```typescript
import { loadEnv } from "@srinath-shrestha/smart-env";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  API_KEY: z.string().min(1),
});

const env = loadEnv(schema);
// env.PORT is always a number
// env.API_KEY is guaranteed to exist
```

## Security

smart-env helps prevent common security issues:

- **Secret Leakage**: Optional `scrubProcessEnv` removes loaded keys from `process.env`
- **Secret Masking**: Sensitive values are masked in error messages by default
- **Immutable Config**: Returned objects are frozen to prevent accidental mutation
- **Validation**: All environment variables are validated at startup

## Performance

- **Minimal Overhead**: ~2KB gzipped, no runtime dependencies (except dotenv)
- **Fast Validation**: Schema validation happens once at startup
- **Tree Shakeable**: Only import what you use

## Examples

### Express.js Application

```typescript
import express from 'express';
import { loadEnv } from '@srinath-shrestha/smart-env';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().url().optional(),
});

const env = loadEnv(schema, { strict: true, scrubProcessEnv: true });

const app = express();
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
```

### Next.js Application

```typescript
// lib/env.ts
import { loadEnv } from '@srinath-shrestha/smart-env';
import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
});

export const env = loadEnv(schema);
```

## Migration Guide

### From dotenv

```typescript
// Before
import dotenv from 'dotenv';
dotenv.config();

const port = Number(process.env.PORT) || 3000;
const isDev = process.env.NODE_ENV === 'development';
const apiKey = process.env.API_KEY; // might be undefined!

// After
import { loadEnv } from '@srinath-shrestha/smart-env';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  API_KEY: z.string().min(1),
});

const env = loadEnv(schema);
// env.PORT is always a number
// env.NODE_ENV is always a valid enum value
// env.API_KEY is guaranteed to exist and be non-empty
```

## API Reference

### `loadEnv(schema, options?)`

Loads and validates environment variables using the provided schema.

**Parameters:**
- `schema` - Zod schema or DSL schema object
- `options` - Optional configuration object

**Options:**
- `strict?: boolean` - Throw on validation errors (default: `true`)
- `scrubProcessEnv?: boolean` - Remove loaded keys from `process.env` (default: `false`)
- `maskSecrets?: boolean` - Mask secret values in error messages (default: `true`)
- `allowUnknownKeys?: boolean` - Allow extra environment variables (default: `true`)
- `sourceFiles?: string[]` - Environment files to load (default: `['.env']`)

**Returns:** Frozen, type-safe configuration object

### `defineSchema(schema)`

Creates a schema using the built-in DSL (no Zod required).

**Schema Format:**
```typescript
{
  KEY_NAME: {
    type: 'string' | 'number' | 'boolean',
    required?: boolean,
    default?: any
  }
}
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/srinathshrestha/smart-env#readme)
- 🐛 [Report Issues](https://github.com/srinathshrestha/smart-env/issues)
- 💬 [Discussions](https://github.com/srinathshrestha/smart-env/discussions)
- ⭐ [Star on GitHub](https://github.com/srinathshrestha/smart-env)
