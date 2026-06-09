export interface JsonToolsInput {
  value: string;
}

export function normalizeJsonToolsInput(input: string): string {
  return input.trim();
}

export function hasJsonToolsInput(input: string): boolean {
  return normalizeJsonToolsInput(input).length > 0;
}
