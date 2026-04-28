export interface HtmlPreviewInput {
  value: string;
}

export function normalizeHtmlPreviewInput(input: string): string {
  return input.trim();
}

export function hasHtmlPreviewInput(input: string): boolean {
  return normalizeHtmlPreviewInput(input).length > 0;
}
