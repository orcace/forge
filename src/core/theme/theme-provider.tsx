import type { JSX, ReactNode } from "react";
import { useEffect, useState } from "react";
import { storageKeys } from "@/core/storage/storage.keys";
import { writeStorageValue } from "@/core/storage/storage.service";
import { useThemeStore } from "./theme.store";
import type { ThemeMode } from "./theme.types";

interface ThemeProviderProps {
  children: ReactNode;
}

const themeModes: ThemeMode[] = ["light", "dark", "system"];

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === "string" && themeModes.includes(value as ThemeMode);
}

function getSystemTheme(): Exclude<ThemeMode, "system"> {
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedMode = window.localStorage.getItem(storageKeys.theme);

      if (!storedMode) {
        setHydrated(true);
        return;
      }

      const parsedMode: unknown = JSON.parse(storedMode);

      if (isThemeMode(parsedMode)) {
        setMode(parsedMode);
      }
    } catch {
      setMode("light");
    } finally {
      setHydrated(true);
    }
  }, [setMode]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const root = document.documentElement;
    const mediaQuery =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;

    function applyTheme(): void {
      const resolvedMode = mode === "system" ? getSystemTheme() : mode;

      root.classList.toggle("dark", resolvedMode === "dark");
      root.dataset.theme = mode;
      root.style.colorScheme = resolvedMode;
    }

    applyTheme();

    try {
      writeStorageValue(storageKeys.theme, mode);
    } catch {
      // Local storage can be disabled in hardened browser sessions.
    }

    if (mode !== "system" || !mediaQuery) {
      return;
    }

    mediaQuery.addEventListener("change", applyTheme);

    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [hydrated, mode]);

  return <>{children}</>;
}
