// Internal DSL validator.
// Minimal schema validator for users who don't want Zod.

import { EnvRecord, InternalSchema, ValidationDetail } from "../types";
import { coerceBoolean, coerceNumber } from "../utils";

// Validate env record against internal schema.
// Returns validated data or array of validation errors.
export function validateWithInternal(
  schema: InternalSchema,
  env: EnvRecord
):
  | { success: true; data: any }
  | { success: false; errors: ValidationDetail[] } {
  const errors: ValidationDetail[] = [];
  const data: Record<string, any> = {};

  for (const key in schema) {
    const field = schema[key];
    const rawValue = env[key];

    // Check required fields.
    if (field.required && !rawValue) {
      errors.push({
        key,
        message: `Required but missing. Add: ${key}=your_value_here`,
      });
      continue;
    }

    // Apply defaults.
    if (rawValue === undefined && field.default !== undefined) {
      data[key] = field.default;
      continue;
    }

    // Coerce and validate types.
    if (rawValue !== undefined) {
      const coerced = coerceValue(rawValue, field.type);

      if (coerced.error) {
        errors.push({
          key,
          message: `Expected ${field.type}, got "${rawValue}"`,
        });
      } else {
        data[key] = coerced.value;
      }
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data };
}

// Coerce string value to specified type.
// Returns coerced value or error.
function coerceValue(
  value: string,
  type: "string" | "number" | "boolean"
): { value: any; error?: string } {
  if (type === "string") {
    return { value };
  }

  if (type === "number") {
    const num = coerceNumber(value);
    if (isNaN(num)) {
      return { value: null, error: "not a number" };
    }
    return { value: num };
  }

  if (type === "boolean") {
    return { value: coerceBoolean(value) };
  }

  return { value, error: "unknown type" };
}
