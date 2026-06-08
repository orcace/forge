import type { JSX } from "react";
import { Github, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";

export function HeaderActions(): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <Button
        className="hidden min-w-52 justify-start text-slate-500 md:inline-flex"
        size="sm"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
        Search tools
        <kbd className="ml-auto rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500">
          Ctrl K
        </kbd>
      </Button>
      <a
        aria-label="Open Forge repository"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
        href="https://github.com/cuthanhcam/forge"
        rel="noreferrer"
        target="_blank"
      >
        <Github aria-hidden="true" className="h-4 w-4" />
      </a>
    </div>
  );
}
