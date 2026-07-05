import { describe, expect, it } from "vitest";
import { createSlug, hasSlugifyInput, normalizeSlugifyInput } from "./slugify.service";

describe("slugify service", () => {
  it("normalizes user input", () => {
    expect(normalizeSlugifyInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasSlugifyInput("   ")).toBe(false);
  });

  it("supports separators and stop word removal", () => {
    expect(
      createSlug("The Forge Preview and Tool Suite 2026", {
        lowercase: true,
        maxLength: 80,
        removeNumbers: true,
        removeStopWords: true,
        separator: "_",
      }),
    ).toBe("forge_preview_tool_suite");
  });
});
