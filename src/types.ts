// Central type definitions for smart-env.
// Keeps type contracts consistent across modules.

export type EnvValue = string | undefined;

export type EnvRecord = Record<string, EnvValue>;

// Options passed to loadEnv function.
export interface LoadEnvOptions {
  // Throw errors on validation failure (default: true).
  strict?: boolean;
  // Remove keys from process.env after loading (default: false).
  scrubProcessEnv?: boolean;
  // Mask secret values in error messages (default: true).
  maskSecrets?: boolean;
  // Allow extra env vars not in schema (default: true).
  allowUnknownKeys?: boolean;
  // List of .env files to load (default: ['.env']).
  sourceFiles?: string[];
}

// Shape of validation error detail.
export interface ValidationDetail {
  key: string;
  message: string;
}

// Internal schema field definition for DSL.
export interface SchemaField {
  type: "string" | "number" | "boolean";
  required?: boolean;
  default?: string | number | boolean;
}

// Internal schema definition object.
export type InternalSchema = Record<string, SchemaField>;

// Type guard: checks if value is Zod schema.
export function isZodSchema(schema: unknown): boolean {
  return (
    typeof schema === "object" &&
    schema !== null &&
    "_def" in schema &&
    "parse" in schema
  );
}
