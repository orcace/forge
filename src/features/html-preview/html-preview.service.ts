import type { HtmlPreviewState } from "./html-preview.schema";

export interface HtmlPreviewInput {
  value: string;
}

const sampleHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Forge HTML Preview</title>
    <style>
      body {
        font-family: Inter, system-ui, sans-serif;
        margin: 0;
        padding: 32px;
        color: #0f172a;
      }

      .panel {
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 24px;
      }
    </style>
  </head>
  <body>
    <main class="panel">
      <h1>Forge HTML Preview</h1>
      <p>Edit HTML locally and inspect the sandboxed output.</p>
    </main>
  </body>
</html>`;

export function createHtmlPreviewState(): HtmlPreviewState {
  return {
    autoUpdate: true,
    html: sampleHtml,
    previewHtml: sampleHtml,
  };
}

export function normalizeHtmlPreviewInput(input: string): string {
  return input.trim();
}

export function hasHtmlPreviewInput(input: string): boolean {
  return normalizeHtmlPreviewInput(input).length > 0;
}

export function createHtmlPreviewDocument(input: string): string {
  const html = normalizeHtmlPreviewInput(input);

  if (!html) {
    return "<!doctype html><html><body></body></html>";
  }

  if (/<html[\s>]/i.test(html)) {
    return html;
  }

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
${html}
</body>
</html>`;
}

export function minifyHtml(input: string): string {
  return input
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function beautifyHtml(input: string): string {
  const compact = minifyHtml(input);
  const tokens = compact.replace(/></g, ">\n<").split("\n");
  let depth = 0;

  return tokens
    .map((token) => {
      const trimmed = token.trim();
      const isClosingTag = /^<\//.test(trimmed);
      const isSelfClosingTag =
        /\/>$/.test(trimmed) ||
        /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i.test(
          trimmed,
        );

      if (isClosingTag) {
        depth = Math.max(0, depth - 1);
      }

      const line = `${"  ".repeat(depth)}${trimmed}`;

      if (!isClosingTag && !isSelfClosingTag && /^<[^!][^>]*>$/.test(trimmed)) {
        depth += 1;
      }

      return line;
    })
    .join("\n");
}
