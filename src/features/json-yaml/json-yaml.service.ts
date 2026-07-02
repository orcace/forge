export interface JsonYamlInput {
  value: string;
}

export type JsonYamlDirection = "json-to-yaml" | "yaml-to-json";

export interface JsonYamlResult {
  error?: string;
  value: string;
}

export function normalizeJsonYamlInput(input: string): string {
  return input.trim();
}

export function hasJsonYamlInput(input: string): boolean {
  return normalizeJsonYamlInput(input).length > 0;
}

export function convertJsonYaml(
  input: string,
  direction: JsonYamlDirection,
): JsonYamlResult {
  const normalized = normalizeJsonYamlInput(input);

  if (!normalized) {
    return { value: "" };
  }

  try {
    if (direction === "json-to-yaml") {
      return { value: stringifyYaml(JSON.parse(normalized)) };
    }

    return { value: JSON.stringify(parseSimpleYaml(normalized), null, 2) };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to convert input.",
      value: "",
    };
  }
}

function stringifyYaml(value: unknown, depth = 0): string {
  const indent = "  ".repeat(depth);

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (isPlainObject(item) || Array.isArray(item)) {
          return `${indent}-\n${stringifyYaml(item, depth + 1)}`;
        }

        return `${indent}- ${formatYamlScalar(item)}`;
      })
      .join("\n");
  }

  if (isPlainObject(value)) {
    return Object.entries(value)
      .map(([key, item]) => {
        if (isPlainObject(item) || Array.isArray(item)) {
          return `${indent}${key}:\n${stringifyYaml(item, depth + 1)}`;
        }

        return `${indent}${key}: ${formatYamlScalar(item)}`;
      })
      .join("\n");
  }

  return `${indent}${formatYamlScalar(value)}`;
}

function parseSimpleYaml(input: string): unknown {
  const lines = input
    .split(/\r\n|\n|\r/)
    .map((line) => line.replace(/\s+#.*$/, ""))
    .filter((line) => line.trim().length > 0);

  if (lines.every((line) => line.trim().startsWith("- "))) {
    return lines.map((line) => parseYamlScalar(line.trim().slice(2)));
  }

  const output: Record<string, unknown> = {};

  for (const line of lines) {
    if (/^\s/.test(line)) {
      throw new Error("Nested YAML parsing is limited. Convert nested data from JSON.");
    }

    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      throw new Error(`Invalid YAML line: ${line}`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    output[key] = parseYamlScalar(value);
  }

  return output;
}

function formatYamlScalar(value: unknown): string {
  if (value === null) {
    return "null";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  const text = typeof value === "string" ? value : JSON.stringify(value);

  return /^[A-Za-z0-9_./ -]+$/.test(text) ? text : JSON.stringify(text);
}

function parseYamlScalar(value: string): unknown {
  if (value === "null" || value === "~") {
    return null;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
