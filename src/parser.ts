// Parses .env files into key-value records.
// Wraps dotenv with a clean, testable interface.

import { config } from "dotenv";
import { existsSync } from "fs";
import { EnvRecord } from "./types";

// Parse a single .env file and return its contents.
// Returns empty object if file doesn't exist or has errors.
export function parseEnvFile(filePath: string): EnvRecord {
  if (!existsSync(filePath)) {
    return {};
  }

  const result = config({ path: filePath });

  if (result.error) {
    console.warn(`smart-env: failed to parse ${filePath}`, result.error);
    return {};
  }

  return result.parsed || {};
}

// Parse multiple .env files in order.
// Later files override earlier ones.
export function parseEnvFiles(filePaths: string[]): EnvRecord {
  const merged: EnvRecord = {};

  for (const path of filePaths) {
    const parsed = parseEnvFile(path);
    Object.assign(merged, parsed);
  }

  return merged;
}
