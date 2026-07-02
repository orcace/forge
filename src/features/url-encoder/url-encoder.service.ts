export interface UrlEncoderInput {
  value: string;
}

export interface UrlEncoderResult {
  error?: string;
  value: string;
}

export function normalizeUrlEncoderInput(input: string): string {
  return input.trim();
}

export function hasUrlEncoderInput(input: string): boolean {
  return normalizeUrlEncoderInput(input).length > 0;
}

export function encodeUrlComponent(input: string): string {
  return encodeURIComponent(input);
}

export function decodeUrlComponent(input: string): UrlEncoderResult {
  try {
    return { value: decodeURIComponent(input) };
  } catch {
    return { error: "Input is not valid percent-encoded text.", value: "" };
  }
}
