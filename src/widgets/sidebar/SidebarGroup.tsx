import type { JSX } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ToolCategoryDefinition } from "@/core/registry/tool.categories";
import type { ToolDefinition } from "@/core/registry/tool.definition";
import { cn } from "@/shared/lib/cn";
import { SidebarToolItem } from "./SidebarToolItem";

interface SidebarGroupProps {
  category: ToolCategoryDefinition;
  sidebarCollapsed?: boolean;
  tools: ToolDefinition[];
}

export function SidebarGroup({
  category,
  sidebarCollapsed = false,
  tools,
}: SidebarGroupProps): JSX.Element {
  const [open, setOpen] = useState(true);
  const Icon = category.icon;

  if (sidebarCollapsed) {
    return (
      <section className="space-y-1 border-b border-slate-100 pb-2 last:border-b-0">
        <div
          className="flex h-7 items-center justify-center text-slate-300"
          title={category.id}
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          {tools.map((tool) => (
            <SidebarToolItem collapsed key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-1.5">
      <button
        aria-expanded={open}
        className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Icon aria-hidden="true" className="h-3.5 w-3.5 text-slate-300" />
        <span className="min-w-0 flex-1 text-left">{category.id}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-3.5 w-3.5 transition", !open && "-rotate-90")}
        />
      </button>
      {open ? (
        <div className="ml-3 space-y-0.5 border-l border-slate-200 pl-2">
          {tools.map((tool) => (
            <SidebarToolItem key={tool.id} tool={tool} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
