// Structured error types and pretty printing.
// Provides clear, actionable error messages.

import { ValidationDetail } from "./types";
import { maybeeMaskValue } from "./utils";

// Custom error class for smart-env validation failures.
export class SmartEnvError extends Error {
  public readonly details: ValidationDetail[];
  public readonly type: "Missing" | "Invalid" | "UnknownKey";

  constructor(details: ValidationDetail[], type = "Invalid" as const) {
    const message = formatErrorMessage(details);
    super(message);
    this.name = "SmartEnvError";
    this.details = details;
    this.type = type;
  }
}

// Format validation details into readable error message.
// Shows count and bulleted list of problems.
function formatErrorMessage(details: ValidationDetail[]): string {
  const count = details.length;
  const header = `smart-env: ${count} problem(s) found`;
  const items = details.map((d) => `  • ${d.key} — ${d.message}`);
  return [header, ...items].join("\n");
}

// Pretty print error details to console.
// Respects maskSecrets option.
export function logValidationErrors(
  details: ValidationDetail[],
  maskSecrets: boolean
): void {
  console.error(`\n❌ smart-env: ${details.length} problem(s) found`);

  for (const detail of details) {
    const message = maskSecrets
      ? maskErrorMessage(detail.message)
      : detail.message;
    console.error(`  • ${detail.key} — ${message}`);
  }

  console.error("");
}

// Mask sensitive values in error message.
// Simple pattern: replaces quoted strings if they look secret-like.
function maskErrorMessage(message: string): string {
  return message.replace(/"([^"]+)"/g, (match, value) => {
    if (value.length > 10 || /[A-Z0-9_]{8,}/.test(value)) {
      return '"***"';
    }
    return match;
  });
}

// Convert Zod issues to ValidationDetail array.
// Extracts key and message from Zod error format.
export function zodIssuesToDetails(issues: any[]): ValidationDetail[] {
  return issues.map((issue) => ({
    key: issue.path.join(".") || "unknown",
    message: issue.message,
  }));
}
