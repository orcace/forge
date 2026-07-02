export interface JwtDecoderInput {
  value: string;
}

export interface DecodedJwt {
  error?: string;
  header: string;
  payload: string;
  signature: string;
}

export function normalizeJwtDecoderInput(input: string): string {
  return input.trim();
}

export function hasJwtDecoderInput(input: string): boolean {
  return normalizeJwtDecoderInput(input).length > 0;
}

export function decodeJwt(input: string): DecodedJwt {
  const token = normalizeJwtDecoderInput(input);
  const [header, payload, signature, ...rest] = token.split(".");

  if (!token) {
    return { header: "", payload: "", signature: "" };
  }

  if (!header || !payload || !signature || rest.length > 0) {
    return {
      error: "JWT must contain exactly three dot-separated sections.",
      header: "",
      payload: "",
      signature: "",
    };
  }

  try {
    return {
      header: JSON.stringify(JSON.parse(decodeBase64Url(header)), null, 2),
      payload: JSON.stringify(JSON.parse(decodeBase64Url(payload)), null, 2),
      signature,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to decode JWT.",
      header: "",
      payload: "",
      signature,
    };
  }
}

function decodeBase64Url(input: string): string {
  const base64 = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}
