export interface HashGeneratorInput {
  value: string;
}

export type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
export type HashMode = "digest" | "hmac";
export type HashOutputFormat = "base64" | "base64url" | "hex";

export interface HashOptions {
  algorithm: HashAlgorithm;
  format: HashOutputFormat;
  key: string;
  mode: HashMode;
}

export interface HashDigest {
  algorithm: HashAlgorithm;
  format: HashOutputFormat;
  label: string;
  mode: HashMode;
  value: string;
}

export interface HashResult {
  digests: HashDigest[];
  error?: string;
  stats: {
    bytes: number;
    chars: number;
    lines: number;
  };
}

const algorithms: HashAlgorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

export function normalizeHashGeneratorInput(input: string): string {
  return input.trim();
}

export function hasHashGeneratorInput(input: string): boolean {
  return normalizeHashGeneratorInput(input).length > 0;
}

export async function generateHashes(input: string): Promise<HashDigest[]> {
  return Promise.all(
    algorithms.map(async (algorithm) => ({
      algorithm,
      format: "hex",
      label: algorithm,
      mode: "digest",
      value: await digestText(input, algorithm, "hex"),
    })),
  );
}

export async function generateHashResult(
  input: string,
  options: HashOptions,
): Promise<HashResult> {
  const stats = getHashStats(input);

  if (!input) {
    return { digests: [], stats };
  }

  try {
    if (options.mode === "hmac") {
      if (!options.key) {
        return {
          digests: [],
          error: "Enter an HMAC secret key.",
          stats,
        };
      }

      return {
        digests: [
          {
            algorithm: options.algorithm,
            format: options.format,
            label: `HMAC-${options.algorithm}`,
            mode: "hmac",
            value: await hmacText(input, options.key, options.algorithm, options.format),
          },
        ],
        stats,
      };
    }

    return {
      digests: await Promise.all(
        algorithms.map(async (algorithm) => ({
          algorithm,
          format: options.format,
          label: algorithm,
          mode: "digest" as const,
          value: await digestText(input, algorithm, options.format),
        })),
      ),
      stats,
    };
  } catch (error) {
    return {
      digests: [],
      error: error instanceof Error ? error.message : "Unable to generate hash.",
      stats,
    };
  }
}

async function digestText(
  input: string,
  algorithm: HashAlgorithm,
  format: HashOutputFormat,
): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest(algorithm, bytes);

  return formatBytes(new Uint8Array(digest), format);
}

async function hmacText(
  input: string,
  keyText: string,
  algorithm: HashAlgorithm,
  format: HashOutputFormat,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(keyText),
    { hash: algorithm, name: "HMAC" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(input),
  );

  return formatBytes(new Uint8Array(signature), format);
}

function formatBytes(bytes: Uint8Array, format: HashOutputFormat): string {
  if (format === "hex") {
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  const base64 = btoa(binary);

  return format === "base64url"
    ? base64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "")
    : base64;
}

function getHashStats(input: string): HashResult["stats"] {
  return {
    bytes: new TextEncoder().encode(input).length,
    chars: input.length,
    lines: input ? input.split(/\r\n|\n|\r/).length : 0,
  };
}
