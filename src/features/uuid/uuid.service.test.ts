import { describe, expect, it } from "vitest";
import { hasUuidInput, normalizeUuidInput } from "./uuid.service";

describe("uuid service", () => {
  it("normalizes user input", () => {
    expect(normalizeUuidInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasUuidInput("   ")).toBe(false);
  });
});
