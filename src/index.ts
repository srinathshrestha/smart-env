// Public API for smart-env.
// Orchestrates loading, validation, and error handling.

import { loadRawEnv, extractSchemaKeys } from "./loader";
import { validateWithZod } from "./validator/zod-adapter";
import { validateWithInternal } from "./validator/internal";
import { SmartEnvError, logValidationErrors } from "./errors";
import { freezeConfig, scrubKeys } from "./utils";
import {
  LoadEnvOptions,
  InternalSchema,
  isZodSchema,
  ValidationDetail,
} from "./types";

// Main function: load and validate environment variables.
// Accepts Zod schema or internal DSL schema.
// Returns frozen, type-safe config object.
export function loadEnv<T extends Record<string, any>>(
  schema: any,
  options: LoadEnvOptions = {}
): T {
  // Set defaults for options.
  const strict = options.strict ?? true;
  const maskSecrets = options.maskSecrets ?? true;
  const scrubProcessEnv = options.scrubProcessEnv ?? false;

  // Load raw env from files and process.env.
  const rawEnv = loadRawEnv(options);

  // Validate using appropriate validator.
  const result = isZodSchema(schema)
    ? validateWithZod(schema, rawEnv)
    : validateWithInternal(schema as InternalSchema, rawEnv);

  // Handle validation failure.
  if (!result.success) {
    handleValidationErrors(result.errors, strict, maskSecrets);

    // In warn mode, return empty frozen object.
    return freezeConfig({}) as T;
  }

  // Optionally scrub process.env.
  if (scrubProcessEnv) {
    const keys = extractSchemaKeys(schema);
    scrubKeys(keys);
  }

  // Return frozen config.
  return freezeConfig(result.data) as T;
}

// Handle validation errors: throw or log based on strict mode.
function handleValidationErrors(
  errors: ValidationDetail[],
  strict: boolean,
  maskSecrets: boolean
): void {
  if (strict) {
    throw new SmartEnvError(errors);
  }

  logValidationErrors(errors, maskSecrets);
}

// Define schema using internal DSL (for non-Zod users).
export function defineSchema(schema: InternalSchema): InternalSchema {
  return schema;
}

// Re-export types for consumer convenience.
export type { LoadEnvOptions, InternalSchema, ValidationDetail };
export { SmartEnvError };
