export interface JsonYamlInput {
  value: string;
}

export function normalizeJsonYamlInput(input: string): string {
  return input.trim();
}

export function hasJsonYamlInput(input: string): boolean {
  return normalizeJsonYamlInput(input).length > 0;
}
