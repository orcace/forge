export const storageKeys = {
  workspace: "forge.workspace",
  theme: "forge.theme",
  toolState: (toolId: string) => `forge.tool.${toolId}`,
} as const;
