export interface RegexTesterInput {
  value: string;
}

export function normalizeRegexTesterInput(input: string): string {
  return input.trim();
}

export function hasRegexTesterInput(input: string): boolean {
  return normalizeRegexTesterInput(input).length > 0;
}
