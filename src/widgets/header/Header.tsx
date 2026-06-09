import type { JSX } from "react";
import { Box, Menu } from "lucide-react";
import { Link, useLocation } from "react-router";
import { getToolById } from "@/core/registry/tool.registry";
import { HeaderActions } from "./HeaderActions";

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

export function Header({ onOpenCommandPalette }: HeaderProps): JSX.Element {
  const location = useLocation();
  const title = getHeaderTitle(location.pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-5">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open navigation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
          type="button"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
        <Link
          aria-label="Go to home"
          className="hidden h-9 w-9 items-center justify-center rounded-md bg-gradient-brand text-white shadow-sm shadow-sky-500/20 transition hover:opacity-95 sm:inline-flex"
          to="/"
        >
          <Box aria-hidden="true" className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-semibold text-slate-950">{title}</h1>
        </div>
      </div>
      <HeaderActions onOpenCommandPalette={onOpenCommandPalette} />
    </header>
  );
}

function getHeaderTitle(pathname: string): string {
  if (pathname === "/") {
    return "Home";
  }

  if (pathname === "/settings") {
    return "Settings";
  }

  if (pathname === "/docs") {
    return "Documentation";
  }

  const toolId = pathname.match(/^\/tools\/([^/]+)$/)?.[1];
  const tool = toolId ? getToolById(toolId) : undefined;

  return tool?.name ?? "Forge";
}
