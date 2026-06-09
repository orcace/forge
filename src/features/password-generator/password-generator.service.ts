export interface PasswordGeneratorInput {
  value: string;
}

export function normalizePasswordGeneratorInput(input: string): string {
  return input.trim();
}

export function hasPasswordGeneratorInput(input: string): boolean {
  return normalizePasswordGeneratorInput(input).length > 0;
}
