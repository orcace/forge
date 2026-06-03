const defaultRecentToolLimit = 8;

export function pushRecentTool(
  toolIds: string[],
  toolId: string,
  limit = defaultRecentToolLimit,
): string[] {
  return [toolId, ...toolIds.filter((id) => id !== toolId)].slice(0, limit);
}
