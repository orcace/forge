export interface PasswordGeneratorInput {
  value: string;
}

export interface PasswordOptions {
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeUppercase: boolean;
  length: number;
}

export interface PasswordResult {
  password: string;
  strength: "Weak" | "Fair" | "Good" | "Strong";
}

const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export function normalizePasswordGeneratorInput(input: string): string {
  return input.trim();
}

export function hasPasswordGeneratorInput(input: string): boolean {
  return normalizePasswordGeneratorInput(input).length > 0;
}

export function createPassword(options: PasswordOptions): PasswordResult {
  const characterSets = [
    options.includeLowercase ? lowercase : "",
    options.includeUppercase ? uppercase : "",
    options.includeNumbers ? numbers : "",
    options.includeSymbols ? symbols : "",
  ].filter(Boolean);
  const pool = characterSets.join("") || lowercase;
  const length = Math.min(128, Math.max(4, options.length));
  const required = characterSets.map((set) => getRandomCharacter(set));
  const remaining = Array.from({ length: Math.max(0, length - required.length) }, () =>
    getRandomCharacter(pool),
  );
  const password = shuffleCharacters([...required, ...remaining]).join("");

  return {
    password,
    strength: estimatePasswordStrength(password, characterSets.length),
  };
}

function getRandomCharacter(characters: string): string {
  const random = new Uint32Array(1);
  crypto.getRandomValues(random);

  return characters[random[0] % characters.length];
}

function shuffleCharacters(characters: string[]): string[] {
  return characters
    .map((value) => ({ sort: crypto.getRandomValues(new Uint32Array(1))[0], value }))
    .sort((left, right) => left.sort - right.sort)
    .map((item) => item.value);
}

function estimatePasswordStrength(
  password: string,
  characterSetCount: number,
): PasswordResult["strength"] {
  if (password.length >= 20 && characterSetCount >= 4) {
    return "Strong";
  }

  if (password.length >= 14 && characterSetCount >= 3) {
    return "Good";
  }

  if (password.length >= 10 && characterSetCount >= 2) {
    return "Fair";
  }

  return "Weak";
}
