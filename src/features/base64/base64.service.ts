export interface Base64Input {
  value: string;
}

export type Base64Mode = "encode" | "decode";
export type Base64Variant = "standard" | "url";
export type Base64TextEncoding = "utf-8" | "utf-16le";

export interface Base64Options {
  lineWrap: boolean;
  padding: boolean;
  textEncoding: Base64TextEncoding;
  variant: Base64Variant;
}

export interface Base64Stats {
  bytes: number;
  chars: number;
  lines: number;
}

export interface Base64Result {
  error?: string;
  inputStats: Base64Stats;
  outputStats: Base64Stats;
  value: string;
}

const defaultOptions: Base64Options = {
  lineWrap: false,
  padding: true,
  textEncoding: "utf-8",
  variant: "standard",
};

export function normalizeBase64Input(input: string): string {
  return input.trim();
}

export function hasBase64Input(input: string): boolean {
  return normalizeBase64Input(input).length > 0;
}

export function transformBase64(
  input: string,
  mode: Base64Mode,
  options: Partial<Base64Options> = {},
): Base64Result {
  const mergedOptions = { ...defaultOptions, ...options };

  if (!input) {
    return {
      inputStats: getTextStats(input, mergedOptions.textEncoding),
      outputStats: getTextStats("", mergedOptions.textEncoding),
      value: "",
    };
  }

  try {
    const value =
      mode === "encode"
        ? encodeBase64(input, mergedOptions)
        : decodeBase64(input, mergedOptions).value;

    return {
      inputStats: getTextStats(input, mergedOptions.textEncoding),
      outputStats: getTextStats(value, mergedOptions.textEncoding),
      value,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to transform Base64.",
      inputStats: getTextStats(input, mergedOptions.textEncoding),
      outputStats: getTextStats("", mergedOptions.textEncoding),
      value: "",
    };
  }
}

export function encodeBase64(
  input: string,
  options: Partial<Base64Options> = {},
): string {
  const mergedOptions = { ...defaultOptions, ...options };
  const bytes = encodeText(input, mergedOptions.textEncoding);
  let output = encodeBytesBase64(bytes);

  if (mergedOptions.variant === "url") {
    output = output.replaceAll("+", "-").replaceAll("/", "_");
  }

  if (!mergedOptions.padding) {
    output = output.replace(/=+$/, "");
  }

  return mergedOptions.lineWrap ? wrapBase64Lines(output) : output;
}

export function decodeBase64(
  input: string,
  options: Partial<Base64Options> = {},
): Base64Result {
  const mergedOptions = { ...defaultOptions, ...options };
  const normalized = normalizeEncodedInput(input, mergedOptions.variant);
  const bytes = decodeBase64Bytes(normalized);
  const value = decodeText(bytes, mergedOptions.textEncoding);

  return {
    inputStats: getEncodedStats(input),
    outputStats: getTextStats(value, mergedOptions.textEncoding),
    value,
  };
}

export function detectBase64Variant(input: string): Base64Variant {
  const normalized = normalizeBase64Input(input);

  return /[-_]/.test(normalized) && !/[+/]/.test(normalized) ? "url" : "standard";
}

function normalizeEncodedInput(input: string, variant: Base64Variant): string {
  const compact = normalizeBase64Input(input).replace(/\s+/g, "");
  const standard =
    variant === "url" ? compact.replaceAll("-", "+").replaceAll("_", "/") : compact;

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(standard)) {
    throw new Error("Input contains characters outside the selected Base64 alphabet.");
  }

  if (standard.length % 4 === 1) {
    throw new Error("Input length is not valid Base64.");
  }

  return standard.padEnd(Math.ceil(standard.length / 4) * 4, "=");
}

function encodeBytesBase64(bytes: Uint8Array): string {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function decodeBase64Bytes(input: string): Uint8Array {
  try {
    const binary = atob(input);

    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    throw new Error("Input is not valid Base64.");
  }
}

function encodeText(input: string, encoding: Base64TextEncoding): Uint8Array {
  if (encoding === "utf-16le") {
    const bytes = new Uint8Array(input.length * 2);

    for (let index = 0; index < input.length; index += 1) {
      const code = input.charCodeAt(index);

      bytes[index * 2] = code & 0xff;
      bytes[index * 2 + 1] = code >> 8;
    }

    return bytes;
  }

  return new TextEncoder().encode(input);
}

function decodeText(bytes: Uint8Array, encoding: Base64TextEncoding): string {
  if (encoding === "utf-16le") {
    if (bytes.length % 2 !== 0) {
      throw new Error("Decoded bytes are not valid UTF-16LE text.");
    }

    let output = "";

    for (let index = 0; index < bytes.length; index += 2) {
      output += String.fromCharCode(bytes[index] | (bytes[index + 1] << 8));
    }

    return output;
  }

  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function wrapBase64Lines(input: string): string {
  return input.match(/.{1,76}/g)?.join("\n") ?? "";
}

function getTextStats(input: string, encoding: Base64TextEncoding): Base64Stats {
  return {
    bytes: encodeText(input, encoding).length,
    chars: input.length,
    lines: input ? input.split(/\r\n|\n|\r/).length : 0,
  };
}

function getEncodedStats(input: string): Base64Stats {
  const compact = input.replace(/\s+/g, "");

  return {
    bytes: Math.max(
      0,
      Math.floor((compact.length * 3) / 4) - (compact.match(/=/g)?.length ?? 0),
    ),
    chars: compact.length,
    lines: input ? input.split(/\r\n|\n|\r/).length : 0,
  };
}
