import type { JSX } from "react";
import { useCallback, useState } from "react";
import { Outlet } from "react-router";
import { useShortcuts } from "@/core/shortcuts/use-shortcuts";
import { CommandPalette } from "@/widgets/command-palette/CommandPalette";
import { Header } from "@/widgets/header/Header";
import { Sidebar } from "@/widgets/sidebar/Sidebar";

export function AppLayout(): JSX.Element {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);

  useShortcuts({ onCommandPalette: openCommandPalette });

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header onOpenCommandPalette={openCommandPalette} />
          <Outlet />
        </div>
      </div>
      <CommandPalette onOpenChange={setCommandPaletteOpen} open={commandPaletteOpen} />
    </div>
  );
}
