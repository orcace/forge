import { describe, expect, it } from "vitest";
import { hasHtmlPreviewInput, normalizeHtmlPreviewInput } from "./html-preview.service";

describe("html-preview service", () => {
  it("normalizes user input", () => {
    expect(normalizeHtmlPreviewInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasHtmlPreviewInput("   ")).toBe(false);
  });
});
