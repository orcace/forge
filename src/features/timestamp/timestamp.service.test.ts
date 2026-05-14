import { describe, expect, it } from "vitest";
import { hasTimestampInput, normalizeTimestampInput } from "./timestamp.service";

describe("timestamp service", () => {
  it("normalizes user input", () => {
    expect(normalizeTimestampInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasTimestampInput("   ")).toBe(false);
  });
});
