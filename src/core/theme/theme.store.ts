import { create } from "zustand";
import type { ThemeMode, ThemeState } from "./theme.types";

interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeActions & ThemeState>((set) => ({
  mode: "light",
  setMode: (mode) => set({ mode }),
}));
