import { describe, expect, it } from "vitest";
import {
  hasMarkdownPreviewInput,
  normalizeMarkdownPreviewInput,
} from "./markdown-preview.service";

describe("markdown-preview service", () => {
  it("normalizes user input", () => {
    expect(normalizeMarkdownPreviewInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasMarkdownPreviewInput("   ")).toBe(false);
  });
});
