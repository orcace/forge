export interface TimestampInput {
  value: string;
}

export interface TimestampConversion {
  dateInput: string;
  iso: string;
  local: string;
  milliseconds: number;
  microseconds: number;
  nanoseconds: number;
  relative: string;
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
    ? parseNumericTimestamp(numeric)
    : new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : createTimestampConversion(date);
}

export function createTimestampConversion(date: Date): TimestampConversion {
  const milliseconds = date.getTime();

  return {
    dateInput: toDateTimeLocalValue(date),
    iso: date.toISOString(),
    local: date.toLocaleString(),
    microseconds: milliseconds * 1000,
    milliseconds,
    nanoseconds: milliseconds * 1_000_000,
    relative: formatRelative(milliseconds - Date.now()),
    seconds: Math.floor(milliseconds / 1000),
    utc: date.toUTCString(),
  };
}

function parseNumericTimestamp(value: number): Date {
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000_000_000_000_000) {
    return new Date(Math.trunc(value / 1_000_000));
  }

  if (absolute >= 1_000_000_000_000_000) {
    return new Date(Math.trunc(value / 1000));
  }

  if (absolute >= 10_000_000_000) {
    return new Date(value);
  }

  return new Date(value * 1000);
}

function toDateTimeLocalValue(date: Date): string {
  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 19);
}

function formatRelative(deltaMs: number): string {
  const absoluteSeconds = Math.round(Math.abs(deltaMs) / 1000);
  const suffix = deltaMs >= 0 ? "from now" : "ago";

  if (absoluteSeconds < 60) {
    return `${absoluteSeconds} seconds ${suffix}`;
  }

  const absoluteMinutes = Math.round(absoluteSeconds / 60);
  if (absoluteMinutes < 60) {
    return `${absoluteMinutes} minutes ${suffix}`;
  }

  const absoluteHours = Math.round(absoluteMinutes / 60);
  if (absoluteHours < 24) {
    return `${absoluteHours} hours ${suffix}`;
  }

  return `${Math.round(absoluteHours / 24)} days ${suffix}`;
}
