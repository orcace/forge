export function toggleFavoriteTool(toolIds: string[], toolId: string): string[] {
  return toolIds.includes(toolId)
    ? toolIds.filter((id) => id !== toolId)
    : [...toolIds, toolId];
}
