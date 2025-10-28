// Unit tests for utility functions.

import { describe, it, expect } from "vitest";
import {
  coerceBoolean,
  coerceNumber,
  maskSecret,
  isSecretKey,
} from "../../src/utils";

describe("coerceBoolean", () => {
  it("converts truthy strings to true", () => {
    expect(coerceBoolean("true")).toBe(true);
    expect(coerceBoolean("TRUE")).toBe(true);
    expect(coerceBoolean("1")).toBe(true);
    expect(coerceBoolean("yes")).toBe(true);
  });

  it("converts falsy strings to false", () => {
    expect(coerceBoolean("false")).toBe(false);
    expect(coerceBoolean("FALSE")).toBe(false);
    expect(coerceBoolean("0")).toBe(false);
    expect(coerceBoolean("no")).toBe(false);
  });

  it("handles undefined and empty strings", () => {
    expect(coerceBoolean(undefined)).toBe(false);
    expect(coerceBoolean("")).toBe(false);
  });
});

describe("coerceNumber", () => {
  it("converts numeric strings to numbers", () => {
    expect(coerceNumber("123")).toBe(123);
    expect(coerceNumber("3.14")).toBe(3.14);
    expect(coerceNumber("-42")).toBe(-42);
  });

  it("returns NaN for invalid numbers", () => {
    expect(coerceNumber("abc")).toBeNaN();
    expect(coerceNumber("12abc")).toBeNaN();
  });

  it("handles undefined", () => {
    expect(coerceNumber(undefined)).toBeNaN();
  });
});

describe("maskSecret", () => {
  it("masks long secrets", () => {
    const result = maskSecret("supersecretkey123");
    expect(result).toBe("sup***23");
  });

  it("masks short values completely", () => {
    expect(maskSecret("abc")).toBe("***");
    expect(maskSecret("ab")).toBe("***");
  });
});

describe("isSecretKey", () => {
  it("detects secret-like key names", () => {
    expect(isSecretKey("API_KEY")).toBe(true);
    expect(isSecretKey("JWT_SECRET")).toBe(true);
    expect(isSecretKey("AUTH_TOKEN")).toBe(true);
    expect(isSecretKey("DB_PASSWORD")).toBe(true);
  });

  it("does not flag regular keys", () => {
    expect(isSecretKey("PORT")).toBe(false);
    expect(isSecretKey("NODE_ENV")).toBe(false);
    expect(isSecretKey("DEBUG")).toBe(false);
  });
});
