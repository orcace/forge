import type { ToolDefinition } from "@/core/registry/tool.definition";

export interface ToolSearchResult {
  score: number;
  tool: ToolDefinition;
}

export function searchTools(tools: ToolDefinition[], query: string): ToolSearchResult[] {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return tools.map((tool) => ({ score: 1, tool }));
  }

  return tools
    .map((tool) => ({
      score: scoreTool(tool, normalizedQuery),
      tool,
    }))
    .filter((result) => result.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.tool.name.localeCompare(right.tool.name),
    );
}

function scoreTool(tool: ToolDefinition, query: string): number {
  const name = normalize(tool.name);
  const category = normalize(tool.category);
  const description = normalize(tool.description);
  const keywords = tool.keywords.map(normalize);

  if (name === query) {
    return 100;
  }

  if (name.startsWith(query)) {
    return 80;
  }

  if (name.includes(query)) {
    return 60;
  }

  if (keywords.some((keyword) => keyword === query || keyword.startsWith(query))) {
    return 50;
  }

  if (category.includes(query)) {
    return 30;
  }

  if (description.includes(query)) {
    return 20;
  }

  return 0;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}
