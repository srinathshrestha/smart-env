// Unit tests for internal validator.

import { describe, it, expect } from "vitest";
import { validateWithInternal } from "../../src/validator/internal";

describe("validateWithInternal", () => {
  it("validates required fields", () => {
    const schema = {
      API_KEY: { type: "string" as const, required: true },
    };
    const env = { API_KEY: "test123" };

    const result = validateWithInternal(schema, env);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.API_KEY).toBe("test123");
    }
  });

  it("fails on missing required fields", () => {
    const schema = {
      API_KEY: { type: "string" as const, required: true },
    };
    const env = {};

    const result = validateWithInternal(schema, env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].key).toBe("API_KEY");
    }
  });

  it("applies defaults", () => {
    const schema = {
      PORT: { type: "number" as const, default: 3000 },
    };
    const env = {};

    const result = validateWithInternal(schema, env);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(3000);
    }
  });

  it("coerces number types", () => {
    const schema = {
      PORT: { type: "number" as const },
    };
    const env = { PORT: "8080" };

    const result = validateWithInternal(schema, env);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.PORT).toBe(8080);
    }
  });

  it("coerces boolean types", () => {
    const schema = {
      ENABLED: { type: "boolean" as const },
    };
    const env = { ENABLED: "true" };

    const result = validateWithInternal(schema, env);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ENABLED).toBe(true);
    }
  });

  it("fails on invalid number", () => {
    const schema = {
      PORT: { type: "number" as const },
    };
    const env = { PORT: "not-a-number" };

    const result = validateWithInternal(schema, env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors[0].key).toBe("PORT");
    }
  });
});
