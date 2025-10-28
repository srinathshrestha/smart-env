// Zod schema adapter.
// Validates env using Zod and maps results to common contract.

import { EnvRecord, ValidationDetail } from "../types";
import { zodIssuesToDetails } from "../errors";

// Validate env record against Zod schema.
// Returns validated data or array of validation errors.
export function validateWithZod(
  schema: any,
  env: EnvRecord
):
  | { success: true; data: any }
  | { success: false; errors: ValidationDetail[] } {
  const result = schema.safeParse(env);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = zodIssuesToDetails(result.error.issues);
  return { success: false, errors };
}
