export interface JwtDecoderInput {
  value: string;
}

export function normalizeJwtDecoderInput(input: string): string {
  return input.trim();
}

export function hasJwtDecoderInput(input: string): boolean {
  return normalizeJwtDecoderInput(input).length > 0;
}
