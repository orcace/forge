export interface SlugifyInput {
  value: string;
}

export function normalizeSlugifyInput(input: string): string {
  return input.trim();
}

export function hasSlugifyInput(input: string): boolean {
  return normalizeSlugifyInput(input).length > 0;
}
