export interface HashGeneratorInput {
  value: string;
}

export function normalizeHashGeneratorInput(input: string): string {
  return input.trim();
}

export function hasHashGeneratorInput(input: string): boolean {
  return normalizeHashGeneratorInput(input).length > 0;
}
