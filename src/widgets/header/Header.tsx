import type { JSX } from "react";
import { Menu } from "lucide-react";
import { HeaderActions } from "./HeaderActions";

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

export function Header({ onOpenCommandPalette }: HeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open navigation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
          type="button"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-950">Forge</p>
          <p className="hidden text-xs text-slate-500 sm:block">
            Local-first tools for developer workflows
          </p>
        </div>
      </div>
      <HeaderActions onOpenCommandPalette={onOpenCommandPalette} />
    </header>
  );
}
