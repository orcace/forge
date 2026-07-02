export interface UuidInput {
  value: string;
}

export function createUuidBatch(count: number): string[] {
  const safeCount = Math.min(100, Math.max(1, Math.floor(count)));

  return Array.from({ length: safeCount }, () => crypto.randomUUID());
}

export function normalizeUuidInput(input: string): string {
  return input.trim();
}

export function hasUuidInput(input: string): boolean {
  return normalizeUuidInput(input).length > 0;
}
