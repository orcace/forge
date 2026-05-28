import { describe, expect, it } from "vitest";
import { hasRegexTesterInput, normalizeRegexTesterInput } from "./regex-tester.service";

describe("regex-tester service", () => {
  it("normalizes user input", () => {
    expect(normalizeRegexTesterInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasRegexTesterInput("   ")).toBe(false);
  });
});
