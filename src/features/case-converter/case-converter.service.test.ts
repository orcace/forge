import { describe, expect, it } from "vitest";
import { hasCaseConverterInput, normalizeCaseConverterInput } from "./case-converter.service";

describe("case-converter service", () => {
  it("normalizes user input", () => {
    expect(normalizeCaseConverterInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasCaseConverterInput("   ")).toBe(false);
  });
});
