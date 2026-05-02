import { describe, expect, it } from "vitest";
import { hasDiffCheckerInput, normalizeDiffCheckerInput } from "./diff-checker.service";

describe("diff-checker service", () => {
  it("normalizes user input", () => {
    expect(normalizeDiffCheckerInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasDiffCheckerInput("   ")).toBe(false);
  });
});
