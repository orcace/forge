export interface TimestampInput {
  value: string;
}

export function normalizeTimestampInput(input: string): string {
  return input.trim();
}

export function hasTimestampInput(input: string): boolean {
  return normalizeTimestampInput(input).length > 0;
}
