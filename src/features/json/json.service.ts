export interface JsonToolsInput {
  value: string;
}

export interface JsonFormatResult {
  error?: string;
  value: string;
}

export function normalizeJsonToolsInput(input: string): string {
  return input.trim();
}

export function hasJsonToolsInput(input: string): boolean {
  return normalizeJsonToolsInput(input).length > 0;
}

export function formatJson(input: string, indent = 2): JsonFormatResult {
  return transformJson(input, (value) => JSON.stringify(value, null, indent));
}

export function minifyJson(input: string): JsonFormatResult {
  return transformJson(input, (value) => JSON.stringify(value));
}

export function sortJsonKeys(input: string, indent = 2): JsonFormatResult {
  return transformJson(input, (value) => JSON.stringify(sortKeys(value), null, indent));
}

function transformJson(
  input: string,
  formatter: (value: unknown) => string,
): JsonFormatResult {
  const normalized = normalizeJsonToolsInput(input);

  if (!normalized) {
    return { value: "" };
  }

  try {
    return { value: formatter(JSON.parse(normalized)) };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Invalid JSON input.",
      value: "",
    };
  }
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
