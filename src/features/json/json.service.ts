export interface JsonToolsInput {
  value: string;
}

export interface JsonFormatResult {
  error?: string;
  errorColumn?: number;
  errorLine?: number;
  parsed?: unknown;
  stats?: JsonStats;
  value: string;
}

export interface JsonStats {
  arrays: number;
  booleans: number;
  keys: number;
  nulls: number;
  numbers: number;
  objects: number;
  strings: number;
}

export type JsonIndent = number | "tab";

export function normalizeJsonToolsInput(input: string): string {
  return input.trim();
}

export function hasJsonToolsInput(input: string): boolean {
  return normalizeJsonToolsInput(input).length > 0;
}

export function formatJson(input: string, indent: JsonIndent = 2): JsonFormatResult {
  return transformJson(input, (value) =>
    JSON.stringify(value, null, indent === "tab" ? "\t" : indent),
  );
}

export function minifyJson(input: string): JsonFormatResult {
  return transformJson(input, (value) => JSON.stringify(value));
}

export function sortJsonKeys(input: string, indent: JsonIndent = 2): JsonFormatResult {
  return transformJson(input, (value) =>
    JSON.stringify(sortKeys(value), null, indent === "tab" ? "\t" : indent),
  );
}

function transformJson(
  input: string,
  formatter: (value: unknown) => string,
): JsonFormatResult {
  const normalized = normalizeJsonToolsInput(input);

  if (!normalized) {
    return { stats: createEmptyStats(), value: "" };
  }

  try {
    const parsed = JSON.parse(normalized) as unknown;

    return {
      parsed,
      stats: getJsonStats(parsed),
      value: formatter(parsed),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON input.";

    return {
      error: message,
      ...getJsonErrorPosition(input, message),
      value: "",
    };
  }
}

export function getJsonStats(value: unknown): JsonStats {
  const stats = createEmptyStats();

  visitJsonValue(value, stats);

  return stats;
}

function createEmptyStats(): JsonStats {
  return {
    arrays: 0,
    booleans: 0,
    keys: 0,
    nulls: 0,
    numbers: 0,
    objects: 0,
    strings: 0,
  };
}

function visitJsonValue(value: unknown, stats: JsonStats): void {
  if (Array.isArray(value)) {
    stats.arrays += 1;
    value.forEach((item) => visitJsonValue(item, stats));

    return;
  }

  if (value === null) {
    stats.nulls += 1;

    return;
  }

  if (typeof value === "object") {
    stats.objects += 1;
    Object.entries(value).forEach(([, item]) => {
      stats.keys += 1;
      visitJsonValue(item, stats);
    });

    return;
  }

  if (typeof value === "string") {
    stats.strings += 1;
  } else if (typeof value === "number") {
    stats.numbers += 1;
  } else if (typeof value === "boolean") {
    stats.booleans += 1;
  }
}

function getJsonErrorPosition(
  input: string,
  message: string,
): Pick<JsonFormatResult, "errorColumn" | "errorLine"> {
  const positionMatch = message.match(/position\s+(\d+)/i);

  if (!positionMatch) {
    return {};
  }

  const position = Number(positionMatch[1]);
  const beforeError = input.slice(0, Math.max(0, position));
  const lines = beforeError.split(/\r\n|\n|\r/);

  return {
    errorColumn: lines[lines.length - 1].length + 1,
    errorLine: lines.length,
  };
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, sortKeys(item)]),
    );
  }

  return value;
}
