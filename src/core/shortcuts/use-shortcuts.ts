import { useEffect } from "react";

interface ShortcutOptions {
  onCommandPalette: () => void;
}

export function useShortcuts({ onCommandPalette }: ShortcutOptions): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const isCommandPaletteShortcut =
        event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey);

      if (!isCommandPaletteShortcut) {
        return;
      }

      event.preventDefault();
      onCommandPalette();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCommandPalette]);
}
