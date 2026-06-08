import type { JSX } from "react";
import { NavLink } from "react-router";
import type { ToolDefinition } from "@/core/registry/tool.definition";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/cn";

interface SidebarToolItemProps {
  tool: ToolDefinition;
}

export function SidebarToolItem({ tool }: SidebarToolItemProps): JSX.Element {
  const Icon = tool.icon;

  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "group flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm transition",
          isActive
            ? "bg-sky-50 text-sky-800 ring-1 ring-sky-100"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        )
      }
      to={tool.route}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{tool.name}</span>
      {tool.status === "planned" ? (
        <Badge className="h-5 px-1.5 text-[10px]" tone="neutral">
          Soon
        </Badge>
      ) : null}
    </NavLink>
  );
}
