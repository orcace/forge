export interface Base64Input {
  value: string;
}

export function normalizeBase64Input(input: string): string {
  return input.trim();
}

export function hasBase64Input(input: string): boolean {
  return normalizeBase64Input(input).length > 0;
}
