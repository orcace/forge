export interface UrlEncoderInput {
  value: string;
}

export function normalizeUrlEncoderInput(input: string): string {
  return input.trim();
}

export function hasUrlEncoderInput(input: string): boolean {
  return normalizeUrlEncoderInput(input).length > 0;
}
