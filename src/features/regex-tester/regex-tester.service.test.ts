import { describe, expect, it } from "vitest";
import {
  hasRegexTesterInput,
  normalizeRegexTesterInput,
  testRegex,
} from "./regex-tester.service";

describe("regex-tester service", () => {
  it("normalizes user input", () => {
    expect(normalizeRegexTesterInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasRegexTesterInput("   ")).toBe(false);
  });

  it("returns matches, groups, and replacement output", () => {
    const result = testRegex("([A-Z]+)-(\\d+)", "g", "FORGE-1024", "$1#$2");

    expect(result.matches[0]?.groups).toEqual(["FORGE", "1024"]);
    expect(result.replaced).toBe("FORGE#1024");
  });
});
