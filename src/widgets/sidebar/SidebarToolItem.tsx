import type { JSX } from "react";
import { NavLink } from "react-router";
import type { ToolDefinition } from "@/core/registry/tool.definition";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/cn";

interface SidebarToolItemProps {
  collapsed?: boolean;
  tool: ToolDefinition;
}

export function SidebarToolItem({
  collapsed = false,
  tool,
}: SidebarToolItemProps): JSX.Element {
  const Icon = tool.icon;

  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "group flex min-h-10 items-center rounded-md py-2 text-sm transition",
          collapsed ? "justify-center px-0" : "gap-3 px-3",
          isActive
            ? "bg-sky-50 text-sky-800 ring-1 ring-sky-100"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        )
      }
      title={collapsed ? tool.name : undefined}
      to={tool.route}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className={cn("min-w-0 flex-1 truncate", collapsed && "sr-only")}>
        {tool.name}
      </span>
      {tool.status === "planned" && !collapsed ? (
        <Badge className="h-5 px-1.5 text-[10px]" tone="neutral">
          Soon
        </Badge>
      ) : null}
    </NavLink>
  );
}
