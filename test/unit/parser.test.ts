// Unit tests for env file parser.

import { describe, it, expect } from "vitest";
import { parseEnvFile } from "../../src/parser";
import { writeFileSync, unlinkSync, existsSync } from "fs";

describe("parseEnvFile", () => {
  const testFile = ".env.test";

  it("parses valid .env file", () => {
    writeFileSync(testFile, "KEY=value\nNUMBER=123");
    const result = parseEnvFile(testFile);

    expect(result.KEY).toBe("value");
    expect(result.NUMBER).toBe("123");

    unlinkSync(testFile);
  });

  it("returns empty object for missing file", () => {
    const result = parseEnvFile("nonexistent.env");
    expect(result).toEqual({});
  });

  it("handles empty file", () => {
    writeFileSync(testFile, "");
    const result = parseEnvFile(testFile);

    expect(result).toEqual({});

    unlinkSync(testFile);
  });

  it("ignores comments", () => {
    writeFileSync(testFile, "# comment\nKEY=value");
    const result = parseEnvFile(testFile);

    expect(result.KEY).toBe("value");
    expect(result["#"]).toBeUndefined();

    unlinkSync(testFile);
  });
});
