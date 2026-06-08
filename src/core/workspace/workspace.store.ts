import { create } from "zustand";
import type { WorkspaceActions, WorkspaceState } from "./workspace.types";

const maxRecentTools = 8;

type WorkspaceStore = WorkspaceActions & WorkspaceState;

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  activeToolId: null,
  favoriteToolIds: [],
  recentToolIds: [],
  sidebarCollapsed: false,
  addFavorite: (toolId) =>
    set((state) => ({
      favoriteToolIds: state.favoriteToolIds.includes(toolId)
        ? state.favoriteToolIds
        : [...state.favoriteToolIds, toolId],
    })),
  removeFavorite: (toolId) =>
    set((state) => ({
      favoriteToolIds: state.favoriteToolIds.filter((id) => id !== toolId),
    })),
  setActiveTool: (toolId) => set({ activeToolId: toolId }),
  toggleFavorite: (toolId) =>
    set((state) => ({
      favoriteToolIds: state.favoriteToolIds.includes(toolId)
        ? state.favoriteToolIds.filter((id) => id !== toolId)
        : [...state.favoriteToolIds, toolId],
    })),
  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),
  trackRecentTool: (toolId) =>
    set((state) => ({
      recentToolIds: [
        toolId,
        ...state.recentToolIds.filter((recentToolId) => recentToolId !== toolId),
      ].slice(0, maxRecentTools),
    })),
}));
