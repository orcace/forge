import { describe, expect, it } from "vitest";
import { hasSlugifyInput, normalizeSlugifyInput } from "./slugify.service";

describe("slugify service", () => {
  it("normalizes user input", () => {
    expect(normalizeSlugifyInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasSlugifyInput("   ")).toBe(false);
  });
});
