import { describe, expect, it } from "vitest";
import {
  hasPasswordGeneratorInput,
  normalizePasswordGeneratorInput,
} from "./password-generator.service";

describe("password-generator service", () => {
  it("normalizes user input", () => {
    expect(normalizePasswordGeneratorInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasPasswordGeneratorInput("   ")).toBe(false);
  });
});
