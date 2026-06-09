import { describe, expect, it } from "vitest";
import {
  beautifyHtml,
  createHtmlPreviewDocument,
  createHtmlPreviewState,
  hasHtmlPreviewInput,
  minifyHtml,
  normalizeHtmlPreviewInput,
} from "./html-preview.service";

describe("html-preview service", () => {
  it("normalizes user input", () => {
    expect(normalizeHtmlPreviewInput("  value  ")).toBe("value");
  });

  it("detects empty input", () => {
    expect(hasHtmlPreviewInput("   ")).toBe(false);
  });

  it("creates the default preview state", () => {
    const state = createHtmlPreviewState();

    expect(state.autoUpdate).toBe(true);
    expect(state.previewHtml).toBe(state.html);
  });

  it("wraps html fragments in a full document", () => {
    const document = createHtmlPreviewDocument("<h1>Hello</h1>");

    expect(document).toContain("<!doctype html>");
    expect(document).toContain("<h1>Hello</h1>");
  });

  it("keeps full html documents unchanged", () => {
    const document = "<html><body>Ready</body></html>";

    expect(createHtmlPreviewDocument(document)).toBe(document);
  });

  it("minifies html whitespace between tags", () => {
    expect(minifyHtml("<main>  <h1>Title</h1>  </main>")).toBe(
      "<main><h1>Title</h1></main>",
    );
  });

  it("beautifies compact html", () => {
    expect(beautifyHtml("<main><h1>Title</h1></main>")).toContain("  <h1>Title</h1>");
  });
});
