export interface HashGeneratorInput {
  value: string;
}

export type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export interface HashDigest {
  algorithm: HashAlgorithm;
  value: string;
}

export function normalizeHashGeneratorInput(input: string): string {
  return input.trim();
}

export function hasHashGeneratorInput(input: string): boolean {
  return normalizeHashGeneratorInput(input).length > 0;
}

export async function generateHashes(input: string): Promise<HashDigest[]> {
  const algorithms: HashAlgorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

  return Promise.all(
    algorithms.map(async (algorithm) => ({
      algorithm,
      value: await digestText(input, algorithm),
    })),
  );
}

async function digestText(input: string, algorithm: HashAlgorithm): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest(algorithm, bytes);

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
