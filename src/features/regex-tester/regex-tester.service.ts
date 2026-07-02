export interface RegexTesterInput {
  value: string;
}

export interface RegexMatch {
  groups: string[];
  index: number;
  match: string;
}

export interface RegexTestResult {
  error?: string;
  matches: RegexMatch[];
}

export function normalizeRegexTesterInput(input: string): string {
  return input.trim();
}

export function hasRegexTesterInput(input: string): boolean {
  return normalizeRegexTesterInput(input).length > 0;
}

export function testRegex(
  pattern: string,
  flags: string,
  sample: string,
): RegexTestResult {
  if (!pattern) {
    return { matches: [] };
  }

  try {
    const safeFlags = Array.from(new Set(`${flags.includes("g") ? flags : `${flags}g`}`))
      .filter((flag) => "dgimsuvy".includes(flag))
      .join("");
    const regex = new RegExp(pattern, safeFlags);
    const matches: RegexMatch[] = [];

    for (const match of sample.matchAll(regex)) {
      matches.push({
        groups: match.slice(1),
        index: match.index ?? 0,
        match: match[0],
      });

      if (match[0] === "") {
        break;
      }
    }

    return { matches };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Invalid regular expression.",
      matches: [],
    };
  }
}
