// Integration tests for loadEnv function.

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadEnv, defineSchema, SmartEnvError } from "../../src/index";
import { writeFileSync, unlinkSync } from "fs";

describe("loadEnv integration", () => {
  const testEnvFile = ".env.test";

  beforeEach(() => {
    // Clean up any existing test env vars.
    delete process.env.TEST_KEY;
    delete process.env.TEST_PORT;
  });

  afterEach(() => {
    // Clean up test file if exists.
    try {
      unlinkSync(testEnvFile);
    } catch (e) {
      // File may not exist, ignore.
    }
  });

  it("loads and validates using internal schema", () => {
    writeFileSync(testEnvFile, "TEST_PORT=3000\nTEST_KEY=value");

    const schema = defineSchema({
      TEST_PORT: { type: "number", required: true },
      TEST_KEY: { type: "string", required: true },
    });

    const env = loadEnv(schema, { sourceFiles: [testEnvFile] });

    expect(env.TEST_PORT).toBe(3000);
    expect(env.TEST_KEY).toBe("value");
  });

  it("applies defaults for missing values", () => {
    writeFileSync(testEnvFile, "");

    const schema = defineSchema({
      TEST_PORT: { type: "number", default: 8080 },
    });

    const env = loadEnv(schema, { sourceFiles: [testEnvFile] });

    expect(env.TEST_PORT).toBe(8080);
  });

  it("throws error in strict mode for missing required", () => {
    writeFileSync(testEnvFile, "");

    const schema = defineSchema({
      TEST_KEY: { type: "string", required: true },
    });

    expect(() => {
      loadEnv(schema, { sourceFiles: [testEnvFile], strict: true });
    }).toThrow(SmartEnvError);
  });

  it("warns in non-strict mode for missing required", () => {
    writeFileSync(testEnvFile, "");

    const schema = defineSchema({
      TEST_KEY: { type: "string", required: true },
    });

    const env = loadEnv(schema, {
      sourceFiles: [testEnvFile],
      strict: false,
    });

    // Should return empty frozen object in non-strict mode.
    expect(env).toEqual({});
  });

  it("merges process.env with file env", () => {
    writeFileSync(testEnvFile, "TEST_KEY=file_value");
    process.env.TEST_KEY = "process_value";

    const schema = defineSchema({
      TEST_KEY: { type: "string", required: true },
    });

    const env = loadEnv(schema, { sourceFiles: [testEnvFile] });

    // process.env should override file.
    expect(env.TEST_KEY).toBe("process_value");
  });

  it("returns frozen config object", () => {
    writeFileSync(testEnvFile, "TEST_KEY=value");

    const schema = defineSchema({
      TEST_KEY: { type: "string", required: true },
    });

    const env = loadEnv(schema, { sourceFiles: [testEnvFile] });

    // Attempt to modify should fail silently or throw in strict mode.
    expect(() => {
      (env as any).TEST_KEY = "new_value";
    }).toThrow();
  });
});
