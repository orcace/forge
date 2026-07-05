export interface SlugifyInput {
  value: string;
}

export interface SlugifyOptions {
  lowercase: boolean;
  maxLength: number;
  removeNumbers: boolean;
  removeStopWords: boolean;
  separator: "-" | "_";
}

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

export function createSlug(input: string, options: Partial<SlugifyOptions> = {}): string {
  const settings: SlugifyOptions = {
    lowercase: options.lowercase ?? true,
    maxLength: options.maxLength ?? 80,
    removeNumbers: options.removeNumbers ?? false,
    removeStopWords: options.removeStopWords ?? false,
    separator: options.separator ?? "-",
  };
  const normalized = normalizeSlugifyInput(input)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "");
  const cased = settings.lowercase ? normalized.toLowerCase() : normalized;
  const words = cased
    .replace(settings.removeNumbers ? /[^A-Za-z]+/g : /[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !settings.removeStopWords || !stopWords.has(word.toLowerCase()));
  const slug = words.join(settings.separator);

  return trimToSeparator(slug.slice(0, settings.maxLength), settings.separator);
}

export function normalizeSlugifyInput(input: string): string {
  return input.trim();
}

export function hasSlugifyInput(input: string): boolean {
  return normalizeSlugifyInput(input).length > 0;
}

function trimToSeparator(input: string, separator: string): string {
  const escaped = separator === "-" ? "\\-" : separator;

  return input
    .replace(new RegExp(`${escaped}{2,}`, "g"), separator)
    .replace(new RegExp(`^${escaped}+|${escaped}+$`, "g"), "");
}
