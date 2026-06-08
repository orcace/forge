export interface WorkspaceState {
  activeToolId: string | null;
  favoriteToolIds: string[];
  recentToolIds: string[];
  sidebarCollapsed: boolean;
}

export interface WorkspaceActions {
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  setActiveTool: (toolId: string | null) => void;
  toggleFavorite: (toolId: string) => void;
  toggleSidebar: () => void;
  trackRecentTool: (toolId: string) => void;
}
