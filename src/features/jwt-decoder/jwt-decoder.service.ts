export interface JwtDecoderInput {
  value: string;
}

export type JwtPartName = "header" | "payload" | "signature";
export type JwtClaimStatus = "active" | "expired" | "future" | "missing";
export type JwtAlgorithm =
  | "none"
  | "HS256"
  | "HS384"
  | "HS512"
  | "RS256"
  | "RS384"
  | "RS512"
  | "ES256"
  | "ES384"
  | "ES512"
  | "PS256"
  | "PS384"
  | "PS512"
  | "EdDSA";
export type JwtVerificationStatus =
  | "idle"
  | "verified"
  | "failed"
  | "unsupported"
  | "error";

export interface JwtClaimInsight {
  description: string;
  name: string;
  status?: JwtClaimStatus;
  value: string;
}

export interface JwtBreakdownRow {
  description: string;
  name: string;
  status?: JwtClaimStatus;
  value: string;
}

export interface JwtSecurityWarning {
  message: string;
  tone: "amber" | "rose";
  title: string;
}

export interface JwtVerificationResult {
  message: string;
  status: JwtVerificationStatus;
}

export interface DecodedJwt {
  algorithm?: string;
  claims: JwtClaimInsight[];
  error?: string;
  header: string;
  headerJson?: Record<string, unknown>;
  headerSegment: string;
  isExpired: boolean;
  isNotYetValid: boolean;
  issuedAt?: Date;
  payload: string;
  payloadJson?: Record<string, unknown>;
  payloadSegment: string;
  signature: string;
  signatureBytes: number;
  token: string;
  type?: string;
  warnings: JwtSecurityWarning[];
}

export const jwtAlgorithms: JwtAlgorithm[] = [
  "none",
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
  "ES256",
  "ES384",
  "ES512",
  "PS256",
  "PS384",
  "PS512",
  "EdDSA",
];

export function normalizeJwtDecoderInput(input: string): string {
  return input.trim();
}

export function hasJwtDecoderInput(input: string): boolean {
  return normalizeJwtDecoderInput(input).length > 0;
}

export function decodeJwt(input: string, now = new Date()): DecodedJwt {
  const token = normalizeJwtDecoderInput(input);
  const parts = token.split(".");
  const [headerSegment = "", payloadSegment = "", signature = ""] = parts;

  if (!token) {
    return createEmptyDecodedJwt();
  }

  if (parts.length !== 3 || !headerSegment || !payloadSegment) {
    return {
      ...createEmptyDecodedJwt(),
      error: "JWT must contain exactly three dot-separated sections.",
      token,
    };
  }

  try {
    const headerJson = parseJwtSection(headerSegment, "header");
    const payloadJson = parseJwtSection(payloadSegment, "payload");
    const algorithm = asString(headerJson.alg);
    const type = asString(headerJson.typ);
    const claims = getClaimInsights(payloadJson, now);
    const warnings = getSecurityWarnings(headerJson, payloadJson, signature);

    return {
      algorithm,
      claims,
      header: stringifyJson(headerJson),
      headerJson,
      headerSegment,
      isExpired: getExpirationStatus(payloadJson, now) === "expired",
      isNotYetValid: getNotBeforeStatus(payloadJson, now) === "future",
      issuedAt: getDateClaim(payloadJson.iat),
      payload: stringifyJson(payloadJson),
      payloadJson,
      payloadSegment,
      signature,
      signatureBytes: getBase64UrlByteLength(signature),
      token,
      type,
      warnings,
    };
  } catch (error) {
    return {
      ...createEmptyDecodedJwt(),
      error: error instanceof Error ? error.message : "Unable to decode JWT.",
      headerSegment,
      payloadSegment,
      signature,
      token,
    };
  }
}

export async function verifyJwtSignature(
  input: string,
  secret: string,
): Promise<JwtVerificationResult> {
  const decoded = decodeJwt(input);

  if (!hasJwtDecoderInput(input)) {
    return { message: "Paste a JWT before verifying the signature.", status: "idle" };
  }

  if (decoded.error) {
    return { message: decoded.error, status: "error" };
  }

  if (!secret) {
    return {
      message: "Enter the shared secret used to sign this token.",
      status: "idle",
    };
  }

  if (!decoded.algorithm) {
    return { message: "JWT header does not declare an algorithm.", status: "error" };
  }

  if (decoded.algorithm === "none") {
    return {
      message: "Unsigned tokens cannot be verified.",
      status: "unsupported",
    };
  }

  const hash = getHmacHash(decoded.algorithm);

  if (!hash) {
    return {
      message: `${decoded.algorithm} verification is not supported in Forge yet. Use the public/private key verifier in your auth stack for asymmetric tokens.`,
      status: "unsupported",
    };
  }

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { hash, name: "HMAC" },
      false,
      ["sign"],
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${decoded.headerSegment}.${decoded.payloadSegment}`),
    );
    const expected = encodeBase64Url(new Uint8Array(signature));
    const verified = timingSafeEqual(expected, decoded.signature);

    return verified
      ? { message: "Signature verified with the provided secret.", status: "verified" }
      : { message: "Signature does not match the provided secret.", status: "failed" };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Unable to verify signature.",
      status: "error",
    };
  }
}

export async function generateJwtExample(
  algorithm: JwtAlgorithm,
  secret = "forge-secret",
): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header: Record<string, unknown> = {
    alg: algorithm,
    typ: "JWT",
    kid: algorithm === "none" ? undefined : `forge-${algorithm.toLowerCase()}-example`,
  };
  const payload = {
    sub: "user_42",
    name: "Forge Developer",
    admin: false,
    iss: "https://forge.cuthanhcam.workers.dev/",
    aud: ["forge-api", "forge-cli"],
    iat: issuedAt,
    nbf: issuedAt,
    exp: issuedAt + 60 * 60 * 24,
    scope: "tools:read tools:write",
    roles: ["developer", "reviewer"],
    meta: {
      algorithm,
      localOnly: true,
      workspace: "orcace",
    },
  };
  const headerSegment = encodeJsonBase64Url(removeUndefined(header));
  const payloadSegment = encodeJsonBase64Url(payload);

  if (algorithm === "none") {
    return `${headerSegment}.${payloadSegment}.`;
  }

  const hash = getHmacHash(algorithm);

  if (hash) {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { hash, name: "HMAC" },
      false,
      ["sign"],
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${headerSegment}.${payloadSegment}`),
    );

    return `${headerSegment}.${payloadSegment}.${encodeBase64Url(
      new Uint8Array(signature),
    )}`;
  }

  return `${headerSegment}.${payloadSegment}.${encodeBase64Url(
    new TextEncoder().encode(`${algorithm}.signature.placeholder`),
  )}`;
}

export function getJwtBreakdownRows(
  value: Record<string, unknown> | undefined,
  section: "header" | "payload",
  now = new Date(),
): JwtBreakdownRow[] {
  if (!value) {
    return [];
  }

  return Object.entries(value).map(([name, item]) => ({
    description: getClaimDescription(name, section),
    name,
    status:
      section === "payload" && name === "exp"
        ? getExpirationStatus(value, now)
        : section === "payload" && name === "nbf"
          ? getNotBeforeStatus(value, now)
          : undefined,
    value:
      section === "payload" && ["exp", "nbf", "iat"].includes(name)
        ? formatDateClaim(item, now)
        : formatClaimValue(item),
  }));
}

function createEmptyDecodedJwt(): DecodedJwt {
  return {
    claims: [],
    header: "",
    headerSegment: "",
    isExpired: false,
    isNotYetValid: false,
    payload: "",
    payloadSegment: "",
    signature: "",
    signatureBytes: 0,
    token: "",
    warnings: [],
  };
}

function parseJwtSection(segment: string, label: JwtPartName): Record<string, unknown> {
  const decoded = decodeBase64Url(segment);
  const parsed = JSON.parse(decoded) as unknown;

  if (!isPlainObject(parsed)) {
    throw new Error(`JWT ${label} must decode to a JSON object.`);
  }

  return parsed;
}

function decodeBase64Url(input: string): string {
  if (!/^[A-Za-z0-9_-]*$/.test(input)) {
    throw new Error("JWT contains invalid Base64URL characters.");
  }

  const base64 = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function encodeJsonBase64Url(value: unknown): string {
  return encodeBase64Url(new TextEncoder().encode(JSON.stringify(value)));
}

function getClaimInsights(
  payload: Record<string, unknown>,
  now: Date,
): JwtClaimInsight[] {
  return [
    {
      description: "Subject",
      name: "sub",
      value: formatClaimValue(payload.sub),
    },
    {
      description: "Issuer",
      name: "iss",
      value: formatClaimValue(payload.iss),
    },
    {
      description: "Audience",
      name: "aud",
      value: formatClaimValue(payload.aud),
    },
    {
      description: "Expiration",
      name: "exp",
      status: getExpirationStatus(payload, now),
      value: formatDateClaim(payload.exp, now),
    },
    {
      description: "Not before",
      name: "nbf",
      status: getNotBeforeStatus(payload, now),
      value: formatDateClaim(payload.nbf, now),
    },
    {
      description: "Issued at",
      name: "iat",
      value: formatDateClaim(payload.iat, now),
    },
    {
      description: "JWT ID",
      name: "jti",
      value: formatClaimValue(payload.jti),
    },
  ];
}

function getSecurityWarnings(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  signature: string,
): JwtSecurityWarning[] {
  const warnings: JwtSecurityWarning[] = [];
  const algorithm = asString(header.alg);

  if (!algorithm) {
    warnings.push({
      message: "A JWT should declare the signing algorithm in the header.",
      title: "Missing algorithm",
      tone: "rose",
    });
  } else if (algorithm === "none") {
    warnings.push({
      message:
        "This token declares alg: none. Treat it as untrusted unless your system explicitly accepts unsigned tokens.",
      title: "Unsigned token",
      tone: "rose",
    });
  }

  if (!signature) {
    warnings.push({
      message: "The third JWT section is empty, so there is no signature to verify.",
      title: "Missing signature",
      tone: "rose",
    });
  }

  if (payload.exp === undefined) {
    warnings.push({
      message: "Tokens without exp can stay valid forever if the server accepts them.",
      title: "No expiration claim",
      tone: "amber",
    });
  }

  if (payload.iss === undefined) {
    warnings.push({
      message:
        "Issuer validation is usually required for multi-tenant and OAuth/OIDC flows.",
      title: "No issuer claim",
      tone: "amber",
    });
  }

  if (payload.aud === undefined) {
    warnings.push({
      message:
        "Audience validation helps prevent tokens issued for one API from being replayed against another.",
      title: "No audience claim",
      tone: "amber",
    });
  }

  return warnings;
}

function getExpirationStatus(
  payload: Record<string, unknown>,
  now: Date,
): JwtClaimStatus {
  const expiration = getDateClaim(payload.exp);

  if (!expiration) {
    return "missing";
  }

  return expiration.getTime() <= now.getTime() ? "expired" : "active";
}

function getNotBeforeStatus(payload: Record<string, unknown>, now: Date): JwtClaimStatus {
  const notBefore = getDateClaim(payload.nbf);

  if (!notBefore) {
    return "missing";
  }

  return notBefore.getTime() > now.getTime() ? "future" : "active";
}

function getDateClaim(value: unknown): Date | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  return new Date(value * 1000);
}

function formatDateClaim(value: unknown, now: Date): string {
  const date = getDateClaim(value);

  if (!date) {
    return "Missing";
  }

  const deltaSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const relative =
    deltaSeconds >= 0
      ? `in ${formatDuration(deltaSeconds)}`
      : `${formatDuration(Math.abs(deltaSeconds))} ago`;

  return `${date.toISOString()} (${relative})`;
}

function formatDuration(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function formatClaimValue(value: unknown): string {
  if (value === undefined) {
    return "Missing";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return JSON.stringify(value);
}

function getClaimDescription(name: string, section: "header" | "payload"): string {
  const descriptions: Record<string, string> = {
    alg: "Algorithm used to sign or verify the JWT.",
    aud: "Recipients that the JWT is intended for.",
    exp: "Expiration time as NumericDate seconds.",
    iat: "Time at which the JWT was issued.",
    iss: "Principal that issued the JWT.",
    jti: "Unique identifier for replay detection.",
    kid: "Key identifier used to select the verification key.",
    name: "Human-readable display name carried by this token.",
    nbf: "Time before which the JWT must not be accepted.",
    scope: "Space-delimited permissions requested or granted.",
    sub: "Principal that is the subject of the JWT.",
    typ: "Media type of this token, usually JWT.",
  };

  return (
    descriptions[name] ??
    (section === "header"
      ? "Custom JOSE header parameter."
      : "Custom private or public claim.")
  );
}

function getBase64UrlByteLength(input: string): number {
  if (!input) {
    return 0;
  }

  const padding = input.length % 4 === 0 ? 0 : 4 - (input.length % 4);
  const paddedLength = input.length + padding;

  return Math.floor((paddedLength * 3) / 4) - padding;
}

function getHmacHash(algorithm: string): string | undefined {
  return {
    HS256: "SHA-256",
    HS384: "SHA-384",
    HS512: "SHA-512",
  }[algorithm];
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

function stringifyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function removeUndefined(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  );
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
