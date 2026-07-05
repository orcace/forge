export interface TocItem {
  id: string;
  level: number;
  title: string;
}

export function createToc(markdown: string): TocItem[] {
  return markdown
    .split("\n")
    .map((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line);

      if (!match) {
        return null;
      }

      return {
        id: slugifyHeading(match[2]),
        level: match[1].length,
        title: match[2],
      };
    })
    .filter((item): item is TocItem => item !== null);
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
