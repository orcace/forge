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

  it("injects preview chrome into full html documents", () => {
    const document = "<html><body>Ready</body></html>";
    const previewDocument = createHtmlPreviewDocument(document);

    expect(previewDocument).toContain("<body>Ready</body>");
    expect(previewDocument).toContain("data-forge-preview-scrollbar");
  });

  it("minifies html whitespace between tags", () => {
    expect(minifyHtml("<main>  <h1>Title</h1>  </main>")).toBe(
      "<main><h1>Title</h1></main>",
    );
  });

  it("beautifies compact html", () => {
    expect(beautifyHtml("<main><h1>Title</h1></main>")).toContain("  <h1>Title</h1>");
  });

  it("beautifies html with a custom indent size", () => {
    expect(beautifyHtml("<main><h1>Title</h1></main>", 4)).toContain(
      "    <h1>Title</h1>",
    );
  });

  it("beautifies script contents", () => {
    expect(
      beautifyHtml(
        "<script>function toggleTheme(){document.body.classList.toggle('dark');}</script>",
      ),
    ).toContain("function toggleTheme(){\n  document.body.classList.toggle('dark');");
  });
});
