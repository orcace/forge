import type { JSX } from "react";
import type { ToolCategoryDefinition } from "@/core/registry/tool.categories";
import type { ToolDefinition } from "@/core/registry/tool.definition";
import { SidebarToolItem } from "./SidebarToolItem";

interface SidebarGroupProps {
  category: ToolCategoryDefinition;
  tools: ToolDefinition[];
}

export function SidebarGroup({ category, tools }: SidebarGroupProps): JSX.Element {
  const Icon = category.icon;

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-3 text-xs font-semibold uppercase text-slate-400">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        <span>{category.id}</span>
      </div>
      <div className="space-y-1">
        {tools.map((tool) => (
          <SidebarToolItem key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
