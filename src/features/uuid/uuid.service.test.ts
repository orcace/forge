import { describe, expect, it } from "vitest";
import {
  createUuidBatch,
  hasUuidInput,
  normalizeUuidInput,
  validateUuid,
} from "./uuid.service";

describe("uuid service", () => {
  it("normalizes user input", () => {
    expect(normalizeUuidInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasUuidInput("   ")).toBe(false);
  });

  it("generates v7 UUID batches", () => {
    const [value] = createUuidBatch({ count: 1, format: "standard", version: "v7" });

    expect(validateUuid(value).version).toBe("Version 7");
  });

  it("formats compact UUIDs", () => {
    const [value] = createUuidBatch({ count: 1, format: "compact", version: "v4" });

    expect(value).toMatch(/^[0-9a-f]{32}$/);
  });
});
