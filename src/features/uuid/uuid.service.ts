export interface UuidInput {
  value: string;
}

export function normalizeUuidInput(input: string): string {
  return input.trim();
}

export function hasUuidInput(input: string): boolean {
  return normalizeUuidInput(input).length > 0;
}
