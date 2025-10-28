// Basic example using internal DSL.
// Run with: ts-node examples/basic.ts

import { loadEnv, defineSchema } from "@srinath/smart-env";

// Define schema using built-in DSL.
const schema = defineSchema({
  PORT: { type: "number", default: 3000 },
  NODE_ENV: { type: "string", default: "development" },
  API_KEY: { type: "string", required: true },
  ENABLE_CACHE: { type: "boolean", default: false },
});

try {
  // Load and validate environment variables.
  const env = loadEnv(schema, { strict: true });

  console.log("Environment loaded successfully:");
  console.log(`  PORT: ${env.PORT}`);
  console.log(`  NODE_ENV: ${env.NODE_ENV}`);
  console.log(`  API_KEY: ${env.API_KEY ? "***" : "not set"}`);
  console.log(`  ENABLE_CACHE: ${env.ENABLE_CACHE}`);
} catch (error) {
  console.error("Failed to load environment:", error);
  process.exit(1);
}
