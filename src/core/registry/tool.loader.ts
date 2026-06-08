import type { ToolCategory } from "./tool.categories";
import { getToolById, getToolsByCategory, toolRegistry } from "./tool.registry";

export const toolLoader = {
  all: () => toolRegistry,
  byCategory: (category: ToolCategory) => getToolsByCategory(category),
  byId: (toolId: string) => getToolById(toolId),
};
