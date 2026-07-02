export interface SlugifyInput {
  value: string;
}

export function createSlug(input: string): string {
  return normalizeSlugifyInput(input)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function normalizeSlugifyInput(input: string): string {
  return input.trim();
}

export function hasSlugifyInput(input: string): boolean {
  return normalizeSlugifyInput(input).length > 0;
}
