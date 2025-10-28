// Merges .env files with process.env.
// Pure function: reads files and environment, returns merged result.

import { parseEnvFiles } from "./parser";
import { EnvRecord, LoadEnvOptions } from "./types";

// Default source files to load.
const DEFAULT_SOURCE_FILES = [".env"];

// Merge .env file(s) with process.env.
// process.env values override file values.
export function loadRawEnv(options: LoadEnvOptions = {}): EnvRecord {
  const sourceFiles = options.sourceFiles || DEFAULT_SOURCE_FILES;

  // Parse all source files.
  const fileEnv = parseEnvFiles(sourceFiles);

  // Merge with process.env (process.env takes priority).
  const merged: EnvRecord = { ...fileEnv };

  for (const key in process.env) {
    if (process.env[key] !== undefined) {
      merged[key] = process.env[key];
    }
  }

  return merged;
}

// Get list of keys that were loaded from schema.
// Used for scrubbing process.env.
export function extractSchemaKeys(schema: unknown): string[] {
  if (typeof schema !== "object" || schema === null) {
    return [];
  }

  // Handle internal schema format.
  if (!("_def" in schema)) {
    return Object.keys(schema);
  }

  // Handle Zod schema.
  // Access shape from _def if available.
  const def = (schema as any)._def;
  if (def && def.shape && typeof def.shape === "function") {
    return Object.keys(def.shape());
  }

  return [];
}
