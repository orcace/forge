export interface RegexTesterInput {
  value: string;
}

export interface RegexMatch {
  end: number;
  groups: string[];
  index: number;
  match: string;
}

export interface RegexTestResult {
  error?: string;
  highlighted: Array<{ match: boolean; text: string }>;
  matches: RegexMatch[];
  replaced: string;
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
  replacement = "",
): RegexTestResult {
  if (!pattern) {
    return {
      highlighted: [{ match: false, text: sample }],
      matches: [],
      replaced: sample,
    };
  }

  try {
    const safeFlags = Array.from(new Set(`${flags.includes("g") ? flags : `${flags}g`}`))
      .filter((flag) => "dgimsuvy".includes(flag))
      .join("");
    const regex = new RegExp(pattern, safeFlags);
    const matches: RegexMatch[] = [];

    for (const match of sample.matchAll(regex)) {
      const index = match.index ?? 0;
      matches.push({
        end: index + match[0].length,
        groups: match.slice(1),
        index,
        match: match[0],
      });

      if (match[0] === "") {
        break;
      }
    }

    return {
      highlighted: createHighlights(sample, matches),
      matches,
      replaced: replacement ? sample.replace(regex, replacement) : sample,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Invalid regular expression.",
      highlighted: [{ match: false, text: sample }],
      matches: [],
      replaced: sample,
    };
  }
}

function createHighlights(
  sample: string,
  matches: RegexMatch[],
): Array<{ match: boolean; text: string }> {
  if (matches.length === 0) {
    return [{ match: false, text: sample }];
  }

  const segments: Array<{ match: boolean; text: string }> = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.index > cursor) {
      segments.push({ match: false, text: sample.slice(cursor, match.index) });
    }

    segments.push({ match: true, text: sample.slice(match.index, match.end) });
    cursor = Math.max(cursor, match.end);
  }

  if (cursor < sample.length) {
    segments.push({ match: false, text: sample.slice(cursor) });
  }

  return segments;
}
