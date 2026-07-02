export interface Base64Input {
  value: string;
}

export interface Base64Result {
  error?: string;
  value: string;
}

export function normalizeBase64Input(input: string): string {
  return input.trim();
}

export function hasBase64Input(input: string): boolean {
  return normalizeBase64Input(input).length > 0;
}

export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");

  return btoa(binary);
}

export function decodeBase64(input: string): Base64Result {
  try {
    const binary = atob(normalizeBase64Input(input));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

    return { value: new TextDecoder().decode(bytes) };
  } catch {
    return { error: "Input is not valid Base64.", value: "" };
  }
}
