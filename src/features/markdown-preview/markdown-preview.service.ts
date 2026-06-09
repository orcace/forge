export interface MarkdownPreviewInput {
  value: string;
}

export function normalizeMarkdownPreviewInput(input: string): string {
  return input.trim();
}

export function hasMarkdownPreviewInput(input: string): boolean {
  return normalizeMarkdownPreviewInput(input).length > 0;
}
