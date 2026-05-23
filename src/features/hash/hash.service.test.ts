import { describe, expect, it } from "vitest";
import { hasHashGeneratorInput, normalizeHashGeneratorInput } from "./hash.service";

describe("hash service", () => {
  it("normalizes user input", () => {
    expect(normalizeHashGeneratorInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasHashGeneratorInput("   ")).toBe(false);
  });
});
