export interface UuidInput {
  value: string;
}

export type UuidVersion = "v4" | "v7" | "nil";
export type UuidFormat = "standard" | "uppercase" | "compact" | "braces";

export interface UuidOptions {
  count: number;
  format: UuidFormat;
  version: UuidVersion;
}

export interface UuidValidation {
  normalized: string;
  valid: boolean;
  variant: string;
  version: string;
}

export function createUuidBatch(countOrOptions: number | Partial<UuidOptions>): string[] {
  const options =
    typeof countOrOptions === "number"
      ? { count: countOrOptions, format: "standard" as const, version: "v4" as const }
      : {
          count: countOrOptions.count ?? 5,
          format: countOrOptions.format ?? "standard",
          version: countOrOptions.version ?? "v4",
        };
  const safeCount = Math.min(100, Math.max(1, Math.floor(options.count)));

  return Array.from({ length: safeCount }, () =>
    formatUuid(createUuid(options.version), options.format),
  );
}

export function normalizeUuidInput(input: string): string {
  return input.trim();
}

export function hasUuidInput(input: string): boolean {
  return normalizeUuidInput(input).length > 0;
}

export function validateUuid(input: string): UuidValidation {
  const normalized = normalizeUuidInput(input)
    .replace(/^\{|\}$/g, "")
    .toLowerCase();
  const valid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      normalized,
    ) || normalized === "00000000-0000-0000-0000-000000000000";

  if (!valid) {
    return { normalized, valid: false, variant: "Unknown", version: "Invalid" };
  }

  if (normalized === "00000000-0000-0000-0000-000000000000") {
    return { normalized, valid: true, variant: "Nil UUID", version: "Nil" };
  }

  return {
    normalized,
    valid: true,
    variant: "RFC 4122 / RFC 9562",
    version: `Version ${normalized.charAt(14)}`,
  };
}

function createUuid(version: UuidVersion): string {
  if (version === "nil") {
    return "00000000-0000-0000-0000-000000000000";
  }

  if (version === "v7") {
    return createUuidV7();
  }

  return crypto.randomUUID();
}

function createUuidV7(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  let timestamp = BigInt(Date.now());
  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = Number(timestamp & 0xffn);
    timestamp >>= 8n;
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return stringifyUuid(bytes);
}

function stringifyUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function formatUuid(uuid: string, format: UuidFormat): string {
  if (format === "uppercase") {
    return uuid.toUpperCase();
  }

  if (format === "compact") {
    return uuid.replaceAll("-", "");
  }

  if (format === "braces") {
    return `{${uuid}}`;
  }

  return uuid;
}
