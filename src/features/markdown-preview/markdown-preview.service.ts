import DOMPurify from "dompurify";
import { marked } from "marked";
import type { MarkdownPreviewState, MarkdownPreviewTab } from "./markdown-preview.schema";

export interface MarkdownPreviewInput {
  value: string;
}

const sampleMarkdown = `# Forge Markdown Preview

Write Markdown on the left and inspect the rendered output on the right.

## Useful checks

- Keep notes in separate tabs
- Preview GitHub-style tables
- Export sanitized HTML when you need a quick artifact

| Feature | Status |
| --- | --- |
| Persistent tabs | Ready |
| Local rendering | Ready |

\`\`\`ts
const localFirst = true;
\`\`\`
`;

export function createMarkdownPreviewTab(index: number): MarkdownPreviewTab {
  return {
    content: index === 1 ? sampleMarkdown : "",
    id: crypto.randomUUID(),
    title: index === 1 ? "Welcome" : `Untitled ${index}`,
    updatedAt: Date.now(),
  };
}

export function createMarkdownPreviewState(): MarkdownPreviewState {
  const tab = createMarkdownPreviewTab(1);

  return {
    activeTabId: tab.id,
    previewVisible: true,
    syncScroll: true,
    tabs: [tab],
  };
}

export function normalizeMarkdownPreviewInput(input: string): string {
  return input.trim();
}

export function hasMarkdownPreviewInput(input: string): boolean {
  return normalizeMarkdownPreviewInput(input).length > 0;
}

export function renderMarkdownToHtml(input: string): string {
  const rawHtml = marked.parse(input, {
    async: false,
    breaks: true,
    gfm: true,
  });

  return DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
  });
}

export function estimateMarkdownReadTime(input: string): number {
  const words = normalizeMarkdownPreviewInput(input).split(/\s+/).filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 220));
}
