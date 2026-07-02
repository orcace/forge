export interface TimestampInput {
  value: string;
}

export interface TimestampConversion {
  iso: string;
  local: string;
  milliseconds: number;
  seconds: number;
  utc: string;
}

export function normalizeTimestampInput(input: string): string {
  return input.trim();
}

export function hasTimestampInput(input: string): boolean {
  return normalizeTimestampInput(input).length > 0;
}

export function convertTimestampInput(input: string): TimestampConversion | null {
  const normalized = normalizeTimestampInput(input);

  if (!normalized) {
    return createTimestampConversion(new Date());
  }

  const numeric = Number(normalized);
  const date = Number.isFinite(numeric)
    ? new Date(Math.abs(numeric) < 10_000_000_000 ? numeric * 1000 : numeric)
    : new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : createTimestampConversion(date);
}

export function createTimestampConversion(date: Date): TimestampConversion {
  return {
    iso: date.toISOString(),
    local: date.toLocaleString(),
    milliseconds: date.getTime(),
    seconds: Math.floor(date.getTime() / 1000),
    utc: date.toUTCString(),
  };
}
