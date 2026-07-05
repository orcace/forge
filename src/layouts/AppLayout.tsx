import type { JSX } from "react";
import { useCallback, useState } from "react";
import { Outlet } from "react-router";
import { useShortcuts } from "@/core/shortcuts/use-shortcuts";
import { CommandPalette } from "@/widgets/command-palette/CommandPalette";
import { Header } from "@/widgets/header/Header";
import { KeyboardShortcutsDialog } from "@/widgets/shortcuts/KeyboardShortcutsDialog";
import { Sidebar } from "@/widgets/sidebar/Sidebar";

export function AppLayout(): JSX.Element {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);

  useShortcuts({ onCommandPalette: openCommandPalette });

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-foreground">
      <div className="flex h-screen min-h-0">
        <Sidebar onOpenShortcuts={openShortcuts} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Header
            onOpenCommandPalette={openCommandPalette}
            onOpenShortcuts={openShortcuts}
          />
          <Outlet />
        </div>
      </div>
      <CommandPalette onOpenChange={setCommandPaletteOpen} open={commandPaletteOpen} />
      <KeyboardShortcutsDialog onOpenChange={setShortcutsOpen} open={shortcutsOpen} />
    </div>
  );
}
