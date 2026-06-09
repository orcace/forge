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
      <section className="space-y-1">
        <div
          className="flex h-8 items-center justify-center text-slate-400"
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
    <section className="space-y-2">
      <button
        aria-expanded={open}
        className="flex h-8 w-full items-center gap-2 rounded-md px-3 text-xs font-semibold uppercase text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="min-w-0 flex-1 text-left">{category.id}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-3.5 w-3.5 transition", !open && "-rotate-90")}
        />
      </button>
      {open ? (
        <div className="space-y-1">
          {tools.map((tool) => (
            <SidebarToolItem key={tool.id} tool={tool} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
