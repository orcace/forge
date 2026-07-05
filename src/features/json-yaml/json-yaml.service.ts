export interface JsonYamlInput {
  value: string;
}

export type JsonYamlDirection = "json-to-yaml" | "yaml-to-json";
export type JsonYamlIndent = number | "tab";

export interface JsonYamlStats {
  arrays: number;
  booleans: number;
  keys: number;
  nulls: number;
  numbers: number;
  objects: number;
  strings: number;
}

export interface JsonYamlResult {
  error?: string;
  errorColumn?: number;
  errorLine?: number;
  parsed?: unknown;
  stats?: JsonYamlStats;
  value: string;
}

interface YamlLine {
  indent: number;
  number: number;
  text: string;
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
  indent: JsonYamlIndent = 2,
): JsonYamlResult {
  const normalized = normalizeJsonYamlInput(input);

  if (!normalized) {
    return { stats: createEmptyStats(), value: "" };
  }

  try {
    const parsed =
      direction === "json-to-yaml"
        ? (JSON.parse(normalized) as unknown)
        : parseYaml(normalized);
    const value =
      direction === "json-to-yaml"
        ? stringifyYaml(parsed, getIndentText(indent))
        : JSON.stringify(parsed, null, getJsonIndent(indent));

    return {
      parsed,
      stats: getJsonYamlStats(parsed),
      value,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to convert input.";

    return {
      error: message,
      ...(direction === "json-to-yaml" ? getJsonErrorPosition(input, message) : {}),
      value: "",
    };
  }
}

export function getJsonYamlStats(value: unknown): JsonYamlStats {
  const stats = createEmptyStats();

  visitValue(value, stats);

  return stats;
}

function stringifyYaml(value: unknown, indentText: string, depth = 0): string {
  const indent = indentText.repeat(depth);

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (isPlainObject(item) || Array.isArray(item)) {
          return `${indent}-\n${stringifyYaml(item, indentText, depth + 1)}`;
        }

        return `${indent}- ${formatYamlScalar(item)}`;
      })
      .join("\n");
  }

  if (isPlainObject(value)) {
    return Object.entries(value)
      .map(([key, item]) => {
        const safeKey = formatYamlKey(key);

        if (isPlainObject(item) || Array.isArray(item)) {
          return `${indent}${safeKey}:\n${stringifyYaml(item, indentText, depth + 1)}`;
        }

        return `${indent}${safeKey}: ${formatYamlScalar(item)}`;
      })
      .join("\n");
  }

  return `${indent}${formatYamlScalar(value)}`;
}

function parseYaml(input: string): unknown {
  const lines = prepareYamlLines(input);

  if (lines.length === 0) {
    return {};
  }

  return parseYamlBlock(lines, 0, lines[0].indent).value;
}

function parseYamlBlock(
  lines: YamlLine[],
  startIndex: number,
  indent: number,
): { nextIndex: number; value: unknown } {
  const isArray =
    lines[startIndex]?.indent === indent && lines[startIndex].text.startsWith("- ");

  return isArray
    ? parseYamlArray(lines, startIndex, indent)
    : parseYamlObject(lines, startIndex, indent);
}

function parseYamlArray(
  lines: YamlLine[],
  startIndex: number,
  indent: number,
): { nextIndex: number; value: unknown[] } {
  const output: unknown[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];

    if (line.indent < indent || line.indent !== indent || !line.text.startsWith("- ")) {
      break;
    }

    const rawValue = line.text.slice(2).trim();
    const nextLine = lines[index + 1];

    if (!rawValue) {
      if (!nextLine || nextLine.indent <= indent) {
        output.push(null);
        index += 1;
      } else {
        const nested = parseYamlBlock(lines, index + 1, nextLine.indent);
        output.push(nested.value);
        index = nested.nextIndex;
      }
    } else if (rawValue.includes(":") && !isQuoted(rawValue)) {
      output.push(parseInlineObject(rawValue, line.number));
      index += 1;
    } else {
      output.push(parseYamlScalar(rawValue));
      index += 1;
    }
  }

  return { nextIndex: index, value: output };
}

function parseYamlObject(
  lines: YamlLine[],
  startIndex: number,
  indent: number,
): { nextIndex: number; value: Record<string, unknown> } {
  const output: Record<string, unknown> = {};
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];

    if (line.indent < indent || line.indent !== indent || line.text.startsWith("- ")) {
      break;
    }

    const separatorIndex = findYamlSeparator(line.text);

    if (separatorIndex === -1) {
      throw new Error(`Invalid YAML at line ${line.number}: ${line.text}`);
    }

    const key = parseYamlKey(line.text.slice(0, separatorIndex).trim());
    const rawValue = line.text.slice(separatorIndex + 1).trim();
    const nextLine = lines[index + 1];

    if (!rawValue) {
      if (!nextLine || nextLine.indent <= line.indent) {
        output[key] = null;
        index += 1;
      } else {
        const nested = parseYamlBlock(lines, index + 1, nextLine.indent);
        output[key] = nested.value;
        index = nested.nextIndex;
      }
    } else {
      output[key] = parseYamlScalar(rawValue);
      index += 1;
    }
  }

  return { nextIndex: index, value: output };
}

function prepareYamlLines(input: string): YamlLine[] {
  return input
    .split(/\r\n|\n|\r/)
    .map((line, index) => ({
      indent: line.match(/^\s*/)?.[0].replace(/\t/g, "  ").length ?? 0,
      number: index + 1,
      text: stripYamlComment(line).trimEnd(),
    }))
    .filter((line) => line.text.trim().length > 0)
    .map((line) => ({ ...line, text: line.text.trimStart() }));
}

function stripYamlComment(line: string): string {
  let quote: '"' | "'" | null = null;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if ((char === '"' || char === "'") && line[index - 1] !== "\\") {
      quote = quote === char ? null : (quote ?? char);
    }

    if (char === "#" && !quote && (index === 0 || /\s/.test(line[index - 1]))) {
      return line.slice(0, index);
    }
  }

  return line;
}

function parseInlineObject(input: string, lineNumber: number): Record<string, unknown> {
  const separatorIndex = findYamlSeparator(input);

  if (separatorIndex === -1) {
    throw new Error(`Invalid YAML at line ${lineNumber}: ${input}`);
  }

  return {
    [parseYamlKey(input.slice(0, separatorIndex).trim())]: parseYamlScalar(
      input.slice(separatorIndex + 1).trim(),
    ),
  };
}

function formatYamlKey(key: string): string {
  return /^[A-Za-z0-9_-]+$/.test(key) ? key : JSON.stringify(key);
}

function parseYamlKey(key: string): string {
  if (isQuoted(key)) {
    return String(parseYamlScalar(key));
  }

  return key;
}

function formatYamlScalar(value: unknown): string {
  if (value === null) {
    return "null";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  const text = typeof value === "string" ? value : JSON.stringify(value);

  return /^[A-Za-z0-9_./ -]+$/.test(text) && text.trim() === text
    ? text
    : JSON.stringify(text);
}

function parseYamlScalar(value: string): unknown {
  if (value === "" || value === "null" || value === "~") {
    return null;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (/^-?\d+(?:\.\d+)?$/.test(value)) {
    return Number(value);
  }

  if (isQuoted(value)) {
    return value.startsWith('"') ? (JSON.parse(value) as string) : value.slice(1, -1);
  }

  return value;
}

function isQuoted(value: string): boolean {
  return (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  );
}

function findYamlSeparator(line: string): number {
  let quote: '"' | "'" | null = null;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if ((char === '"' || char === "'") && line[index - 1] !== "\\") {
      quote = quote === char ? null : (quote ?? char);
    }

    if (char === ":" && !quote) {
      return index;
    }
  }

  return -1;
}

function getIndentText(indent: JsonYamlIndent): string {
  return indent === "tab" ? "\t" : " ".repeat(indent);
}

function getJsonIndent(indent: JsonYamlIndent): number | "\t" {
  return indent === "tab" ? "\t" : indent;
}

function getJsonErrorPosition(
  input: string,
  message: string,
): Pick<JsonYamlResult, "errorColumn" | "errorLine"> {
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

function createEmptyStats(): JsonYamlStats {
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

function visitValue(value: unknown, stats: JsonYamlStats): void {
  if (Array.isArray(value)) {
    stats.arrays += 1;
    value.forEach((item) => visitValue(item, stats));

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
      visitValue(item, stats);
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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
