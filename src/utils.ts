// Shared utility functions.
// Includes coercion, masking, and helper logic.

import { EnvRecord } from "./types";

// Coerce string value to boolean.
// "true", "1", "yes" => true; "false", "0", "no" => false.
export function coerceBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const lower = value.toLowerCase();
  return lower === "true" || lower === "1" || lower === "yes";
}

// Coerce string value to number.
// Returns NaN if conversion fails.
export function coerceNumber(value: string | undefined): number {
  if (!value) return NaN;
  return Number(value);
}

// Mask a secret value for logging.
// Shows only first 3 and last 2 chars.
export function maskSecret(value: string): string {
  if (value.length <= 5) return "***";
  return `${value.slice(0, 3)}***${value.slice(-2)}`;
}

// Detect if a key name looks like a secret.
// Checks for common patterns: KEY, SECRET, TOKEN, PASSWORD.
export function isSecretKey(key: string): boolean {
  const upper = key.toUpperCase();
  return (
    upper.includes("KEY") ||
    upper.includes("SECRET") ||
    upper.includes("TOKEN") ||
    upper.includes("PASSWORD")
  );
}

// Mask value if masking enabled and key is secret-like.
export function maybeeMaskValue(
  key: string,
  value: string,
  shouldMask: boolean
): string {
  if (!shouldMask) return value;
  if (!isSecretKey(key)) return value;
  return maskSecret(value);
}

// Remove specified keys from process.env.
// Used for scrubProcessEnv option.
export function scrubKeys(keys: string[]): void {
  for (const key of keys) {
    delete process.env[key];
  }
}

// Freeze an object deeply (one level).
// Returns readonly version of input.
export function freezeConfig<T extends Record<string, unknown>>(
  config: T
): Readonly<T> {
  return Object.freeze(config);
}
