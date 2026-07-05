export interface PasswordGeneratorInput {
  value: string;
}

export type PasswordMode = "password" | "passphrase";
export type SecretFormat = "base64" | "base64url" | "env" | "hex";
export type JwtSecretSize = number;

export interface PasswordOptions {
  avoidAmbiguous: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeUppercase: boolean;
  length: number;
}

export interface PassphraseOptions {
  separator: string;
  titleCase: boolean;
  words: number;
}

export interface JwtSecretOptions {
  format: SecretFormat;
  size: JwtSecretSize;
  variableName: string;
}

export interface GeneratedSecret {
  entropyBits: number;
  label: string;
  strength: "Fair" | "Good" | "Strong" | "Weak";
  value: string;
}

const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const ambiguous = "0O1Il|`'\"";
const words = [
  "anchor",
  "binary",
  "canvas",
  "delta",
  "ember",
  "forge",
  "harbor",
  "index",
  "kernel",
  "ledger",
  "matrix",
  "native",
  "orbit",
  "packet",
  "quantum",
  "ripple",
  "signal",
  "tensor",
  "vector",
  "widget",
  "zenith",
  "violet",
  "silver",
  "cobalt",
];

export function normalizePasswordGeneratorInput(input: string): string {
  return input.trim();
}

export function hasPasswordGeneratorInput(input: string): boolean {
  return normalizePasswordGeneratorInput(input).length > 0;
}

export function createPassword(options: PasswordOptions): GeneratedSecret {
  const characterSets = [
    options.includeLowercase ? lowercase : "",
    options.includeUppercase ? uppercase : "",
    options.includeNumbers ? numbers : "",
    options.includeSymbols ? symbols : "",
  ]
    .filter(Boolean)
    .map((set) => (options.avoidAmbiguous ? removeAmbiguous(set) : set))
    .filter(Boolean);
  const pool = characterSets.join("") || lowercase;
  const length = Math.min(128, Math.max(4, options.length));
  const required = characterSets.map((set) => getRandomCharacter(set));
  const remaining = Array.from({ length: Math.max(0, length - required.length) }, () =>
    getRandomCharacter(pool),
  );
  const password = shuffleCharacters([...required, ...remaining]).join("");
  const entropyBits = Math.log2(pool.length) * password.length;

  return {
    entropyBits,
    label: "Password",
    strength: estimateStrength(entropyBits),
    value: password,
  };
}

export function createPassphrase(options: PassphraseOptions): GeneratedSecret {
  const count = Math.min(12, Math.max(3, options.words));
  const selected = Array.from({ length: count }, () => getRandomItem(words)).map(
    (word) => (options.titleCase ? `${word[0].toUpperCase()}${word.slice(1)}` : word),
  );
  const value = selected.join(options.separator);
  const entropyBits = Math.log2(words.length) * count;

  return {
    entropyBits,
    label: "Passphrase",
    strength: estimateStrength(entropyBits),
    value,
  };
}

export function createJwtSecret(options: JwtSecretOptions): GeneratedSecret {
  const byteLength = Math.ceil(options.size / 8);
  const entropyBits = byteLength * 8;
  const bytes = getRandomBytes(byteLength);
  const raw =
    options.format === "hex"
      ? formatHex(bytes)
      : options.format === "base64url"
        ? formatBase64(bytes).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "")
        : formatBase64(bytes);
  const value = options.format === "env" ? `${options.variableName}=${raw}` : raw;

  return {
    entropyBits,
    label: `JWT secret (${entropyBits}-bit)`,
    strength: estimateStrength(entropyBits),
    value,
  };
}

function getRandomCharacter(characters: string): string {
  return characters[getRandomIndex(characters.length)];
}

function getRandomItem<T>(items: T[]): T {
  return items[getRandomIndex(items.length)];
}

function getRandomIndex(max: number): number {
  const random = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;

  do {
    crypto.getRandomValues(random);
  } while (random[0] >= limit);

  return random[0] % max;
}

function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);

  crypto.getRandomValues(bytes);

  return bytes;
}

function shuffleCharacters(characters: string[]): string[] {
  return characters
    .map((value) => ({ sort: crypto.getRandomValues(new Uint32Array(1))[0], value }))
    .sort((left, right) => left.sort - right.sort)
    .map((item) => item.value);
}

function removeAmbiguous(input: string): string {
  return Array.from(input)
    .filter((character) => !ambiguous.includes(character))
    .join("");
}

function formatHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function formatBase64(bytes: Uint8Array): string {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function estimateStrength(entropyBits: number): GeneratedSecret["strength"] {
  if (entropyBits >= 128) {
    return "Strong";
  }

  if (entropyBits >= 80) {
    return "Good";
  }

  if (entropyBits >= 50) {
    return "Fair";
  }

  return "Weak";
}
