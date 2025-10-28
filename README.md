# smart-env

Secure .env loader with schema validation, type safety, defaults, and helpful error reporting. Minimal runtime overhead. Works out-of-the-box for Node + TypeScript.

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

## Contributing

Contributions welcome!

## License

MIT
