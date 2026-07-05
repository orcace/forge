import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import { toolRegistry } from "@/core/registry/tool.registry";
import { searchTools } from "@/core/search/search.service";
import { EmptyState } from "@/shared/components/EmptyState";
import { CommandPaletteItem } from "./CommandPaletteItem";

interface CommandPaletteProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function CommandPalette({
  onOpenChange,
  open,
}: CommandPaletteProps): JSX.Element | null {
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => searchTools(toolRegistry, query), [query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuery("");
    setActiveIndex(0);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        return;
      }

      if (event.key === "Enter" && results[activeIndex]) {
        event.preventDefault();
        void navigate(results[activeIndex].tool.route);
        onOpenChange(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, navigate, onOpenChange, open, results]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/20 px-3 py-16 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Close command palette"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={() => onOpenChange(false)}
        type="button"
      />
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-950/15">
        <div className="flex h-14 items-center gap-3 border-b border-slate-200 px-4">
          <Search aria-hidden="true" className="h-5 w-5 text-slate-400" />
          <input
            aria-label="Search tools"
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools, categories, and keywords"
            ref={inputRef}
            value={query}
          />
          <button
            aria-label="Close command palette"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
          <span>{query ? `${results.length} matches` : "All Forge tools"}</span>
          <span>{toolRegistry.length} tools</span>
        </div>

        <div className="scrollbar-forge max-h-[min(34rem,calc(100vh-11rem))] overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((result, index) => (
              <CommandPaletteItem
                active={index === activeIndex}
                key={result.tool.id}
                onSelect={() => {
                  void navigate(result.tool.route);
                  onOpenChange(false);
                }}
                tool={result.tool}
              />
            ))
          ) : (
            <EmptyState
              className="min-h-56 border-0"
              description="Try a category like Data, Encoding, Crypto, or a tool name like JSON."
              title="No tools found"
            />
          )}
        </div>
      </div>
    </div>
  );
}
