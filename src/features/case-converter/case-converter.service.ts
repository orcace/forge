export interface CaseConverterInput {
  value: string;
}

export interface CaseVariant {
  label: string;
  value: string;
}

export function normalizeCaseConverterInput(input: string): string {
  return input.trim();
}

export function hasCaseConverterInput(input: string): boolean {
  return normalizeCaseConverterInput(input).length > 0;
}

export function convertCases(input: string): CaseVariant[] {
  const words = splitWords(input);

  return [
    { label: "camelCase", value: toCamelCase(words) },
    { label: "PascalCase", value: toPascalCase(words) },
    { label: "snake_case", value: words.join("_") },
    { label: "kebab-case", value: words.join("-") },
    { label: "CONSTANT_CASE", value: words.join("_").toUpperCase() },
    { label: "Title Case", value: words.map(capitalize).join(" ") },
    { label: "Sentence case", value: toSentenceCase(words) },
  ];
}

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function toCamelCase(words: string[]): string {
  return words.map((word, index) => (index === 0 ? word : capitalize(word))).join("");
}

function toPascalCase(words: string[]): string {
  return words.map(capitalize).join("");
}

function toSentenceCase(words: string[]): string {
  const sentence = words.join(" ");

  return sentence ? `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}` : "";
}

function capitalize(input: string): string {
  return input ? `${input.charAt(0).toUpperCase()}${input.slice(1)}` : "";
}
